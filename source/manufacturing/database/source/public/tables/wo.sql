drop trigger if exists wo_wf_did_change on wo;
create trigger wo_wf_did_change after insert or delete or update on wo for each row
  execute procedure xt.wo_wf_did_change();
