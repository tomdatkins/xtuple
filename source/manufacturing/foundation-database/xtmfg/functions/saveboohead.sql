
CREATE OR REPLACE FUNCTION xtmfg.saveBooHead(integer,text,date,text,integer,boolean)
  RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pRevision ALIAS FOR $2;
  pRevisionDate ALIAS FOR $3;
  pDocumentNumber ALIAS FOR $4;
  pFinalLocation ALIAS FOR $5;
  pCloseWo ALIAS FOR $6;
  _seq INTEGER;
  _p RECORD;
  _revid INTEGER;
  
BEGIN

  IF (NOT fetchMetricBool('RevControl')) THEN -- Deal with BOO if Rev Control Turned off
    SELECT boohead_id INTO _seq
    FROM xtmfg.boohead 
    WHERE (boohead_item_id=pItemid);

    IF (NOT FOUND) THEN  -- No boohead exists
      _seq := NEXTVAL('xtmfg.boohead_boohead_id_seq');
      
      INSERT INTO xtmfg.boohead 
        (boohead_id,boohead_item_id,boohead_docnum,boohead_revision,
        boohead_revisiondate,boohead_final_location_id,boohead_closewo,boohead_rev_id)
        VALUES 
        (_seq,pItemid, pDocumentNumber, pRevision, pRevisionDate, pFinalLocation, pCloseWo,-1);   
    ELSE
      UPDATE xtmfg.boohead SET
        boohead_revision	   = pRevision,
        boohead_revisiondate	   = pRevisionDate,
        boohead_docnum		   = pDocumentNumber,
        boohead_final_location_id = pFinalLocation,
        boohead_closewo           = pCloseWo
      WHERE (boohead_id=_seq);
    END IF;
    
    RETURN _seq;
  ELSE  -- Deal with Revision Control
    IF (COALESCE(pRevision,'') = '' AND getActiveRevId('BOO',pItemid) != -1) THEN 
        RAISE EXCEPTION 'Revision Control records exist for item.  You must provide a new or existing revision number.';
    END IF;
    
    SELECT * INTO _p
    FROM xtmfg.boohead
      LEFT OUTER JOIN rev ON (boohead_rev_id=rev_id),
      item
    WHERE ((boohead_item_id=pItemid)
    AND (COALESCE(boohead_revision,'')=COALESCE(pRevision,''))
    AND (boohead_item_id=item_id));

    IF (NOT FOUND) THEN  -- This is a new boohead record
      IF LENGTH(pRevision) > 0 THEN  -- We need to create a revision record   
        SELECT xtmfg.createboorev(pItemid, pRevision) INTO _revid;
        
        UPDATE xtmfg.boohead SET
          boohead_revisiondate		= pRevisiondate,
          boohead_docnum		= pDocumentNumber,
          boohead_final_location_id	= pFinalLocation,
          boohead_closewo       	= pCloseWo
        WHERE (boohead_rev_id=_revid);
        
        SELECT boohead_id INTO _seq
        FROM xtmfg.boohead
        WHERE (boohead_rev_id=_revid);
        
        RETURN _seq;      
      ELSE  -- Just create a regular boo header record
       _seq := NEXTVAL('xtmfg.boohead_boohead_id_seq');
       
       INSERT INTO xtmfg.boohead 
        (boohead_id,boohead_item_id,boohead_docnum,boohead_revision,
        boohead_revisiondate,boohead_final_location_id,boohead_closewo,boohead_rev_id)
        VALUES 
        (_seq,pItemid, pDocumentNumber, pRevision, pRevisionDate, pFinalLocation, pCloseWo,-1);
        
        RETURN _seq;      
        
      END IF;
    ELSE  -- We need to update a record
      IF (_p.rev_status = 'I') THEN
        RAISE EXCEPTION 'Revision % for % is inactive.  Update not allowed.', _p.rev_number, _p.item_number;

      ELSIF (COALESCE(pRevision,'') = COALESCE(_p.boohead_revision,'')) THEN  -- No change, just update
        UPDATE xtmfg.boohead SET
          boohead_revisiondate		= pRevisiondate,
          boohead_docnum		= pDocumentNumber,
          boohead_final_location_id	= pFinalLocation,
          boohead_closewo		= pCloseWo
        WHERE (boohead_id=_p.boohead_id);

        RETURN _p.boohead_id;
        
      ELSE -- Need a new revision
        SELECT xtmfg.createboorev(pItemid, pRevision) INTO _revid;
        
        UPDATE xtmfg.boohead SET
          boohead_revisiondate		= pRevisiondate,
          boohead_docnum		= pDocumentNumber,
          boohead_final_location_id	= pFinalLocation,
          boohead_closewo		= pCloseWo
        WHERE (boohead_rev_id=_revid);

        SELECT boohead_id INTO _seq
        FROM xtmfg.boohead
        WHERE (boohead_rev_id=_revid);
        
        RETURN _seq;
      END IF;
    END IF;
  END IF;

  RETURN _seq;

END;
$$ LANGUAGE 'plpgsql';
