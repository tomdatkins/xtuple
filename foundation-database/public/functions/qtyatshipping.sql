CREATE OR REPLACE FUNCTION qtyAtShipping(plineitemid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _coheadid    INTEGER;
  _linenumber  INTEGER;
  _qty         NUMERIC  := 0.0;

BEGIN
  -- account for kits by including kit components
  SELECT coitem_cohead_id, coitem_linenumber INTO _coheadid, _linenumber
  FROM coitem
  WHERE (coitem_id=plineitemid);

  SELECT COALESCE(SUM(qtyAtShipping('SO', coitem_id)), 0.0) INTO _qty
  FROM coitem
  WHERE (coitem_cohead_id=_coheadid)
    AND (coitem_linenumber=_linenumber);

  RETURN _qty;

END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION qtyAtShipping(TEXT, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN qtyAtShipping($1, $2, 'U');
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION qtyAtShipping(pordertype TEXT,
                                         plineitemid INTEGER,
                                         pstatus TEXT) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qty         NUMERIC  := 0.0;

BEGIN

-- pstatus U=unshipped
--         S=shipped
--         B=both unshipped and shipped

  IF (pordertype NOT IN ('SO', 'TO')) THEN
    RAISE EXCEPTION '% is not a valid order type', pordertype;
  END IF;

  IF (pstatus NOT IN ('U', 'S', 'B')) THEN
    RAISE EXCEPTION '% is not a valid status', pstatus;
  END IF;

  SELECT COALESCE(SUM(shipitem_qty), 0.0) INTO _qty
  FROM shipitem, shiphead
  WHERE ((shipitem_shiphead_id=shiphead_id)
    AND  (shiphead_order_type=pordertype)
    AND  (shipitem_orderitem_id=plineitemid)
    AND  (((shiphead_shipped) AND (pstatus IN ('S', 'B'))) OR ((NOT shiphead_shipped) AND (pstatus IN ('U', 'B'))))  );

  RETURN _qty;

END;
$$ LANGUAGE plpgsql STABLE;
