select xt.create_view('xt.prparent', $$

  -- SALES ORDER
  select
    coitem_id as prparent_id,
    pordtype_code as prparent_type,
    coitem.obj_uuid as prparent_uuid,
    cohead_number as prparent_number
  from coitem
    join cohead on coitem_cohead_id=cohead_id
    join pg_class c on coitem.tableoid = c.oid
    join xt.pordtype on pordtype_tblname=relname

  union all

  -- WORK ORDER
  select
    wo_id,
    pordtype_code,
    obj_uuid as ord_uuid,
    formatwonumber(wo_id)
  from wo
    join pg_class c on wo.tableoid = c.oid
    join xt.pordtype on pordtype_tblname=relname

$$);
