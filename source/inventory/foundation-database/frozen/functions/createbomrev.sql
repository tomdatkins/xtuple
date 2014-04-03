
CREATE OR REPLACE FUNCTION createBomRev(INTEGER, TEXT) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pRevision ALIAS FOR $2;
  _check INTEGER;
  _oldrevid INTEGER;
  _newrevid INTEGER;
  _bomitemid INTEGER;
  _r RECORD;
  _test INTEGER;

BEGIN
  --Check if revsion control enabled
  IF (NOT fetchMetricBool('RevControl')) THEN
    RETURN -2;
  END IF;

  --Get active revision
  SELECT getActiveRevId('BOM',pItemid) INTO _oldrevid;

  --Create Revision Record
  SELECT NEXTVAL('rev_rev_id_seq') INTO _newrevid;

  INSERT INTO rev (rev_id,rev_number,rev_status,rev_target_type,rev_target_id,rev_date,rev_effective,rev_expires) 
  VALUES (_newrevid,UPPER(pRevision),'P','BOM',pItemid,current_date,startoftime(),endoftime());


  --Update/Insert new bom records
  IF (_oldrevid = -1) THEN
    UPDATE rev SET rev_status = 'A' WHERE (rev_id=_newrevid);
    SELECT bomhead_id INTO _test
    FROM bomhead
    WHERE (bomhead_item_id=pItemid);
    IF (FOUND) THEN
      UPDATE bomhead SET bomhead_rev_id=_newrevid,bomhead_revision=UPPER(pRevision),bomhead_revisiondate=current_date
      WHERE ((bomhead_item_id=pItemid) AND (bomhead_rev_id=-1));
    ELSE
      INSERT INTO bomhead (bomhead_item_id,bomhead_rev_id,bomhead_revision,bomhead_revisiondate)
        VALUES (pItemid,_newrevid,UPPER(pRevision),current_date);
    END IF;
    UPDATE bomitem SET bomitem_rev_id=_newrevid 
    WHERE ((bomitem_parent_item_id=pItemid) AND (bomitem_rev_id=-1));
    UPDATE wo SET wo_bom_rev_id=_newrevid
    FROM itemsite
    WHERE ((wo_itemsite_id=itemsite_id)
    AND (itemsite_item_id=pItemid));
  ELSE
    INSERT INTO bomhead (bomhead_item_id,bomhead_serial,bomhead_docnum,bomhead_revision,bomhead_revisiondate,bomhead_batchsize,bomhead_requiredqtyper,bomhead_rev_id)
    SELECT bomhead_item_id,bomhead_serial,bomhead_docnum,UPPER(pRevision),current_date,bomhead_batchsize,bomhead_requiredqtyper,_newrevid
    FROM bomhead
    WHERE (bomhead_rev_id=_oldrevid);

    FOR _r IN SELECT bomitem_id, bomitem_seqnumber, bomitem_item_id,
                   bomitem_uom_id, bomitem_qtyfxd, bomitem_qtyper, bomitem_scrap,
                   bomitem_expires, bomitem_ecn, bomitem_schedatwooper,
                   bomitem_createwo, bomitem_issuemethod, bomitem_subtype,
                   bomitem_uom_id, bomitem_booitem_seq_id, bomitem_notes, bomitem_ref,
                   bomitem_char_id, bomitem_value
              FROM bomitem(pItemId,_oldrevid)
              WHERE (bomitem_expires>CURRENT_DATE) LOOP

      SELECT NEXTVAL('bomitem_bomitem_id_seq') INTO _bomitemid;

      INSERT INTO bomitem
      ( bomitem_id, bomitem_parent_item_id, bomitem_seqnumber, bomitem_item_id,
        bomitem_uom_id, bomitem_qtyfxd, bomitem_qtyper, bomitem_scrap,
        bomitem_booitem_seq_id,
        bomitem_effective, bomitem_expires, bomitem_ecn, bomitem_schedatwooper,
        bomitem_createwo, bomitem_issuemethod, bomitem_moddate, bomitem_subtype,
        bomitem_rev_id, bomitem_notes, bomitem_ref,
        bomitem_char_id, bomitem_value )
      VALUES
       ( _bomitemid, pItemid, _r.bomitem_seqnumber, _r.bomitem_item_id,
       _r.bomitem_uom_id, _r.bomitem_qtyfxd, _r.bomitem_qtyper, _r.bomitem_scrap,
       _r.bomitem_booitem_seq_id,
       CURRENT_DATE, _r.bomitem_expires, _r.bomitem_ecn, _r.bomitem_schedatwooper,
       _r.bomitem_createwo, _r.bomitem_issuemethod, CURRENT_DATE, _r.bomitem_subtype,
       _newrevid, _r.bomitem_notes, _r.bomitem_ref,
       _r.bomitem_char_id, _r.bomitem_value);

      INSERT INTO bomitemsub
      ( bomitemsub_bomitem_id, bomitemsub_item_id,
      bomitemsub_uomratio, bomitemsub_rank )
      SELECT _bomitemid, bomitemsub_item_id,
           bomitemsub_uomratio, bomitemsub_rank
      FROM bomitemsub
      WHERE (bomitemsub_bomitem_id=_r.bomitem_id);

    END LOOP;
  END IF;

  RETURN _newrevid;
END;
$$ LANGUAGE 'plpgsql';
