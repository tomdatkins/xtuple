create or replace function xt.coitem_order_id_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.tuple.com/CPAL for the full text of the software license. */

/* Handle update to child order link association. Since
   both sides have the link there's a chicken/egg
   problem that can only be solved this way */
return (function () {

  var sql;

  switch (NEW.coitem_order_type) 
  {
  /* Purchase Request */
  case "R":
    sql = "update pr set " +
          "  pr_order_id=$1, " +
          "  pr_order_type='S' " +
          "where pr_id=$2;";
    break;
  /* Purchase Order */
  case "P":
    sql = "update poitem set " +
          "  poitem_order_id=$1, " +
          "  poitem_order_type='S' " +
          "where pr_id=$2;";
    break;
  /* Work Order */
  case "W":
    sql = "update wo set " +
          "  wo_order_id=$1, " +
          "  wo_order_type='S' " +
          "where wo_id=$2;";
    break;
  }

  plv8.execute(sql, [NEW.coitem_id, NEW.coitem_order_id]);

  return NEW;

}());

$$ language plv8;

