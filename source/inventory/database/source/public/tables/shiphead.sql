drop trigger if exists ship_head_did_change on shiphead;
create trigger ship_head_did_change after update on shiphead for each row
  execute procedure xt.ship_head_did_change();

-- Share Users Cache trigger.
drop trigger if exists shiphead_share_users_cache on shiphead;
create trigger shiphead_share_users_cache after insert or update or delete on shiphead for each row execute procedure xt.refresh_shiphead_share_users_cache();
