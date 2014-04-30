-- the api_booitemimage view uses text,text,text. why?
CREATE OR REPLACE FUNCTION xtmfg.getBooitemId(text,text,text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  RETURN xtmfg.getBooitemId($1, $2, CAST($3 AS INTEGER));
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xtmfg.getBooitemId(TEXT,TEXT,INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemNumber ALIAS FOR $1;
  pRevision   ALIAS FOR $2;
  pSeqNumber  ALIAS FOR $3;
  _returnVal  INTEGER;
  
BEGIN
  IF ((pItemNumber IS NULL) OR (pSeqNumber IS NULL)) THEN
    RETURN NULL;
  END IF;

  SELECT booitem_id INTO _returnVal
  FROM xtmfg.booitem(getItemId(pItemNumber),
                     COALESCE(getRevId('BOO',pItemNumber,pRevision)))
  WHERE (booitem_seqnumber=pSeqNumber);
    
  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Sequence % on Bill of Operations % Revision % not found.', pSeqNumber, pItemNumber, pRevision;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
