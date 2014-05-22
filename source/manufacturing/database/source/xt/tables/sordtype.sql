-- WORK ORDER
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
  'wo',
  'W',
  'wo_id',
  'wo.obj_uuid',
  'wo.obj_uuid::text',
  'formatwonumber(wo_id)',
  'wo_status',
  'wo_duedate',
  'wo_qtyord',
  null
);
