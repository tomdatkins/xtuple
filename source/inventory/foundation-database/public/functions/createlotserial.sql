CREATE OR REPLACE FUNCTION createlotserial(INTEGER,TEXT,INTEGER,TEXT,INTEGER,INTEGER,NUMERIC,DATE,DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteId		ALIAS FOR $1;
  pLotSerial 		ALIAS FOR $2;
  pItemlocseries	ALIAS FOR $3;
  pSourceType 		ALIAS FOR $4;
  pSourceId    		ALIAS FOR $5;
  pItemlocdistid      	ALIAS FOR $6;
  pQty			ALIAS FOR $7;
  pExpiration		ALIAS FOR $8;
  pWarranty		ALIAS FOR $9;
  _p			RECORD;
  _lsid			INTEGER;
  _itemlocdistid	INTEGER;
  _lsdetailid		INTEGER;
  _statusCache		CHAR;

BEGIN
  --See if number exists
  SELECT ls_id INTO _lsid
  FROM ls,itemsite
  WHERE ((itemsite_id=pItemsiteId)
  AND (ls_item_id=itemsite_item_id)
  AND (ls_number=UPPER(pLotSerial)));

  --If not create it
  IF (NOT FOUND) THEN
    _lsid := NEXTVAL('ls_ls_id_seq');
    INSERT INTO ls (ls_id,ls_item_id,ls_number)
    SELECT _lsid,itemsite_item_id,UPPER(pLotSerial)
    FROM itemsite
    WHERE (itemsite_id=pItemsiteId);
  END IF;

  --Create distribution staging record
  _itemlocdistid := NEXTVAL('itemlocdist_itemlocdist_id_seq');
  INSERT INTO itemlocdist 
            ( itemlocdist_id, itemlocdist_source_type, itemlocdist_source_id,
              itemlocdist_itemsite_id, itemlocdist_ls_id, itemlocdist_expiration,
              itemlocdist_qty, itemlocdist_series, itemlocdist_invhist_id, itemlocdist_warranty ) 
       SELECT _itemlocdistid, 'D', itemlocdist_id,
              itemlocdist_itemsite_id, _lsid, pExpiration,
              pQty, pItemlocseries, itemlocdist_invhist_id, pWarranty 
              FROM itemlocdist 
              WHERE (itemlocdist_id=pItemlocdistid);

  --Create or update lot serial detail
  SELECT lsdetail_id INTO _lsdetailid
  FROM lsdetail
  WHERE ((lsdetail_source_type=pSourceType)
  AND (lsdetail_source_id=pSourceId)
  AND (lsdetail_ls_id=_lsid));

  IF (FOUND) THEN
    IF (pSourceType='RR') THEN
      -- Update Return Auth pre-assign record
      SELECT raitem_status INTO _statusCache
      FROM raitem
      WHERE (raitem_id=pSourceId);

      IF (_statusCache = 'C') THEN
        UPDATE raitem SET raitem_status = 'O' 
        WHERE (raitem_id=pSourceId);
      END IF;
      
      UPDATE raitemls
        SET raitemls_qtyreceived=raitemls_qtyreceived + (pQty / raitem_qty_invuomratio)
      FROM raitem
      WHERE ((raitemls_raitem_id=pSourceId)
      AND (raitemls_ls_id=_lsid)
      AND (raitemls_raitem_id=raitem_id));

      IF (_statusCache = 'C') THEN
        UPDATE raitem SET raitem_status = 'C' 
        WHERE (raitem_id=pSourceId);
      END IF;
    END IF;
     
    UPDATE lsdetail SET
      lsdetail_qtytoassign=lsdetail_qtytoassign-pQty
    WHERE (lsdetail_id=_lsdetailid);
  ELSE
    INSERT INTO lsdetail 
           ( lsdetail_itemsite_id, lsdetail_ls_id, lsdetail_created,
             lsdetail_source_type, lsdetail_source_id, lsdetail_source_number ) 
      SELECT itemlocdist_itemsite_id, _lsid, CURRENT_TIMESTAMP,
             'I', itemlocdist_id, '' 
      FROM itemlocdist 
      WHERE (itemlocdist_id=_itemlocdistid);
  END IF;

  RETURN _itemlocdistid;

END;
$$ LANGUAGE 'plpgsql';
  
       
