create or replace function xt.refresh_shiphead_share_users_cache() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
  if (TG_OP === 'INSERT') {
    /* Refresh this Shipment's share access. */
    XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);
  } else if (TG_OP === 'UPDATE') {
    /* If the Shipment's Order changed, refresh the Shipment's share access. */
    if (OLD.shiphead_order_id !== NEW.shiphead_order_id) {
      XT.ShareUsers.refreshCacheObj(NEW.obj_uuid);
    }
  } else if (TG_OP === 'DELETE') {
    /* Delete share access cache for this Shipment. */
    XT.ShareUsers.deleteCacheObj(OLD.obj_uuid);
  }

  return NEW;
}());

$$ language plv8;
