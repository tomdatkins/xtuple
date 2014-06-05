CREATE OR REPLACE FUNCTION xwd.smoothMargin(pSoitemid INTEGER,
                                            pMargin INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  RETURN xwd.smoothMargin(2, pSoitemid, pMargin);

END;
$$ LANGUAGE 'plpgsql';

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

  _marginpct := (pMargin / 100.0);

  IF (pOrderType = 1) THEN
    SELECT (quitem_unitcost / (1.0 - _marginpct)) INTO _newprice
    FROM quitem
    WHERE (quitem_id=pOrderItemid);

    IF (NOT FOUND) THEN
      RETURN -2;
    END IF;

    UPDATE quitem SET quitem_price = _newprice
    WHERE (quitem_id=pOrderItemid);
  ELSE
    SELECT (coitem_unitcost / (1.0 - _marginpct)) INTO _newprice
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
$$ LANGUAGE 'plpgsql';
