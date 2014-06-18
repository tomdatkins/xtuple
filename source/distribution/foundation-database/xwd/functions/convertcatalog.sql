CREATE OR REPLACE FUNCTION xwd.convertCatalog(pCatalogid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;
  _c RECORD;
  _ig RECORD;
  _warehous RECORD;
  _result INTEGER;
  _itemid INTEGER := -1;
  _itemsiteid INTEGER := -1;
  _itemsrcid INTEGER := -1;
  _weburlid INTEGER := -1;
  _pdfurlid INTEGER := -1;
  _uomid INTEGER := NULL;
  _puomid INTEGER := NULL;
  _itemuomconvid INTEGER := NULL;
  _classcodeid INTEGER := NULL;
  _itemgrpid INTEGER := NULL;
  _parentitemgrpid INTEGER := NULL;
  _previtemgrpid INTEGER := NULL;
  _catcommdescip TEXT := NULL;
  _prodcatid INTEGER := NULL;
  _freightclassid INTEGER := NULL;
  _vendid INTEGER := NULL;
  _catvendorcost INTEGER := -1;
  _selectedcost NUMERIC := 0.0;

BEGIN

  SELECT *, COALESCE(catalog_i2_cat_num, catalog_mfr_cat_num) AS selected_cat_num,
         CASE WHEN (COALESCE(catalog_custom_price1, 0.0) > 0.0) THEN catalog_custom_price1
              WHEN (COALESCE(catalog_cost, 0.0) > 0.0) THEN catalog_cost
              ELSE COALESCE(catalog_col3, 0.0)
         END AS selected_cost
  INTO _r
  FROM xwd.catalog
  WHERE (catalog_id=pCatalogid);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  SELECT * INTO _c FROM xwd.catconfig WHERE (catconfig_provider=_r.catalog_provider);
  IF (NOT FOUND) THEN
    RETURN -2;
  END IF;

  -- Make sure Item does not already exist
  SELECT item_id INTO _result FROM item WHERE (item_number = (COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.selected_cat_num));
  IF (FOUND) THEN
    RETURN -3;
  END IF;
  SELECT item_id INTO _result FROM item WHERE (item_number = (COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.catalog_mfr_cat_num));
  IF (FOUND) THEN
    RETURN -3;
  END IF;
  SELECT item_id INTO _result FROM item WHERE (item_upccode = _r.catalog_upc) LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  -- Find UOM and create if not found
  _r.catalog_ps_uom := UPPER(COALESCE(_r.catalog_ps_uom, 'MISSING'));
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_ps_uom)) = 0) THEN
    _r.catalog_ps_uom := 'MISSING';
  END IF;
  SELECT uom_id INTO _uomid FROM uom WHERE (uom_name=_r.catalog_ps_uom);
  IF (NOT FOUND) THEN
    INSERT INTO uom (uom_name, uom_descrip) VALUES (_r.catalog_ps_uom, _r.catalog_ps_uom)
    RETURNING uom_id INTO _uomid;
  END IF;

  -- Find Pricing UOM and create if not found
  _r.catalog_ps_lgcy_uom := UPPER(COALESCE(_r.catalog_ps_lgcy_uom, _r.catalog_ps_uom, 'MISSING'));
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_ps_lgcy_uom)) = 0) THEN
    _r.catalog_ps_lgcy_uom := 'MISSING';
  END IF;
  SELECT uom_id INTO _puomid FROM uom WHERE (uom_name=_r.catalog_ps_lgcy_uom);
  IF (NOT FOUND) THEN
    INSERT INTO uom (uom_name, uom_descrip) VALUES (_r.catalog_ps_lgcy_uom, _r.catalog_ps_lgcy_uom)
    RETURNING uom_id INTO _puomid;
  END IF;

  -- Find ClassCode and create if not found
  _r.catalog_comm_code := COALESCE(_r.catalog_comm_code, '999999');
  SELECT classcode_id INTO _classcodeid FROM classcode WHERE (classcode_code=_r.catalog_comm_code);
  IF (NOT FOUND) THEN
    SELECT catcomm_comm_desc INTO _catcommdescip FROM xwd.catcomm WHERE (catcomm_comm_code = _r.catalog_comm_code);
    INSERT INTO classcode (classcode_code, classcode_descrip) VALUES (_r.catalog_comm_code, COALESCE(_catcommdescip, _r.catalog_comm_code))
    RETURNING classcode_id INTO _classcodeid;
  END IF;

  -- Find ItemGroup and create if not found
  _r.catalog_comm_code := COALESCE(_r.catalog_comm_code, '999999');
  SELECT itemgrp_id INTO _itemgrpid FROM itemgrp WHERE (itemgrp_name=_r.catalog_comm_code);
  IF (NOT FOUND) THEN
    SELECT catcomm_comm_desc INTO _catcommdescip FROM xwd.catcomm WHERE (catcomm_comm_code = _r.catalog_comm_code);
    INSERT INTO itemgrp (itemgrp_name, itemgrp_descrip, itemgrp_catalog) VALUES (_r.catalog_comm_code, COALESCE(_catcommdescip, _r.catalog_comm_code), FALSE)
    RETURNING itemgrp_id INTO _itemgrpid;
    _previtemgrpid := _itemgrpid;

    -- Recursively create parent ItemGroups
    FOR _ig IN
      WITH RECURSIVE indentedgroups(id, parent, name, descrip, depth, path, cycle) AS (
      SELECT catcomm_id AS id,
             catcomm_parent_pik AS parent,
             catcomm_comm_code AS name,
             catcomm_comm_desc AS descrip,
             0 AS depth, array[catcomm_id] AS path, false AS cycle
      FROM xwd.catcomm WHERE (catcomm_comm_code=_r.catalog_comm_code)
      UNION ALL
      SELECT catcomm_id AS id,
             catcomm_parent_pik AS parent,
             catcomm_comm_code AS name,
             catcomm_comm_desc AS descrip,
             (depth+1) AS depth, (path || catcomm_id) AS path, (catcomm_id = any(path)) AS cycle
      FROM indentedgroups
        JOIN xwd.catcomm ON (catcomm_pik=parent)
      WHERE (NOT cycle)
      )
      SELECT id, parent, name, descrip, depth, path, cycle
      FROM indentedgroups
      ORDER BY depth LOOP

      SELECT itemgrp_id INTO _parentitemgrpid FROM itemgrp WHERE (itemgrp_name=_ig.name);
      IF (NOT FOUND) THEN
        INSERT INTO itemgrp (itemgrp_name, itemgrp_descrip) VALUES (_ig.name, _ig.descrip)
        RETURNING itemgrp_id INTO _parentitemgrpid;
        INSERT INTO itemgrpitem (itemgrpitem_itemgrp_id, itemgrpitem_item_id, itemgrpitem_item_type)
                         VALUES (_parentitemgrpid, _previtemgrpid, 'G');
      END IF;

      _previtemgrpid := _parentitemgrpid;

    END LOOP;
  END IF;

  -- Find ProdCat and create if not found
  _r.catalog_product_category := COALESCE(_r.catalog_product_category, 'MISSING');
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_product_category)) = 0) THEN
    _r.catalog_product_category := 'MISSING';
  END IF;
  SELECT prodcat_id INTO _prodcatid FROM prodcat WHERE (prodcat_code=_r.catalog_product_category);
  IF (NOT FOUND) THEN
    INSERT INTO prodcat (prodcat_code, prodcat_descrip) VALUES (_r.catalog_product_category, _r.catalog_product_category)
    RETURNING prodcat_id INTO _prodcatid;
  END IF;

  -- Find FreightClass and create if not found
  _r.catalog_pkg_freight_class := COALESCE(_r.catalog_pkg_freight_class, 'MISSING');
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_pkg_freight_class)) = 0) THEN
    _r.catalog_pkg_freight_class := 'MISSING';
  END IF;
  SELECT freightclass_id INTO _freightclassid FROM freightclass WHERE (freightclass_code=_r.catalog_pkg_freight_class);
  IF (NOT FOUND) THEN
    INSERT INTO freightclass (freightclass_code, freightclass_descrip) VALUES (_r.catalog_pkg_freight_class, _r.catalog_pkg_freight_class)
    RETURNING freightclass_id INTO _freightclassid;
  END IF;

  -- Find Vendor and create if not found
  _r.catalog_mfr_ucc_num := COALESCE(_r.catalog_mfr_ucc_num, 'MISSING');
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_mfr_ucc_num)) = 0) THEN
    _r.catalog_mfr_ucc_num := 'MISSING';
  END IF;
  SELECT COALESCE(catvendor_parent_id, vend_id) AS vend_id INTO _vendid
  FROM vendinfo LEFT OUTER JOIN xwd.catvendor ON (catvendor_vend_id=vend_id)
  WHERE (vend_number=_r.catalog_mfr_ucc_num);
  IF (NOT FOUND) THEN
    INSERT INTO vendinfo
       ( vend_number, vend_accntnum,
         vend_active, vend_vendtype_id, vend_name,
         vend_cntct1_id, vend_cntct2_id, vend_addr_id,
         vend_po, vend_restrictpurch,
         vend_1099, vend_qualified,
         vend_comments, vend_pocomments,
         vend_fobsource, vend_fob,
         vend_terms_id, vend_shipvia, vend_curr_id,
         vend_taxzone_id, vend_match, vend_ach_enabled,
         vend_ach_routingnumber, vend_ach_accntnumber,
         vend_ach_use_vendinfo,
         vend_ach_accnttype, vend_ach_indiv_number,
         vend_ach_indiv_name,
         vend_accnt_id, vend_expcat_id, vend_tax_id)
       VALUES
       ( _r.catalog_mfr_ucc_num,
         NULL,
         TRUE,
         _c.catconfig_vendtype_id,
         _r.catalog_mfr_fullname,
         NULL,
         NULL,
         NULL,
         TRUE,
         FALSE,
         FALSE,
         TRUE,
         '',
         '',
         NULL,
         NULL,
         _c.catconfig_terms_id,
         NULL,
         NULL,
         NULL,
         FALSE,
         FALSE,
         '',
         '',
         FALSE,
         'K',
         '',
         '',
         -1,
         -1,
         -1
          )
    RETURNING vend_id INTO _vendid;
    _selectedcost := _r.selected_cost;
  ELSE
    SELECT catvendor_costcolumn INTO _catvendorcost FROM xwd.catvendor WHERE (catvendor_vend_id=_vendid);
    IF (NOT FOUND) THEN
      _catvendorcost := -1;
    END IF;
    _selectedcost := COALESCE(CASE _catvendorcost WHEN (-1) THEN _r.selected_cost
                                                  WHEN (0) THEN _r.selected_cost
                                                  WHEN (1) THEN COALESCE(_r.catalog_custom_price1, _r.selected_cost)
                                                  WHEN (2) THEN COALESCE(_r.catalog_col3, _r.selected_cost)
                                                  WHEN (3) THEN COALESCE(_r.catalog_list, _r.selected_cost)
                                                  WHEN (4) THEN COALESCE(_r.catalog_cost, _r.selected_cost)
                                                  ELSE 0.0
                              END, 0.0);
  END IF;

  -- Insert Item
  INSERT INTO item
    ( item_number, item_active,
      item_descrip1, item_descrip2,
      item_type, item_inv_uom_id, item_classcode_id,
      item_picklist, item_sold, item_fractional,
      item_listcost, item_prodweight, item_packweight,
      item_prodcat_id, item_price_uom_id, item_exclusive,
      item_listprice, item_upccode, item_config,
      item_comments, item_extdescrip, item_warrdays,
      item_freightclass_id, item_tax_recoverable )
  VALUES
    ( (COALESCE(_r.catalog_mfr_shortname || '-', '') || COALESCE(_r.selected_cat_num, 'MISSING')), TRUE,
      COALESCE(_r.catalog_product_name, 'MISSING'), COALESCE(_r.catalog_mfr_description, 'MISSING'),
      'P', _uomid, _classcodeid,
      TRUE, TRUE, TRUE,
      _selectedcost, COALESCE(_r.catalog_indv_weight, 0.0), COALESCE(_r.catalog_pkg_weight, 0.0),
      _prodcatid, _puomid, FALSE,
      _r.catalog_col3, COALESCE(_r.catalog_upc, 'MISSING'), FALSE,
      '', COALESCE(_r.catalog_2k_desc, 'MISSING'), 0,
      _freightclassid, TRUE )
  RETURNING item_id INTO _itemid;

  -- Insert Item Cost
  INSERT INTO itemcost
  ( itemcost_item_id, itemcost_costelem_id, itemcost_lowlevel,
    itemcost_stdcost, itemcost_posted,
    itemcost_actcost, itemcost_curr_id, itemcost_updated )
  SELECT
    _itemid, costelem_id, FALSE,
    _selectedcost, CURRENT_DATE,
    _selectedcost, BaseCurrId(), CURRENT_DATE
  FROM costelem
  WHERE (costelem_type='Material');

  -- Insert/Update itemuomconv
  IF (_uomid != _puomid) THEN
    SELECT itemuomconv_id INTO _itemuomconvid
    FROM itemuomconv
    WHERE (itemuomconv_item_id=_itemid)
      AND (itemuomconv_from_uom_id=_puomid)
      AND (itemuomconv_to_uom_id=_uomid);
    IF (NOT FOUND) THEN
      INSERT INTO itemuomconv
        (itemuomconv_item_id,
         itemuomconv_from_uom_id,
         itemuomconv_from_value,
         itemuomconv_to_uom_id,
         itemuomconv_to_value,
         itemuomconv_fractional)
      VALUES
        (_itemid,
         _puomid,
         1,
         _uomid,
         CASE _r.catalog_ps_lgcy_uom WHEN 'E' THEN 1
                                     WHEN 'C' THEN 100
                                     WHEN 'M' THEN 1000
                                     ELSE 1 END,
         FALSE)
      RETURNING itemuomconv_id INTO _itemuomconvid;
      INSERT INTO itemuom
        (itemuom_itemuomconv_id,
         itemuom_uomtype_id)
      SELECT _itemuomconvid, uomtype_id
      FROM uomtype
      WHERE (uomtype_name='Selling');
    END IF;
  END IF;

  -- Insert URL Info
  IF (_r.catalog_web_url IS NOT NULL) THEN
    INSERT INTO urlinfo
      ( url_title, url_url )
    VALUES
      ( 'Image', _r.catalog_web_url )
    RETURNING url_id INTO _weburlid;
  END IF;
  
  IF (_r.catalog_pdf_url IS NOT NULL) THEN
    INSERT INTO urlinfo
      ( url_title, url_url )
    VALUES
      ( 'Spec Sheet', _r.catalog_pdf_url )
    RETURNING url_id INTO _pdfurlid;
  END IF;
  
  -- Insert Document Assignment
  IF (_r.catalog_web_url IS NOT NULL) THEN
    INSERT INTO docass
      ( docass_source_id, docass_source_type,
        docass_target_id, docass_target_type, docass_purpose )
    VALUES
      ( _itemid, 'I', _weburlid, 'URL', 'S' );
  END IF;

  IF (_r.catalog_pdf_url IS NOT NULL) THEN
    INSERT INTO docass
      ( docass_source_id, docass_source_type,
        docass_target_id, docass_target_type, docass_purpose )
    VALUES
      ( _itemid, 'I', _pdfurlid, 'URL', 'S' );
  END IF;

  -- Insert Item Tax
  IF (_c.catconfig_taxtype_id IS NOT NULL) THEN
    INSERT INTO itemtax
      ( itemtax_item_id, itemtax_taxtype_id, itemtax_taxzone_id )
    VALUES
      ( _itemid, _c.catconfig_taxtype_id, _c.catconfig_taxzone_id );
  END IF;

  -- Insert Item Group Item
  IF (_itemgrpid > 0) THEN
    INSERT INTO itemgrpitem
      ( itemgrpitem_itemgrp_id, itemgrpitem_item_id, itemgrpitem_item_type )
    VALUES
      ( _itemgrpid, _itemid, 'I' );
  END IF;

  -- Insert Itemsite(s)
  FOR _warehous IN SELECT * 
                   FROM whsinfo
  LOOP
    IF ( (_c.catconfig_warehous_id = -1) OR (_c.catconfig_warehous_id = _warehous.warehous_id) ) THEN
      INSERT INTO itemsite
        ( itemsite_item_id, itemsite_warehous_id, itemsite_qtyonhand,
          itemsite_useparams, itemsite_useparamsmanual, itemsite_reorderlevel,
          itemsite_ordertoqty, itemsite_minordqty, itemsite_maxordqty, itemsite_multordqty,
          itemsite_safetystock, itemsite_cyclecountfreq,
          itemsite_leadtime, itemsite_eventfence, itemsite_plancode_id, itemsite_costcat_id,
          itemsite_poSupply, itemsite_woSupply, itemsite_createpr, itemsite_createwo,
          itemsite_createsopr, itemsite_createsopo,
          itemsite_sold, itemsite_soldranking,
          itemsite_stocked, itemsite_planning_type, itemsite_supply_itemsite_id,
          itemsite_controlmethod, itemsite_perishable, itemsite_active,
          itemsite_loccntrl, itemsite_location_id, itemsite_location,
          itemsite_recvlocation_id, itemsite_issuelocation_id,
          itemsite_location_dist, itemsite_recvlocation_dist, itemsite_issuelocation_dist,
          itemsite_location_comments, itemsite_notes,
          itemsite_abcclass, itemsite_autoabcclass,
          itemsite_freeze, itemsite_datelastused, itemsite_ordergroup, itemsite_ordergroup_first,
          itemsite_mps_timefence,
          itemsite_disallowblankwip,
          itemsite_costmethod, itemsite_value, itemsite_cosdefault,
          itemsite_warrpurc, itemsite_autoreg, itemsite_lsseq_id)
      VALUES
        ( _itemid, _warehous.warehous_id, 0.0,
          _c.catconfig_useparams, _c.catconfig_useparamsmanual, _c.catconfig_reorderlevel,
          _c.catconfig_ordertoqty, _c.catconfig_minordqty, _c.catconfig_maxordqty, _c.catconfig_multordqty,
          _c.catconfig_safetystock, _c.catconfig_cyclecountfreq,
          _c.catconfig_leadtime, _c.catconfig_eventfence, _c.catconfig_plancode_id, _c.catconfig_costcat_id,
          TRUE, FALSE, FALSE, FALSE,
          _c.catconfig_createsopr, _c.catconfig_createsopo,
          TRUE, 1,
          _c.catconfig_stocked, _c.catconfig_planning_type, NULL,
          _c.catconfig_controlmethod, FALSE, TRUE,
          _c.catconfig_loccntrl, _c.catconfig_location_id, _c.catconfig_location,
          _c.catconfig_recvlocation_id, _c.catconfig_issuelocation_id,
          _c.catconfig_location_dist, _c.catconfig_recvlocation_dist, _c.catconfig_issuelocation_dist,
          '', '',
          _c.catconfig_abcclass, _c.catconfig_autoabcclass,
          FALSE, startOfTime(), _c.catconfig_ordergroup, _c.catconfig_ordergroup_first,
          0,
          FALSE,
          _c.catconfig_costmethod, 0, NULL,
          FALSE, FALSE, NULL  )
      RETURNING itemsite_id INTO _itemsiteid;
      IF (fetchMetricText('Application') = 'Standard') THEN
        UPDATE itemsite SET itemsite_dropship=_c.catconfig_dropship WHERE itemsite_id=_itemsiteid;
      END IF;
    END IF;
  END LOOP;

  -- Insert Itemsrc
  INSERT INTO itemsrc
    ( itemsrc_item_id, itemsrc_active, itemsrc_default, itemsrc_vend_id,
      itemsrc_vend_item_number, itemsrc_vend_item_descrip,
      itemsrc_vend_uom, itemsrc_invvendoruomratio,
      itemsrc_minordqty, itemsrc_multordqty, itemsrc_upccode,
      itemsrc_leadtime, itemsrc_ranking,
      itemsrc_comments, itemsrc_manuf_name,
      itemsrc_manuf_item_number, itemsrc_manuf_item_descrip )
  VALUES
    ( _itemid, TRUE, TRUE, _vendid,
      _r.catalog_mfr_cat_num, _r.catalog_mfr_description,
      COALESCE(_r.catalog_ps_uom, 'EA'), 1.0,
      CASE _r.catalog_ps_lgcy_uom WHEN ('C') THEN 100.0 WHEN ('M') THEN 1000.0 ELSE 1.0 END,
      1.0, COALESCE(_r.catalog_upc, 'MISSING'),
      1, 1,
      '', _r.catalog_mfr_fullname,
      _r.catalog_mfr_cat_num, _r.catalog_mfr_description )
  RETURNING itemsrc_id INTO _itemsrcid;

  -- Insert Itemsrc Prices
  INSERT INTO itemsrcp
    ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_type, itemsrcp_price,
      itemsrcp_discntprcnt, itemsrcp_fixedamtdiscount )
  VALUES
    ( _itemsrcid, 1.0, 'N',
      CASE WHEN (_selectedcost > 0.0 AND _r.catalog_ps_lgcy_uom = 'C') THEN (_selectedcost / 100.0)
           WHEN (_selectedcost > 0.0 AND _r.catalog_ps_lgcy_uom = 'M') THEN (_selectedcost / 1000.0)
           WHEN (_selectedcost > 0.0) THEN _selectedcost
           ELSE 0.0 END,
      0.0, 0.0 );


--  IF (COALESCE(_r.catalog_trade_qty1::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty1::NUMERIC, _r.catalog_trade_price1 );
--  END IF;
--  IF (COALESCE(_r.catalog_trade_qty2::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty2::NUMERIC, _r.catalog_trade_price2 );
--  END IF;
--  IF (COALESCE(_r.catalog_trade_qty3::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty3::NUMERIC, _r.catalog_trade_price3 );
--  END IF;
--  IF (COALESCE(_r.catalog_trade_qty4::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty4::NUMERIC, _r.catalog_trade_price4 );
--  END IF;
--  IF (COALESCE(_r.catalog_trade_qty5::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty5::NUMERIC, _r.catalog_trade_price5 );
--  END IF;
--  IF (COALESCE(_r.catalog_trade_qty6::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty6::NUMERIC, _r.catalog_trade_price6 );
--  END IF;
--  IF (COALESCE(_r.catalog_trade_qty7::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty7::NUMERIC, _r.catalog_trade_price7 );
--  END IF;
--  IF (COALESCE(_r.catalog_trade_qty8::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty8::NUMERIC, _r.catalog_trade_price8 );
--  END IF;
--  IF (COALESCE(_r.catalog_trade_qty9::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty9::NUMERIC, _r.catalog_trade_price9 );
--  END IF;
--  IF (COALESCE(_r.catalog_trade_qty10::NUMERIC, 0.0) > 0.0) THEN
--    INSERT INTO itemsrcp
--      ( itemsrcp_itemsrc_id, itemsrcp_qtybreak, itemsrcp_price )
--    VALUES
--      ( _itemsrcid, _r.catalog_trade_qty10::NUMERIC, _r.catalog_trade_price10 );
--  END IF;

  RETURN _itemid;
END;
$$ LANGUAGE 'plpgsql';

