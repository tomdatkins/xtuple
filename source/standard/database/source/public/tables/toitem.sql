-- add uuid column here because there are views that need this
select xt.add_column('toitem','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('toitem', 'xt.obj');
select xt.add_constraint('toitem', 'toitem_obj_uuid','unique(obj_uuid)', 'public');
