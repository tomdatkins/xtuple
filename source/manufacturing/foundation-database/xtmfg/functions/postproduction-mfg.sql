CREATE OR REPLACE FUNCTION xtmfg.postProduction(pWoid INTEGER,
                                                 pQty NUMERIC,
                                                 pBackflush BOOLEAN,
                                                 pBackflushOperations BOOLEAN,
                                                 pItemlocSeries INTEGER,
                                                 pSuUser TEXT,
                                                 pRnUser TEXT,
                                                 pGlDistTS TIMESTAMP WITH TIME ZONE,
                                                 pWotcid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _brddistid     INTEGER;
  _itemtype      TEXT;
  _itemlocSeries INTEGER;
  _parentQty     NUMERIC;
  _orderQty      NUMERIC;
  _r             RECORD;
  _rnTime        NUMERIC;
  _suTime        NUMERIC;
  _tmpint        INTEGER;
  _wooperitem    RECORD;

  _useEmpl	  BOOLEAN := FALSE;
  
  _debug         BOOLEAN := false;

BEGIN

-- Employee versus Username setting
  IF(fetchmetrictext('TimeAttendanceMethod') = 'Employee') THEN
    _useEmpl = true;
  END IF;
  
  SELECT roundQty(item_fractional, pQty), wo_qtyord, item_type INTO _parentQty, _orderQty, _itemtype
  FROM wo
       JOIN itemsite ON (wo_itemsite_id=itemsite_id)
       JOIN item     ON (itemsite_item_id=item_id)
  WHERE (wo_id=pWoid);

  IF (pBackflushOperations) THEN
    FOR _wooperitem IN SELECT wooper_id, wooper_sutime,
                              wooper_suconsumed, wooper_sucomplete,
                              wooper_rncomplete, wooper_rnqtyper,
                              wooper_invproduomratio,
                              wooper_wo_id, wooper_seqnumber,
                              wooper_wrkcnt_id
                       FROM xtmfg.wooper
                       WHERE ((wooper_wo_id=pWoid)
                       AND (NOT wooper_rncomplete))
                       ORDER BY wooper_seqnumber LOOP

      --  Backflush any remaining Setup Time
      IF ( (NOT _wooperitem.wooper_sucomplete) AND
           ( noNeg(_wooperitem.wooper_sutime -
                   _wooperitem.wooper_suconsumed ) > 0) ) THEN
        _suTime := _wooperitem.wooper_sutime;
        _tmpint := xtmfg.postSutime(_wooperitem.wooper_id, _suTime, TRUE, COALESCE(pSuUser,''), pGlDistTS);
        IF (_tmpint < 0) THEN
          IF _debug THEN RAISE NOTICE 'postsutime failed'; END IF;
          RETURN _tmpint;
        END IF;
      END IF;

      --  Backflush Run Time for the reported Qty.
      IF ( (NOT _wooperitem.wooper_rncomplete) AND
           (_wooperitem.wooper_invproduomratio <> 0) ) THEN

        _rnTime := (_wooperitem.wooper_rnqtyper /
                    _wooperitem.wooper_invproduomratio * _parentQty);
        _tmpint := xtmfg.postRntime(_wooperitem.wooper_id, _rnTime, FALSE, pQty, COALESCE(pRnUser,''), pGlDistTS);
        IF (_tmpint < 0) THEN
          IF _debug THEN RAISE NOTICE 'postrntime failed'; END IF;
          RETURN _tmpint;
        END IF;

        UPDATE xtmfg.wooper
        SET wooper_qtyrcv = (COALESCE(wooper_qtyrcv,0) + _parentQty),
            wooper_rncomplete = (COALESCE(wooper_qtyrcv,0) + _parentQty >= _orderQty)
        WHERE (wooper_id=_wooperitem.wooper_id);

      END IF;

      IF (_useEmpl) THEN
        INSERT INTO xtmfg.wooperpost
             (wooperpost_wo_id, wooperpost_seqnumber,
              wooperpost_username, wooperpost_timestamp,
              wooperpost_qty, wooperpost_su_emp_code, wooperpost_sutime,
              wooperpost_rn_emp_code, wooperpost_rntime, 
              wooperpost_sucost, wooperpost_rncost,
              wooperpost_wooper_id, wooperpost_wotc_id)
        VALUES (_wooperitem.wooper_wo_id, _wooperitem.wooper_seqnumber,
              getEffectiveXtUser(), pGlDistTS,
              _parentQty, pSuUser, _suTime, pRnUser, _rnTime, 
              COALESCE(xtmfg.workCenterSetupCost(_wooperitem.wooper_wrkcnt_id, _suTime),0),
              COALESCE(xtmfg.workCenterRunCost(_wooperitem.wooper_wrkcnt_id, _rnTime, pQty),0),
              _wooperitem.wooper_id, pWotcid);
      ELSE
        INSERT INTO xtmfg.wooperpost
             (wooperpost_wo_id, wooperpost_seqnumber,
              wooperpost_username, wooperpost_timestamp,
              wooperpost_qty, wooperpost_su_username, wooperpost_sutime,
              wooperpost_rn_username, wooperpost_rntime, 
              wooperpost_sucost, wooperpost_rncost,
              wooperpost_wooper_id, wooperpost_wotc_id)
        VALUES (_wooperitem.wooper_wo_id, _wooperitem.wooper_seqnumber,
              getEffectiveXtUser(), pGlDistTS,
              _parentQty, pSuUser, _suTime, pRnUser, _rnTime, 
              COALESCE(xtmfg.workCenterSetupCost(_wooperitem.wooper_wrkcnt_id, _suTime),0),
              COALESCE(xtmfg.workCenterRunCost(_wooperitem.wooper_wrkcnt_id, _rnTime, pQty),0),
              _wooperitem.wooper_id, pWotcid);

      END IF; -- User vs Employee

    END LOOP;
  END IF;

  -- create/update brddist records for co- or by-products of breeder parents
  IF (_itemtype='B') THEN
    FOR _r IN SELECT cs.itemsite_id AS c_itemsite_id,
                     bbomitem_qtyper, (bbomitem_qtyper * _parentQty) AS qty
              FROM xtmfg.bbomitem, itemsite AS cs, itemsite AS ps, wo
              WHERE ((bbomitem_parent_item_id=ps.itemsite_item_id)
                 AND (bbomitem_item_id=cs.itemsite_item_id)
                 AND (wo_itemsite_id=ps.itemsite_id)
                 AND (cs.itemsite_warehous_id=ps.itemsite_warehous_id)
                 AND (wo_id=pWoid) ) LOOP

      SELECT brddist_id INTO _brddistid
      FROM xtmfg.brddist
      WHERE ((NOT brddist_posted)
         AND (brddist_wo_id=pWoid)
         AND (brddist_itemsite_id=_r.c_itemsite_id) );
      IF (FOUND) THEN
        UPDATE xtmfg.brddist
        SET brddist_wo_qty=(brddist_wo_qty + _parentQty),
            brddist_qty = (brddist_qty + _r.qty)
        WHERE (brddist_id=_brddistid);
      ELSE
        INSERT INTO xtmfg.brddist
        ( brddist_wo_id, brddist_wo_qty, brddist_itemsite_id,
          brddist_stdqtyper, brddist_qty, brddist_posted )
        VALUES
        ( pWoid, _parentQty, _r.c_itemsite_id,
          _r.bbomitem_qtyper, _r.qty, FALSE );
      END IF;

    END LOOP;
  END IF;

  _itemlocSeries := postProduction(pWoid, pQty, pBackflush, pItemlocSeries, pGlDistTS);
  IF (_itemlocSeries < 0) THEN
    IF _debug THEN RAISE NOTICE 'base postProduction() failed'; END IF;
    RETURN _itemlocSeries;
  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
