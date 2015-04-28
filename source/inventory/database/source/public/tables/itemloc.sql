-- add uuid column here because there are views that need this
select xt.add_column('itemloc','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('itemloc', 'xt.obj');
select xt.add_constraint('itemloc', 'itemloc_obj_uuid_id','unique(obj_uuid)', 'public');