DROP FUNCTION IF EXISTS calcRaDueAmt(INTEGER);
CREATE OR REPLACE FUNCTION calcRaDueAmt(pRaid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _h RECORD;
  _r RECORD;
  _ext NUMERIC;
  _total NUMERIC := 0;
  _tax NUMERIC;
  _price NUMERIC;

BEGIN
  SELECT rahead_creditmethod, rahead_timing, rahead_taxzone_id, rahead_curr_id,
         rahead_disposition, rahead_headcredited, rahead_freight, rahead_misc
    INTO _h
    FROM rahead
   WHERE rahead_id = pRaid;

  IF (_h.rahead_creditmethod = 'N') THEN
    RETURN 0;
  END IF;

  FOR _r IN
    SELECT raitem_linenumber, raitem_subnumber, raitem_unitprice,
           raitem_disposition, raitem_qtyauthorized, raitem_qtycredited,
           raitem_qtyreceived,
           raitem_qty_invuomratio, raitem_price_invuomratio,
           raitem_taxtype_id,
           item_id, item_type
      FROM raitem
      JOIN itemsite ON raitem_itemsite_id = itemsite_id
      JOIN item     ON itemsite_item_id   = item_id
     WHERE raitem_status    = 'O'
       AND raitem_rahead_id = pRaid
  LOOP
    -- these if's are faster here than in the WHERE clause on at least one customer db
    IF _r.raitem_subnumber = 0 AND _r.item_type = 'K' THEN
      _price := stdCost(_r.item_id);
    ELSIF _r.raitem_unitprice > 0 THEN
      _price := _r.raitem_unitprice;
    ELSE
      _price := 0;
    END IF;
      
    IF _r.raitem_disposition = 'C' AND
      (_h.rahead_timing = 'I' OR _r.raitem_qtyauthorized > _r.raitem_qtycredited) THEN
      _ext := ROUND(((_r.raitem_qtyauthorized - _r.raitem_qtycredited) * _r.raitem_qty_invuomratio) *  (_price / _r.raitem_price_invuomratio), 2);
    ELSIF _r.raitem_disposition IN ('R','P') AND
         ((_h.rahead_timing = 'I' AND _r.raitem_qtyauthorized > _r.raitem_qtycredited)
          OR (_h.rahead_timing = 'R' AND _r.raitem_qtyreceived > _r.raitem_qtycredited)) THEN

      _ext := ROUND(((_r.raitem_qtyreceived - _r.raitem_qtycredited) * _r.raitem_qty_invuomratio) *  (_price / _r.raitem_price_invuomratio),2);
    ELSE
      _ext := 0;
    END IF;

    _total := _total + _ext +
                calculateTax(_h.rahead_taxzone_id, _r.raitem_taxtype_id,
                             CURRENT_DATE, _h.rahead_curr_id, _ext);

  END LOOP;  

  IF (_h.rahead_disposition != 'C' AND _total = 0) THEN
     RETURN 0;
  END IF;

  IF (NOT _h.rahead_headcredited) THEN
    _total := _total + _h.rahead_misc + _h.rahead_freight +
              calculateTax(_h.rahead_taxzone_id, getFreightTaxTypeId(),
                           CURRENT_DATE, _h.rahead_curr_id, _h.rahead_freight);
  END IF;

  RETURN _total;
END;
$$ LANGUAGE plpgsql;
