-- PURCHASE REQUEST
delete from xt.sordtype where sordtype_tblname = 'pr' and sordtype_nsname = 'public';
insert into xt.sordtype (
  sordtype_nsname,
  sordtype_tblname,
  sordtype_code,
  sordtype_col_sochild_id,
  sordtype_col_sochild_uuid,
  sordtype_col_sochild_key,
  sordtype_col_sochild_number,
  sordtype_col_sochild_status,
  sordtype_col_sochild_duedate,
  sordtype_col_sochild_qty,
  sordtype_joins
) values (
  'public',
  'pr',
  'R',
  'pr_id',
  'pr.obj_uuid',
  'pr.obj_uuid::text',
  'pr_number::text || ''''-'''' || pr_subnumber',
  'pr_status',
  'pr_duedate',
  'pr_qtyreq',
  null
);

-- PURCHASE ORDER LINE
delete from xt.sordtype where sordtype_tblname = 'poitem' and sordtype_nsname = 'public';
insert into xt.sordtype (
  sordtype_nsname,
  sordtype_tblname,
  sordtype_code,
  sordtype_col_sochild_id,
  sordtype_col_sochild_uuid,
  sordtype_col_sochild_key,
  sordtype_col_sochild_number,
  sordtype_col_sochild_status,
  sordtype_col_sochild_duedate,
  sordtype_col_sochild_qty,
  sordtype_joins
) values (
  'public',
  'poitem',
  'P',
  'poitem_id',
  'poitem.obj_uuid',
  'pohead_number',
  'pohead_number || ''''-'''' || poitem_linenumber::text',
  'poitem_status',
  'poitem_duedate',
  'poitem_qty_ordered',
  'left join pohead on pohead_id=poitem_pohead_id'
);
