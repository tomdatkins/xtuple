drop trigger if exists ship_head_did_change on shiphead;
create trigger ship_head_did_change after update on shiphead for each row
  execute procedure xt.ship_head_did_change();
