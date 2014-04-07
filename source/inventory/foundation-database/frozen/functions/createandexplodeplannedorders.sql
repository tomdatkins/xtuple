CREATE OR REPLACE FUNCTION createAndExplodePlannedOrders(INTEGER, DATE, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteId ALIAS FOR $1;
  pCutoffDate ALIAS FOR $2;
  pDeleteFirmed ALIAS FOR $3;
BEGIN
  RETURN createAndExplodePlannedOrders(pItemsiteId, pCutoffDate, pDeleteFirmed, FALSE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createAndExplodePlannedOrders(INTEGER, DATE, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteId ALIAS FOR $1;
  pCutoffDate ALIAS FOR $2;
  pDeleteFirmed ALIAS FOR $3;
  pMPS ALIAS FOR $4;
BEGIN
  RETURN createAndExplodePlannedOrders(pItemsiteId, pCutoffDate, pDeleteFirmed, pMPS, FALSE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createAndExplodePlannedOrders(INTEGER, DATE, BOOLEAN, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteId ALIAS FOR $1;
  pCutoffDate ALIAS FOR $2;
  pDeleteFirmed ALIAS FOR $3;
  pMPS ALIAS FOR $4;
  pCreateExcp ALIAS FOR $5;
  _result NUMERIC;
  _ordercounter NUMERIC;
  _b RECORD;

BEGIN

  SELECT createplannedorders(pItemsiteId,pCutoffDate,pDeleteFirmed, pMPS, pCreateExcp) INTO _ordercounter;

-- Create Planned Orders for manufactured or purchased component items
  FOR _b IN SELECT c.itemsite_id AS componentsiteid
            FROM bomitem, itemsite AS p, itemsite AS c, item
            WHERE ( (pItemsiteId=p.itemsite_id)
             AND (bomitem_parent_item_id=p.itemsite_item_id)
             AND (bomitem_item_id=c.itemsite_item_id)
             AND (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
             AND (p.itemsite_warehous_id=c.itemsite_warehous_id)
             AND (c.itemsite_item_id=item_id)
             AND (c.itemsite_planning_type='M')
             AND (pCutoffDate BETWEEN bomitem_effective AND (bomitem_expires - 1))) LOOP

  SELECT createandexplodeplannedorders(_b.componentsiteid,pCutoffDate,pDeleteFirmed,pMPS, pCreateExcp) INTO _result;

  _ordercounter := _ordercounter + _result;

  END LOOP;

  RETURN _ordercounter;
END;
$$ LANGUAGE 'plpgsql';

COMMENT ON FUNCTION createandexplodeplannedorders(integer, date, boolean) IS 'Run MRP by Itemsite, but explode through children';
COMMENT ON FUNCTION createandexplodeplannedorders(integer, date, boolean, boolean) IS 'Run MRP by Itemsite, but explode through children';
COMMENT ON FUNCTION createandexplodeplannedorders(integer, date, boolean, boolean, boolean) IS 'Run MRP by Itemsite, but explode through children';
