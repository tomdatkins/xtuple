create or replace function xt.ship_item_did_change() returns trigger as $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  var data = Object.create(XT.Data),
    sqlQuery = "select max(ordhead.obj_uuid) as uuid " +
        "from shipitem " +
        "inner join orderitem on shipitem_orderitem_id = orderitem_id " +
        "inner join xt.ordhead on orderitem_orderhead_id = ordhead_id " +
        "inner join xt.orditem on ordhead_id = orditem_ordhead_id " +
        "where shipitem_id = $1 " +
        "group by ordhead_id " +
        "having sum(ship_balance - at_shipping) = 0;",
      rows = plv8.execute(sqlQuery, NEW.shipitem_id);

    rows.each(function (row) {
      plv8.elog(NOTICE, "Update workflow for " + row.uuid);
    });

$$ language plv8;
