
CREATE OR REPLACE FUNCTION xtmfg.copyPlannedSchedule(INTEGER, TEXT, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPschheadid ALIAS FOR $1;
  pNumber ALIAS FOR $2;
  pStartDate ALIAS FOR $3;
  _pschheadid NUMERIC;
  _offset INTEGER;
  _r RECORD;

BEGIN

  SELECT pschhead_descrip, pschhead_warehous_id,
         pschhead_start_date, pschhead_end_date, pschhead_type
    INTO _r
    FROM xtmfg.pschhead
   WHERE (pschhead_id=pPschheadid);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  _offset := pStartDate - _r.pschhead_start_date;

  SELECT nextval('xtmfg.pschhead_pschhead_id_seq') INTO _pschheadid;
  INSERT INTO xtmfg.pschhead
        (pschhead_id, pschhead_number, pschhead_descrip,
         pschhead_warehous_id, pschhead_start_date, pschhead_end_date, pschhead_type)
  VALUES(_pschheadid, pNumber, _r.pschhead_descrip,
         _r.pschhead_warehous_id, _r.pschhead_start_date + _offset,
         _r.pschhead_end_date + _offset, _r.pschhead_type);

  INSERT INTO xtmfg.pschitem
        (pschitem_pschhead_id, pschitem_linenumber,
         pschitem_itemsite_id, pschitem_scheddate,
         pschitem_qty, pschitem_status)
  SELECT _pschheadid, pschitem_linenumber,
         pschitem_itemsite_id, pschitem_scheddate + _offset,
         pschitem_qty, pschitem_status
    FROM xtmfg.pschitem
   WHERE (pschitem_pschhead_id=pPschheadid);

  RETURN _pschheadid;

END;
$$ LANGUAGE 'plpgsql';

