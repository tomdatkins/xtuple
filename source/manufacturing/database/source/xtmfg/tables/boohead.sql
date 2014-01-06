-- add uuid column here because there are views that need this
select xt.add_column('boohead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'xtmfg');
select xt.add_inheritance('boohead', 'xt.obj');
select xt.add_constraint('boohead', 'boohead_obj_uuid','unique(obj_uuid)', 'xtmfg');