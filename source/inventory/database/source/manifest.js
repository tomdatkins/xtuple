{
  "name": "inventory",
  "version": "",
  "comment": "Inventory extension",
  "loadOrder": 100,
  "dependencies": ["commercialcore"],
  "databaseScripts": [
    "search_path.sql",
    "xt/trigger_functions/coitem_order_id_did_change.sql",
    "xt/trigger_functions/refresh_shiphead_share_users_cache.sql",
    "public/functions/getoldestlocationid.sql",
    "public/tables/coitem.sql",
    "public/tables/shiphead.sql",
    "public/tables/shipitem.sql",
    "public/tables/itemloc.sql",
    "public/tables/locitem.sql",
    "public/tables/planord.sql",
    "public/tables/planreq.sql",
    "public/tables/rahead.sql",
    "public/tables/recv.sql",
    "public/tables/tohead.sql",
    "public/tables/toitem.sql",
    "public/tables/location.sql",
    "xt/functions/distributedetail.sql",
    "xt/functions/invhist_quantity.sql",
    "xt/functions/shipment_value.sql",
    "xt/functions/to_freight_weight.sql",
    "xt/functions/to_schedule_date.sql",
    "xt/functions/to_subtotal.sql",
    "xt/functions/to_tax_total.sql",
    "xt/functions/to_total.sql",
    "xt/functions/to_line_at_shipping.sql",
    "xt/functions/to_line_ship_balance.sql",
    "xt/tables/siteemlprofile.sql",
    "xt/tables/sitetypeext.sql",
    "xt/tables/invcharext.sql",
    "xt/tables/objtype.sql",
    "xt/tables/ordtype.sql",
    "xt/tables/pordtype.sql",
    "xt/tables/recvext.sql",
    "xt/tables/distdetail.sql",
    "xt/tables/rptdef.sql",
    "xt/tables/sordtype.sql",
    "xt/views/distributioninfo.sql",
    "xt/views/itemsitedtl.sql",
    "xt/views/locationdtl.sql",
    "xt/views/locitemsite.sql",
    "xt/views/activeorder.sql",
    "xt/views/ordhead.sql",
    "xt/views/orditem.sql",
    "xt/views/orditemreceipt.sql",
    "xt/views/orditemship.sql",
    "xt/views/planordinfo.sql",
    "xt/views/prparent.sql",
    "xt/views/prinfo.sql",
    "xt/views/share_users_shiphead.sql",
    "xt/views/shipheadinfo.sql",
    "xt/views/shipmentline.sql",
    "xt/views/shipmentdetail.sql",
    "xt/views/toheadinfo.sql",
    "xt/views/toiteminfo.sql",
    "xm/javascript/billing.sql",
    "xm/javascript/inventory.sql",
    "xm/javascript/inventory_availability.sql",
    "xm/javascript/invoice.sql",
    "xm/javascript/planned_order.sql",
    "xm/javascript/return.sql",
    "xm/javascript/transfer_order.sql",
    "xt/tables/sharetype.sql"
  ]
}

