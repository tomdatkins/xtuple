
CREATE OR REPLACE FUNCTION xtmfg.qtyforecasted(INTEGER, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
BEGIN
  RETURN xtmfg.qtyForecasted(pItemsiteid, pStartDate, pEndDate, false);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xtmfg.qtyForecasted(INTEGER, DATE, DATE, BOOL) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  pNettedOnly ALIAS FOR $4;
  _total NUMERIC := 0.0;
  _qty NUMERIC;

BEGIN

  SELECT COALESCE(SUM(pschitem_qty),0.0) INTO _qty
    FROM xtmfg.pschitem JOIN xtmfg.pschhead ON (pschitem_pschhead_id=pschhead_id)
   WHERE ((pschhead_status = 'R')
     AND  ((pschhead_type IN ('N', 'P')) OR ((pNettedOnly=False) AND (pschhead_type='F')))
     AND  (pschitem_status = 'O')
     AND  (pschitem_itemsite_id=pItemsiteid)
     AND  (pschitem_scheddate BETWEEN pStartDate AND pEndDate));

  _total := _total + _qty;

  SELECT COALESCE(SUM(((itemuomtouomratio(bomitem_item_id, bomitem_uom_id, NULL) * (bomitem_qtyfxd + pschitem_qty * bomitem_qtyper) * (1 + bomitem_scrap)))),0.0) INTO _qty
    FROM itemsite AS source, item AS sitem,
         itemsite AS parent, item AS pitem,
         xtmfg.pschitem, xtmfg.pschhead, bomitem
   WHERE ((pitem.item_type='L')
     AND  (source.itemsite_planning_type!='N')
     AND  (pschhead_status='R')
     AND  ((pschhead_type IN ('N', 'P')) OR ((pNettedOnly=False) AND (pschhead_type='F')))
     AND  (pschitem_status='O')
     AND  (pschitem_itemsite_id=parent.itemsite_id)
     AND  (pschitem_pschhead_id=pschhead_id)
     AND  (bomitem_parent_item_id=pitem.item_id)
     AND  (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
     AND  (bomitem_item_id=sitem.item_id)
     AND  (bomitem_effective < pEndDate)
     AND  (bomitem_expires > pStartDate)
     AND  (source.itemsite_item_id=sitem.item_id)
     AND  (parent.itemsite_item_id=pitem.item_id)
     AND  (source.itemsite_warehous_id=parent.itemsite_warehous_id)
     AND  (pschitem_scheddate BETWEEN pStartDate AND pEndDate)
     AND  (source.itemsite_id=pItemsiteid));

  _total := _total + _qty;

  RETURN _total;
END;
$$ LANGUAGE 'plpgsql';
