
CREATE OR REPLACE FUNCTION importCoitemsToRa(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRaheadid ALIAS FOR $1;
  pCoheadid ALIAS FOR $2;
  _check INTEGER;
  _oldline INTEGER := 0;
  _newline INTEGER := 0;
  _r RECORD;
  _disposition CHAR(1);
  _rsncodeid INTEGER;
  _price BOOLEAN;
  _rcvwhsid integer;
  _shipwhsid integer;
BEGIN

  _price := TRUE;

--  Check to see if authorizations already done
  SELECT raitem_id INTO _check 
  FROM raitem 
  WHERE ((raitem_orig_coitem_id IS NOT NULL)
  AND (raitem_qtyauthorized > 0)
  AND (raitem_rahead_id=pRaheadid));
  IF (FOUND) THEN
    RAISE EXCEPTION 'Quantities have been authorized, Sales Order link may not be changed.';
  END IF;

--  Check to see if closed, otherwise get disposition
  SELECT rahead_disposition, rahead_rsncode_id, rahead_creditmethod INTO _r
  FROM rahead
  WHERE (rahead_id=pRaheadid);
  IF (FOUND) THEN
    IF _r.rahead_disposition='M' THEN
      _disposition := 'R';
      _price = FALSE;
    ELSE
      _disposition := _r.rahead_disposition;
    END IF;
    _rsncodeid := _r.rahead_rsncode_id;
    IF (_r.rahead_creditmethod = 'N') THEN
      _price = FALSE;
    END IF;
  END IF;

--  Check to see if there is already an open Return linked to this Sales Order
  SELECT rahead_number INTO _check
  FROM rahead,raitem
  WHERE ((rahead_id != pRaheadid)
  AND (rahead_orig_cohead_id = pCoheadid)
  AND (raitem_rahead_id=rahead_id)
  AND (raitem_status='O')
  AND (raitem_qtyauthorized > 0));
  IF (FOUND) THEN
    RAISE EXCEPTION 'This sales order is already linked to Authorization % which is still open.', _check;
  END IF;
    
-- Delete any existing line items linked to a sales order
  FOR _r IN
  SELECT raitem_id
  FROM raitem
  WHERE ((raitem_rahead_id=pRaheadid)
  AND (raitem_orig_coitem_id IS NOT NULL))
  LOOP
    UPDATE raitem SET raitem_orig_coitem_id=NULL WHERE raitem_id=_r.raitem_id;
    DELETE FROM raitem WHERE raitem_id=_r.raitem_id;  
  END LOOP;

-- Renumber existing lines
  FOR _r IN 
    SELECT raitem_id, raitem_linenumber
    FROM raitem 
    WHERE (raitem_rahead_id=pRaheadid)
    ORDER BY raitem_linenumber, raitem_subnumber
  LOOP
    IF (_r.raitem_linenumber <> _oldline) THEN
      _newline := _newline + 1;
    END IF;
    _oldline := _r.raitem_linenumber;
    UPDATE raitem SET raitem_linenumber=_newline
    WHERE (raitem_id = _r.raitem_id);
  END LOOP;

  IF (pCoheadid IS NOT NULL) THEN

    SELECT rahead_warehous_id INTO _rcvwhsid
      FROM rahead
     WHERE(rahead_id = pRaheadid);
    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'Receive warehouse site not found.';
    END IF;

    SELECT rahead_cohead_warehous_id INTO _shipwhsid
      FROM rahead
     WHERE(rahead_id = pRaheadid);
    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'Ship warehouse site not found.';
    END IF;

-- Import Sales Order Lines
    FOR _r IN 
      SELECT * ,ri.itemsite_id as rcvitemsite_id,si.itemsite_id as shipitemsite_id,
          ri.itemsite_costmethod AS rcvitemsite_costmethod
        FROM coitem, itemsite oi, item
             LEFT OUTER JOIN itemsite ri ON
             (ri.itemsite_item_id=item_id AND ri.itemsite_warehous_id= _rcvwhsid)
             LEFT OUTER JOIN itemsite si ON
             (si.itemsite_item_id=item_id AND si.itemsite_warehous_id=_shipwhsid)
       WHERE ((coitem_cohead_id=pCoheadid)
         AND (oi.itemsite_id=coitem_itemsite_id)
         AND (item_id=oi.itemsite_item_id)
         AND (coitem_status <> 'X'))
       ORDER BY coitem_linenumber, coitem_subnumber
    LOOP
      IF (_r.rcvitemsite_id IS NULL) THEN
        RAISE EXCEPTION 'Itemsite record for item % does not exist receiving site',_r.item_number;
      END IF;
      IF (_r.shipitemsite_id IS NULL) THEN
        RAISE EXCEPTION 'Itemsite record for item % does not exist shipping site',_r.item_number;
      END IF;

      IF (_r.coitem_subnumber = 0) THEN
        _newline := _newline + 1;
      END IF;
      IF (_disposition IN ('C','R','P','M') OR _r.rcvitemsite_costmethod = 'J') THEN
        INSERT INTO raitem (
          raitem_rahead_id,
          raitem_linenumber,
          raitem_subnumber,
          raitem_itemsite_id,
          raitem_custpn,
          raitem_disposition,
          raitem_rsncode_id,
          raitem_qtyauthorized,
          raitem_qtyreceived,
          raitem_qty_uom_id,
          raitem_qty_invuomratio,
          raitem_price_uom_id,
          raitem_price_invuomratio,
          raitem_unitprice,
          raitem_taxtype_id,
          raitem_orig_coitem_id,
          raitem_cos_accnt_id,
          raitem_scheddate,
          raitem_coitem_itemsite_id)
        VALUES (
          pRaheadid,
          _newline,
          _r.coitem_subnumber,
          _r.rcvitemsite_id,
          _r.coitem_custpn,
          _disposition,
          _rsncodeid,
          0,
          0,
          _r.coitem_qty_uom_id,
          _r.coitem_qty_invuomratio,
          _r.coitem_price_uom_id,
          _r.coitem_price_invuomratio,
          CASE WHEN (_disposition IN ('C','R','S') AND _price) THEN
            _r.coitem_price
          ELSE
            0
          END,
          _r.coitem_taxtype_id,
          _r.coitem_id,
          _r.coitem_cos_accnt_id,
         CASE WHEN _disposition IN ('P','V','S') THEN
            current_date
         ELSE
            NULL
         END,
         CASE WHEN _disposition IN ('P','V','S') THEN
           _r.shipitemsite_id
         ELSE
           NULL
         END );
      END IF;

    END LOOP;

    -- Update average unit cost based on sales if applicable
    FOR _r IN
      SELECT raitem_id
      FROM raitem
       JOIN itemsite ON ((raitem_itemsite_id=itemsite_id)
                     AND (itemsite_costmethod='A'))
      WHERE (raitem_rahead_id=pRaheadid)
      LOOP
        UPDATE raitem
        SET raitem_unitcost=(SELECT COALESCE(SUM(cohist_unitcost * cohist_qtyshipped) / 
                                             SUM(cohist_qtyshipped), 0.0)
                             FROM rahead
                                 JOIN cohead ON (cohead_id=rahead_orig_cohead_id)
                                 JOIN cohist ON ((cohist_doctype='I') 
                                             AND (cohist_ordernumber=cohead_number)
                                             AND (cohist_itemsite_id=raitem_itemsite_id))
                             WHERE (rahead_id=raitem_rahead_id))
        WHERE (raitem_id=_r.raitem_id);
      END LOOP;

  END IF;

  RETURN 1;

END;
$$ LANGUAGE plpgsql;
