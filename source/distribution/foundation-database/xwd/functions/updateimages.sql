CREATE OR REPLACE FUNCTION xwd.updateImages(pProvider TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;
  _itemid INTEGER := -1;
  _weburlid INTEGER := -1;
  _pdfurlid INTEGER := -1;
  _webdocid INTEGER := -1;
  _pdfdocid INTEGER := -1;

BEGIN

  FOR _r IN 
    SELECT *, COALESCE(catalog_i2_cat_num, catalog_mfr_cat_num) AS selected_cat_num FROM xwd.catalog
    WHERE (catalog_provider=pProvider)
  LOOP

  -- Check to see if Catalog has been converted and Item exists
  SELECT item_id INTO _itemid FROM item WHERE (item_number = (COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.selected_cat_num));
  IF (NOT FOUND) THEN
    SELECT item_id INTO _itemid FROM item WHERE (item_number = (COALESCE(_r.catalog_mfr_shortname || '-', '') || _r.catalog_mfr_cat_num));
    IF (NOT FOUND) THEN
      SELECT item_id INTO _itemid FROM item WHERE (item_upccode = _r.catalog_upc) LIMIT 1;
      IF (NOT FOUND) THEN
        CONTINUE;
      END IF;
    END IF;
  END IF;

  -- Insert/Update URL Info
  IF (_r.catalog_web_url IS NOT NULL) THEN
    SELECT url_id INTO _weburlid
    FROM urlinfo
    WHERE url_id = ( SELECT docass_target_id
                     FROM docass JOIN urlinfo ON (url_id=docass_target_id)
                     WHERE (docass_source_id=_itemid)
                       AND (docass_source_type='I')
                       AND (docass_target_type='URL')
                       AND (url_title='Image') );
    IF (FOUND) THEN
      UPDATE urlinfo SET url_url=_r.catalog_web_url
      WHERE (url_id=_weburlid);
    ELSE
      INSERT INTO urlinfo
        ( url_title, url_url )
      VALUES
        ( 'Image', _r.catalog_web_url )
      RETURNING url_id INTO _weburlid;
    END IF;
  END IF;
  
  IF (_r.catalog_pdf_url IS NOT NULL) THEN
    SELECT url_id INTO _pdfurlid
    FROM urlinfo
    WHERE url_id = ( SELECT docass_target_id
                     FROM docass JOIN urlinfo ON (url_id=docass_target_id)
                     WHERE (docass_source_id=_itemid)
                       AND (docass_source_type='I')
                       AND (docass_target_type='URL')
                       AND (url_title='Spec Sheet') );
    IF (FOUND) THEN
      UPDATE urlinfo SET url_url=_r.catalog_pdf_url
      WHERE (url_id=_pdfurlid);
    ELSE
      INSERT INTO urlinfo
        ( url_title, url_url )
      VALUES
        ( 'Spec Sheet', _r.catalog_pdf_url )
      RETURNING url_id INTO _pdfurlid;
    END IF;
  END IF;
  
  -- Insert Document Assignment if necessary
  IF (_r.catalog_web_url IS NOT NULL) THEN
    SELECT docass_id INTO _webdocid
    FROM docass
    WHERE (docass_source_id=_itemid)
      AND (docass_source_type='I')
      AND (docass_target_type='URL')
      AND (docass_target_id=_weburlid);
    IF (NOT FOUND) THEN
      INSERT INTO docass
        ( docass_source_id, docass_source_type,
          docass_target_id, docass_target_type, docass_purpose )
      VALUES
        ( _itemid, 'I', _weburlid, 'URL', 'S' );
    END IF;
  END IF;

  IF (_r.catalog_pdf_url IS NOT NULL) THEN
    SELECT docass_id INTO _pdfdocid
    FROM docass
    WHERE (docass_source_id=_itemid)
      AND (docass_source_type='I')
      AND (docass_target_type='URL')
      AND (docass_target_id=_pdfurlid);
    IF (NOT FOUND) THEN
      INSERT INTO docass
        ( docass_source_id, docass_source_type,
          docass_target_id, docass_target_type, docass_purpose )
      VALUES
        ( _itemid, 'I', _pdfurlid, 'URL', 'S' );
    END IF;
  END IF;

  END LOOP;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

