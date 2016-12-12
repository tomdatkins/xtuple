CREATE OR REPLACE FUNCTION distributeVoucherFreight(pVoHeadid    INTEGER,
                                                    pCostElement INTEGER,
                                                    pDistrType   TEXT,
                                                    pFreight     NUMERIC)
RETURNS integer AS $$
-- Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _item    RECORD;
  _total   RECORD;
  _vodist  RECORD;
  _dist    NUMERIC;
BEGIN

  SELECT SUM(voitem_qty) as qty, SUM((voitem_qty * poitem_unitprice)) as price, SUM(voitem_qty * (item_prodweight + item_packweight)) as wgt
  INTO _total
  FROM voitem
  JOIN poitem ON (voitem_poitem_id=poitem_id)
  JOIN itemsite ON (poitem_itemsite_id=itemsite_id)
  JOIN item ON (itemsite_item_id=item_id)
  WHERE voitem_vohead_id=pVoHeadid;

-- Distribution checks
  IF (_total.qty IS NULL) THEN
    RAISE EXCEPTION 'Voucher Items not yet distributed [xtuple: distributeVoucherFreight, -1]';
  END IF;

  FOR _item IN
    SELECT voitem_poitem_id AS poitem, voitem_qty AS qty, 
      (voitem_qty * poitem_unitprice) as price, 
      voitem_qty * (item_prodweight + item_packweight) as wgt
    FROM voitem
    JOIN poitem ON (voitem_poitem_id=poitem_id)
    JOIN itemsite ON (poitem_itemsite_id=itemsite_id)
    JOIN item ON (itemsite_item_id=item_id)
    WHERE voitem_vohead_id=pVoHeadid 
  LOOP

    SELECT vodist_taxtype_id AS taxtype,
           vodist_qty AS qty,
           vodist_discountable AS discountable
    INTO _vodist
    FROM vodist
    WHERE vodist_vohead_id = pVoHeadid
    AND vodist_poitem_id = _item.poitem
    AND vodist_costelem_id <> pCostElement
    LIMIT 1;

    CASE pDistrType
      WHEN 'Q' THEN
        IF (_total.qty = 0) THEN
          RAISE EXCEPTION 'Voucher totals equal zero [xtuple: distributeVoucherFreight, -2]';
        END IF;  
        _dist := (_item.qty / _total.qty) * pFreight;
      WHEN 'V' THEN
        IF (_total.price = 0) THEN
          RAISE EXCEPTION 'Voucher totals equal zero [xtuple: distributeVoucherFreight, -2]';
        END IF;      
        _dist := (_item.price / _total.price) * pFreight;
      WHEN 'W' THEN
        IF (_total.wgt = 0) THEN
          RAISE EXCEPTION 'Voucher totals equal zero [xtuple: distributeVoucherFreight, -2]';
        END IF;      
        _dist := (_item.wgt / _total.wgt) * pFreight;
    END CASE;         

    INSERT INTO vodist (vodist_poitem_id, vodist_vohead_id, vodist_costelem_id, vodist_amount,
                        vodist_qty, vodist_expcat_id, vodist_tax_id, vodist_discountable,
                        vodist_notes, vodist_taxtype_id)
    VALUES (_item.poitem, pVoHeadid, pCostElement,  _dist, 
            _vodist.qty, -1, -1, _vodist.discountable, 'Freight Auto Distribution', _vodist.taxtype);
        
  END LOOP;  

  RETURN 1;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION distributeVoucherFreight(integer, integer, text, numeric) OWNER TO admin;

