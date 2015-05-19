-- Work Orders' uuids.
delete from xt.obj_type where obj_type_tblname = 'wo';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'wo',
  'obj_uuid'
);

-- Work Order item's uuids.
delete from xt.obj_type where obj_type_tblname = 'womatl';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'womatl',
  'obj_uuid'
);