CREATE OR REPLACE FUNCTION calcRaDueAmt(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRaid ALIAS FOR $1;
  _h RECORD;
  _r RECORD;
  _ext NUMERIC;
  _total NUMERIC;
  _tax NUMERIC;
  _lines BOOLEAN;

BEGIN
  _lines := FALSE;
  _total := 0;

-- Fetch header data
  SELECT rahead.*
  INTO _h
  FROM rahead
  WHERE (rahead_id=pRaid);

  IF (_h.rahead_creditmethod = 'N') THEN
    RETURN 0;
  END IF;

--  Total up line item amounts
  FOR _r IN
    SELECT *
    FROM rahead, raitem
    WHERE ((raitem_rahead_id=rahead_id)
    AND (rahead_id=pRaid)
    AND (raitem_unitprice > 0)
    AND (raitem_status = 'O')
    AND ((raitem_disposition = 'C' AND raitem_qtyauthorized > raitem_qtycredited)
    OR (raitem_disposition IN ('R','P') AND rahead_timing = 'I' AND raitem_qtyauthorized > raitem_qtycredited)
    OR (raitem_disposition IN ('R','P') AND rahead_timing = 'R' AND raitem_qtyreceived > raitem_qtycredited)))
  LOOP

--  Calc Amount Due
    IF (_r.raitem_disposition = 'C' OR _r.rahead_timing = 'I') THEN
      _ext := ROUND(((_r.raitem_qtyauthorized - _r.raitem_qtycredited) * _r.raitem_qty_invuomratio) *  (_r.raitem_unitprice / _r.raitem_price_invuomratio),2);
    ELSE
      _ext := ROUND(((_r.raitem_qtyreceived - _r.raitem_qtycredited) * _r.raitem_qty_invuomratio) *  (_r.raitem_unitprice / _r.raitem_price_invuomratio),2);
    END IF;

    _lines := TRUE;

--  Calc Tax

    _tax := calculateTax(_r.rahead_taxzone_id, _r.raitem_taxtype_id, CURRENT_DATE, _r.rahead_curr_id, _ext);

    _total := _total + _ext + _tax;
  END LOOP;  

-- If not credit, and no lines eligible, then nothing
  IF (_h.rahead_disposition != 'C' AND NOT _lines) THEN
     RETURN 0;
  END IF;

  IF (NOT _h.rahead_headcredited) THEN
-- Calc Tax on freight
    _tax := calculateTax(_h.rahead_taxzone_id, getFreightTaxTypeId(), CURRENT_DATE, _h.rahead_curr_id, _h.rahead_freight);

-- Add header totals
    _total := _total + _h.rahead_misc + _h.rahead_freight + _tax; 
  END IF;

  RETURN _total;
END;
$$ LANGUAGE 'plpgsql';
