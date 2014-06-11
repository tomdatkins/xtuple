{
  "name": "xdruple",
  "version": "4.5.0",
  "comment": "xDruple Extension",
  "loadOrder": 120,
  "dependencies": ["crm", "sales", "billing", "inventory", "manufacturing"],
  "databaseScripts": [
    "xdruple/schema/xdruple.sql",
    "xdruple/tables/xd_site.sql",
    "xdruple/triggers/xd_create_b2x_user.sql",
    "xdruple/tables/xd_user_contact.sql",
    "xdruple/tables/xd_commerce_product_data.sql",
    "xdruple/tables/xd_field_data_commerce_price_data.sql",
    "xdruple/tables/xd_stdorditem.sql",
    "xdruple/triggers/xd_commerce_product_trigger.sql",
    "xdruple/triggers/xd_commerce_shipto_trigger.sql",
    "xdruple/triggers/xd_field_data_commerce_price_trigger.sql",
    "xdruple/views/xd_commerce_product.sql",
    "xdruple/views/xd_field_data_commerce_price.sql",
    "xdruple/views/xd_commerce_shipto.sql",
    "xdruple/views/xd_recentitem.sql",
    "xdruple/views/xd_share_users_stdorditem.sql",
    "xdruple/views/xd_shipto_cntcts_emails.sql",
    "xm/javascript/xd_commerce_product.sql",
    "xdruple/tables/sharetype.sql",
    "xdruple/functions/xd_create_pguser_for_crmaccnt_cntct.sql",
    "priv.sql"
  ]
}
