CREATE TABLE xwd.pricesvc
(pricesvc_id SERIAL NOT NULL,
 pricesvc_ps_pik TEXT,
 pricesvc_item_pik TEXT,
 pricesvc_item_action TEXT,
 pricesvc_mfr_ucc_num TEXT,
 pricesvc_item_num TEXT,
 pricesvc_pkg_indicator TEXT,
 pricesvc_ean TEXT,
 pricesvc_unspsc TEXT,
 pricesvc_user_num TEXT,
 pricesvc_zone TEXT,
 pricesvc_zone_pik TEXT,
 pricesvc_item_country TEXT,
 pricesvc_item_industry TEXT,
 pricesvc_upc_flag TEXT,
 pricesvc_replaced_by_item_pik TEXT,
 pricesvc_replaces_item_pik TEXT,
 pricesvc_mfr_type TEXT,
 pricesvc_mfr_shortname TEXT,
 pricesvc_mfr_fullname TEXT,
 pricesvc_ps_min_order_type TEXT,
 pricesvc_ps_min_order TEXT,
 pricesvc_i2_cat_num TEXT,
 pricesvc_mfr_cat_num TEXT,
 pricesvc_product_name TEXT,
 pricesvc_fulltech_description TEXT,
 pricesvc_mfr_description TEXT,
 pricesvc_invoice_description TEXT,
 pricesvc_ps_product_group TEXT,
 pricesvc_cash_discount TEXT,
 pricesvc_velocity_code TEXT,
 pricesvc_ps_lgcy_dscnt_schd TEXT,
 pricesvc_comm_code TEXT,
 pricesvc_comm_pik TEXT,
 pricesvc_gst_flag TEXT,
 pricesvc_ps_lgcy_low_dollar TEXT,
 pricesvc_ps_lgcy_high_dollar TEXT,
 pricesvc_ps_lgcy_qty2 TEXT,
 pricesvc_ps_lgcy_qty3 TEXT,
 pricesvc_ps_lgcy_uom TEXT,
 pricesvc_ps_uom TEXT,
 pricesvcps_uom_qty TEXT,
 pricesvc_price_src_name TEXT,
 pricesvc_price_status TEXT,
 pricesvc_price_eff_date TEXT,
 pricesvc_price_end_date TEXT,
 pricesvc_list TEXT,
 pricesvc_col1 TEXT,
 pricesvc_col2 TEXT,
 pricesvc_col3 TEXT,
 pricesvc_resale TEXT,
 pricesvc_cost TEXT,
 pricesvc_custom_price1 TEXT,
 pricesvc_custom_price2 TEXT,
 pricesvc_custom_price3 TEXT,
 pricesvc_pkg_weight TEXT,
 pricesvc_pkg_weight_uom TEXT,
 pricesvc_pkg_type TEXT,
 pricesvc_pkg_qty TEXT,
 pricesvc_pkg_uom TEXT,
 pricesvc_msds TEXT,
 pricesvc_msds_eff_date TEXT,
 pricesvc_msds_form_num TEXT,
 pricesvc_ps_dscnt_schd_code TEXT,
 pricesvc_mfr_pik TEXT,
 pricesvc_mfr_registered_ucc_flag TEXT,
 pricesvc_leaf_class TEXT,
 pricesvc_unspsc40 TEXT,
 pricesvc_pfms_description TEXT,
 pricesvc_pfms_mfr_shortname TEXT,
 pricesvc_xref_group TEXT,
 pricesvc_custom_price1_uom TEXT,
 pricesvc_custom_price2_uom TEXT,
 pricesvc_custom_price3_uom TEXT,
 pricesvc_2k_desc TEXT,
 pricesvc_mfr_class_code TEXT,
 pricesvc_mfr_sub_class_code TEXT,
 pricesvc_price_group_code1 TEXT,
 pricesvc_price_group_code2 TEXT,
 pricesvc_price_group_code3 TEXT,
 pricesvc_stock_indicator TEXT,
 pricesvc_brand_name TEXT,
 pricesvc_indv_weight TEXT,
 pricesvc_indv_weight_uom TEXT,
 pricesvc_mfr_replaced_by_upc TEXT,
 pricesvc_mfr_replaced_by_cat_no TEXT,
 pricesvc_mfr_replaces_upc TEXT,
 pricesvc_mfr_replaces_cat_no TEXT,
 pricesvc_pkg_length TEXT,
 pricesvc_pkg_width TEXT,
 pricesvc_pkg_height TEXT,
 pricesvc_pkg_volume TEXT,
 pricesvc_pkg_freight_class TEXT,
 pricesvc_pkg_dmnsn_uom TEXT,
 pricesvc_pkg_volume_uom TEXT,
 pricesvc_comm_code_enhanced TEXT,
 pricesvc_comm_pik_enhanced TEXT,
 pricesvc_currency_code TEXT,
 pricesvc_gtin TEXT,
 pricesvc_upc TEXT,
 pricesvc_legacy_update_status TEXT,
 pricesvc_item_update_status TEXT,
 pricesvc_price_update_status TEXT,
 pricesvc_mfr_item_status TEXT,
 pricesvc_mfr_unspsc TEXT,
 pricesvc_energy_star TEXT,
 pricesvc_min_advertised_price TEXT,
 pricesvc_trade_qty1 TEXT,
 pricesvc_trade_price1 TEXT,
 pricesvc_trade_qty2 TEXT,
 pricesvc_trade_price2 TEXT,
 pricesvc_trade_qty3 TEXT,
 pricesvc_trade_price3 TEXT,
 pricesvc_trade_qty4 TEXT,
 pricesvc_trade_price4 TEXT,
 pricesvc_trade_qty5 TEXT,
 pricesvc_trade_price5 TEXT,
 pricesvc_trade_qty6 TEXT,
 pricesvc_trade_price6 TEXT,
 pricesvc_trade_qty7 TEXT,
 pricesvc_trade_price7 TEXT,
 pricesvc_trade_qty8 TEXT,
 pricesvc_trade_price8 TEXT,
 pricesvc_trade_qty9 TEXT,
 pricesvc_trade_price9 TEXT,
 pricesvc_trade_qty10 TEXT,
 pricesvc_trade_price10 TEXT,
 pricesvc_cost_qty1 TEXT,
 pricesvc_cost_price1 TEXT,
 pricesvc_cost_qty2 TEXT,
 pricesvc_cost_price2 TEXT,
 pricesvc_cost_qty3 TEXT,
 pricesvc_cost_price3 TEXT,
 pricesvc_cost_qty4 TEXT,
 pricesvc_cost_price4 TEXT,
 pricesvc_cost_qty5 TEXT,
 pricesvc_cost_price5 TEXT,
 pricesvc_cost_qty6 TEXT,
 pricesvc_cost_price6 TEXT,
 pricesvc_cost_qty7 TEXT,
 pricesvc_cost_price7 TEXT,
 pricesvc_cost_qty8 TEXT,
 pricesvc_cost_price8 TEXT,
 pricesvc_cost_qty9 TEXT,
 pricesvc_cost_price9 TEXT,
 pricesvc_cost_qty10 TEXT,
 pricesvc_cost_price10 TEXT,
 pricesvc_country_of_origin TEXT,
 pricesvc_percnet_mfgd_in_usa TEXT,
 pricesvc_indv_weight_qty TEXT,
 pricesvc_indv_weight_qty_uom TEXT,
 pricesvc_alt_mfr_cat_number TEXT,
 pricesvc_product_category TEXT,
 pricesvc_lead_free_flag TEXT,
 pricesvc_mercury_free_flag TEXT,
 pricesvc_returnable TEXT,
 pricesvc_custom_price TEXT,
 pricesvc_custom_price_uom TEXT,
 CONSTRAINT pricesvc_pkey PRIMARY KEY (pricesvc_id)
);

ALTER TABLE xwd.pricesvc OWNER TO "admin";
GRANT ALL ON TABLE xwd.pricesvc TO "admin";
GRANT ALL ON TABLE xwd.pricesvc TO xtrole;
GRANT ALL ON SEQUENCE xwd.pricesvc_pricesvc_id_seq TO xtrole;

COMMENT ON TABLE xwd.pricesvc IS 'Trade Service Unified Tab';