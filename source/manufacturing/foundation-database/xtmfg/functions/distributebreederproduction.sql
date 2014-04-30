
CREATE OR REPLACE FUNCTION xtmfg.distributeBreederProduction(INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  pGlDistTS ALIAS FOR $2;
  _p RECORD;
  _r RECORD;
  _woqty NUMERIC;
  _invhistid INTEGER;
  _assetAccntid INTEGER;
  _itemlocSeries INTEGER := 0;

BEGIN

  SELECT formatWoNumber(pWoid) AS woNumber,
         accnt_id AS wipaccntid, itemsite_id, itemsite_item_id,
         stdcost(itemsite_item_id) AS cost
  INTO _p
  FROM wo JOIN itemsite ON (itemsite_id=wo_itemsite_id)
          JOIN costcat ON (costcat_id=itemsite_costcat_id)
          JOIN accnt ON (accnt_id=costcat_wip_accnt_id)
  WHERE (wo_id=pWoid);

--  Receive the Co-Products/By-Products
  FOR _r IN SELECT brddist_id, itemsite_id,
                   brddist_wo_qty, brddist_stdqtyper, brddist_qty,
                   CASE WHEN (itemsite_costmethod='A') THEN (_p.cost * bbomitem_costabsorb * brddist_qty)
                        ELSE (stdcost(itemsite_item_id) * brddist_qty)
                   END AS value
            FROM xtmfg.brddist JOIN itemsite ON (itemsite_id=brddist_itemsite_id)
                               JOIN xtmfg.bbomitem ON (bbomitem_parent_item_id=_p.itemsite_item_id AND
                                                       bbomitem_item_id=itemsite_item_id)
            WHERE ( (NOT brddist_posted)
              AND   (brddist_wo_id=pWoid) ) LOOP

    _woqty := _r.brddist_wo_qty;

    IF (_itemlocSeries = 0) THEN
      SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
    END IF;

    SELECT postInvTrans( _r.itemsite_id, 'RB', _r.brddist_qty,
                         'W/O', 'WO', _p.woNumber, '', 'Receive Inventory from Breeder Manufacturing',
                         costcat_asset_accnt_id, _p.wipaccntid, _itemlocSeries, pGlDistTS,
                         -- the following is only actually used when the item is average or job costed
                         _r.value ) INTO _invhistid
    FROM itemsite, costcat
    WHERE ( (itemsite_costcat_id=costcat_id)
     AND (itemsite_id=_r.itemsite_id) );

--  Pull value from brdvalue to represent the receipt of the co-products
    UPDATE wo
    SET wo_brdvalue=(wo_brdvalue - _r.value)
    WHERE (wo_id=pWoid);

--  Mark the current brddist record as been posted
    UPDATE xtmfg.brddist
    SET brddist_posted=TRUE
    WHERE (brddist_id=_r.brddist_id);

  END LOOP;

--  Issue the Breeder
  IF (_itemlocSeries = 0) THEN
    SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  END IF;

  SELECT postInvTrans( _p.itemsite_id, 'IB', _woqty,
                       'W/O', 'WO', _p.woNumber, '', 'Issue Breeder Inventory by Breeder Distribution',
                       _p.wipaccntid, costcat_asset_accnt_id, _itemlocSeries, pGlDistTS ) INTO _invhistid
  FROM itemsite, costcat
  WHERE ( (itemsite_costcat_id=costcat_id)
   AND (itemsite_id=_p.itemsite_id) );

--  Add value to brd to represent the issue of the breeder item
  UPDATE wo
  SET wo_brdvalue=(wo_brdvalue + (_p.cost * _woqty))
  WHERE (wo_id=pWoid);

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
