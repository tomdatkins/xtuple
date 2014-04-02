CREATE OR REPLACE FUNCTION calcRaAmt(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRaid ALIAS FOR $1;
  _h RECORD;
  _r RECORD;
  _ext NUMERIC := 0.0;
  _total NUMERIC := 0.0;
  _lines BOOLEAN := FALSE;

BEGIN

-- Fetch header data
  SELECT rahead.*
  INTO _h
  FROM rahead
  WHERE (rahead_id=pRaid);

  IF (_h.rahead_creditmethod = 'N') THEN
    RETURN 0.0;
  END IF;

--  Total up line item amounts
  FOR _r IN
    SELECT *
    FROM rahead, raitem
    WHERE ((raitem_rahead_id=rahead_id)
    AND (rahead_id=pRaid)
    AND (raitem_unitprice > 0))
  LOOP

--  Calc Amount Due
    _ext := ROUND(((_r.raitem_qtyauthorized) * _r.raitem_qty_invuomratio) *  (_r.raitem_unitprice / _r.raitem_price_invuomratio),2);

    _lines := TRUE;

    _total := _total + _ext;
  END LOOP;  

-- If not credit, and no lines eligible, then nothing
  IF (_h.rahead_disposition != 'C' AND NOT _lines) THEN
     RETURN 0.0;
  END IF;

-- Add header totals
    _total := _total + _h.rahead_misc + _h.rahead_freight + calcRaTaxAmt(pRaid);


  RETURN _total;
END;
$$ LANGUAGE 'plpgsql';
