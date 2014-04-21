
CREATE OR REPLACE FUNCTION xtmfg.wooperqtyavail(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoOper ALIAS FOR $1;
  _p RECORD;
  _qtyAvail NUMERIC;

BEGIN

  SELECT wo_qtyord, wooper_wo_id, wooper_seqnumber INTO _p
    FROM wo, xtmfg.wooper
  WHERE ((wo_id=wooper_wo_id)
   AND (wooper_id=pWoOper));

  IF _p IS NULL THEN
   RETURN -9999;
  END IF;

  SELECT COALESCE(wooper_qtyrcv,0) INTO _qtyAvail
    FROM xtmfg.wooper
  WHERE ( (wooper_wo_id = _p.wooper_wo_id)
   AND (wooper_seqnumber < _p.wooper_seqnumber) )
  ORDER BY wooper_seqnumber DESC;

  IF _qtyAvail IS NULL THEN
   RETURN _p.wo_qtyord;
  ELSE
   RETURN _qtyAvail;
  END IF;

END;
$$ LANGUAGE 'plpgsql';

