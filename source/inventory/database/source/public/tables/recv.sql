drop trigger if exists recv_item_did_change on recv;
create trigger recv_item_did_change after insert or delete or update on recv for each row
  execute procedure xt.recv_item_did_change();
