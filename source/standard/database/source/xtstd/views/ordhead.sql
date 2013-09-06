select xt.create_view('xtstd.ordhead', $$

  select 
    cohead.obj_uuid as obj_uuid,
    cohead_number as ordhead_number,
    cohead_shipvia as ordhead_shipvia,
    cohead_status as ordhead_status,
    xt.co_schedule_date(cohead) as schedule_date,
    cohead_orderdate as ordhead_orderdate,
    cohead_ordercomments as ordhead_ordercomments,
    cohead_shiptoname as ordhead_shiptoname,
    cohead_shiptocity as ordhead_shiptocity,
    cohead_shiptostate as ordhead_shiptostate,
    cohead_shiptocountry as ordhead_shiptocountry
  from cohead
  union all
  select 
    tohead.obj_uuid as obj_uuid,
    tohead_number as ordhead_number,
    tohead_shipvia as ordhead_shipvia,
    tohead_status as ordhead_status,
    xtstd.to_schedule_date(tohead),
    tohead_orderdate,
    tohead_ordercomments,
    tohead_destname,
    tohead_destcity as ordhead_shiptocity,
    tohead_deststate as ordhead_shiptostate,
    tohead_destcountry as ordhead_country
  from tohead

$$);