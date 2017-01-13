CREATE OR REPLACE FUNCTION xtmfg.logWOTCEvent(pWoid INTEGER,
                                              pUsername TEXT,
                                              pEvntname TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
        
    INSERT INTO evntlog
	( evntlog_evnttime, evntlog_username, evntlog_evnttype_id,
	  evntlog_ordtype, evntlog_ord_id, evntlog_warehous_id,
	  evntlog_number )
    SELECT CURRENT_TIMESTAMP, evntnot_username, evnttype_id,
	   'W', wo_id, warehous_id,
	   (pUsername || '/' || wo_number)
    FROM wo, itemsite, whsinfo, evntnot, evnttype
    WHERE ((wo_id = pWoid)
      AND  (wo_itemsite_id = itemsite_id)
      AND  (itemsite_warehous_id=warehous_id)
      AND  (evntnot_evnttype_id=evnttype_id)
      AND  (evntnot_warehous_id=warehous_id)
      AND  (evnttype_name=pEvntname));

    RETURN 0;
END;
$$ LANGUAGE 'plpgsql';
