
CREATE OR REPLACE FUNCTION xtmfg.copyBOO(pSItemid INTEGER,
                                         pTItemid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  RETURN xtmfg.copyBOO(pSItemid, pTItemid, FALSE);

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION xtmfg.copyBOO(pSItemid INTEGER,
                                         pTItemid INTEGER,
                                         pCopyUsedAt BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  IF EXISTS(( SELECT 1
              FROM xtmfg.boohead
              WHERE (boohead_item_id=pTItemid) ) ) THEN
    RETURN -1;
  END IF;

--  Make sure that target booitems do not exist
  IF EXISTS(( SELECT 1
              FROM xtmfg.booitem
              WHERE (booitem_item_id=pTItemid) ) ) THEN
    RETURN -3;
  END IF;

  INSERT INTO xtmfg.boohead
  (boohead_item_id, boohead_serial_id, boohead_docnum,
   boohead_revision, boohead_revisiondate, boohead_leadtime,
   boohead_final_location_id, boohead_closewo)
  SELECT pTItemid, boohead_serial_id, boohead_docnum,
         NULL, NULL, boohead_leadtime,
         boohead_final_location_id, boohead_closewo
    FROM xtmfg.boohead
   WHERE ((boohead_item_id=pSItemid)
   AND (boohead_rev_id=getActiveRevId('BOO',pSItemid)));

  INSERT INTO xtmfg.booitem
  (booitem_item_id, booitem_effective, booitem_expires,
   booitem_seqnumber, booitem_wrkcnt_id, booitem_stdopn_id, booitem_opntype_id,
   booitem_descrip1, booitem_descrip2, booitem_toolref,
   booitem_sutime, booitem_sucosttype, booitem_surpt,
   booitem_rntime, booitem_rncosttype, booitem_rnrpt, booitem_rnqtyper,
   booitem_produom, booitem_invproduomratio,
   booitem_pullthrough, booitem_overlap,
   booitem_configtype, booitem_configid,
   booitem_issuecomp, booitem_rcvinv, booitem_instruc,
   booitem_execday, booitem_configflag, booitem_wip_location_id,booitem_seq_id)
  SELECT pTItemid, booitem_effective, booitem_expires,
         booitem_seqnumber, booitem_wrkcnt_id, booitem_stdopn_id, booitem_opntype_id,
         booitem_descrip1, booitem_descrip2, booitem_toolref,
         booitem_sutime, booitem_sucosttype, booitem_surpt,
         booitem_rntime, booitem_rncosttype, booitem_rnrpt, booitem_rnqtyper,
         booitem_produom, booitem_invproduomratio,
         booitem_pullthrough, booitem_overlap,
         booitem_configtype, booitem_configid,
         booitem_issuecomp, booitem_rcvinv, booitem_instruc,
         booitem_execday, booitem_configflag, booitem_wip_location_id,booitem_seq_id
  FROM xtmfg.booitem(pSItemid)
  WHERE (booitem_expires>CURRENT_DATE);

  RETURN pTItemid;

END;
$$ LANGUAGE plpgsql;
