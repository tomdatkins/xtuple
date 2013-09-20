-- add uuid column here because there are views that need this
select xt.add_column('tohead','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('tohead', 'xt.obj');
select xt.add_constraint('tohead', 'tohead_obj_uuid','unique(obj_uuid)', 'public');
