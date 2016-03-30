
CREATE OR REPLACE FUNCTION calcIpsitemPrice(pIpsitemid INTEGER,
                                            pListPrice NUMERIC) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result NUMERIC := 0.0;
BEGIN

  SELECT CASE WHEN (ipsitem_type = 'N') THEN
               ipsitem_price
              WHEN (ipsitem_type = 'D') THEN
               noNeg(pListPrice - (pListPrice * ipsitem_discntprcnt) - ipsitem_fixedamtdiscount)
              WHEN ((ipsitem_type = 'M') AND fetchMetricBool('Long30Markups') AND fetchMetricBool('WholesalePriceCosting')) THEN
               (_item.listcost / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
              WHEN ((ipsitem_type = 'M') AND fetchMetricBool('Long30Markups')) THEN
               (_item.invcost / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
              WHEN (ipsitem_type = 'M' AND fetchMetricBool('WholesalePriceCosting')) THEN
               (_item.item_listcost + (_item.item_listcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
              WHEN (ipsitem_type = 'M') THEN
               (_item.invcost + (_item.invcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount)
              ELSE 0.00
         END INTO _result
  FROM ipsiteminfo
  WHERE (ipsitem_id=pIpsitemid);

  IF ( SELECT ((metric_value='t') AND packageIsEnabled('xtmfg'))
         FROM metric
        WHERE(metric_name='Routings') ) THEN
    RETURN xtmfg.calcWooperStart(pWoId, pBooitemSeqId);
  END IF;
  RETURN null;
END;
$$ LANGUAGE 'plpgsql';

