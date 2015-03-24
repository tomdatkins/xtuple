CREATE OR REPLACE FUNCTION xwd.convertCatalogItemsrc(pCatalogid INTEGER, pItemid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;
  _c RECORD;
  _result INTEGER;
  _itemsrcid INTEGER := -1;
  _uomid INTEGER := NULL;
  _vendid INTEGER := NULL;
  _catvendorcost INTEGER := -1;
  _selectedcost NUMERIC := 0.0;

BEGIN

  SELECT *,  COALESCE(catalog_i2_cat_num, catalog_mfr_cat_num) AS selected_cat_num,
           CASE WHEN (COALESCE(catcost_po_cost, 0.0) > 0.0) THEN catcost_po_cost
                WHEN (COALESCE(catalog_custom_price1, 0.0) > 0.0) THEN catalog_custom_price1
                WHEN (COALESCE(catalog_cost, 0.0) > 0.0) THEN catalog_cost
                ELSE COALESCE(catalog_col3, 0.0)
           END AS selected_cost,
           CASE WHEN ((COALESCE(catcost_po_cost, 0.0) > 0.0) AND
                      (COALESCE(catcost_po_uom, '') != '')) THEN catcost_po_uom
                ELSE COALESCE(catalog_ps_lgcy_uom, catalog_ps_uom, 'MISSING')
           END AS selected_priceuom
  INTO _r
  FROM xwd.catalog
         LEFT OUTER JOIN xwd.catcost ON (catalog_upc=catcost_upc)
  WHERE (catalog_id=pCatalogid);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  SELECT * INTO _c FROM xwd.catconfig WHERE (catconfig_provider=_r.catalog_provider);
  IF (NOT FOUND) THEN
    RETURN -2;
  END IF;

  -- Make sure Item exists
  SELECT item_id INTO _result FROM item WHERE (item_id=pItemid);
  IF (NOT FOUND) THEN
    RETURN -4;
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

  -- Make sure Itemsrc does not exist
  SELECT itemsrc_id INTO _result FROM itemsrc WHERE (itemsrc_item_id=pItemid)
                                                AND (itemsrc_vend_id=_vendid)
                                                AND (itemsrc_vend_item_number=_r.catalog_mfr_cat_num)
                                                AND (itemsrc_manuf_name=_r.catalog_mfr_fullname)
                                                AND (itemsrc_manuf_item_number=_r.catalog_mfr_cat_num)
                                                AND (itemsrc_contrct_id IS NULL);

  IF (FOUND) THEN
    RETURN -5;
  END IF;

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
    ( pItemid, TRUE, TRUE, _vendid,
      _r.catalog_mfr_cat_num, _r.catalog_mfr_description,
      COALESCE(_r.catalog_ps_uom, 'EA'), 1.0,
      CASE _r.selected_priceuom WHEN ('C') THEN 100.0 WHEN ('M') THEN 1000.0 ELSE 1.0 END,
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
      CASE WHEN (_selectedcost > 0.0 AND _r.selected_priceuom = 'C') THEN (_selectedcost / 100.0)
           WHEN (_selectedcost > 0.0 AND _r.selected_priceuom = 'M') THEN (_selectedcost / 1000.0)
           WHEN (_selectedcost > 0.0) THEN _selectedcost
           ELSE 0.0 END,
      0.0, 0.0 );

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

