CREATE OR REPLACE FUNCTION xtmfg.createwobufferstatus(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoid   ALIAS FOR $1;
  _p      RECORD;
  _x      RECORD;
  _result INTEGER;

BEGIN
  --Clear old status records
  DELETE FROM xtmfg.bufrsts
  WHERE ((bufrsts_target_type = 'W')
     AND (bufrsts_target_id=pWoid));

  --Fetch Work Order Data
  SELECT wo_id,
        wo_status,
        itemsite_id,
        (calculateworkdays(itemsite_warehous_id, wo_startdate,
                                 wo_duedate)+1) AS ttlLeadtime,
        calculateworkdays(itemsite_warehous_id, current_date,
                                wo_duedate) AS remLeadtime,
        (wo_qtyord - wo_qtyrcv) AS supply,
        itemsite_stocked INTO _p
        FROM wo, itemsite
        WHERE (wo_itemsite_id=itemsite_id)
         AND (wo_id=pWoid);

  --Validate
  IF (_p.wo_id IS NULL) or (_p.wo_status = 'C') or (_p.supply <= 0) THEN
    RETURN -1;
  END IF;

  --Create Buffer Status for this workorder at current level
  INSERT INTO xtmfg.bufrsts (
           bufrsts_target_type, bufrsts_target_id, bufrsts_date,
           bufrsts_type, bufrsts_size, bufrsts_itemsite_id,
           bufrsts_status
  ) VALUES (
           'W', _p.wo_id, current_date,
           'T', _p.ttlLeadtime, _p.Itemsite_id,
           xtmfg.calcbufferstatus(_p.ttlLeadtime,_p.remLeadtime));

  --Loop through child work orders and calculate status
  FOR _x IN SELECT wo_id
            FROM wo
            WHERE ((wo_status <> 'C')
               AND (wo_qtyord > wo_qtyrcv)
               AND (wo_ordid = pWoid)
               AND (wo_ordtype = 'W'))
  LOOP
    _result := xtmfg.createwobufferstatus(_x.wo_id);
    IF _result = -1 THEN
      RETURN _result;
    END IF;
  END LOOP;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

COMMENT ON FUNCTION xtmfg.createwobufferstatus(INTEGER) IS 'Insert work order buffer status records for a non-stock work order and all its children';

CREATE OR REPLACE FUNCTION xtmfg.createwobufferstatus(INTEGER, NUMERIC, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoid         ALIAS FOR $1;
  PBufferSize   ALIAS FOR $2;
  pBufferStatus ALIAS FOR $3;
  _p            RECORD;
  _x            RECORD;
  _result       INTEGER;

BEGIN
  --Clear old status records
  DELETE FROM xtmfg.bufrsts WHERE
    ((bufrsts_target_type = 'W')
   AND (bufrsts_target_id=pWoid));

  --Fetch Work Order Data
  SELECT
        wo_id,
        wo_subnumber,
        wo_ordtype,
        wo_status,
        itemsite_id,
        itemsite_stocked,
        (wo_qtyord - wo_qtyrcv) AS supply INTO _p
  FROM wo, itemsite
  WHERE ((wo_itemsite_id=itemsite_id)
     AND (wo_id=pWoid));

  --Validate
  IF (_p.wo_ordtype = 'S')
      OR (_p.wo_ordtype IS NULL AND _p.itemsite_stocked = False)
      OR (_p.wo_status = 'C') or (_p.supply <= 0) THEN
    RETURN -1;
  END IF;

  --Create Buffer Status this workorder at current level
  INSERT INTO xtmfg.bufrsts (
        bufrsts_target_type, bufrsts_target_id, bufrsts_date,
        bufrsts_type, bufrsts_size, bufrsts_itemsite_id,
        bufrsts_status
  ) VALUES (
        'W', pWoid, current_date,
        'S', pBufferSize, _p.itemsite_id,
        pBufferStatus);

  --Loop through child work orders and calculate status
  FOR _x IN SELECT wo_id
          FROM wo
          WHERE ((wo_status <> 'C')
             AND (wo_qtyord > wo_qtyrcv)
             AND (wo_ordid = pWoid)
             AND (wo_ordtype = 'W') )
  LOOP
    _result := xtmfg.createwobufferstatus(_x.wo_id, pBufferSize, pBufferStatus);
    IF _result = -1 THEN
      RETURN _result;
    END IF;
  END LOOP;

  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';
