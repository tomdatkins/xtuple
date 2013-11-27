{
  "name": "inventory",
  "version": "1.4.6",
  "comment": "Inventory extension",
  "loadOrder": 100,
  "databaseScripts": [
    "xt/trigger_functions/ship_item_did_change.sql",
    "public/tables/shipitem.sql",
    "public/tables/itemloc.sql",
    "public/tables/locitem.sql",
    "public/tables/tohead.sql",
    "public/tables/toitem.sql",
    "xt/functions/shipment_value.sql",
    "xt/functions/to_schedule_date.sql",
    "xt/functions/to_line_at_shipping.sql",
    "xt/functions/to_line_ship_balance.sql",
    "xt/tables/ordtype.sql",
    "xt/views/itemsitedtl.sql",
    "xt/views/locitemsite.sql",
    "xt/views/ordhead.sql",
    "xt/views/orditem.sql",
    "xt/views/orditemship.sql",
    "xt/views/shipheadinfo.sql",
    "xt/views/shipmentdetail.sql",
    "xt/views/shipmentline.sql",
    "xm/javascript/inventory.sql",
    "xm/javascript/standard.sql"
  ]
}




