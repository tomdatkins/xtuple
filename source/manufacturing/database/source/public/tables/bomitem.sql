drop trigger if exists bomitem_did_change on bomitem;

-- add uuid column here because there are views that need this
select xt.add_column('bomitem','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('bomitem', 'xt.obj');
select xt.add_constraint('bomitem', 'bomitem_obj_uuid','unique(obj_uuid)', 'public');


-- We added foreign keys incorrectly at one point. Clean up.
do $$

  var sql = "select conname " +
    "from pg_constraint, pg_class f, pg_class con, pg_namespace " +
    " where confrelid=f.oid " +
    " and conrelid=con.oid " +
    " and f.relname = 'bomhead' " +
    " and con.relname = 'bomitem' " +
    " and conname != 'bomitem_bomitem_parent_item_id_bomitem_rev_id_fkey' " +
    " and con.relnamespace=pg_namespace.oid;",
    res = plv8.execute(sql);

  sql = "alter table bomitem drop constraint {name}";

  res.forEach(function (row) {
    var sql1 = sql.replace("{name}", row.conname);
    plv8.execute(sql1);
  });

$$ language plv8;

-- Foreign key will make sure all bomitems have headers
select xt.add_constraint('bomitem', 'bomitem_bomitem_parent_item_id_bomitem_rev_id_fkey','foreign key (bomitem_parent_item_id, bomitem_rev_id) references bomhead (bomhead_item_id, bomhead_rev_id) on delete cascade', 'public');

-- Trigger to create header if there isn't one.
create trigger bomitem_did_change
  before insert
  on bomitem
  for each row
  execute procedure xt.bomitem_did_change();