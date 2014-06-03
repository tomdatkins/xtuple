CREATE OR REPLACE FUNCTION xwd.importxoPrice(pProvider text,
                                             pMode text) RETURNS integer AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _c RECORD;
  _kount INTEGER := 0;
  _result INTEGER;

BEGIN

  RAISE NOTICE 'importxoPrice starting with pProvider=%, pMode=%', pProvider, pMode;
  SELECT count(*) FROM xwd.xoprice INTO _kount;
  RAISE NOTICE 'importxoPrice importing % records', _kount;

  SELECT * INTO _c FROM xwd.catconfig WHERE (catconfig_provider=pProvider);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Provider % not configured', pProvider;
  END IF;

  RAISE NOTICE 'importxoPrice starting deleting from catalog';
  IF (pMode = 'L') THEN
    DELETE FROM xwd.catalog WHERE (catalog_provider=pProvider);
  ELSE
    DELETE FROM xwd.catalog WHERE (catalog_provider=pProvider) AND
                                  (catalog_item_pik IN (SELECT xwd.convToInt(xoprice_itemid)
                                                        FROM xwd.xoprice));
  END IF;
  RAISE NOTICE 'importxoPrice finished deleting from catalog';

  RAISE NOTICE 'importxoPrice starting inserting into catalog';
  INSERT INTO xwd.catalog
(catalog_provider ,
 catalog_item_pik ,
 catalog_mfr_ucc_num ,
 catalog_mfr_shortname ,
 catalog_mfr_fullname ,
 catalog_ps_min_order_type ,
 catalog_ps_min_order ,
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
 catalog_upc ,
 catalog_product_category,
 catalog_price_src_name ,
 catalog_ps_dscnt_schd_code )
SELECT
 pProvider ,
 xwd.convToInt(xoprice_itemid) ,
 xoprice_vendorid ,
 'xo',
 xoprice_vendorname ,
 'Q' ,
 xwd.convToNum('1') ,
 xoprice_itemnum ,
 xoprice_itemname ,
 xoprice_vendoritemname ,
 xoprice_catgroup ,
 xwd.convToInt(xoprice_catgroupid) ,
 'E',
 'EA',
 xwd.convToNum(xoprice_webprice) ,
 xwd.convToNum(xoprice_base) ,
 xwd.convToNum(xoprice_price) ,
 xwd.convToNum(xoprice_withshipping) ,
 xwd.convToNum(xoprice_weight) ,
 '1' ,
 'EA',
 xoprice_vendoritemdescrip ,
 xwd.convToNum(xoprice_itemshipweight) ,
  SUBSTRING(xoprice_upccode FROM 1 FOR 11),
 xoprice_catbgroup,
 'xo' ,
 xoprice_familyid
  FROM xwd.xoprice;
  RAISE NOTICE 'importxoPrice starting inserting into catalog';

  SELECT xwd.updateCatalog(pProvider) INTO _result;

  RAISE NOTICE 'importxoPrice completed';
  RETURN _result;
END;
$$ LANGUAGE 'plpgsql'
