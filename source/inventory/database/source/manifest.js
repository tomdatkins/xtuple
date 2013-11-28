{
  "name": "inventory",
  "version": "1.4.6",
  "comment": "Inventory extension",
  "loadOrder": 100,
  "databaseScripts": [
    "public/tables/itemloc.sql",
    "public/tables/locitem.sql",
    "public/tables/tohead.sql",
    "public/tables/toitem.sql",
    "xt/functions/shipment_value.sql",
    "xt/functions/to_freight_weight.sql",
    "xt/functions/to_schedule_date.sql",
    "xt/functions/to_subtotal.sql",
    "xt/functions/to_tax_total.sql",
    "xt/functions/to_total.sql",
    "xt/functions/to_line_at_shipping.sql",
    "xt/functions/to_line_ship_balance.sql",
    "xt/tables/invcharext.sql",
    "xt/tables/ordtype.sql",
    "xt/views/itemsitedtl.sql",
    "xt/views/locitemsite.sql",
    "xt/views/ordhead.sql",
    "xt/views/orditem.sql",
    "xt/views/orditemship.sql",
    "xt/views/shipheadinfo.sql",
    "xt/views/shipmentdetail.sql",
    "xt/views/shipmentline.sql",
    "xt/views/toheadinfo.sql",
    "xm/javascript/inventory.sql",
    "xm/javascript/standard.sql"
  ]
}




