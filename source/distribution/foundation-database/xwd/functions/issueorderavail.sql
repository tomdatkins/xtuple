CREATE OR REPLACE FUNCTION xwd.issueOrderAvail(pOrderNumber TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _s                   RECORD;
  _qtytoship           NUMERIC := 0.0;
  _itemlocSeries       INTEGER := 0;
  _isqtyavail          INTEGER := 0;
  _timestamp           TIMESTAMP WITH TIME ZONE := NULL;

BEGIN
  FOR _s IN
    SELECT coitem_id, qtyNetable(itemsite_id) AS netableqoh,
           CASE WHEN (SELECT fetchMetricBool('RequireSOReservations'))
                  THEN coitem_qtyreserved
                ELSE
                  noNeg(coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned -
                        ( SELECT COALESCE(SUM(shipitem_qty), 0)
                          FROM shipitem, shiphead
                          WHERE ( (shipitem_orderitem_id=coitem_id)
                            AND (shipitem_shiphead_id=shiphead_id)
                            AND (NOT shiphead_shipped)
                            AND (shiphead_order_type='SO') ) ) )
           END AS balance
    FROM cohead JOIN coitem ON (coitem_cohead_id=cohead_id)
                LEFT OUTER JOIN (itemsite JOIN item ON (itemsite_item_id=item_id)) ON (coitem_itemsite_id=itemsite_id)
    WHERE ( (coitem_status NOT IN ('C','X'))
      AND (item_type != 'K')
      AND (cohead_number=pOrderNumber) )
  LOOP
    _qtytoship := CASE WHEN (_s.balance > _s.netableqoh) THEN _s.netableqoh
                       ELSE _s.balance
                  END;
    IF (_qtytoship > 0.0) THEN
      _isqtyavail := sufficientInventoryToShipItem('SO', _s.coitem_id, _qtytoship);
      IF (_isqtyavail = 0) THEN
        _itemlocSeries := issueToShipping('SO', _s.coitem_id, _qtytoship, _itemlocSeries, _timestamp);
        IF (_itemlocSeries < 0) THEN
          EXIT;
        END IF;
      END IF;
    END IF;
  END LOOP;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
