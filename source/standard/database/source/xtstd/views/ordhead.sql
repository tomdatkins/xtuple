select xt.create_view('xtstd.ordhead', $$

  select 
    cohead.obj_uuid as obj_uuid,
    cohead_number as ordhead_number,
    cohead_shipvia as ordhead_shipvia,
    cohead_status as ordhead_status
  from cohead
  union all
  select 
    tohead.obj_uuid as obj_uuid,
    tohead_number as ordhead_number,
    tohead_shipvia as ordhead_shipvia,
    tohead_status as ordhead_status
  from tohead

$$);