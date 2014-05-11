
CREATE OR REPLACE FUNCTION postTransformTrans(INTEGER, INTEGER, INTEGER, NUMERIC, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  RETURN postTransformTrans($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postTransformTrans(INTEGER, INTEGER, INTEGER, NUMERIC, TEXT, TEXT, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pSourceItemsiteid ALIAS FOR $1;
  pTargetItemsiteid ALIAS FOR $2;
  pItemlocid ALIAS FOR $3;
  pQty ALIAS FOR $4;
  pDocumentNumber ALIAS FOR $5;
  pComments ALIAS FOR $6;
  pGlDistTS     ALIAS FOR $7;
  _sourceItemid INTEGER;
  _targetItemid INTEGER;
  _cost NUMERIC;
  _postVariance BOOLEAN;
  _variance NUMERIC;
  _sourceInvhistid INTEGER;
  _targetInvhistid INTEGER;
  _sourceItemlocSeries INTEGER;
  _targetItemlocSeries INTEGER;
  _sourceLsnumber TEXT;
  _sourceLsid INTEGER;
  _targetLsid INTEGER;
  _check INTEGER;
  _itemlocid INTEGER;

BEGIN

--  Make sure the passed source itemsite defines a real item
  IF ( ( SELECT (item_type IN ('R', 'F', 'J'))
         FROM itemsite, item
         WHERE ( (itemsite_item_id=item_id)
          AND (itemsite_id=pSourceItemsiteid) ) ) ) THEN
    RETURN 0;
  END IF;

--  Make sure the passed target itemsite defines a real, active item
  IF ( ( SELECT ((item_type IN ('R')) OR (NOT itemsite_active))
         FROM itemsite, item
         WHERE ( (itemsite_item_id=item_id)
          AND (itemsite_id=pTargetItemsiteid) ) ) ) THEN
    RETURN 0;
  END IF;

  SELECT s.itemsite_item_id, t.itemsite_item_id,
         itemCost(s.itemsite_id),
         (s.itemsite_costmethod='A' AND t.itemsite_costmethod='S'),
         pQty * (avgcost(s.itemsite_id) - stdcost(t.itemsite_item_id))
    INTO _sourceItemid, _targetItemid, _cost, _postVariance, _variance
    FROM itemsite AS s, itemsite AS t
   WHERE((s.itemsite_id=pSourceItemsiteid)
     AND (t.itemsite_id=pTargetItemsiteid));

-- Find/Create ls for target item
  IF (COALESCE(pItemlocid, -1) > 0) THEN
    SELECT ls_id, ls_number INTO _sourceLsid, _sourceLsnumber
    FROM itemloc JOIN ls ON (ls_id=itemloc_ls_id)
    WHERE (itemloc_id=pItemlocid);
    IF (FOUND) THEN
      SELECT ls_id INTO _targetLsid
      FROM ls
      WHERE (ls_number=_sourceLsnumber) AND (ls_item_id=_targetItemid);
      IF (NOT FOUND) THEN
        INSERT INTO ls
          (ls_item_id, ls_number)
        VALUES
          (_targetItemid, _sourceLsnumber)
        RETURNING ls_id INTO _targetLsid;
        INSERT INTO charass
          (charass_target_type, charass_target_id,
           charass_char_id, charass_value,
           charass_default, charass_price)
        SELECT
           charass_target_type, _targetLsid,
           charass_char_id, charass_value,
           charass_default, charass_price
        FROM charass
        WHERE (charass_target_type='LS') AND (charass_target_id=_sourceLsid);
      END IF;
    END IF;
  END IF;

--  Issue the Source
  SELECT NEXTVAL('itemloc_series_seq') INTO _sourceItemlocSeries;
    RAISE NOTICE 'SOURCE = %', _sourceItemLocSeries;
  SELECT postInvTrans( itemsite_id, 'IT', pQty,
                       'I/M', 'IT', pDocumentNumber, '',
                       ('Transform Issue for item ' || item_number || E'\n' ||  pComments),
                       costcat_transform_accnt_id, costcat_asset_accnt_id,
                       _sourceItemlocSeries, pGlDistTS, NULL) INTO _sourceInvhistid
  FROM itemsite, item, costcat
  WHERE ( (itemsite_item_id=item_id)
   AND (itemsite_costcat_id=costcat_id)
   AND (itemsite_id=pSourceItemsiteid) );

--  Receive the Target
  SELECT NEXTVAL('itemloc_series_seq') INTO _targetItemlocSeries;
  SELECT postInvTrans( itemsite_id, 'RT', pQty,
                       'I/M', 'RT', pDocumentNumber, '',
                       ('Transform Receipt for item ' || item_number || E'\n' ||  pComments),
                       costcat_asset_accnt_id, costcat_transform_accnt_id,
                       _targetItemlocSeries, pGlDistTS, (pQty * _cost)) INTO _targetInvhistid
  FROM itemsite, item, costcat
  WHERE ( (itemsite_item_id=item_id)
   AND (itemsite_costcat_id=costcat_id)
   AND (itemsite_id=pTargetItemsiteid) );

  IF (_postVariance) THEN
    PERFORM insertGLTransaction('I/M', '', pDocumentNumber,
                               ('Transform Variance for item ' || item_number || E'\n' ||  pComments),
                               costcat_transform_accnt_id, costcat_asset_accnt_id, _targetInvhistid,
                               _variance, pGLDistTS::DATE)
      FROM itemsite, item, costcat
     WHERE( (itemsite_item_id=item_id)
       AND (itemsite_costcat_id=costcat_id)
       AND (itemsite_id=pTargetItemsiteid) );
  END IF;

--  Check to see if inventory detail should be transformed as well
  SELECT itemlocdist_series INTO _check
  FROM itemlocdist
  WHERE (itemlocdist_series=_targetItemlocSeries);
  IF (FOUND) THEN
--    RAISE NOTICE 'itemlocdist found';
    IF (pItemlocid <> -1) THEN
--      RAISE NOTICE 'pItemlocid = %', pItemlocid;
--  Check for an existing target itemloc
      SELECT t.itemloc_id INTO _itemlocid
      FROM itemloc AS s, itemloc AS t
      WHERE ( (s.itemloc_location_id=t.itemloc_location_id)
       AND (COALESCE(t.itemloc_ls_id,-1)=COALESCE(_targetLsid,-1))
       AND (COALESCE(s.itemloc_expiration,CURRENT_DATE)=COALESCE(t.itemloc_expiration,CURRENT_DATE))
       AND (COALESCE(s.itemloc_warrpurc,CURRENT_DATE)=COALESCE(t.itemloc_warrpurc,CURRENT_DATE))
       AND (t.itemloc_itemsite_id=pTargetItemsiteid)
       AND (s.itemloc_id=pItemlocid) );
      IF (NOT FOUND) THEN
--        RAISE NOTICE 'exisint target itemloc not found';
--  Could not find an existing target itemloc, create one 
        SELECT NEXTVAL('itemloc_itemloc_id_seq') INTO _itemlocid;
--        RAISE NOTICE 'New itemloc_id=%', _itemlocid;
        INSERT INTO itemloc
        ( itemloc_id, itemloc_itemsite_id, itemloc_location_id,
          itemloc_ls_id, itemloc_expiration, itemloc_qty,
          itemloc_consolflag, itemloc_warrpurc )
        SELECT _itemlocid, pTargetItemsiteid, itemloc_location_id,
               _targetLsid, itemloc_expiration, pQty,
               FALSE, itemloc_warrpurc
        FROM itemloc
        WHERE (itemloc_id=pItemlocid);
      ELSE

--        RAISE NOTICE 'Existing itemloc_id=%', _itemlocid;
--  Found an existing target itemloc, increment the qty
        UPDATE itemloc
        SET itemloc_qty=(itemloc_qty + pQty)
        WHERE (itemloc_id=_itemlocid);
      END IF;

      INSERT INTO invdetail
      ( invdetail_transtype, invdetail_invhist_id,
        invdetail_location_id, invdetail_ls_id,
        invdetail_qty, invdetail_comments,
        invdetail_qty_before, invdetail_qty_after,
        invdetail_expiration, invdetail_warrpurc )
      SELECT 'RT', _targetInvhistid,
             itemloc_location_id, itemloc_ls_id,
             pQty, pComments,
             (itemloc_qty - pQty), itemloc_qty,
             itemloc_expiration, itemloc_warrpurc
      FROM itemloc
      WHERE (itemloc_id=_itemlocid);

      UPDATE invhist
      SET invhist_hasdetail=TRUE
      WHERE (invhist_id=_targetInvhistid);

--  Delete any remaining target itemlocdist records
      DELETE FROM itemlocdist
      WHERE (itemlocdist_series=_targetItemlocSeries);
    END IF;
  END IF;

--  Decrement the source itemloc
  IF (pItemlocid <> -1) THEN
    INSERT INTO invdetail
    ( invdetail_transtype, invdetail_invhist_id,
      invdetail_location_id, invdetail_ls_id,
      invdetail_qty, invdetail_comments,
      invdetail_qty_before, invdetail_qty_after,
      invdetail_expiration, invdetail_warrpurc )
    SELECT 'IT', _sourceInvhistid,
           itemloc_location_id, itemloc_ls_id,
           pQty, pComments,
           itemloc_qty, (itemloc_qty - pQty),
           itemloc_expiration, itemloc_warrpurc
    FROM itemloc
    WHERE (itemloc_id=pItemlocid);

    UPDATE invhist
    SET invhist_hasdetail=TRUE
    WHERE (invhist_id=_sourceInvhistid);

    UPDATE itemloc
    SET itemloc_qty=(itemloc_qty - pQty)
    WHERE (itemloc_id=pItemlocid);

--  Delete any errant source itemloc records
    DELETE FROM itemloc
    WHERE ( (itemloc_id=pItemlocid)
      AND   (itemloc_qty=0) );

--  Delete any errant source itemlocdist records
    DELETE FROM itemlocdist
    WHERE (itemlocdist_series=_sourceItemlocSeries);
  END IF;

  PERFORM postItemlocseries(_sourceItemlocSeries);
  PERFORM postItemlocseries(_targetItemlocSeries);

  RETURN _targetItemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
