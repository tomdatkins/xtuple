{
  "name": "inventory",
  "version": "4.4.0",
  "comment": "Inventory extension",
  "loadOrder": 100,
  "dependencies": ["purchasing"],
  "databaseScripts": [
    "xt/trigger_functions/coitem_order_id_did_change.sql",
    "xt/trigger_functions/recv_item_did_change.sql",
    "xt/trigger_functions/ship_head_did_change.sql",
    "xt/trigger_functions/ship_item_did_change.sql",
    "public/tables/coitem.sql",
    "public/tables/shiphead.sql",
    "public/tables/shipitem.sql",
    "public/tables/itemloc.sql",
    "public/tables/locitem.sql",
    "public/tables/planord.sql",
    "public/tables/planreq.sql",
    "public/tables/recv.sql",
    "public/tables/tohead.sql",
    "public/tables/toitem.sql",
    "xt/functions/invhist_quantity.sql",
    "xt/functions/shipment_value.sql",
    "xt/functions/to_freight_weight.sql",
    "xt/functions/po_schedule_date.sql",
    "xt/functions/to_schedule_date.sql",
    "xt/functions/to_subtotal.sql",
    "xt/functions/to_tax_total.sql",
    "xt/functions/to_total.sql",
    "xt/functions/to_line_at_shipping.sql",
    "xt/functions/to_line_ship_balance.sql",
    "xt/tables/siteemlprofile.sql",
    "xt/tables/sitetypeext.sql",
    "xt/tables/sitetypewf.sql",
    "xt/tables/towf.sql",
    "xt/tables/acttype.sql",
    "xt/tables/invcharext.sql",
    "xt/tables/objtype.sql",
    "xt/tables/ordtype.sql",
    "xt/tables/pordtype.sql",
    "xt/tables/recvext.sql",
    "xt/tables/rptdef.sql",
    "xt/tables/sordtype.sql",
    "xt/tables/wftype.sql",
    "xt/views/distributioninfo.sql",
    "xt/views/invavail.sql",
    "xt/views/itemsitedtl.sql",
    "xt/views/locitemsite.sql",
    "xt/views/activeorder.sql",
    "xt/views/ordhead.sql",
    "xt/views/orditem.sql",
    "xt/views/orditemreceipt.sql",
    "xt/views/orditemship.sql",
    "xt/views/planordinfo.sql",
    "xt/views/prparent.sql",
    "xt/views/prinfo.sql",
    "xt/views/shipheadinfo.sql",
    "xt/views/shipmentdetail.sql",
    "xt/views/shipmentline.sql",
    "xt/views/toheadinfo.sql",
    "xt/views/toiteminfo.sql",
    "xm/javascript/inventory.sql",
    "xm/javascript/inventory_availability.sql",
    "xm/javascript/planned_order.sql",
    "xm/javascript/return.sql",
    "xm/javascript/transfer_order.sql"
  ]
}
