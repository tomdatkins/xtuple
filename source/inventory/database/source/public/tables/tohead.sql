-- add uuid column here because there are views that need this
select xt.add_column('tohead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('tohead', 'xt.obj');
select xt.add_constraint('tohead', 'tohead_obj_uuid_id','unique(obj_uuid)', 'public');

-- auto workflow generation trigger
drop trigger if exists towf_after_insert on tohead;
create trigger towf_after_insert after insert on tohead for each row
  execute procedure xt.createwf_after_insert();