CREATE OR REPLACE FUNCTION xwd.smoothMargin(pSoitemid INTEGER,
                                            pMargin INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  RETURN xwd.smoothMargin(2, pSoitemid, pMargin);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION xwd.smoothMargin(pOrderType INTEGER,
                                            pOrderItemid INTEGER,
                                            pMargin INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _marginpct NUMERIC;
  _newprice NUMERIC;

BEGIN

  IF (COALESCE(pMargin, 0) = 0) THEN
    RETURN -1;
  END IF;

  IF (pMargin = 100.0) THEN
    _marginpct := 0.99999;
  ELSE
    _marginpct := (pMargin / 100.0);
  END IF;

  IF (pOrderType = 1) THEN
    SELECT CASE WHEN fetchMetricBool('Long30Markups') THEN (quitem_unitcost / (1.0 - _marginpct))
                ELSE (quitem_unitcost + (quitem_unitcost * _marginpct))
           END INTO _newprice
    FROM quitem
    WHERE (quitem_id=pOrderItemid);

    IF (NOT FOUND) THEN
      RETURN -2;
    END IF;

    UPDATE quitem SET quitem_price = _newprice
    WHERE (quitem_id=pOrderItemid);
  ELSE
    SELECT CASE WHEN fetchMetricBool('Long30Markups') THEN (coitem_unitcost / (1.0 - _marginpct))
                ELSE (coitem_unitcost + (coitem_unitcost * _marginpct))
           END INTO _newprice
    FROM coitem
    WHERE (coitem_id=pOrderItemid);

    IF (NOT FOUND) THEN
      RETURN -2;
    END IF;

    UPDATE coitem SET coitem_price = _newprice
    WHERE (coitem_id=pOrderItemid);
  END IF;
  RETURN 1;

END;
$$ LANGUAGE plpgsql;
