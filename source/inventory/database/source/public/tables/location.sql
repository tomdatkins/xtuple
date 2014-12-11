select xt.add_column('location', 'obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('location', 'xt.obj');
select xt.add_constraint('location', 'location_obj_uuid', 'unique(obj_uuid)', 'public');

