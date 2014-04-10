
CREATE OR REPLACE FUNCTION xtmfg.postSutime(INTEGER, NUMERIC, BOOL, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWooperid ALIAS FOR $1;
  pTime ALIAS FOR $2;
  pComplete ALIAS FOR $3;
  pGlDistTS ALIAS FOR $4;

BEGIN

  RETURN xtmfg.postSutime(pWooperid, pTime, pComplete, '', pGlDistTS);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xtmfg.postSutime(INTEGER, NUMERIC, BOOL, TEXT, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWooperid ALIAS FOR $1;
  pTime ALIAS FOR $2;
  pComplete ALIAS FOR $3;
  pUser ALIAS FOR $4;
  pGlDistTS ALIAS FOR $5;
  _cost NUMERIC;

BEGIN

  --  If the passed time to post is negative, indicating that this is a correction,
  --  make sure that the time to correct is not greater than the time posted to
  --  this operation
  IF (pTime < 0) THEN
    IF ( SELECT (wooper_suconsumed < pTime)
         FROM xtmfg.wooper
         WHERE (wooper_id=pWooperid) ) THEN
      RETURN -1;
    END IF;
  END IF;

  --  Cache the cost for this post
  SELECT xtmfg.workCenterSetupCost(wooper_wrkcnt_id, pTime) INTO _cost
  FROM xtmfg.wooper
  WHERE (wooper_id=pWooperid);

  --  Distribute to G/L - debit WIP, credit DL&O
  PERFORM insertGLTransaction( 'W/O', 'WO', formatWoNumber(wo_id),
                               ('Post Setup Time ' || wooper_descrip1 || '/' || pUser || ' to Work Order'),
                               getPrjAccntId(wo_prj_id, costcat_laboroverhead_accnt_id), getPrjAccntId(wo_prj_id, costcat_wip_accnt_id), -1,
                               _cost, pGlDistTS::DATE )
  FROM xtmfg.wooper, wo, itemsite, costcat
  WHERE ( (wooper_wo_id=wo_id)
   AND (wo_itemsite_id=itemsite_id)
   AND (itemsite_costcat_id=costcat_id)
   AND (wooper_id=pWooperid) );

  IF (pTime < 0) THEN
    --  Post the correction
    UPDATE xtmfg.wooper
    SET wooper_suconsumed = (wooper_suconsumed + pTime)
    WHERE (wooper_id=pWooperid);

    IF (pComplete) THEN
      UPDATE xtmfg.wooper
      SET wooper_sucomplete=FALSE
      WHERE (wooper_id=pWooperid);
    END IF;

  ELSE
    --  The passed time is not negative, so post the time
    UPDATE xtmfg.wooper
    SET wooper_suconsumed = (wooper_suconsumed + pTime),
        wooper_sucomplete = pComplete
    WHERE (wooper_id=pWooperid);
  END IF;

  UPDATE wo
  SET wo_wipvalue = (wo_wipvalue + _cost),
      wo_postedvalue = (wo_postedvalue + _cost)
  FROM xtmfg.wooper
  WHERE ( (wooper_wo_id=wo_id)
   AND (wooper_id=pWooperid) );

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
