{
  "name": "xdruple",
  "version": "4.6.0",
  "comment": "xDruple Extension",
  "loadOrder": 120,
  "defaultSchema": "xdruple",
  "dependencies": ["crm", "sales", "billing", "inventory", "manufacturing"],
  "databaseScripts": [
    "public/triggers/uom_item_weight_trigger.sql",
    "public/triggers/uom_item_dimension_trigger.sql",
    "public/functions/iscatalogitemgrp.sql",
    "public/tables/item.sql",
    "public/tables/uom.sql",
    "xt/views/share_users_crmchild_cntct.sql",
    "xt/views/share_users_crmchild_addr.sql",
    "xt/views/share_users_childcrm_cust_viashiptocntct.sql",
    "xt/views/share_users_childcrm_shipto_viashiptocntct.sql",
    "xt/views/share_users_childcrm_shiptoaddr_viashiptocntct.sql",
    "xt/views/share_users_childcrm_custbillcntct_viashiptocntct.sql",
    "xt/views/share_users_childcrm_custbilladdr_viashiptocntct.sql",
    "xt/views/share_users_childcrm_custcorrscntct_viashiptocntct.sql",
    "xt/views/share_users_childcrm_custcorrsaddr_viashiptocntct.sql",
    "xt/tables/sharetype.sql",
    "xdruple/schema/xdruple.sql",
    "public/tables/pkghead.sql",
    "xdruple/tables/pkgcmd/pkgcmd.sql",
    "xdruple/tables/pkgimage/pkgimage.sql",
    "xdruple/tables/pkgmetasql/pkgmetasql.sql",
    "xdruple/tables/pkgpriv/pkgpriv.sql",
    "xdruple/tables/pkgreport/pkgreport.sql",
    "xdruple/tables/pkgscript/pkgscript.sql",
    "xdruple/tables/pkguiform/pkguiform.sql",
    "xdruple/tables/xd_site.sql",
    "xdruple/triggers/xd_create_b2x_user.sql",
    "xdruple/tables/xd_user_contact.sql",
    "xdruple/tables/xd_commerce_product_data.sql",
    "xdruple/tables/xd_stdorditem.sql",
    "xdruple/triggers/xd_commerce_product_trigger.sql",
    "xdruple/triggers/xd_commerce_shipto_trigger.sql",
    "xdruple/triggers/xd_field_data_commerce_price_trigger.sql",
    "xdruple/views/xd_commerce_product.sql",
    "xdruple/views/xd_field_data_commerce_price.sql",
    "xdruple/views/xd_commerce_shipto.sql",
    "xdruple/views/xd_product_groups.sql",
    "xdruple/views/xd_recentitem.sql",
    "xdruple/views/xd_share_users_stdorditem.sql",
    "xdruple/views/xd_shipto_cntcts_emails.sql",
    "xm/javascript/xd_commerce_product.sql",
    "xdruple/tables/sharetype.sql",
    "xdruple/functions/xd_create_pguser_for_crmaccnt_cntct.sql",
    "xdruple/tables/pkguiform/itemAttributes.ui",
    "xdruple/tables/pkguiform/itemGroupsAttach.ui",
    "xdruple/tables/pkgscript/item.js",
    "xdruple/tables/pkgscript/itemGroupsAttach.js",
    "xdruple/tables/pkgscript/uom.js",
    "xdruple/tables/pkgscript/uoms.js",
    "priv.sql",
    "xdruple/populate_xdruple_data.sql"
  ]
}
