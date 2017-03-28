CREATE OR REPLACE FUNCTION deleteItemlocdist(INTEGER) RETURNS INTEGER AS $$

-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemlocdistId        ALIAS FOR $1;
  _r      RECORD;
  _lsdetail             RECORD;
  _statusCache          CHAR;

BEGIN
  --Cache itemlocdist
  SELECT *, CASE WHEN orderhead_id IS NULL AND itemlocdist_order_type = 'WO' THEN formatWoNumber(womatl_wo_id)
                 WHEN orderhead_id IS NOT NULL AND orderhead_type = 'SO' THEN formatSoNumber(orderitem_id)
                 WHEN orderhead_id IS NOT NULL AND orderhead_type = 'TO' THEN formatToNumber(orderitem_id)
                 WHEN orderhead_id IS NOT NULL AND orderhead_type = 'RA' THEN orderhead_number || '-' || orderitem_linenumber
                 ELSE '' END AS ordnumber
  INTO _r
  FROM itemlocdist
  LEFT JOIN orderitem ON itemlocdist_order_id = orderitem_id AND itemlocdist_order_type = orderitem_orderhead_type
  LEFT JOIN orderhead ON orderitem_orderhead_id = orderhead_id AND orderhead_type = itemlocdist_order_type
  LEFT JOIN womatl ON itemlocdist_order_id = womatl_id AND itemlocdist_order_type = 'WO'
  LEFT OUTER JOIN invhist ON (invhist_id=itemlocdist_invhist_id)
  WHERE (itemlocdist_id=pItemlocdistId);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Itemlocdist not found';
  END IF;

  --Delete or update lot serial detail
  SELECT lsdetail_id, lsdetail_source_type, lsdetail_source_id, lsdetail_ls_id INTO _lsdetail
  FROM lsdetail
  WHERE ((lsdetail_source_type=COALESCE(_r.invhist_transtype, _r.itemlocdist_transtype))
    AND  (lsdetail_source_number=COALESCE(_r.invhist_ordnumber, _r.ordnumber))
    AND  (lsdetail_ls_id=_r.itemlocdist_ls_id));

  IF (FOUND) THEN
    IF (_lsdetail.lsdetail_source_type='RR') THEN
      SELECT raitem_status INTO _statusCache
      FROM raitem
      WHERE (raitem_id=_lsdetail.lsdetail_source_id);

      IF (_statusCache = 'C') THEN
        UPDATE raitem SET raitem_status = 'O' 
        WHERE (raitem_id=_lsdetail.lsdetail_source_id);
      END IF;
      
      UPDATE raitemls
        SET raitemls_qtyreceived=raitemls_qtyreceived - (_r.itemlocdist_qty / raitem_qty_invuomratio)
      FROM raitem
      WHERE ((raitemls_raitem_id=_lsdetail.lsdetail_source_id)
      AND (raitemls_ls_id=_lsdetail.lsdetail_ls_id)
      AND (raitemls_raitem_id=raitem_id));

      IF (_statusCache = 'C') THEN
        UPDATE raitem SET raitem_status = 'C' 
        WHERE (raitem_id=_lsdetail.lsdetail_source_id);
      END IF;
    END IF;

    UPDATE lsdetail SET
      lsdetail_qtytoassign=lsdetail_qtytoassign + _r.itemlocdist_qty
    WHERE (lsdetail_id=_lsdetail.lsdetail_id);
  ELSE
    DELETE FROM lsdetail
    WHERE ((lsdetail_source_type='I')
      AND  (lsdetail_source_id=_r.itemlocdist_id));
  END IF;

  --Delete the itemlocdist
  DELETE FROM itemlocdist
  WHERE (itemlocdist_id=pItemlocdistId);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
COMMENT ON FUNCTION deleteItemlocdist (INTEGER) IS 'Reverse createLotSerial and delete itemlocdist record';
