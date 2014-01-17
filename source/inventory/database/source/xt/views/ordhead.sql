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
    case when shiphead_id is not null then true else false end as can_receive
  from tohead
    left join shiphead on shiphead_order_id = tohead_id and shiphead_order_type = 'TO'
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
    vend_name as ordhead_srcname,
    '' as ordhead_shiptoname,
    pohead_vendaddress1 as ordhead_shiptoaddress1,
    pohead_vendaddress2 as ordhead_shiptoaddress2,
    pohead_vendaddress3 as ordhead_shiptoaddress3,
    pohead_vendcity as ordhead_shiptocity,
    pohead_vendstate as ordhead_shiptostate,
    pohead_vendzipcode as ordhead_shiptopostalcode,
    pohead_vendcountry as ordhead_shiptocountry,
    pohead_curr_id as ordhead_curr_id,
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
    false as can_receive
  from cmhead
    join custinfo on cmhead_cust_id = cust_id
    join pg_class c on cmhead.tableoid = c.oid
    join xt.ordtype on ordtype_tblname = relname

$$);
