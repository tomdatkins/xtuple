
CREATE OR REPLACE FUNCTION xtmfg.correctOperationsPosting( INTEGER, NUMERIC,
                                                     BOOLEAN, BOOLEAN )
                           RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN
  RETURN correctOperationPosting($1, $2, $3, $3, false, NULL, NULL, false, NULL, NULL, now());
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION xtmfg.correctOperationsPosting( INTEGER, NUMERIC,
                                                     BOOLEAN, BOOLEAN,
                                                     BOOLEAN, NUMERIC, BOOLEAN,
                                                     BOOLEAN, NUMERIC, BOOLEAN, TIMESTAMP WITH TIME ZONE )
                           RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWooperid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pReturnComponents ALIAS FOR $3;
  pCorrectInventory ALIAS FOR $4;
  pCorrectSuTime ALIAS FOR $5;
  pSuTime ALIAS FOR $6;
  pSuComplete ALIAS FOR $7;
  pCorrectRnTime ALIAS FOR $8;
  pRnTime ALIAS FOR $9;
  pRnComplete ALIAS FOR $10;
  pGlDistTS ALIAS FOR $11;
  _womatl RECORD;
  _itemlocSeries INTEGER;
  _result INTEGER;
  _qtyfxd NUMERIC;

BEGIN

  _itemlocSeries := 0;

--  Make sure that the correction is not greater than the amount
--  received to this wooper
  IF ( SELECT (COALESCE(wooper_qtyrcv,0) < pQty)
       FROM xtmfg.wooper
       WHERE (wooper_id=pWooperid) ) THEN
    RETURN -1;
  END IF;

  --  Insert the records recording this post and the required information
  INSERT INTO xtmfg.wooperpost
         (wooperpost_wo_id, wooperpost_seqnumber,
          wooperpost_username, wooperpost_timestamp,
          wooperpost_qty, wooperpost_su_username, wooperpost_sutime,
          wooperpost_rn_username, wooperpost_rntime, wooperpost_wotc_id,
          wooperpost_sucost,wooperpost_rncost,wooperpost_wooper_id)
  SELECT  wooper_wo_id, wooper_seqnumber,
          getEffectiveXtUser(), pGlDistTS,
          pQty * -1,
          getEffectiveXtUser(), CASE WHEN(COALESCE(pCorrectSuTime,FALSE)=false) THEN 0 ELSE COALESCE(pSuTime,0) END,
          getEffectiveXtUser(), CASE WHEN(COALESCE(pCorrectRnTime,FALSE)=false) THEN 0 ELSE COALESCE(pRnTime,0) END,
          NULL,
          COALESCE(xtmfg.workCenterSetupCost(wooper_wrkcnt_id, pSuTime),0),
          COALESCE(xtmfg.workCenterRunCost(wooper_wrkcnt_id, pRnTime, pQty),0),
          pWooperid
     FROM xtmfg.wooper
    WHERE (wooper_id=pWooperid);

--  Decrease the qty received by this wooper
  UPDATE xtmfg.wooper
  SET wooper_qtyrcv = (COALESCE(wooper_qtyrcv,0) - pQty)
  WHERE (wooper_id=pWooperid);

--  If requested, return components
  IF (pReturnComponents) THEN
    FOR _womatl IN SELECT womatl_id, womatl_qtyfxd, womatl_qtyper, womatl_scrap, wooper_qtyrcv
                   FROM womatl JOIN wooper ON (womatl_wooper_id=wooper_id)
                   WHERE ( (womatl_issuemethod IN ('L', 'M'))
                    AND (womatl_wooper_id=pWooperid) ) LOOP

      -- If going back to beginning, unissue fixed qty as well
      IF (_womatl.wooper_qtyrcv-pQty > 0) THEN
        _qtyfxd := 0;
      ELSE
        _qtyfxd := _womatl.womatl_qtyfxd;
      END IF;

      IF ( (_qtyfxd + (pQty * _womatl.womatl_qtyper) * (1 + _womatl.womatl_scrap)) > 0) THEN
        SELECT returnWoMaterial( _womatl.womatl_id,
                                 (_qtyfxd + (pQty * _womatl.womatl_qtyper) * (1 + _womatl.womatl_scrap)),
                               _itemlocSeries, pGlDistTS ) INTO _itemlocSeries;
      END IF;
    END LOOP;
  END IF;

--  If requested, correct inventory posting
  IF (pCorrectInventory) THEN
    SELECT correctProduction( wooper_wo_id, pQty,
                              FALSE, FALSE, _itemlocSeries, pGlDistTS )
           INTO _itemlocSeries
    FROM xtmfg.wooper
    WHERE (wooper_id=pWooperid);
  END IF;

  IF (COALESCE(pCorrectSuTime)) THEN
    SELECT xtmfg.postSuTime(pWooperid, COALESCE(pSuTime,0), COALESCE(pSuComplete,FALSE), pGlDistTS) INTO _result;
  END IF;

  IF (COALESCE(pCorrectRnTime)) THEN
    SELECT xtmfg.postRnTime(pWooperid, COALESCE(pRnTime,0), COALESCE(pRnComplete,FALSE), pGlDistTS) INTO _result;
  END IF;

--  Post Run Time (This is only to capture per unit burden correction)
  SELECT xtmfg.postRntime(pWooperid, 0, FALSE, pQty, pGlDistTS) INTO _result;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
