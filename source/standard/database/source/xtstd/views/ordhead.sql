select xt.create_view('xtstd.ordhead', $$

  select 
    cohead.obj_uuid as obj_uuid,
    cohead_number as ordhead_number,
    ordtype_code as ordhead_type,
    cohead_shipvia as ordhead_shipvia,
    cohead_status as ordhead_status,
    xt.co_schedule_date(cohead) as schedule_date,
    cohead_orderdate as ordhead_orderdate,
    cohead_ordercomments as ordhead_ordercomments,
    cust_name as ordhead_srcname,
    cohead_shiptoname as ordhead_shiptoname,
    cohead_shiptocity as ordhead_shiptocity,
    cohead_shiptostate as ordhead_shiptostate,
    cohead_shiptocountry as ordhead_shiptocountry
  from cohead
    join custinfo on cohead_cust_id=cust_id
    join pg_class c on cohead.tableoid = c.oid
    join xtstd.ordtype on ordtype_tblname=relname
  union all
  select 
    tohead.obj_uuid,
    tohead_number,
    ordtype_code as ordhead_type,
    tohead_shipvia,
    tohead_status,
    xtstd.to_schedule_date(tohead),
    tohead_orderdate,
    tohead_ordercomments,
    tohead_srcname,
    tohead_destname,
    tohead_destcity,
    tohead_deststate,
    tohead_destcountry
  from tohead
    join pg_class c on tohead.tableoid = c.oid
    join xtstd.ordtype on ordtype_tblname=relname
  where tohead_status in ('O','C')

$$);