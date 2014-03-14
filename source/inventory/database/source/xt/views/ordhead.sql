select xt.create_view('xt.ordhead', $$

  -- SALES ORDER
  select
    cohead.obj_uuid as obj_uuid,
    cohead_id as ordhead_id,
    cohead_number as ordhead_number,
    ordtype_code as ordhead_type,
    cohead_shipvia as ordhead_shipvia,
    cohead_status as ordhead_status,
    xt.co_schedule_date(cohead) as schedule_date,
    cohead_orderdate as ordhead_orderdate,
    cohead_ordercomments as ordhead_ordercomments,
    cohead_billtoaddress1 as ordhead_billtoaddress1,
    cohead_billtoaddress2 as ordhead_billtoaddress2,
    cohead_billtoaddress3 as ordhead_billtoaddress3,
    cohead_billtocity as ordhead_billtocity,
    cohead_billtostate as ordhead_billtostate,
    cohead_billtozipcode as ordhead_billtozipcode,
    cohead_billtocountry as ordhead_billtocountry,
    cohead_billto_cntct_phone as ordhead_billtophone,
    cust_name as ordhead_srcname,
    cohead_shiptoname as ordhead_shiptoname,
    cohead_shiptoaddress1 as ordhead_shiptoaddress1,
    cohead_shiptoaddress2 as ordhead_shiptoaddress2,
    cohead_shiptoaddress3 as ordhead_shiptoaddress3,
    cohead_shiptocity as ordhead_shiptocity,
    cohead_shiptostate as ordhead_shiptostate,
    cohead_shiptozipcode as ordhead_shiptopostalcode,
    cohead_shiptocountry as ordhead_shiptocountry,
    cohead_curr_id as ordhead_curr_id,
    cohead_custponumber as ordhead_custponumber,
    cohead_cust_id as ordhead_cust_id,
    cohead_terms_id as ordhead_terms_id,
    trim(cohead_billto_cntct_first_name || ' ' || cohead_billto_cntct_last_name) as ordhead_contactname,
    false as can_receive
  from cohead
    join custinfo on cohead_cust_id=cust_id
    join pg_class c on cohead.tableoid = c.oid
    join xt.ordtype on ordtype_tblname=relname

  union all

  -- TRANSFER ORDER
  select
    tohead.obj_uuid,
    tohead_id,
    tohead_number,
    ordtype_code as ordhead_type,
    tohead_shipvia,
    tohead_status,
    xt.to_schedule_date(tohead),
    tohead_orderdate,
    tohead_ordercomments,
    tohead_srcaddress1 as ordhead_billtoaddress1,
    tohead_srcaddress2 as ordhead_billtoaddress2,
    tohead_srcaddress3 as ordhead_billtoaddress3,
    tohead_srccity as ordhead_billtocity,
    tohead_srcstate as ordhead_billtostate,
    tohead_srcpostalcode as ordhead_billtozipcode,
    tohead_srccountry as ordhead_billtocountry,
    tohead_srcphone as ordhead_billtophone,
    tohead_srcname,
    tohead_destname,
    tohead_destaddress1,
    tohead_destaddress2,
    tohead_destaddress3,
    tohead_destcity,
    tohead_deststate,
    tohead_destpostalcode,
    tohead_destcountry,
    basecurrid(),
    '' as ordhead_custponumber,
    0 as ordhead_cust_id,
    0 as ordhead_terms_id,
    tohead_destcntct_name as ordhead_contactname,
    (select count(*) > 0
     from shiphead
     where shiphead_shipped
       and shiphead_order_id=tohead_id
       and shiphead_order_type = 'TO') as can_receive
  from tohead
    join pg_class c on tohead.tableoid = c.oid
    join xt.ordtype on ordtype_tblname=relname

  union all

  -- PURCHASE ORDER
  select
    pohead.obj_uuid as obj_uuid,
    pohead_id,
    pohead_number as ordhead_number,
    ordtype_code as ordhead_type,
    pohead_shipvia as ordhead_shipvia,
    pohead_status as ordhead_status,
    xt.po_schedule_date(pohead) as schedule_date,
    pohead_orderdate as ordhead_orderdate,
    pohead_comments as ordhead_ordercomments,
    pohead_vendaddress1 as ordhead_billtoaddress1,
    pohead_vendaddress2 as ordhead_billtoaddress2,
    pohead_vendaddress3 as ordhead_billtoaddress3,
    pohead_vendcity as ordhead_billtocity,
    pohead_vendstate as ordhead_billtostate,
    pohead_vendzipcode as ordhead_billtozipcode,
    pohead_vendcountry as ordhead_billtocountry,
    pohead_vend_cntct_phone as ordhead_billtophone,
    vend_name as ordhead_srcname,
    '' as ordhead_shiptoname,
    pohead_shiptoaddress1 as ordhead_shiptoaddress1,
    pohead_shiptoaddress2 as ordhead_shiptoaddress2,
    pohead_shiptoaddress3 as ordhead_shiptoaddress3,
    pohead_shiptocity as ordhead_shiptocity,
    pohead_shiptostate as ordhead_shiptostate,
    pohead_shiptozipcode as ordhead_shiptopostalcode,
    pohead_shiptocountry as ordhead_shiptocountry,
    pohead_curr_id as ordhead_curr_id,
    '' as ordhead_custponumber,
    0 as ordhead_cust_id,
    pohead_terms_id as ordhead_terms_id,
    trim(pohead_vend_cntct_first_name || ' ' || pohead_vend_cntct_last_name) as ordhead_contactname,
    case when pohead_status = 'O' then true else false end as can_receive
  from pohead
    join vendinfo on pohead_vend_id = vend_id
    join pg_class c on pohead.tableoid = c.oid
    join xt.ordtype on ordtype_tblname = relname
  union all
    select
    cmhead.obj_uuid as obj_uuid,
    cmhead_id,
    cmhead_number as ordhead_number,
    ordtype_code as ordhead_type,
    null,--cmhead_shipvia as ordhead_shipvia,
    'O', --cmhead_status as ordhead_status,
    cmhead_docdate as schedule_date,
    cmhead_docdate as ordhead_orderdate,
    cmhead_comments as ordhead_ordercomments,
    cmhead_billtoaddress1 as ordhead_billtoaddress1,
    cmhead_billtoaddress2 as ordhead_billtoaddress2,
    cmhead_billtoaddress3 as ordhead_billtoaddress3,
    cmhead_billtocity as ordhead_billtocity,
    cmhead_billtostate as ordhead_billtostate,
    cmhead_billtozip as ordhead_billtozipcode,
    cmhead_billtocountry as ordhead_billtocountry,
    '' as ordhead_billtophone,
    cust_name as ordhead_srcname,
    cmhead_shipto_name as ordhead_shiptoname,
    cmhead_shipto_address1 as ordhead_shiptoaddress1,
    cmhead_shipto_address2 as ordhead_shiptoaddress2,
    cmhead_shipto_address3 as ordhead_shiptoaddress3,
    cmhead_shipto_city as ordhead_shiptocity,
    cmhead_shipto_state as ordhead_shiptostate,
    cmhead_shipto_zipcode as ordhead_shiptopostalcode,
    cmhead_shipto_country as ordhead_shiptocountry,
    cmhead_curr_id as ordhead_curr_id,
    cmhead_custponumber as ordhead_custponumber,
    cmhead_cust_id as ordhead_cust_id,
    0 as ordhead_terms_id,
    '' as ordhead_contactname,
    false as can_receive
  from cmhead
    join custinfo on cmhead_cust_id = cust_id
    join pg_class c on cmhead.tableoid = c.oid
    join xt.ordtype on ordtype_tblname = relname

$$);
