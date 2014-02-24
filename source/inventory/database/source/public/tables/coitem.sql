drop trigger if exists coitem_order_id_did_change on coitem;
create trigger coitem_order_id_did_change after insert or update on coitem for each row
  execute procedure xt.coitem_order_id_did_change();