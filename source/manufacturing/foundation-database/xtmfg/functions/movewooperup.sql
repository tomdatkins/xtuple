
CREATE OR REPLACE FUNCTION xtmfg.moveWooperUp(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWooperid ALIAS FOR $1;
  _nextWooper RECORD;

BEGIN

  SELECT nextwooper.wooper_id AS wooper_id, nextwooper.wooper_seqnumber AS next_seqnumber,
         thiswooper.wooper_seqnumber AS this_seqnumber INTO _nextWooper
  FROM xtmfg.wooper AS nextwooper, xtmfg.wooper AS thiswooper
  WHERE ((nextwooper.wooper_seqnumber < thiswooper.wooper_seqnumber)
   AND (nextwooper.wooper_wo_id=thiswooper.wooper_wo_id)
   AND (thiswooper.wooper_id=pWooperid))
  ORDER BY next_seqnumber DESC
  LIMIT 1;

  IF (FOUND) THEN
--  Swap the seqnumber of the current wooper and the next wooper

    UPDATE xtmfg.wooper 
    SET wooper_seqnumber=_nextWooper.next_seqnumber
    WHERE (wooper_id=pWooperid);

    UPDATE xtmfg.wooper
    SET wooper_seqnumber=_nextWooper.this_seqnumber
    WHERE (wooper_id=_nextWooper.wooper_id);
  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
