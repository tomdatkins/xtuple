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
  SELECT
    invhist_transtype,
    itemlocdist_transtype,
    invhist_ordnumber,
    itemlocdist_ls_id,
    itemlocdist_qty,
    itemlocdist_id,
    CASE
      WHEN (cohead_id IS NULL AND tohead_id IS NULL AND rahead_id IS NULL) AND itemlocdist_order_type = 'WO'
        THEN formatWoNumber(womatl_wo_id)
      WHEN cohead_id IS NOT NULL AND itemlocdist_order_type = 'SO'
        THEN formatSoNumber(coitem_id)
      WHEN tohead_id IS NOT NULL AND itemlocdist_order_type = 'TO'
        THEN formatToNumber(toitem_id)
      WHEN rahead_id IS NOT NULL AND itemlocdist_order_type = 'RA'
        THEN rahead_number || '-' || raitem_linenumber
      ELSE ''
    END AS ordnumber
    INTO _r
    FROM itemlocdist
    LEFT JOIN coitem ON itemlocdist_order_id = coitem_id AND itemlocdist_order_type = 'SO'
    LEFT JOIN toitem ON itemlocdist_order_id = toitem_id AND itemlocdist_order_type = 'TO'
    LEFT JOIN raitem ON itemlocdist_order_id = raitem_id AND itemlocdist_order_type = 'RA'
    LEFT JOIN cohead ON coitem_cohead_id = cohead_id AND itemlocdist_order_type = 'SO'
    LEFT JOIN tohead ON toitem_tohead_id = tohead_id AND itemlocdist_order_type = 'TO'
    LEFT JOIN rahead ON raitem_rahead_id = rahead_id AND itemlocdist_order_type = 'RA'
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
