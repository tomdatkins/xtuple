
CREATE OR REPLACE FUNCTION mrpReport(itemsiteid INTEGER,
                                     calitems TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _indexid INTEGER;
  _order   INTEGER;

  _runningavailability numeric(18,6);

  _qoh numeric(18,6);
  _allocations numeric(18,6);
  _orders numeric(18,6);
  _availability numeric(18,6);
  _firmed numeric(18,6);
  _firmedavailability numeric(18,6);
  
  _pstart timestamp;
  _pend timestamp;

  rec RECORD;
BEGIN
  _indexid := (SELECT NEXTVAL('misc_index_seq'));
  _order := 0;

  FOR rec IN EXECUTE 'SELECT qtyNetable(itemsite_id) as initialqoh, '
                   ||'       pstart, pend, '
                   ||'       qtyAllocated(itemsite_id, pstart, pend) AS allocations, '
                   ||'       qtyOrdered(  itemsite_id, pstart, pend) AS orders, '
                   ||'       qtyFirmed(   itemsite_id, pstart, pend) AS firmedorders '
                   ||'  FROM itemsite, (SELECT findPeriodStart(rcalitem_id) as pstart, '
                   ||'                         findPeriodEnd(rcalitem_id) as pend '
                   ||'                    FROM rcalitem '
                   ||'                   WHERE (rcalitem_id in (' || _calitems || ')) '
                   ||'                  UNION '
                   ||'                  SELECT findPeriodStart(acalitem_id) as pstart, '
                   ||'                         findPeriodEnd(acalitem_id) as pend '
                   ||'                    FROM acalitem '
                   ||'                   WHERE (acalitem_id in (' || _calitems || ')) '
                   ||'                  ) AS dates '
                   ||' WHERE (itemsite_id=' || _itemsiteid || ') '
                   ||'ORDER BY dates.pstart' LOOP
    IF _order = 0 THEN
        _runningavailability := rec.initialqoh;
        IF _runningavailability IS NULL THEN
          _runningavailability := 0;
        END IF;
    END IF;

    _pstart := rec.pstart;
    _pend := rec.pend;

    _qoh := _runningavailability;
    _allocations := rec.allocations;
    _orders := rec.orders;

    _runningavailability := _runningavailability - rec.allocations + rec.orders;

    _availability := _runningavailability;
    _firmed := rec.firmedorders;
    if _firmed IS NULL THEN
      _firmed := 0;
    END IF;
    _firmedavailability := _runningavailability + _firmed;

    insert into mpsmrpwork (mpsmrpwork_set_id, mpsmrpwork_order,
                            mpsmrpwork_startdate, mpsmrpwork_enddate,
                            mpsmrpwork_qoh, mpsmrpwork_allocations,
                            mpsmrpwork_orders, mpsmrpwork_availability,
                            mpsmrpwork_firmed, mpsmrpwork_firmedavailability)
                    values (_indexid, _order, _pstart, _pend, _qoh,
                            _allocations, _orders, _availability,
                            _firmed, _firmedavailability);

    _order := _order + 1;
  END LOOP;

  RETURN _indexid;
END;
$$ LANGUAGE plpgsql;

