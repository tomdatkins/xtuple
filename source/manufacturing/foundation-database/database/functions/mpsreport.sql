
CREATE OR REPLACE FUNCTION xtmfg.mpsReport(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _itemsiteid ALIAS FOR $1;
  _calitems   ALIAS FOR $2;

  _indexid INTEGER;
  _order   INTEGER;

  _runningavailability numeric(18,6);
  _safetystock numeric(18,6);

  _forecasted numeric(18,6);
  _actual numeric(18,6);
  _demand numeric(18,6);
  _topromise numeric(18,6);
  _qoh numeric(18,6);
  _allocations numeric(18,6);
  _orders numeric(18,6);
  _availability numeric(18,6);
  _planned numeric(18,6);
  _plannedavailability numeric(18,6);
  _available numeric(18,6);
  
  _pstart timestamp;
  _pend timestamp;

  rec RECORD;
BEGIN
  _indexid := (SELECT NEXTVAL('misc_index_seq'));
  _order := 0;

  FOR rec IN EXECUTE 'SELECT itemsite_qtyonhand as initialqoh, '
                   ||'       itemsite_safetystock, '
                   ||'       pstart, pend, '
                   ||'       qtyAllocated(itemsite_id, pstart, pend) AS allocations, '
                   ||'       qtyOrdered(  itemsite_id, pstart, pend) AS orders, '
                   ||'       qtyPlanned(  itemsite_id, pstart, pend) AS planned, '
                   ||'       xtmfg.qtyForecasted(itemsite_id, pstart, pend) AS forecast, '
                   ||'       (pstart < (CURRENT_DATE + itemsite_mps_timefence)) AS inside '
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

    IF (_order = 0) THEN
      _forecasted := rec.forecast;
      _actual := rec.allocations;
      IF ( (_forecasted > _actual) AND (NOT rec.inside) ) THEN
        _demand := _forecasted;
      ELSE
        _demand := _actual;
      END IF;
      _orders := rec.orders;
      _planned := COALESCE(rec.planned, 0.0);
      _runningavailability := (COALESCE(rec.initialqoh, 0.0) - _demand + _orders + _planned);
      _availability := _runningavailability - _planned;
      _topromise := (COALESCE(rec.initialqoh, 0.0) + _orders + _planned - _actual);
    ELSE
      _forecasted := rec.forecast;
      _actual := rec.allocations;
      IF ( (_forecasted > _actual) AND (NOT rec.inside) ) THEN
        _demand := _forecasted;
      ELSE
        _demand := _actual;
      END IF;
      _orders := rec.orders;
      _planned := COALESCE(rec.planned, 0.0);
      _runningavailability := (_runningavailability - _demand + _orders + _planned);
      _availability := (_runningavailability - _planned);
      _topromise := (_orders + _planned);
    END IF;

    _pstart := rec.pstart;
    _pend := rec.pend;

    insert into mpsmrpwork (mpsmrpwork_set_id, mpsmrpwork_order,
                            mpsmrpwork_startdate, mpsmrpwork_enddate,
                            mpsmrpwork_qoh, mpsmrpwork_allocations,
                            mpsmrpwork_orders, mpsmrpwork_availability,
                            mpsmrpwork_planned, mpsmrpwork_plannedavailability,
                            mpsmrpwork_firmed, mpsmrpwork_firmedavailability,
                            mpsmrpwork_available)
                    values (_indexid, _order,
                            _pstart, _pend,
                            _runningavailability, _actual,
                            _orders, _availability,
                            _planned, _topromise,
                            _forecasted, 0.0,
                            0.0);

    _order := _order + 1;
  END LOOP;

  RETURN _indexid;
END;
$$ LANGUAGE 'plpgsql';

