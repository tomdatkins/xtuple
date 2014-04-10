CREATE OR REPLACE FUNCTION xtmfg.postOperation(pWooperid INTEGER,
                                               pQty NUMERIC,
                                               pIssueComponents BOOLEAN,
                                               pReceiveInventory BOOLEAN,
                                               pSuTime NUMERIC,
                                               pSuComplete BOOLEAN,
                                               pRnTime NUMERIC,
                                               pRnComplete BOOLEAN ) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  RETURN xtmfg.postOperation(pWooperid,
                             pQty,
                             pIssueComponents,
                             pReceiveInventory,
                             '',
                             pSuTime,
                             pSuComplete,
                             '',
                             pRnTime,
                             pRnComplete);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xtmfg.postOperation(pWooperid INTEGER,
                                               pQty NUMERIC,
                                               pIssueComponents BOOLEAN,
                                               pReceiveInventory BOOLEAN,
                                               pSuUser TEXT,
                                               pSuTime NUMERIC,
                                               pSuComplete BOOLEAN,
                                               pRnUser TEXT,
                                               pRnTime NUMERIC,
                                               pRnComplete BOOLEAN ) RETURNS INTEGER AS $$
BEGIN
  RETURN xtmfg.postOperation(pWooperid,
                             pQty,
                             pIssueComponents,
                             pReceiveInventory,
		             pSuUser,
                             pSuTime,
                             pSuComplete,
                             pRnUser,
                             pRnTime,
		             pRnComplete,
                             NULL,
                             now());
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xtmfg.postOperation(pWooperid INTEGER,
                                               pQty NUMERIC,
                                               pIssueComponents BOOLEAN,
                                               pReceiveInventory BOOLEAN,
                                               pSuUser TEXT,
                                               pSuTime NUMERIC,
                                               pSuComplete BOOLEAN,
                                               pRnUser TEXT,
                                               pRnTime NUMERIC,
                                               pRnComplete BOOLEAN,
                                               pWotcid INTEGER,
                                               pGlDistTS TIMESTAMP WITH TIME ZONE ) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _woNumber      TEXT;
  _womatl        RECORD;
  _result        INTEGER;
  _p             RECORD;
  _itemlocSeries INTEGER := 0;
  _locationid    INTEGER := -1;
  _itemlocdistid INTEGER;
  _useEmpl       BOOLEAN := FALSE;

BEGIN

  IF(fetchmetrictext('TimeAttendanceMethod') = 'Employee') THEN
    _useEmpl = true;
  END IF;
  
--  Insert the records recording this post and the required information
  IF (_useEmpl) THEN
  --  Employee postings
    INSERT INTO xtmfg.wooperpost
         (wooperpost_wo_id, wooperpost_seqnumber,
          wooperpost_username, wooperpost_timestamp,
          wooperpost_qty, wooperpost_su_emp_code, wooperpost_sutime,
          wooperpost_rn_emp_code, wooperpost_rntime, wooperpost_wotc_id,
          wooperpost_sucost,wooperpost_rncost,wooperpost_wooper_id)
    SELECT  wooper_wo_id, wooper_seqnumber,
          getEffectiveXtUser(),
          CASE WHEN (pGLDistTS::DATE=CURRENT_DATE) THEN CURRENT_TIMESTAMP
               ELSE pGlDistTS
          END,
          pQty, pSuUser, pSuTime, pRnUser, pRnTime, pWotcid,
          COALESCE(xtmfg.workCenterSetupCost(wooper_wrkcnt_id, pSuTime),0),
          COALESCE(xtmfg.workCenterRunCost(wooper_wrkcnt_id, pRnTime, pQty),0),
          pWooperid
       FROM xtmfg.wooper
      WHERE (wooper_id=pWooperid);
  ELSE
  -- Username postings  
    INSERT INTO xtmfg.wooperpost
         (wooperpost_wo_id, wooperpost_seqnumber,
          wooperpost_username, wooperpost_timestamp,
          wooperpost_qty, wooperpost_su_username, wooperpost_sutime,
          wooperpost_rn_username, wooperpost_rntime, wooperpost_wotc_id,
          wooperpost_sucost,wooperpost_rncost,wooperpost_wooper_id)
    SELECT  wooper_wo_id, wooper_seqnumber,
          getEffectiveXtUser(),
          CASE WHEN (pGLDistTS::DATE=CURRENT_DATE) THEN CURRENT_TIMESTAMP
               ELSE pGlDistTS
          END,
          pQty, pSuUser, pSuTime, pRnUser, pRnTime, pWotcid,
          COALESCE(xtmfg.workCenterSetupCost(wooper_wrkcnt_id, pSuTime),0),
          COALESCE(xtmfg.workCenterRunCost(wooper_wrkcnt_id, pRnTime, pQty),0),
          pWooperid
       FROM xtmfg.wooper
      WHERE (wooper_id=pWooperid);

  END IF;
   
-- Increase the qty receive by this wooper
  UPDATE xtmfg.wooper
  SET wooper_qtyrcv = (COALESCE(wooper_qtyrcv,0) + pQty)
  WHERE (wooper_id=pWooperid);

--  Make sure the W/O is at in-process status
  UPDATE wo
  SET wo_status='I'
  WHERE (wo_id=(SELECT wooper_wo_id FROM xtmfg.wooper WHERE wooper_id=pWooperid));

--  If requested, issue components
  IF (pIssueComponents) THEN
    FOR _p IN SELECT womatl_id, womatl_qtyiss + 
		     (CASE 
		       WHEN (womatl_qtywipscrap >  (womatl_qtyfxd + (wooper_qtyrcv * womatl_qtyper)) * womatl_scrap) THEN
                         (womatl_qtyfxd + (wooper_qtyrcv * womatl_qtyper)) * womatl_scrap
		       ELSE 
		         womatl_qtywipscrap 
		      END) AS consumed,
		     (womatl_qtyfxd + (wooper_qtyrcv * womatl_qtyper)) * (1 + womatl_scrap) AS expected
	      FROM womatl, wo, itemsite, item, xtmfg.wooper
	      WHERE ((womatl_issuemethod IN ('L', 'M'))
		AND  (womatl_wooper_id=pWooperid)
		AND  (wooper_id=womatl_wooper_id)
		AND  (womatl_wo_id=wo_id)
		AND  (womatl_itemsite_id=itemsite_id)
		AND  (itemsite_item_id=item_id)) LOOP

      -- Don't issue more than should have already been consumed at this point
      IF (noNeg(_p.expected - _p.consumed) > 0) THEN
        SELECT issueWoMaterial(_p.womatl_id, noNeg(_p.expected - _p.consumed), _itemlocSeries) INTO _itemlocSeries; 

        UPDATE womatl
        SET womatl_issuemethod='L'
        WHERE ( (womatl_issuemethod='M')
         AND (womatl_id=_p.womatl_id) );       
        END IF;
			     
    END LOOP;
  END IF;

--  Post Setup Time
  SELECT xtmfg.postSutime(pWooperid, pSuTime, pSuComplete, pGlDistTS) INTO _result;

--  Post Run Time
  SELECT xtmfg.postRntime(pWooperid, pRnTime, pRnComplete, pQty, pGlDistTS) INTO _result;

--  If requested, receive inventory
  IF (pReceiveInventory) THEN
    SELECT xtmfg.postProduction( wooper_wo_id, pQty,
                                 FALSE, FALSE, _itemlocSeries,
                                 pSuUser, pRnUser, pGlDistTS, pWotcid ) INTO _itemlocSeries
    FROM xtmfg.wooper
    WHERE (wooper_id=pWooperid);

    -- If the next operation location or final location, if this is the last operation,
    -- has a value set then we want to pre-distribute the inventory to that location
    -- so the user only has to click post.

    -- Find the next operation location record.
    SELECT b.wooper_wip_location_id INTO _locationid
      FROM xtmfg.wooper AS a, xtmfg.wooper AS b
     WHERE ((a.wooper_id=pWooperid)
       AND  (b.wooper_wo_id=a.wooper_wo_id)
       AND  (b.wooper_seqnumber > a.wooper_seqnumber))
     ORDER BY b.wooper_seqnumber
     LIMIT 1;
    -- If we didn't find a record then it must be the last on in the list
    -- so get the wip location from the boohead
    IF ( NOT FOUND ) THEN
      SELECT boohead_final_location_id INTO _locationid
        FROM wo, xtmfg.wooper, xtmfg.booitem, xtmfg.boohead
       WHERE ((boohead_item_id=booitem_item_id)
         AND  (wooper_booitem_id=booitem_id)
         AND  (wooper_wo_id=wo_id)
         AND  (wooper_id=pWooperid))
       LIMIT 1;
      -- If we still haven't found anything set the variable to a known value
      IF ( NOT FOUND ) THEN
        _locationid := -1;
      END IF;
    END IF;

    -- Make sure we have a valid location
    IF ( _locationid <> -1 ) THEN
      -- find the itemlocdist record that we want to distribute to
      -- We ignore records where lotserial information is required
      -- and if we can't find it then it's either not there or in a
      -- state that we are ignoring because we can't reasonably handle
      SELECT itemlocdist_id INTO _itemlocdistid
        FROM xtmfg.wooper, wo, itemlocdist
       WHERE ((itemlocdist_itemsite_id=wo_itemsite_id)
         AND  (itemlocdist_distlotserial=false)
         AND  (wooper_wo_id=wo_id)
         AND  (itemlocdist_series=_itemlocSeries)
         AND  (wooper_id=pWooperid));
      IF ( FOUND ) THEN
        SELECT location_id INTO _result
          FROM itemlocdist, location, itemsite
         WHERE ((itemlocdist_itemsite_id=itemsite_id)
           AND  (itemsite_loccntrl)
           AND  (itemsite_Warehous_id=location_warehous_id)
           AND  (validLocation(location_id, itemsite_id))
           AND  (itemlocdist_id=_itemlocdistid)
           AND  (location_id=_locationid));
        -- If we found a record then we know the location we want to pre-distribute
        -- to is valid for this transaction so lets go ahead and create the record
        IF ( FOUND ) THEN
          INSERT INTO itemlocdist
                (itemlocdist_itemlocdist_id,
                 itemlocdist_source_type, itemlocdist_source_id,
                 itemlocdist_qty, itemlocdist_ls_id, itemlocdist_expiration)
          SELECT itemlocdist_id,
                 'L', _locationid,
                 pQty, itemlocdist_ls_id, endOfTime()
            FROM itemlocdist
           WHERE (itemlocdist_id=_itemlocdistid);

          -- If this succeeded then we can call distributeToLocations(_itemlocdistid)
          -- do the distribution but at this time we will not do so and allow the user
          -- to make changes if necessary
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
