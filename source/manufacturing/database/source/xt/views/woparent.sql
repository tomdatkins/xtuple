select xt.create_view('xt.woparent', $$

  -- SALES ORDER
  select
    wo_id,
    wo.obj_uuid as wo_uuid,
    wo_ordtype,
    wo_ordid,
    coitem.obj_uuid as ord_uuid,
    cohead_number as ord_number
  from wo
    join coitem on wo_ordid=coitem_id and wo_ordtype='S'
    join cohead on coitem_cohead_id=cohead_id

  union all

  -- WORK ORDER
  select
    c.wo_id,
    c.obj_uuid as wo_uuid,
    c.wo_ordtype,
    c.wo_ordid,
    p.obj_uuid as ord_uuid,
    formatwonumber(p.wo_id)
  from wo c
    join wo p on c.wo_ordid=p.wo_id and c.wo_ordtype='W'

$$);
