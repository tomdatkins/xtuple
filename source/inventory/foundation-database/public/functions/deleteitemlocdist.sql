CREATE OR REPLACE FUNCTION deleteItemlocdist(INTEGER) RETURNS INTEGER AS $$

-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemlocdistId      	ALIAS FOR $1;
  _r			RECORD;
  _lsdetailid           INTEGER;

BEGIN
  --Cache itemlocdist
  SELECT * INTO _r
  FROM itemlocdist LEFT OUTER JOIN invhist ON (invhist_id=itemlocdist_invhist_id)
  WHERE (itemlocdist_id=pItemlocdistId);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Itemlocdist not found';
  END IF;

  --Delete or update lot serial detail
  SELECT lsdetail_id INTO _lsdetailid
  FROM lsdetail
  WHERE ((lsdetail_source_type=_r.invhist_transtype)
    AND  (lsdetail_source_number=_r.invhist_ordnumber)
    AND  (lsdetail_ls_id=_r.itemlocdist_ls_id));

  IF (FOUND) THEN
    UPDATE lsdetail SET
      lsdetail_qtytoassign=lsdetail_qtytoassign + _r.itemlocdist_qty
    WHERE (lsdetail_id=_lsdetailid);
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
  
       
