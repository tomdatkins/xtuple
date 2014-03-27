
CREATE OR REPLACE FUNCTION interWarehouseTransfer(INTEGER, INTEGER, INTEGER, NUMERIC, TEXT, TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  RETURN interWarehouseTransfer($1, $2, $3, $4, $5, $6, $7, 0, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION interWarehouseTransfer(INTEGER, INTEGER, INTEGER, NUMERIC, TEXT, TEXT, TEXT, INTEGER, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  RETURN interWarehouseTransfer($1, $2, $3, $4, $5, $6, $7, $8, CAST($9 AS TIMESTAMP WITH TIME ZONE));
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION interWarehouseTransfer(INTEGER, INTEGER, INTEGER, NUMERIC, TEXT, TEXT, TEXT, INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pFromWarehousid ALIAS FOR $2;
  pToWarehousid ALIAS FOR $3;
  pQty ALIAS FOR $4;
  pDocumentType ALIAS FOR $5;
  pDocumentNumber ALIAS FOR $6;
  pComments ALIAS FOR $7;
  _itemlocSeries	INTEGER	:= $8;
  _gldate		TIMESTAMP WITH TIME ZONE := $9;
  _invhistid		INTEGER;
  _itemlocdistid	INTEGER;
  _r RECORD;
  _debug BOOLEAN := false;
  _tmp INTEGER;

BEGIN
  IF (_debug) THEN
    raise notice 'interWarehouseTransfer starting...';
    raise notice 'pItemid = %', pItemid;
    raise notice 'pFromWarehousid = %', pFromWarehousid;
    raise notice 'pToWarehousid = %', pToWarehousid;
    raise notice 'pQty = %', pQty;
    raise notice 'pDocumentType = %', pDocumentType;
    raise notice 'pDocumentNumber = %', pDocumentNumber;
    raise notice 'pComments = %', pComments;
    raise notice '_itemlocSeries = %', _itemlocSeries;
    raise notice '_gldate = %', _gldate;
  END IF;

  IF ((_gldate IS NULL) OR (CAST(_gldate AS date)=CURRENT_DATE)) THEN
    _gldate := CURRENT_TIMESTAMP;
  END IF;

--  Make sure the passed item is real
  IF ( ( SELECT (item_type IN ('R', 'F', 'J'))
         FROM item
         WHERE (item_id=pItemid) ) ) THEN
    RETURN COALESCE(_itemlocSeries, 0);
  END IF;

 SELECT CASE WHEN(s.itemsite_costmethod='A') THEN avgcost(s.itemsite_id)
             ELSE stdcost(s.itemsite_item_id)
        END AS source_cost,
        s.itemsite_value AS source_value,
        CASE WHEN(t.itemsite_costmethod='A') THEN (CASE WHEN(s.itemsite_costmethod='A') THEN avgcost(s.itemsite_id)
                                                       ELSE stdcost(s.itemsite_item_id)
                                                  END)
             ELSE stdcost(t.itemsite_item_id)
        END AS target_cost,
        t.itemsite_value AS target_value,
        s.itemsite_costmethod AS source_costmethod,
        t.itemsite_costmethod AS target_costmethod,
        s.itemsite_qtyonhand AS source_qtyonhand,
        (s.itemsite_costmethod='A' AND t.itemsite_costmethod='S') AS post_variance,
        pQty * (avgcost(s.itemsite_id) - stdcost(t.itemsite_item_id)) AS variance
   INTO _r
   FROM itemsite AS s, itemsite AS t
  WHERE((s.itemsite_warehous_id=pFromWarehousid)
    AND (s.itemsite_item_id=pItemid)
    AND (t.itemsite_item_id=pItemid)
    AND (t.itemsite_warehous_id=pTowarehousid));

  IF(_r.source_costmethod='A' AND (_r.source_qtyonhand - pQty) < 0) THEN
    RETURN -2;
  END IF;

--  Distribute to G/L
  SELECT NEXTVAL('invhist_invhist_id_seq') INTO _invhistid;
  SELECT insertGLTransaction( fetchJournalNumber('GL-MISC'), 'I/M', pDocumentType, pDocumentNumber,
                               ('Inter-Warehouse Transfer for item ' || item_number || E'\n' || pComments),
                               sc.costcat_asset_accnt_id, tc.costcat_asset_accnt_id, _invhistid,
                               (_r.source_cost * pQty),
                               CAST(_gldate AS DATE), false ) INTO _tmp
  FROM itemsite AS ti, costcat AS tc,
       itemsite AS si, costcat AS sc,
       item
  WHERE ( (ti.itemsite_costcat_id=tc.costcat_id)
   AND (si.itemsite_costcat_id=sc.costcat_id)
   AND (ti.itemsite_item_id=pItemid)
   AND (si.itemsite_item_id=pItemid)
   AND (ti.itemsite_warehous_id=pToWarehousid)
   AND (si.itemsite_warehous_id=pFromWarehousid)
   AND (item_id=pItemid) );

  IF (_itemlocSeries = 0 OR _itemlocSeries IS NULL) THEN
    SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  END IF;
  INSERT INTO invhist
  ( invhist_id, invhist_itemsite_id, invhist_xfer_warehous_id,
    invhist_transtype, invhist_invqty,
    invhist_qoh_before, invhist_qoh_after,
    invhist_costmethod, invhist_value_before, invhist_value_after,
    invhist_ordnumber, invhist_ordtype,
    invhist_docnumber, invhist_comments,
    invhist_invuom, invhist_unitcost, invhist_transdate, invhist_series,
    invhist_posted) 
  SELECT _invhistid, itemsite_id, pToWarehousid, 'TW',
         (pQty * -1), itemsite_qtyonhand, (itemsite_qtyonhand + pQty * -1),
         _r.source_costmethod, _r.source_value, _r.source_value - (_r.source_cost * pQty),
         pDocumentNumber, pDocumentType,
         pDocumentNumber, pComments,
         uom_name, _r.source_cost, _gldate, _itemlocSeries,
         false
  FROM item, itemsite, uom
  WHERE ((itemsite_item_id=item_id) 
   AND (item_id=pItemid)
   AND (item_inv_uom_id=uom_id)
   AND (itemsite_controlmethod <> 'N')
   AND (itemsite_warehous_id=pFromWarehousid));

  -- Posting of trial balance and invhist is deferred to prevent locking
  INSERT INTO itemlocpost ( itemlocpost_glseq, itemlocpost_itemlocseries)
  VALUES ( _tmp, _itemlocSeries );

--  Create an open itemloc record if this is a controlled item
  IF ( ( SELECT (((itemsite_loccntrl) OR (itemsite_controlmethod IN ('L', 'S'))) AND warehous_transit=FALSE)
         FROM itemsite, whsinfo
         WHERE ((itemsite_item_id=pItemid)
          AND (itemsite_warehous_id=warehous_id)
          AND (itemsite_warehous_id=pFromWarehousid)) ) ) THEN

    SELECT NEXTVAL('itemlocdist_itemlocdist_id_seq') INTO _itemlocdistid;
    INSERT INTO itemlocdist
    ( itemlocdist_id, itemlocdist_itemsite_id, itemlocdist_source_type,
      itemlocdist_reqlotserial, itemlocdist_distlotserial,
      itemlocdist_expiration,
      itemlocdist_qty, itemlocdist_series, itemlocdist_invhist_id )
    SELECT _itemlocdistid, itemsite_id, 'O',
           false,
           (itemsite_controlmethod IN ('L', 'S')),
           endOfTime(),
           (pQty * -1), _itemlocSeries, _invhistid
    FROM itemsite
    WHERE ((itemsite_item_id=pItemid)
     AND (itemsite_warehous_id=pFromWarehousid));

  END IF;

  SELECT NEXTVAL('invhist_invhist_id_seq') INTO _invhistid;
  INSERT INTO invhist
  ( invhist_id, invhist_itemsite_id, invhist_xfer_warehous_id,
    invhist_transtype, invhist_invqty,
    invhist_qoh_before, invhist_qoh_after,
    invhist_costmethod, invhist_value_before, invhist_value_after,
    invhist_ordnumber, invhist_ordtype,
    invhist_docnumber, invhist_comments,
    invhist_invuom, invhist_unitcost, invhist_transdate, invhist_series,
    invhist_posted) 
  SELECT _invhistid, itemsite_id, pFromWarehousid, 
         CASE WHEN (pDocumentType='TO') THEN 'TR'
              ELSE 'TW'
         END,
         pQty, itemsite_qtyonhand, (itemsite_qtyonhand + pQty),
         _r.target_costmethod, _r.target_value, _r.target_value + (_r.target_cost * pQty),
         pDocumentNumber, pDocumentType,
         pDocumentNumber, pComments,
         uom_name, _r.target_cost, _gldate, _itemlocSeries,
         false
  FROM item, itemsite, uom
  WHERE ((itemsite_item_id=item_id) 
   AND (item_id=pItemid)
   AND (item_inv_uom_id=uom_id)
   AND (itemsite_controlmethod <> 'N')
   AND (itemsite_warehous_id=pToWarehousid));

--  Create an open itemloc record if this is a controlled item
  IF ( ( SELECT ((itemsite_loccntrl) OR (itemsite_controlmethod IN ('L', 'S')))
         FROM itemsite
         WHERE ((itemsite_item_id=pItemid)
          AND (itemsite_warehous_id=pToWarehousid)) ) ) THEN

    INSERT INTO itemlocdist
    ( itemlocdist_itemsite_id, itemlocdist_source_type, itemlocdist_source_id,
      itemlocdist_reqlotserial,
      itemlocdist_distlotserial,
      itemlocdist_expiration,
      itemlocdist_qty, itemlocdist_series, itemlocdist_invhist_id )
    SELECT itemsite_id, 'O', _itemlocdistid,
           (itemsite_controlmethod IN ('L', 'S')),
           false,
           endOfTime(),
           pQty, _itemlocSeries, _invhistid
    FROM itemsite
    WHERE ((itemsite_item_id=pItemid)
     AND (itemsite_warehous_id=pToWarehousid));

  END IF;

  IF (_r.post_variance) THEN
    SELECT insertGLTransaction( fetchJournalNumber('GL-MISC'), 'I/M', pDocumentType, pDocumentNumber,
                                 ('Inter-Warehouse Transfer Variance for item ' || item_number),
                                 tc.costcat_asset_accnt_id, tc.costcat_invcost_accnt_id, _invhistid,
                                 _r.variance,
                                 CAST(_gldate AS DATE), false ) INTO _tmp
    FROM itemsite AS ti, costcat AS tc, item
    WHERE ( (ti.itemsite_costcat_id=tc.costcat_id)
     AND (ti.itemsite_item_id=pItemid)
     AND (ti.itemsite_warehous_id=pToWarehousid)
     AND (item_id=pItemid) );
  END IF;

  INSERT INTO itemlocpost ( itemlocpost_glseq, itemlocpost_itemlocseries)
  VALUES ( _tmp, _itemlocSeries );

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
