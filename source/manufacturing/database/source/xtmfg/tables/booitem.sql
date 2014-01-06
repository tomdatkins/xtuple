-- add uuid column here because there are views that need this
select xt.add_column('booitem','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'xtmfg');
select xt.add_inheritance('booitem', 'xt.obj');
select xt.add_constraint('booitem', 'booitem_obj_uuid','unique(obj_uuid)', 'xtmfg');