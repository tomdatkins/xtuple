{
  "name": "standard",
  "version": "1.4.4",
  "comment": "Standard Edition",
  "loadOrder": 100,
  "dependencies": ["inventory"],
  "databaseScripts": [
    "standard.sql",
    "public/tables/tohead.sql",
    "public/tables/toitem.sql",
    "xtstd/create_xtstd_schema.sql",
    "xtstd/functions/to_schedule_date.sql",
    "xtstd/functions/to_line_at_shipping.sql",
    "xtstd/functions/to_line_ship_balance.sql",
    "xtstd/functions/shipment_value.sql",
    "xtstd/views/ordhead.sql",
    "xtstd/views/orditem.sql",
    "xtstd/views/orditemship.sql",
    "xtstd/views/shipheadinfo.sql",
    "xtstd/views/shipmentline.sql",
    "xt/tables/ordtype.sql",
    "xm/javascript/inventory.sql"
   ]
}
