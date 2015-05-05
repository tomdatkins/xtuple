-- add uuid column here because there are views that need this
select xt.add_column('womatl','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('womatl', 'xt.obj');
select xt.add_constraint('womatl', 'womatl_obj_uuid_id','unique(obj_uuid)', 'public');

drop trigger if exists womatl_did_change on womatl;
create trigger womatl_did_change after insert or delete or update on womatl for each row
  execute procedure xt.womatl_did_change();
