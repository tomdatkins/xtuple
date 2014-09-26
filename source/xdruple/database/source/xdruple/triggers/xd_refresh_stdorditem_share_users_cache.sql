create or replace function xdruple.xd_refresh_stdorditem_share_users_cache() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
  var refreshStdOrdItem = false;

  if (typeof XT === 'undefined') {
    plv8.execute("select xt.js_init();");
  }

  if (TG_OP === 'INSERT') {
    /* Refresh this Standard Order Item's share access. */
    XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);
  } else if (TG_OP === 'UPDATE') {
    /* If the Standard Order Item's Ship To changed, refresh the Standard Order Item's share access. */
    if (OLD.xd_stdorditem_shipto_id !== NEW.xd_stdorditem_shipto_id) {
      refreshStdOrdItem = true;
    }

    /* If the Standard Order Item's Customer changed, refresh the Standard Order Item's share access. */
    if (OLD.xd_stdorditem_cust_id !== NEW.xd_stdorditem_cust_id) {
      refreshStdOrdItem = true;
    }

    /* If the Standard Order Item's Customer changed, refresh the Standard Order Item's share access. */
    if (refreshStdOrdItem) {
      XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);
    }
  } else if (TG_OP === 'DELETE') {
    /* Delete share access cache for this Standard Order Item. */
    XT.ShareUsers.deleteCacheObj(OLD.obj_uuid);
  }

  return NEW;
}());

$$ language plv8;
