CREATE OR REPLACE FUNCTION resolveCORAccount(INTEGER, INTEGER) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  RETURN resolveCORAccount($1, $2, -1, -1);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION resolveCORAccount(pItemsiteid INTEGER,
                                             pCustid INTEGER,
                                             pSaletypeid INTEGER,
                                             pShipzoneid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _salesaccntid INTEGER;
  _accntid INTEGER;

BEGIN

  SELECT findSalesAccnt(pItemsiteid, 'IS', pCustid, pSaletypeid, pShipzoneid) INTO _salesaccntid;
  IF (_salesaccntid = -1) THEN
    SELECT metric_value::INTEGER INTO _accntid
    FROM metric
    WHERE (metric_name='UnassignedAccount');
  ELSE
    SELECT salesaccnt_cor_accnt_id INTO _accntid
    FROM salesaccnt
    WHERE (salesaccnt_id=_salesaccntid);
  END IF;

  RETURN _accntid;

END;
$$ LANGUAGE 'plpgsql';
