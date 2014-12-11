-- Share Users Cache trigger.
drop trigger if exists xd_shiptoinfo_share_users_cache on shiptoinfo;
create trigger xd_shiptoinfo_share_users_cache after insert or update or delete on shiptoinfo for each row execute procedure xdruple.xd_refresh_shiptoinfo_share_users_cache();
