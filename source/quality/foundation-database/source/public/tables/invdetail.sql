drop trigger if exists inv_detail_did_change on invdetail;

create trigger inv_detail_did_change after insert on invdetail for each row
  execute procedure xt.inv_detail_did_change();
