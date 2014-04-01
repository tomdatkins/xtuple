
CREATE OR REPLACE FUNCTION xtmfg.deleteWorkCenter(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWrkcntid ALIAS FOR $1;
  _check INTEGER;

BEGIN

  SELECT woopervar_id INTO _check
  FROM xtmfg.woopervar
  WHERE (woopervar_wrkcnt_id=pWrkcntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;
 
  SELECT stdopn_id INTO _check
  FROM xtmfg.stdopn
  WHERE (stdopn_wrkcnt_id=pWrkcntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  SELECT booitem_id INTO _check
  FROM xtmfg.booitem
  WHERE (booitem_wrkcnt_id=pWrkcntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  SELECT wooper_id INTO _check
  FROM xtmfg.wooper
  WHERE (wooper_wrkcnt_id=pWrkcntid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

  DELETE FROM xtmfg.wrkcnt
  WHERE (wrkcnt_id=pWrkcntid);

  RETURN pWrkcntid;

END;
$$ LANGUAGE 'plpgsql';

