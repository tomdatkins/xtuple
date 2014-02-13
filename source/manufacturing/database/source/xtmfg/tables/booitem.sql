-- add uuid column here because there are views that need this
select xt.add_column('booitem','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'xtmfg');
select xt.add_inheritance('xtmfg.booitem', 'xt.obj');
select xt.add_constraint('booitem', 'booitem_obj_uuid','unique(obj_uuid)', 'xtmfg');

-- We added foreign keys incorrectly at one point. Clean up.
do $$

  var sql = "select conname " +
    "from pg_constraint, pg_class f, pg_class con, pg_namespace " +
    " where confrelid=f.oid " +
    " and conrelid=con.oid " +
    " and f.relname = 'boohead' " +
    " and con.relname = 'booitem' " +
    " and conname != 'booitem_booitem_item_id_booitem_rev_id_fkey' " +
    " and con.relnamespace=pg_namespace.oid;",
    res = plv8.execute(sql);

  sql = "alter table xtmfg.booitem drop constraint {name}";

  res.forEach(function (row) {
    var sql1 = sql.replace("{name}", row.conname);
    plv8.execute(sql1);
  });

$$ language plv8;

-- Foreign key will make sure all booitems have headers
select xt.add_constraint('booitem', 'booitem_booitem_item_id_booitem_rev_id_fkey','foreign key (booitem_item_id, booitem_rev_id) references xtmfg.boohead (boohead_item_id, boohead_rev_id) on delete cascade', 'xtmfg');

-- Trigger to create header if there isn't one.
create trigger booitem_did_change
  before insert
  on xtmfg.booitem
  for each row
  execute procedure xt.booitem_did_change();