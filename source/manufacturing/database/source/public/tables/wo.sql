drop trigger if exists wo_wf_did_change on wo;
create trigger wo_wf_did_change after insert or delete or update on wo for each row
  execute procedure xt.wo_wf_did_change();

-- auto workflow generation trigger
drop trigger if exists wowf_after_insert on wo;
create trigger wowf_after_insert after insert on wo for each row
  execute procedure xt.createwf_after_insert();

ALTER TABLE wo DISABLE TRIGGER wowf_after_insert;