create or replace function xt.bomitem_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

 var sql = "select bomhead_id from bomhead where bomhead_item_id=$1 and bomhead_rev_id=$2;",
   params = [NEW.bomitem_parent_item_id, NEW.bomitem_rev_id],
   res;

 /* See if there is a bom header and insert one if there isn't */
 res = plv8.execute(sql, params);

 if (!res.length) {
   sql = "insert into bomhead (bomhead_item_id, bomhead_docnum, bomhead_revision, " +
     " bomhead_batchsize, bomhead_rev_id) values ($1, '', '', 1, $2);"
   plv8.execute(sql, params);
 }
 
 return NEW;

}());

$$ language plv8;
