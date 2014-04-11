CREATE OR REPLACE FUNCTION xtmfg.calcWooperStart(INTEGER, INTEGER) RETURNS DATE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoId         ALIAS FOR $1;
  pBooitemSeqId ALIAS FOR $2;
  _result       DATE;
BEGIN
  SELECT (wo_startdate + booitem_execday - 1) INTO _result
  FROM wo JOIN itemsite ON (itemsite_id=wo_itemsite_id)
          JOIN xtmfg.booitem ON ( (itemsite_item_id=booitem_item_id) AND
                                  (wo_boo_rev_id=booitem_rev_id) AND
                                  (booitem_seq_id=pBooitemSeqId) )
  WHERE (wo_id=pWoId);
 
  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';
