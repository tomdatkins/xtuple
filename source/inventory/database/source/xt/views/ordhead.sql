select xt.create_view('xt.ordhead', $$

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
    cohead_curr_id as ordhead_curr_id
  from cohead
    join custinfo on cohead_cust_id=cust_id
    join pg_class c on cohead.tableoid = c.oid
    join xt.ordtype on ordtype_tblname=relname
  union all
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
    basecurrid()
  from tohead
    join pg_class c on tohead.tableoid = c.oid
    join xt.ordtype on ordtype_tblname=relname
  where tohead_status in ('O','C')
  union all
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
    pohead_curr_id as ordhead_curr_id
  from pohead
    join vendinfo on pohead_vend_id = vend_id
    join pg_class c on pohead.tableoid = c.oid
    join xt.ordtype on ordtype_tblname = relname

$$);
