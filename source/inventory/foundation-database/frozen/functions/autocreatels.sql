CREATE OR REPLACE FUNCTION autocreatels(integer) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemlocdistId ALIAS FOR $1;
  _i INTEGER;
  _itemlocseries INTEGER;
  _r RECORD;
  _rows INTEGER;

BEGIN

  -- Fetch data for processing
  SELECT itemlocdist_qty, itemsite_controlmethod, 
    itemsite_perishable, itemsite_warrpurc, itemsite_lsseq_id
  INTO _r
  FROM itemlocdist
    JOIN itemsite ON (itemlocdist_itemsite_id=itemsite_id)
  WHERE (itemlocdist_id=pItemlocdistId);

  -- Validate
  GET DIAGNOSTICS _rows = ROW_COUNT;
  IF (_rows = 0) THEN
    RAISE NOTICE 'Itemlocdist record does not exist for id %', pItemlocdistId;
    RETURN -1;
  ELSIF (_r.itemsite_controlmethod NOT IN ('L','S')) THEN
    RAISE NOTICE 'Auto create for lot/serial can only be used on lot or serial controlled items';
    RETURN -1;
  ELSIF (_r.itemsite_perishable) THEN
    RAISE NOTICE 'Auto create for lot/serial can not be used on perishable items sites';
    RETURN -1;
  ELSIF (_r.itemsite_warrpurc) THEN
    RAISE NOTICE 'Auto create for lot/serial can not be used on items sites with purchase warranty';
    RETURN -1;
  ELSIF (_r.itemsite_lsseq_id IS NULL) THEN
    RAISE NOTICE 'Auto create for lot/serial requires a lot/serial sequence id';
    RETURN -1;
  END IF;

  _itemlocseries := NEXTVAL('itemloc_series_seq');

  -- Process
  IF (_r.itemsite_controlmethod = 'L') THEN
    -- Create lot number
    PERFORM createlotserial(itemlocdist_itemsite_id,fetchlsnumber(_r.itemsite_lsseq_id),
                           _itemlocseries, 'I', NULL,itemlocdist_id, itemlocdist_qty, 
                           startOfTime(), NULL)
    FROM itemlocdist 
    WHERE (itemlocdist_id=pItemlocdistId);
  ELSE
    -- Create serial number for each one
    FOR _i IN 1.._r.itemlocdist_qty::integer
    LOOP
      PERFORM createlotserial(itemlocdist_itemsite_id,fetchlsnumber(_r.itemsite_lsseq_id),
                             _itemlocseries, 'I', NULL,itemlocdist_id, 1, 
                             startOfTime(), NULL)
      FROM itemlocdist 
      WHERE (itemlocdist_id=pItemlocdistId);
    END LOOP;
  END IF;

  RETURN _itemlocseries;

END;
$$ LANGUAGE 'plpgsql';
