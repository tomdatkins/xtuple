drop trigger if exists pr_did_change on pr;
create trigger pr_did_change after insert or delete on pr for each row
  execute procedure xt.pr_did_change();