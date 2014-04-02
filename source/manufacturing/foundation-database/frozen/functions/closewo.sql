CREATE OR REPLACE FUNCTION xtmfg.closeWo(INTEGER, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  pPostMaterialVariances ALIAS FOR $2;
  pPostLaborVariances ALIAS FOR $3;

BEGIN
  RETURN xtmfg.closeWo(pWoid, pPostMaterialVariances, pPostLaborVariances, CURRENT_DATE);
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION xtmfg.closeWo(INTEGER, BOOLEAN, BOOLEAN, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  pPostMaterialVariances ALIAS FOR $2;
  pPostLaborVariances ALIAS FOR $3;
  pTransDate ALIAS FOR $4;
  _woNumber     TEXT;
  _result       INTEGER := 0;

BEGIN
  _result := closeWo(pWoid, pPostMaterialVariances, pTransDate);
  IF (_result < 0) THEN
    RETURN _result;
  END IF;

  SELECT formatWoNumber(pWoid) INTO _woNumber;

  -- variances are meaningless if qtyrcv == 0, so do not bother posting them
  IF ( ( SELECT wo_qtyrcv
         FROM wo
         WHERE (wo_id=pWoid) ) > 0 ) THEN

    IF (pPostLaborVariances) THEN
      INSERT INTO xtmfg.woopervar
      ( woopervar_number, woopervar_subnumber, woopervar_seqnumber, woopervar_posted,
        woopervar_parent_itemsite_id, woopervar_booitem_id, woopervar_wrkcnt_id,
        woopervar_qtyord, woopervar_qtyrcv,
        woopervar_stdsutime, woopervar_sutime,
        woopervar_stdrntime, woopervar_rntime )
      SELECT wo_number, wo_subnumber, wooper_seqnumber, pTransDate,
             wo_itemsite_id, wooper_booitem_id, wooper_wrkcnt_id,
             wo_qtyord, wo_qtyrcv,
             wooper_sutime, wooper_suconsumed,
             wooper_rntime, wooper_rnconsumed
      FROM wo, xtmfg.wooper
      WHERE ((wooper_wo_id=wo_id)
       AND (wo_id=pWoid));
    END IF;

  END IF;

  --  Post Breeder distribution variances for Breeder parent item if we received on the WO
  IF ( ( SELECT (item_type='B')
         FROM wo, itemsite, item
         WHERE ( (wo_itemsite_id=itemsite_id)
          AND (itemsite_item_id=item_id)
	  AND (wo_qtyrcv > 0)
          AND (wo_id=pWoid) ) ) ) THEN
    INSERT INTO xtmfg.brdvar
    ( brdvar_postdate, brdvar_wonumber, brdvar_parent_itemsite_id, brdvar_itemsite_id,
      brdvar_wo_qty, brdvar_stdqtyper, brdvar_actqtyper )
    SELECT pTransDate, _woNumber, wo_itemsite_id, brddist_itemsite_id,
           SUM(brddist_wo_qty), brddist_stdqtyper,
	   CASE WHEN (SUM(brddist_wo_qty)=0) THEN 'NaN' -- any qty is unexpected
	        ELSE (SUM(brddist_qty) / SUM(brddist_wo_qty))
	   END
    FROM xtmfg.brddist, wo
    WHERE ( (brddist_wo_id=wo_id)
     AND (brddist_wo_id=pWoid) )
    GROUP BY wo_itemsite_id, brddist_itemsite_id, brddist_stdqtyper;

    DELETE FROM xtmfg.brddist
    WHERE (brddist_wo_id=pWoid);
  END IF;

  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';
