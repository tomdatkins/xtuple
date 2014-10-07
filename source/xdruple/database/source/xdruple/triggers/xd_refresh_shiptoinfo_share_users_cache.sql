create or replace function xdruple.xd_refresh_shiptoinfo_share_users_cache() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
  var refreshStdOrdItems = false,
    stdOrdItems,
    shipTostdOrdItemsSQL = 'select xd_stdorditem.obj_uuid ' +
                           'from xdruple.xd_stdorditem ' +
                           'where xd_stdorditem.xd_stdorditem_shipto_id = $1';

  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

  if (TG_OP === 'UPDATE') {
    /* If the Ship To's Contact changed, refresh the Standard Order Item share access. */
    if (OLD.shipto_cntct_id !== NEW.shipto_cntct_id) {
      refreshStdOrdItems = true;
    }

    /* If the Ship To's Customer changed, refresh the Standard Order Item share access. */
    if (OLD.shipto_cust_id !== NEW.shipto_cust_id) {
      refreshStdOrdItems = true;
    }

    if (refreshStdOrdItems) {
      stdOrdItems = plv8.execute(shipTostdOrdItemsSQL, [NEW.shipto_id]);

      /* Loop over all Standard Order Items that belong to this Ship To and refresh. */
      /* TODO: If this is too slow, do bulk update with WHERE obj_uuid IN (array-of-uuids). */
      for (var i = 0; i < stdOrdItems.length; i++) {
        if (stdOrdItems[i] && stdOrdItems[i].obj_uuid) {
          XT.ShareUsers.refreshCacheObj(stdOrdItems[i].obj_uuid);
        }
      }
    }
  }

  return NEW;
}());

$$ language plv8;
