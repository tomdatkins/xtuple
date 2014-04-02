CREATE OR REPLACE FUNCTION xtmfg.copyItem(INTEGER, TEXT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pSItemid      ALIAS FOR $1;
  pTItemNumber  ALIAS FOR $2;
  pCopyBOM      ALIAS FOR $3;
  pCopyBOO      ALIAS FOR $4;
  pCopyCosts    ALIAS FOR $5;
  pCopyUsedAt   ALIAS FOR $6;
  _itemid       INTEGER;

BEGIN
  _itemid := copyItem(pSItemid, pTItemNumber);
  
  IF (pCopyBOM) THEN
    PERFORM copyBOM(psItemid, _itemid, pCopyBOO AND pCopyUsedAt);
  END IF;

  IF (pCopyBOO) THEN
    PERFORM xtmfg.copyBOO(pSItemid, _itemid);
  END IF;

  IF (pCopyCosts) THEN
    INSERT INTO itemcost
    ( itemcost_item_id, itemcost_costelem_id, itemcost_lowlevel,
      itemcost_stdcost, itemcost_posted,
      itemcost_actcost, itemcost_curr_id, itemcost_updated)
    SELECT _itemid, itemcost_costelem_id, itemcost_lowlevel,
           itemcost_stdcost, CURRENT_DATE,
           itemcost_actcost, itemcost_curr_id, CURRENT_DATE
    FROM itemcost
    WHERE (itemcost_item_id=pSItemid);
  END IF;

  RETURN _itemid;
END;
$$ LANGUAGE 'plpgsql';
