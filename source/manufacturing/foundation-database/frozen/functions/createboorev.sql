
CREATE OR REPLACE FUNCTION xtmfg.createBooRev(INTEGER, TEXT) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pRevision ALIAS FOR $2;
  _check INTEGER;
  _oldrevid INTEGER;
  _newrevid INTEGER;
  _newbooitemid INTEGER;
  _r RECORD;
  _test INTEGER;

BEGIN 
  --Check if revsion control enabled
  IF (NOT fetchMetricBool('RevControl')) THEN
    RETURN -2;
  END IF;

  --Get active revision
  SELECT getActiveRevId('BOO',pItemid) INTO _oldrevid;

  --Create Revision Record
  SELECT NEXTVAL('rev_rev_id_seq') INTO _newrevid;

  INSERT INTO rev (rev_id,rev_number,rev_status,rev_target_type,rev_target_id,rev_date,rev_effective,rev_expires) 
  VALUES (_newrevid,UPPER(pRevision),'P','BOO',pItemid,current_date,startoftime(),endoftime());

  --Update/Insert new bom records
  IF (_oldrevid = -1) THEN
    UPDATE rev SET rev_status = 'A' WHERE (rev_id=_newrevid);
    SELECT boohead_id INTO _test
    FROM xtmfg.boohead
    WHERE (boohead_item_id=pItemid);
    IF (FOUND) THEN
    UPDATE boohead SET boohead_rev_id=_newrevid,boohead_revision=UPPER(pRevision),boohead_revisiondate=current_date
    WHERE ((boohead_item_id=pItemid) AND (boohead_rev_id=-1));
    ELSE
      INSERT INTO xtmfg.boohead (boohead_item_id,boohead_rev_id,boohead_revision,boohead_revisiondate)
        VALUES (pItemid,_newrevid,UPPER(pRevision),current_date);
    END IF;
    UPDATE xtmfg.booitem SET booitem_rev_id=_newrevid WHERE ((booitem_item_id=pItemid) AND (booitem_rev_id=-1));
    UPDATE wo SET wo_boo_rev_id=_newrevid
    FROM itemsite
    WHERE ((wo_itemsite_id=itemsite_id)
    AND (itemsite_item_id=pItemid));
  ELSE
    INSERT INTO xtmfg.boohead (boohead_item_id,boohead_serial_id,boohead_docnum,boohead_revision,boohead_revisiondate,
                boohead_leadtime,boohead_final_location_id,boohead_closewo,boohead_rev_id)
    SELECT boohead_item_id,boohead_serial_id,boohead_docnum,UPPER(pRevision),current_date,
           boohead_leadtime,boohead_final_location_id,boohead_closewo,_newrevid
    FROM xtmfg.boohead
    WHERE (boohead_rev_id=_oldrevid);

    FOR _r IN
    SELECT booitem.*
    FROM xtmfg.booitem(pItemid,_oldrevid)
    WHERE (booitem_expires>CURRENT_DATE) LOOP
      SELECT NEXTVAL('xtmfg.booitem_booitem_id_seq') INTO _newbooitemid;
      INSERT INTO xtmfg.booitem
      (booitem_id, booitem_item_id, booitem_effective, booitem_expires,
       booitem_seqnumber, booitem_wrkcnt_id, booitem_stdopn_id,
       booitem_descrip1, booitem_descrip2, booitem_toolref,
       booitem_sutime, booitem_sucosttype, booitem_surpt,
       booitem_rntime, booitem_rncosttype, booitem_rnrpt, booitem_rnqtyper,
       booitem_produom, booitem_invproduomratio,
       booitem_pullthrough, booitem_overlap,
       booitem_configtype, booitem_configid,
       booitem_issuecomp, booitem_rcvinv, booitem_instruc,
       booitem_execday, booitem_configflag, booitem_wip_location_id,
       booitem_rev_id,booitem_seq_id)
      VALUES
      (_newbooitemid, pItemid, _r.booitem_effective, _r.booitem_expires,
       _r.booitem_seqnumber, _r.booitem_wrkcnt_id, _r.booitem_stdopn_id,
       _r.booitem_descrip1, _r.booitem_descrip2, _r.booitem_toolref,
       _r.booitem_sutime, _r.booitem_sucosttype, _r.booitem_surpt,
       _r.booitem_rntime, _r.booitem_rncosttype, _r.booitem_rnrpt, _r.booitem_rnqtyper,
       _r.booitem_produom, _r.booitem_invproduomratio,
       _r.booitem_pullthrough, _r.booitem_overlap,
       _r.booitem_configtype, _r.booitem_configid,
       _r.booitem_issuecomp, _r.booitem_rcvinv, _r.booitem_instruc,
       _r.booitem_execday, _r.booitem_configflag, _r.booitem_wip_location_id,
       _newrevid, _r.booitem_seq_id);

      INSERT INTO xtmfg.booimage
      (booimage_booitem_id, booimage_image_id, booimage_purpose)
      SELECT _newbooitemid, booimage_image_id, booimage_purpose
      FROM xtmfg.booimage
      WHERE (booimage_booitem_id=_r.booitem_id);

    END LOOP;
  END IF;

  RETURN _newrevid;
END;
$$ LANGUAGE 'plpgsql';
