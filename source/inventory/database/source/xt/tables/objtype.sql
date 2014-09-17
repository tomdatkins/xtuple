-- Sales Orders' uuids.
delete from xt.obj_type where obj_type_tblname = 'cohead';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'cohead',
  'obj_uuid'
);

-- Sales Order item's uuids.
delete from xt.obj_type where obj_type_tblname = 'coitem';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'coitem',
  'obj_uuid'
);

-- Purchase Orders' uuids.
delete from xt.obj_type where obj_type_tblname = 'pohead';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'pohead',
  'obj_uuid'
);

-- Purchase Order item's uuids.
delete from xt.obj_type where obj_type_tblname = 'poitem';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'poitem',
  'obj_uuid'
);

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

-- Credit Memos' uuids.
delete from xt.obj_type where obj_type_tblname = 'cmhead';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'cmhead',
  'obj_uuid'
);

-- Credit Memo item's uuids.
delete from xt.obj_type where obj_type_tblname = 'cmitem';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'cmitem',
  'obj_uuid'
);

-- Credit Memos' uuids.
delete from xt.obj_type where obj_type_tblname = 'invchead';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'invchead',
  'obj_uuid'
);

-- Credit Memo item's uuids.
delete from xt.obj_type where obj_type_tblname = 'invcitem';
insert into xt.obj_type (
  obj_type_nsname,
  obj_type_tblname,
  obj_type_col_obj_uuid
) values (
  'public',
  'invcitem',
  'obj_uuid'
);