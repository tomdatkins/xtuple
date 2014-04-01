CREATE OR REPLACE FUNCTION xtmfg.checkBOOSitePrivs(INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pBooheadid ALIAS FOR $1;
  _check    BOOLEAN;
  _result   INTEGER;

BEGIN

  IF (NOT fetchMetricBool('MultiWhs')) THEN
    RETURN true;
  END IF;

  IF (NOT fetchUsrPrefBool('selectedSites')) THEN
    RETURN true;
  END IF;

  SELECT COALESCE(COUNT(*), 0) INTO _result
    FROM ( SELECT booitem_id
             FROM xtmfg.boohead, xtmfg.booitem, xtmfg.wrkcnt
            WHERE ( (boohead_id=pBooheadid)
              AND   (booitem_item_id=boohead_item_id)
              AND   (booitem_rev_id=boohead_rev_id)
              AND   (booitem_wrkcnt_id=wrkcnt_id)
              AND   (wrkcnt_warehous_id NOT IN (SELECT usrsite_warehous_id
                                                    FROM usrsite
                                                   WHERE (usrsite_username=getEffectiveXtUser()))) )
         ) AS data;
  IF (_result > 0) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE 'plpgsql';
