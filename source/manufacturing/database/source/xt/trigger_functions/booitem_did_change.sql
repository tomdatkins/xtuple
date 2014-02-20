create or replace function xt.booitem_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

 var sql = "select boohead_id from boohead where boohead_item_id=$1 and boohead_rev_id=$2;",
   params = [NEW.booitem_item_id, NEW.booitem_rev_id],
   res;

 /* See if there is a bom header and insert one if there isn't */
 res = plv8.execute(sql, params);

 if (!res.length) {
   sql = "insert into xtmfg.boohead (boohead_item_id, boohead_docnum, boohead_revision, " +
     "boohead_leadtime, boohead_final_location_id, boohead_closewo, boohead_rev_id) " +
     " values ($1, '', '', 1, -1, false, $2);";
   plv8.execute(sql, params);
 }
 
 return NEW;

}());

$$ language plv8;
