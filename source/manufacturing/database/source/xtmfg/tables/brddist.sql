-- add uuid column here because there are views that need this
select xt.add_column('brddist','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'xtmfg');
select xt.add_inheritance('xtmfg.brddist', 'xt.obj');
select xt.add_constraint('brddist', 'brddist_obj_uuid_id','unique(obj_uuid)', 'xtmfg');
