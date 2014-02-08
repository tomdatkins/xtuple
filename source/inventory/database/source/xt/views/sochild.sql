-- This thing would need to be re-written as a self generating
-- union query like 'xt.act' and 'xt.ordhead' to be truely extensible.

select xt.create_view('xt.sochild', $$

  -- PURCHASE REQUEST
  select
    coitem_id as sochild_id,
    pr_id as sochild_child_id,
    sordtype_code as sochild_type,
    pr.obj_uuid as sochild_uuid,
    pr.obj_uuid::text as sochild_key,
    pr_number::text || '-' || pr_subnumber as sochild_number,
    pr_status as sochild_status,
    pr_duedate as sochild_duedate,
    pr_qtyreq as sochild_qty
  from pr
    join coitem on coitem_order_id=pr_id and coitem_order_type='R'
    join pg_class c on pr.tableoid = c.oid
    join xt.sordtype on sordtype_tblname=relname

  union all

  -- PURCHASE ORDER LINE
  select
    coitem_id as sochild_id,
    poitem_id as sochild_child_id,
    sordtype_code as sochild_type,
    poitem.obj_uuid as sochild_uuid,
    pohead_number as sochild_key,
    pohead_number || '-' || poitem_linenumber::text as sochild_number,
    poitem_status as sochild_status,
    poitem_duedate as sochild_duedate,
    poitem_qty_ordered as sochild_qty
  from poitem
    join pohead on pohead_id=poitem_pohead_id
    join coitem on coitem_order_id=poitem_id and coitem_order_type='P'
    join pg_class c on poitem.tableoid = c.oid
    join xt.sordtype on sordtype_tblname=relname

  union all

  -- WORK ORDER
  select
    coitem_id,
    wo_id,
    sordtype_code,
    wo.obj_uuid as ord_uuid,
    wo.obj_uuid::text as sochild_key,
    formatwonumber(wo_id),
    wo_status as sochild_status,
    wo_duedate as sochild_duedate,
    wo_qtyord as sochild_qty
  from wo
    join coitem on coitem_order_id=wo_id and coitem_order_type='W'
    join pg_class c on wo.tableoid = c.oid
    join xt.sordtype on sordtype_tblname=relname

$$);
