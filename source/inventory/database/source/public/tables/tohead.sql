-- add uuid column here because there are views that need this
select xt.add_column('tohead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('tohead', 'xt.obj');
select xt.add_constraint('tohead', 'tohead_obj_uuid','unique(obj_uuid)', 'public');

-- Create (default) Site Type workflows for new Transfer Orders that are created in desktop client
/*drop trigger if exists transfer_order_did_change on tohead;
create trigger transfer_order_did_change after insert on tohead for each row
  execute procedure xt.transfer_order_did_change(); */
