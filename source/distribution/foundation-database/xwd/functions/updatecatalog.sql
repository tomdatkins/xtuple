CREATE OR REPLACE FUNCTION xwd.updateCatalog(pProvider TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  RETURN xwd.updateCatalog(pProvider, TRUE);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xwd.updateCatalog(pProvider TEXT,
                                             pDiffItem BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  RETURN xwd.updateCatalog(pProvider, pDiffItem, TRUE);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xwd.updateCatalog(pProvider TEXT,
                                             pDiffItem BOOLEAN,
                                             pDebug BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _c RECORD;
  _r RECORD;
  _warehous RECORD;
  _result INTEGER;
  _itemid INTEGER := -1;
  _itemsiteid INTEGER := -1;
  _itemsrcid INTEGER := -1;
  _itemsrcpid INTEGER := -1;
  _uomid INTEGER := NULL;
  _puomid INTEGER := NULL;
  _itemuomconvid INTEGER := NULL;
  _classcodeid INTEGER := NULL;
  _prodcatid INTEGER := NULL;
  _freightclassid INTEGER := NULL;
  _vendid INTEGER := NULL;
  _catvendorcost INTEGER := -1;
  _selectedcost NUMERIC := 0.0;
  _catalogUpdate TEXT;

BEGIN

  RAISE NOTICE 'updateCatalog starting with pProvider=%, pDiffItem=%, pDebug=%', pProvider, pDiffItem, pDebug;

  SELECT * INTO _c FROM xwd.catconfig WHERE (catconfig_provider=pProvider);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  FOR _r IN 
    SELECT *, COALESCE(catalog_i2_cat_num, catalog_mfr_cat_num) AS selected_cat_num,
           CASE WHEN (COALESCE(catalog_custom_price1, 0.0) > 0.0) THEN catalog_custom_price1
                WHEN (COALESCE(catalog_cost, 0.0) > 0.0) THEN catalog_cost
                ELSE COALESCE(catalog_col3, 0.0)
           END AS selected_cost
    FROM xwd.catalog WHERE (catalog_provider=pProvider)
  LOOP

--  RAISE NOTICE 'updateCatalog processing catalog %',(COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.catalog_mfr_cat_num);

  -- Check to see if Catalog has been converted and Item exists
  SELECT item_id INTO _itemid FROM item WHERE (item_number = (COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.selected_cat_num));
  IF (NOT FOUND) THEN
    SELECT item_id INTO _itemid FROM item WHERE (item_number = (COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.catalog_mfr_cat_num));
    IF (NOT FOUND) THEN
      SELECT item_id INTO _itemid FROM item WHERE (item_upccode = _r.catalog_upc) LIMIT 1;
      IF (NOT FOUND) THEN
--        IF (pDebug) THEN
--          RAISE NOTICE 'updateCatalog catalog % not found',(COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.catalog_mfr_cat_num);
--        END IF;
        CONTINUE;
      END IF;
    END IF;
  END IF;

  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog found catalog %, item_id %',(COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.selected_cat_num), _itemid;
  END IF;

  -- Check for CatalogUpdate characteristic
  -- If found and set to false then skip
  SELECT UPPER(charass_value) INTO _catalogUpdate
  FROM char JOIN charass ON (charass_char_id=char_id)
  WHERE (char_name ~* 'catalogupdate')
    AND (charass_target_type='I')
    AND (charass_target_id=_itemid);
  IF (FOUND) THEN
    IF (_catalogUpdate IN ('NO', 'OFF')) THEN
      IF (pDebug) THEN
        RAISE NOTICE 'updateCatalog found characteristic and skipping catalog %',(COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.selected_cat_num);
      END IF;
      CONTINUE;
    END IF;
  END IF;

  -- Find UOM and create if not found
  _r.catalog_ps_uom := COALESCE(_r.catalog_ps_uom, 'MISSING');
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_ps_uom)) = 0) THEN
    _r.catalog_ps_uom := 'MISSING';
  END IF;
  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog checking for UOM=%',_r.catalog_ps_uom;
  END IF;
  SELECT uom_id INTO _uomid FROM uom WHERE (uom_name=_r.catalog_ps_uom);
  IF (NOT FOUND) THEN
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog inserting UOM=%',_r.catalog_ps_uom;
    END IF;
    INSERT INTO uom (uom_name, uom_descrip) VALUES (_r.catalog_ps_uom, _r.catalog_ps_uom)
    RETURNING uom_id INTO _uomid;
  END IF;

  -- Find Pricing UOM and create if not found
  _r.catalog_ps_lgcy_uom := COALESCE(_r.catalog_ps_lgcy_uom, _r.catalog_ps_uom, 'MISSING');
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_ps_lgcy_uom)) = 0) THEN
    _r.catalog_ps_lgcy_uom := 'MISSING';
  END IF;
  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog checking for PUOM=%',_r.catalog_ps_lgcy_uom;
  END IF;
  SELECT uom_id INTO _puomid FROM uom WHERE (uom_name=_r.catalog_ps_lgcy_uom);
  IF (NOT FOUND) THEN
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog inserting PUOM=%',_r.catalog_ps_lgcy_uom;
    END IF;
    INSERT INTO uom (uom_name, uom_descrip) VALUES (_r.catalog_ps_lgcy_uom, _r.catalog_ps_lgcy_uom)
    RETURNING uom_id INTO _puomid;
  END IF;

  -- Find ClassCode and create if not found
  _r.catalog_comm_code := COALESCE(_r.catalog_comm_code, '999999');
  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog checking for classcode=%',_r.catalog_comm_code;
  END IF;
  SELECT classcode_id INTO _classcodeid FROM classcode WHERE (classcode_code=_r.catalog_comm_code);
  IF (NOT FOUND) THEN
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog inserting classcode=%',_r.catalog_comm_code;
    END IF;
    INSERT INTO classcode (classcode_code, classcode_descrip) VALUES (_r.catalog_comm_code, _r.catalog_comm_code)
    RETURNING classcode_id INTO _classcodeid;
  END IF;

  -- Find ProdCat and create if not found
  _r.catalog_product_category := COALESCE(_r.catalog_product_category, 'MISSING');
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_product_category)) = 0) THEN
    _r.catalog_product_category := 'MISSING';
  END IF;
  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog checking for prodcat=%',_r.catalog_product_category;
  END IF;
  SELECT prodcat_id INTO _prodcatid FROM prodcat WHERE (prodcat_code=_r.catalog_product_category);
  IF (NOT FOUND) THEN
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog inserting prodcat=%',_r.catalog_product_category;
    END IF;
    INSERT INTO prodcat (prodcat_code, prodcat_descrip) VALUES (_r.catalog_product_category, _r.catalog_product_category)
    RETURNING prodcat_id INTO _prodcatid;
  END IF;

  -- Find FreightClass and create if not found
  _r.catalog_pkg_freight_class := COALESCE(_r.catalog_pkg_freight_class, 'MISSING');
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_pkg_freight_class)) = 0) THEN
    _r.catalog_pkg_freight_class := 'MISSING';
  END IF;
  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog checking for freightclass=%',_r.catalog_pkg_freight_class;
  END IF;
  SELECT freightclass_id INTO _freightclassid FROM freightclass WHERE (freightclass_code=_r.catalog_pkg_freight_class);
  IF (NOT FOUND) THEN
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog inserting freightclass=%',_r.catalog_pkg_freight_class;
    END IF;
    INSERT INTO freightclass (freightclass_code, freightclass_descrip) VALUES (_r.catalog_pkg_freight_class, _r.catalog_pkg_freight_class)
    RETURNING freightclass_id INTO _freightclassid;
  END IF;

  -- Find Vendor and create if not found
  _r.catalog_mfr_ucc_num := COALESCE(_r.catalog_mfr_ucc_num, 'MISSING');
  IF (LENGTH(TRIM(TRAILING ' ' FROM _r.catalog_mfr_ucc_num)) = 0) THEN
    _r.catalog_mfr_ucc_num := 'MISSING';
  END IF;
  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog checking for vendor=%',_r.catalog_mfr_ucc_num;
  END IF;
  SELECT COALESCE(catvendor_parent_id, vend_id) AS vend_id INTO _vendid
  FROM vendinfo LEFT OUTER JOIN xwd.catvendor ON (catvendor_vend_id=vend_id)
  WHERE (vend_number=_r.catalog_mfr_ucc_num);
  IF (NOT FOUND) THEN
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog inserting vendor=%', _r.catalog_mfr_ucc_num;
    END IF;
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
    IF (pDebug) THEN
      RAISE NOTICE '_selectedcost using %',  CASE _catvendorcost WHEN (-1) THEN 'selected_cost'
                                                  WHEN (0) THEN 'selected_cost'
                                                  WHEN (1) THEN 'custom_price1'
                                                  WHEN (2) THEN 'col3'
                                                  WHEN (3) THEN 'list'
                                                  WHEN (4) THEN 'dist'
                                                  ELSE 'unknown'
                                             END;
    END IF;
  END IF;
  IF (pDebug) THEN
    RAISE NOTICE '_selectedcost set to %', _selectedcost;
  END IF;

  -- Update Item
  UPDATE item
    SET
--        item_descrip1=COALESCE(_r.catalog_product_name, 'MISSING'),
--        item_descrip2=COALESCE(_r.catalog_mfr_description, 'MISSING'),
--        item_inv_uom_id=_uomid,
        item_classcode_id=_classcodeid,
        item_prodweight=COALESCE(_r.catalog_indv_weight, 0.0),
        item_packweight=COALESCE(_r.catalog_pkg_weight, 0.0),
        item_prodcat_id=_prodcatid,
        item_price_uom_id=_puomid,
        item_listprice=CASE WHEN _r.catalog_col3 > 0.0 THEN _r.catalog_col3 ELSE item_listprice END,
        item_listcost =CASE WHEN _selectedcost > 0.0 THEN _selectedcost ELSE item_listcost END,
        item_upccode=COALESCE(_r.catalog_upc, 'MISSING'),
        item_extdescrip=COALESCE(_r.catalog_2k_desc, 'MISSING'),
        item_freightclass_id=_freightclassid
  WHERE (item_id=_itemid);

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

  -- Insert/Update Itemsite(s)
  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog checking for itemsites';
  END IF;
  FOR _warehous IN SELECT * 
                   FROM whsinfo
  LOOP
    IF ( (_c.catconfig_warehous_id = -1) OR (_c.catconfig_warehous_id = _warehous.warehous_id) ) THEN
      SELECT itemsite_id INTO _itemsiteid FROM itemsite WHERE (itemsite_item_id=_itemid) AND (itemsite_warehous_id=_warehous.warehous_id);
      IF (FOUND) THEN
        IF (pDebug) THEN
          RAISE NOTICE 'updateCatalog updating itemsite, itemsite=%', _itemsiteid;
        END IF;
        UPDATE itemsite
          SET itemsite_plancode_id=_c.catconfig_plancode_id,
              itemsite_costcat_id=_c.catconfig_costcat_id,
              itemsite_controlmethod=_c.catconfig_controlmethod,
              itemsite_createsopr=_c.catconfig_createsopr,
              itemsite_createsopo=_c.catconfig_createsopo
        WHERE (itemsite_id=_itemsiteid);
        IF (fetchMetricText('Application') = 'Standard') THEN
          UPDATE itemsite
            SET itemsite_dropship=_c.catconfig_dropship
          WHERE (itemsite_id=_itemsiteid);
        END IF;
      ELSE
        IF (pDebug) THEN
          RAISE NOTICE 'updateCatalog inserting itemsite, site=%', _warehous.warehous_id;
        END IF;
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
            itemsite_location_comments, itemsite_notes,
            itemsite_abcclass, itemsite_autoabcclass,
            itemsite_freeze, itemsite_datelastused, itemsite_ordergroup, itemsite_ordergroup_first,
            itemsite_mps_timefence,
            itemsite_disallowblankwip,
            itemsite_costmethod, itemsite_value, itemsite_cosdefault,
            itemsite_warrpurc, itemsite_autoreg, itemsite_lsseq_id)
        VALUES
          ( _itemid, _warehous.warehous_id, 0.0,
            FALSE, FALSE, 0.0,
            0.0, 0.0, 0.0, 0.0,
            0.0, 0,
            0, 10, _c.catconfig_plancode_id, _c.catconfig_costcat_id,
            TRUE, FALSE, FALSE, FALSE,
            _c.catconfig_createsopr, _c.catconfig_createsopo,
            TRUE, 1,
            FALSE, 'M', NULL,
            _c.catconfig_controlmethod, FALSE, TRUE,
            FALSE, -1, NULL,
            '', '',
            'A', TRUE,
            FALSE, startOfTime(), 1, FALSE,
            0,
            FALSE,
            _c.catconfig_costmethod, 0, NULL,
            FALSE, FALSE, NULL  )
        RETURNING itemsite_id INTO _itemsiteid;
        IF (fetchMetricText('Application') = 'Standard') THEN
          UPDATE itemsite SET itemsite_dropship=_c.catconfig_dropship WHERE itemsite_id=_itemsiteid;
        END IF;
      END IF;
    END IF;
  END LOOP;

  -- Insert/Update Itemsrc
  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog checking for itemsrc';
  END IF;
  SELECT itemsrc_id INTO _itemsrcid FROM itemsrc WHERE (itemsrc_item_id=_itemid)
                                                   AND (itemsrc_vend_id=_vendid)
                                                   AND (itemsrc_vend_item_number=_r.catalog_mfr_cat_num)
                                                   AND (itemsrc_manuf_name=_r.catalog_mfr_fullname)
                                                   AND (itemsrc_manuf_item_number=_r.catalog_mfr_cat_num)
                                                   AND (itemsrc_contrct_id IS NULL);

  IF (FOUND) THEN
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog updating itemsrc, itemsrc_id=%',_itemsrcid;
    END IF;
    UPDATE itemsrc
      SET itemsrc_vend_item_number=_r.catalog_mfr_cat_num,
          itemsrc_vend_item_descrip=_r.catalog_mfr_description,
          itemsrc_vend_uom=COALESCE(_r.catalog_ps_uom, 'EA'),
          itemsrc_invvendoruomratio=1.0,
          itemsrc_minordqty=CASE _r.catalog_ps_lgcy_uom WHEN ('C') THEN 100.0 WHEN ('M') THEN 1000.0 ELSE 1.0 END,
          itemsrc_upccode=COALESCE(_r.catalog_upc, 'MISSING'),
          itemsrc_manuf_name=_r.catalog_mfr_fullname,
          itemsrc_manuf_item_number=_r.catalog_mfr_cat_num,
          itemsrc_manuf_item_descrip=_r.catalog_mfr_description
    WHERE (itemsrc_id=_itemsrcid);
  ELSE
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog inserting itemsrc, vendor=%', _vendid;
    END IF;
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
  END IF;

  -- Insert Itemsrc Prices
  IF (pDebug) THEN
    RAISE NOTICE 'updateCatalog checking for itemsrcp';
  END IF;
  SELECT itemsrcp_id INTO _itemsrcpid FROM itemsrcp WHERE (itemsrcp_itemsrc_id=_itemsrcid);
  IF (FOUND) THEN
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog updating itemsrcp, _itemsrcp_id=%', _itemsrcpid;
    END IF;
    UPDATE itemsrcp
      SET itemsrcp_price=CASE WHEN (_selectedcost > 0.0 AND _r.catalog_ps_lgcy_uom = 'C') THEN (_selectedcost / 100.0)
                              WHEN (_selectedcost > 0.0 AND _r.catalog_ps_lgcy_uom = 'M') THEN (_selectedcost / 1000.0)
                              WHEN (_selectedcost > 0.0) THEN _selectedcost
                              ELSE itemsrcp_price END
    WHERE (itemsrcp_id=_itemsrcpid);
  ELSE
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog inserting itemsrcp';
    END IF;
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
  END IF;

  END LOOP;


  -- Second loop thru to update Item Sources associated with a different item
  IF (pDiffItem) THEN
    RAISE NOTICE 'updateCatalog starting second itemsrc only loop';
    FOR _r IN 
      SELECT *, COALESCE(catalog_i2_cat_num, catalog_mfr_cat_num) AS selected_cat_num,
             CASE WHEN (COALESCE(catalog_custom_price1, 0.0) > 0.0) THEN catalog_custom_price1
                  WHEN (COALESCE(catalog_cost, 0.0) > 0.0) THEN catalog_cost
                  ELSE COALESCE(catalog_col3, 0.0)
             END AS selected_cost
      FROM xwd.catalog WHERE (catalog_provider=pProvider)
    LOOP

--    RAISE NOTICE 'updateCatalog 2nd loop processing catalog %',(COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.selected_cat_num);

    -- Check to see if Catalog has been converted and Item exists
    SELECT item_id INTO _itemid FROM item WHERE (item_number = (COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.selected_cat_num));
    IF (FOUND) THEN
--      IF (pDebug) THEN
--        RAISE NOTICE 'updateCatalog 2nd loop item_number found, skipping';
--      END IF;
      CONTINUE;
    END IF;
    SELECT item_id INTO _itemid FROM item WHERE (item_number = (COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.catalog_mfr_cat_num));
    IF (FOUND) THEN
--      IF (pDebug) THEN
--        RAISE NOTICE 'updateCatalog 2nd loop item_number found, skipping';
--      END IF;
      CONTINUE;
    END IF;
    SELECT item_id INTO _itemid FROM item WHERE (item_upccode = _r.catalog_upc) LIMIT 1;
    IF (FOUND) THEN
--      IF (pDebug) THEN
--        RAISE NOTICE 'updateCatalog 2nd loop item_upccode found, skipping';
--      END IF;
      CONTINUE;
    END IF;

    -- Update Itemsrc
--    IF (pDebug) THEN
--      RAISE NOTICE 'updateCatalog 2nd loop checking for itemsrc';
--    END IF;
    SELECT itemsrc_id INTO _itemsrcid FROM itemsrc WHERE (itemsrc_vend_item_number=_r.catalog_mfr_cat_num)
                                                     AND (itemsrc_manuf_name=_r.catalog_mfr_fullname)
                                                     AND (itemsrc_manuf_item_number=_r.catalog_mfr_cat_num)
                                                     AND (itemsrc_upccode=COALESCE(_r.catalog_upc, 'MISSING'))
                                                     AND (itemsrc_contrct_id IS NULL);

    IF (NOT FOUND) THEN
--      IF (pDebug) THEN
--        RAISE NOTICE 'updateCatalog 2nd loop itemsrc not found';
--      END IF;
      CONTINUE;
    END IF;

    SELECT catvendor_costcolumn INTO _catvendorcost
    FROM itemsrc JOIN xwd.catvendor ON (catvendor_vend_id=itemsrc_vend_id)
    WHERE (itemsrc_id=_itemsrcid);
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

    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog 2nd loop updating catalog %',(COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.selected_cat_num);
      RAISE NOTICE 'updateCatalog 2nd loop _selectedcost set to %', _selectedcost;
      RAISE NOTICE 'updateCatalog 2nd loop updating itemsrc_id=%', _itemsrcid;
    END IF;
    UPDATE itemsrc
      SET itemsrc_vend_item_number=_r.catalog_mfr_cat_num,
          itemsrc_vend_item_descrip=_r.catalog_mfr_description,
          itemsrc_vend_uom=COALESCE(_r.catalog_ps_uom, 'EA'),
          itemsrc_invvendoruomratio=1.0,
          itemsrc_minordqty=CASE _r.catalog_ps_lgcy_uom WHEN ('C') THEN 100.0 WHEN ('M') THEN 1000.0 ELSE 1.0 END,
          itemsrc_upccode=COALESCE(_r.catalog_upc, 'MISSING'),
          itemsrc_manuf_name=_r.catalog_mfr_fullname,
          itemsrc_manuf_item_number=_r.catalog_mfr_cat_num,
          itemsrc_manuf_item_descrip=_r.catalog_mfr_description
    WHERE (itemsrc_id=_itemsrcid);

    -- Update Itemsrc Prices
    IF (pDebug) THEN
      RAISE NOTICE 'updateCatalog 2nd loop checking for itemsrcp';
    END IF;
    SELECT itemsrcp_id INTO _itemsrcpid FROM itemsrcp WHERE (itemsrcp_itemsrc_id=_itemsrcid);
    IF (FOUND) THEN
      IF (pDebug) THEN
        RAISE NOTICE 'updateCatalog 2nd loop updating itemsrcp_id=%', _itemsrcpid;
      END IF;
      UPDATE itemsrcp
        SET itemsrcp_price=CASE WHEN (_selectedcost > 0.0 AND _r.catalog_ps_lgcy_uom = 'C') THEN (_selectedcost / 100.0)
                                WHEN (_selectedcost > 0.0 AND _r.catalog_ps_lgcy_uom = 'M') THEN (_selectedcost / 1000.0)
                                WHEN (_selectedcost > 0.0) THEN _selectedcost
                                ELSE itemsrcp_price END
      WHERE (itemsrcp_id=_itemsrcpid);
    END IF;

    END LOOP;
  END IF;

  RAISE NOTICE 'updateCatalog completed';
  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

