CREATE OR REPLACE FUNCTION xwd.importPricesvc(pProvider TEXT,
                                              pMode TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _c RECORD;
  _kount INTEGER := 0;
  _result INTEGER;

BEGIN

  RAISE NOTICE 'importPricesvc starting with pProvider=%, pMode=%', pProvider, pMode;
  SELECT count(*) FROM xwd.pricesvc INTO _kount;
  RAISE NOTICE 'importPricesvc importing % records', _kount;

  SELECT * INTO _c FROM xwd.catconfig WHERE (catconfig_provider=pProvider);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Provider % not configured', pProvider;
  END IF;

  RAISE NOTICE 'importPricesvc starting deleting from catalog';
  IF (pMode = 'L') THEN
    DELETE FROM xwd.catalog WHERE (catalog_provider=pProvider);
  ELSE
    DELETE FROM xwd.catalog WHERE (catalog_provider=pProvider) AND
                                  (catalog_item_pik IN (SELECT xwd.convToInt(pricesvc_item_pik)
                                                        FROM xwd.pricesvc));
  END IF;
  RAISE NOTICE 'importPricesvc finished deleting from catalog';

  RAISE NOTICE 'importPricesvc starting inserting into catalog';
  INSERT INTO xwd.catalog
(catalog_provider ,
 catalog_item_pik ,
 catalog_mfr_ucc_num ,
 catalog_mfr_shortname ,
 catalog_mfr_fullname ,
 catalog_ps_min_order_type ,
 catalog_ps_min_order ,
 catalog_i2_cat_num ,
 catalog_mfr_cat_num ,
 catalog_product_name ,
 catalog_mfr_description ,
 catalog_comm_code ,
 catalog_comm_pik ,
 catalog_ps_lgcy_uom ,
 catalog_ps_uom ,
 catalog_list ,
 catalog_col3 ,
 catalog_cost ,
 catalog_custom_price1 ,
 catalog_pkg_weight ,
 catalog_pkg_qty ,
 catalog_pkg_uom ,
 catalog_2k_desc ,
 catalog_indv_weight ,
 catalog_pkg_freight_class ,
 catalog_upc ,
 catalog_product_category,
 catalog_price_src_name ,
 catalog_ps_dscnt_schd_code )
SELECT
 pProvider ,
 xwd.convToInt(pricesvc_item_pik) ,
 pricesvc_mfr_ucc_num ,
 pricesvc_mfr_shortname ,
 pricesvc_mfr_fullname ,
 pricesvc_ps_min_order_type ,
 xwd.convToNum(pricesvc_ps_min_order) ,
 pricesvc_i2_cat_num ,
 pricesvc_mfr_cat_num ,
 pricesvc_product_name ,
 pricesvc_mfr_description ,
 pricesvc_comm_code ,
 xwd.convToInt(pricesvc_comm_pik) ,
 pricesvc_ps_lgcy_uom ,
 pricesvc_ps_uom ,
 xwd.convToNum(pricesvc_list) ,
 xwd.convToNum(pricesvc_col3) ,
 xwd.convToNum(pricesvc_cost) ,
 xwd.convToNum(pricesvc_custom_price1) ,
 xwd.convToNum(pricesvc_pkg_weight) ,
 xwd.convToNum(pricesvc_pkg_qty) ,
 pricesvc_pkg_uom ,
 pricesvc_2k_desc ,
 xwd.convToNum(pricesvc_indv_weight) ,
 pricesvc_pkg_freight_class ,
 SUBSTRING(pricesvc_upc FROM 1 FOR 11),
 pricesvc_product_category,
 pricesvc_price_src_name ,
 pricesvc_ps_dscnt_schd_code
  FROM xwd.pricesvc;
  RAISE NOTICE 'importPricesvc starting inserting into catalog';

  SELECT xwd.updateCatalog(pProvider) INTO _result;

  RAISE NOTICE 'importPricesvc completed';
  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

