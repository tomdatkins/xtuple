drop trigger if exists wo_did_change on wo;
create trigger wo_did_change after insert or delete or update on wo for each row
  execute procedure xt.wo_did_change();
