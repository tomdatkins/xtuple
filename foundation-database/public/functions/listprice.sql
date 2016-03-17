
CREATE OR REPLACE FUNCTION listprice(pItemid INTEGER,
                                     pCustid INTEGER DEFAULT (NULL),
                                     pShiptoid INTEGER DEFAULT (NULL),
                                     pQty NUMERIC DEFAULT (1.0),
                                     pQtyuom INTEGER DEFAULT (NULL),
                                     pPriceuom INTEGER DEFAULT (NULL),
                                     pCurrid INTEGER DEFAULT (NULL),
                                     pEffective DATE DEFAULT (NULL),
                                     pAsof DATE DEFAULT (NULL),
                                     pSiteid INTEGER DEFAULT (NULL),
                                     pShipzoneid INTEGER DEFAULT (-1),
                                     pSaletypeid INTEGER DEFAULT (-1)) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _ips RECORD;
  _item RECORD;
  _cust RECORD;
  _shipto RECORD;
  _itempricepricerat NUMERIC := 1.0;
  _listprice NUMERIC := 0.0;
  _qty NUMERIC;
  _qtyuomid INTEGER;
  _currid INTEGER;
  _asof DATE;
  _wholesalepricecosting BOOLEAN := false;
  _long30markups BOOLEAN := false;
  _itempricingprecedence BOOLEAN := false;

BEGIN
  _wholesalepricecosting := fetchMetricBool('WholesalePriceCosting');
  _long30markups := fetchMetricBool('Long30Markups');
  _itempricingprecedence := fetchMetricBool('ItemPricingPrecedence');

-- If no as of passed, use current date
  _asof := COALESCE(pAsOf, CURRENT_DATE);

--  Cache Item, Customer and Shipto
  SELECT item.*,
         CASE WHEN (itemsite_id IS NULL) THEN
                   (stdCost(item_id) / itemuomtouomratio(item_id, item_inv_uom_id, item_price_uom_id))
              ELSE
                   (itemCost(itemsite_id) / itemuomtouomratio(item_id, item_inv_uom_id, item_price_uom_id))
         END AS invcost INTO _item
  FROM item LEFT OUTER JOIN itemsite ON (itemsite_item_id=item_id AND itemsite_warehous_id=pSiteid)
  WHERE (item_id=pItemid);

  SELECT * INTO _cust
  FROM custinfo JOIN custtype ON (custtype_id=cust_custtype_id)
  WHERE (cust_id=pCustid);

  SELECT * INTO _shipto
  FROM shiptoinfo
  WHERE (shipto_id=pShiptoid);

-- Return the listPrice in the currency passed in as pCurrid
  _qtyuomid := COALESCE(pQtyuom, _item.item_inv_uom_id);
  _currid := COALESCE(pCurrid, baseCurrid());
  _qty := itemuomtouom(pItemid, _qtyuomid, NULL, pQty);

-- Get a value here so we do not have to call the function several times
  SELECT itemuomtouomratio(pItemid, pPriceUOM, _item.item_price_uom_id) AS ratio
    INTO _itempricepricerat;

-- Price Schedule Assignment Order of Precedence
-- 1. Specific Customer Shipto Id
-- 2. Specific Customer Shipto Pattern
-- 3. Any Customer Shipto Pattern
-- 4. Specific Customer
-- 5. Customer Type
-- 6. Customer Type Pattern
-- 7. Shipping Zone
-- 8. Sale Type 

-- Find the best List Price Schedule Price
 
  SELECT INTO _ips
    *, currToCurr(ipshead_curr_id, _currid, protoprice, pEffective) AS rightprice
  FROM (
    SELECT *,
           CASE WHEN (COALESCE(ipsass_shipto_id, -1) > 0) THEN 1
                WHEN (COALESCE(LENGTH(ipsass_shipto_pattern), 0) > 0 AND COALESCE(ipsass_cust_id, -1) > 0) THEN 2
                WHEN (COALESCE(LENGTH(ipsass_shipto_pattern), 0) > 0) THEN 3
                WHEN (COALESCE(ipsass_cust_id, -1) > 0) THEN 4
                WHEN (COALESCE(ipsass_custtype_id, -1) > 0) THEN 5
                WHEN (COALESCE(LENGTH(ipsass_custtype_pattern), 0) > 0) THEN 6
                WHEN (COALESCE(ipsass_shipzone_id, -1) > 0) THEN 7
                WHEN (COALESCE(ipsass_saletype_id, -1) > 0) THEN 8
                ELSE 99
           END AS assignseq,
           CASE WHEN (ipsitem_type = 'N') THEN
                 (ipsitem_price * itemuomtouomratio(_item.item_id, pPriceUOM, ipsitem_price_uom_id))
                WHEN (ipsitem_type = 'D') THEN
                 noNeg(_item.item_listprice - (_item.item_listprice * ipsitem_discntprcnt) - ipsitem_fixedamtdiscount) * _itempricepricerat
                WHEN ((ipsitem_type = 'M') AND _long30markups AND _wholesalepricecosting) THEN
                 (_item.item_listcost / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
                WHEN ((ipsitem_type = 'M') AND _long30markups) THEN
                 (_item.invcost / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
                WHEN (ipsitem_type = 'M' AND _wholesalepricecosting) THEN
                 (_item.item_listcost + (_item.item_listcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
                WHEN (ipsitem_type = 'M') THEN
                 (_item.invcost + (_item.invcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
                ELSE 0.00
           END AS protoprice,
           CASE WHEN (ipsitem_item_id=_item.item_id) THEN itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak)
                ELSE ipsitem_qtybreak
           END AS protoqtybreak,
           (COALESCE(ipsitem_price_uom_id, -1)=COALESCE(pPriceUOM,-1)) AS uommatched,
           CASE WHEN (_itempricingprecedence) THEN (COALESCE(ipsitem_item_id, -1)=_item.item_id)
                ELSE true END AS itemmatched
    FROM ipsass JOIN ipshead ON (ipshead_id=ipsass_ipshead_id AND ipshead_listprice)
                JOIN ipsiteminfo ON (ipsitem_ipshead_id=ipshead_id)
    WHERE ( (ipsitem_item_id=_item.item_id) OR (ipsitem_prodcat_id=_item.item_prodcat_id) )
      AND (_asof BETWEEN ipshead_effective AND (ipshead_expires - 1))
      AND ( (ipsitem_warehous_id=pSiteid) OR (ipsitem_warehous_id IS NULL) )
      AND ( (ipsass_shipto_id=_shipto.shipto_id)
       OR   ((COALESCE(LENGTH(ipsass_shipto_pattern), 0) > 0) AND (ipsass_cust_id > -1) AND (_shipto.shipto_num ~ ipsass_shipto_pattern) AND (ipsass_cust_id = _cust.cust_id))
       OR   ((COALESCE(LENGTH(ipsass_shipto_pattern), 0) > 0) AND (ipsass_cust_id = -1) AND (_shipto.shipto_num ~ ipsass_shipto_pattern))
       OR   ((COALESCE(LENGTH(ipsass_shipto_pattern), 0) = 0) AND (ipsass_cust_id=_cust.cust_id))
       OR   (ipsass_custtype_id=_cust.cust_custtype_id)
       OR   ((COALESCE(LENGTH(ipsass_custtype_pattern), 0) > 0) AND (_cust.custtype_code ~ ipsass_custtype_pattern))
       OR   ((COALESCE(ipsass_shipzone_id, 0) > 0) AND (ipsass_shipzone_id=pShipZoneid))
       OR   ((COALESCE(ipsass_saletype_id, 0 ) > 0) AND (ipsass_saletype_id=pSaleTypeid)) )
  ) AS proto
  WHERE (protoqtybreak <= pQty)
  ORDER BY assignseq, itemmatched DESC, protoqtybreak DESC, rightprice
  LIMIT 1;
 
  IF (_ips.rightprice IS NOT NULL) THEN
    RAISE DEBUG 'itemprice, item=%, cust=%, shipto=%, schedule price= %', pItemid, pCustid, pShiptoid, _ips.rightprice;
    RETURN _ips.rightprice;
  END IF;

--  If item is exclusive then list list price does not apply
  IF (_item.item_exclusive) THEN
    RAISE DEBUG 'itemprice, item=%, cust=%, shipto=%, item exclusive, price=-9999', pItemid, pCustid, pShiptoid;
    RETURN -9999.0;
  END IF;

--  Check for a list price
  _listprice := noNeg(currToLocal(_currid, _item.item_listprice - (_item.item_listprice * COALESCE(_cust.cust_discntprcnt, 0.0)), pEffective)
                      * itemuomtouomratio(pItemid, pPriceUOM, _item.item_price_uom_id));

  RAISE DEBUG 'itemprice, item=%, cust=%, shipto=%, list price= %', pItemid, pCustid, pShiptoid, _listprice;

  RETURN _listprice;

END; $$
  LANGUAGE plpgsql;
