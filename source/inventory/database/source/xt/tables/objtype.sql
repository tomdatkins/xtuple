-- Transfer Orders' uuids.
delete from xt.obj_type where obj_type_tblname = 'tohead';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'tohead',
  'obj_uuid'
);

-- Transfer Order item's uuids.
delete from xt.obj_type where obj_type_tblname = 'toitem';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'toitem',
  'obj_uuid'
);