create trigger ship_item_did_change after insert or delete on shipitem for each row
  execute procedure xt.ship_item_did_change();
