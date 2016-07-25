drop trigger if exists inv_hist_did_change on invhist;

create trigger inv_hist_did_change after insert on invhist for each row
  execute procedure xt.inv_hist_did_change();
