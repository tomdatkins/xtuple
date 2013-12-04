drop trigger if exists ship_item_did_change on shipitem;
create trigger ship_item_did_change after insert or delete or update on shipitem for each row
  execute procedure xt.ship_item_did_change();
