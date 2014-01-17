select xt.create_view('xt.woparent', $$

  -- SALES ORDER
  select
    coitem_id as woparent_id,
    wordtype_code as woparent_type,
    coitem.obj_uuid as woparent_uuid,
    cohead_number as woparent_number
  from coitem
    join cohead on coitem_cohead_id=cohead_id
    join pg_class c on coitem.tableoid = c.oid
    join xt.wordtype on wordtype_tblname=relname

  union all

  -- WORK ORDER
  select
    wo_id,
    wordtype_code as woparent_type,
    obj_uuid as ord_uuid,
    formatwonumber(wo_id)
  from wo
    join pg_class c on wo.tableoid = c.oid
    join xt.wordtype on wordtype_tblname=relname

$$);
