CREATE OR REPLACE FUNCTION xtmfg.correctProduction(INTEGER, NUMERIC, BOOLEAN, BOOLEAN, INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoid                ALIAS FOR $1;
  pQty                 ALIAS FOR $2;
  pBackflush           ALIAS FOR $3;
  pBackflushOperations ALIAS FOR $4;
  pItemlocSeries       ALIAS FOR $5;
  pGlDistTS		ALIAS FOR $6;
  _itemlocSeries       INTEGER := pItemlocSeries;
  _itemtype            TEXT;
  _parentQty           NUMERIC;
  _rntime              NUMERIC;
  _tmpresult           INTEGER;
  _wooperitem          RECORD;
  _debug               BOOLEAN := FALSE;

BEGIN
  IF (_debug) THEN
    RAISE NOTICE 'xtmfg.correctProduction';
    RAISE NOTICE 'pWoid=%', pWoid;
    RAISE NOTICE 'pQty=%', pQty;
    RAISE NOTICE 'pBackflush=%', pBackflush;
    RAISE NOTICE 'pBackflushOperations=%', pBackflushOperations;
    RAISE NOTICE 'pItemlocSeries=%', pItemlocSeries;
    RAISE NOTICE 'pGLDistTS=%', pGLDistTS;
  END IF;

  SELECT item_type, roundQty(item_fractional, pQty) INTO _itemtype, _parentQty
    FROM wo, itemsite, item
   WHERE ((wo_itemsite_id=itemsite_id)
      AND (itemsite_item_id=item_id)
      AND (wo_id=pWoid));

  IF ( _itemtype = 'B') THEN
    RETURN -2;
  END IF;

  IF (pBackflushOperations) THEN

    FOR _wooperitem IN SELECT *,
                              --  If this is a complete return reverse backflush Setup Time for the reported Qty.
                              CASE WHEN (COALESCE(wooper_qtyrcv, 0.0) = _parentQty) THEN (wooper_sutime * -1.0)
                                   ELSE 0.0
                              END AS sutime,
                              (wooper_rnqtyper / wooper_invproduomratio * _parentQty * -1.0) AS rntime 
                       FROM xtmfg.wooper
                       WHERE (wooper_wo_id=pWoid)
                       ORDER BY wooper_seqnumber LOOP

        IF (_debug) THEN
          RAISE NOTICE 'wooper_id=%', _wooperitem.wooper_id;
        END IF;
        IF (_wooperitem.sutime < 0.0) THEN
          _tmpresult := xtmfg.postSutime(_wooperitem.wooper_id,
                                         _wooperitem.sutime, TRUE, pGlDistTS);
          IF (_debug) THEN
            RAISE NOTICE 'setup result=%', _tmpresult;
          END IF;
        END IF;

        --  Reverse backflush Run Time for the reported Qty.
        _tmpresult := xtmfg.postRntime(_wooperitem.wooper_id, _wooperitem.rntime, TRUE,
                                       _wooperitem.wooper_invproduomratio * _parentQty * -1, pGlDistTS);

        IF (_debug) THEN
          RAISE NOTICE 'runtime result=%', _tmpresult;
        END IF;
        UPDATE xtmfg.wooper
        SET wooper_qtyrcv = (COALESCE(wooper_qtyrcv,0) - _parentQty)
        WHERE (wooper_id=_wooperitem.wooper_id);

        INSERT INTO xtmfg.wooperpost
               (wooperpost_wo_id, wooperpost_seqnumber,
                wooperpost_username, wooperpost_timestamp,
                wooperpost_qty, wooperpost_su_username, wooperpost_sutime,
                wooperpost_rn_username, wooperpost_rntime, 
                wooperpost_sucost, wooperpost_rncost,
                wooperpost_wooper_id, wooperpost_wotc_id)
        VALUES (_wooperitem.wooper_wo_id, _wooperitem.wooper_seqnumber,
                getEffectiveXtUser(), pGlDistTS,
                _parentQty, NULL, _wooperitem.sutime, NULL, _wooperitem.rntime, 
                COALESCE(xtmfg.workCenterSetupCost(_wooperitem.wooper_wrkcnt_id, _wooperitem.sutime),0),
                COALESCE(xtmfg.workCenterRunCost(_wooperitem.wooper_wrkcnt_id, _wooperitem.rntime, pQty),0),
                _wooperitem.wooper_id, NULL);
    END LOOP;

  END IF;

  _itemlocseries = public.correctProduction(pWoid, pQty, pBackflush, pItemlocSeries, pGlDistTS);

  IF (_itemlocseries < 0) THEN
    RETURN _itemlocseries;
  ELSIF (_itemlocseries = 0) THEN
    SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
