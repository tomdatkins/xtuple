CREATE OR REPLACE FUNCTION xt.createqualityplanrevision(pPlanid integer, pRevision TEXT)
  RETURNS integer AS $$
DECLARE
 _np	INTEGER;
BEGIN

  INSERT INTO xt.qphead (qphead_code, qphead_descrip, qphead_qplantype_id,
         qphead_rev_number, qphead_rev_date, qphead_rev_status,
         qphead_notes)
    SELECT qphead_code, qphead_descrip, qphead_qplantype_id,
         pRevision, current_date, 'A',
         qphead_notes
    FROM xt.qphead 
    WHERE (qphead_id = pPlanid)     
    RETURNING qphead_id INTO _np;

  UPDATE xt.qphead SET qphead_rev_status = 'I'
  WHERE (qphead_id = pPlanid);

  INSERT INTO xt.qpitem (qpitem_qphead_id, qpitem_qspec_id)
    SELECT _np, qpitem_qspec_id
    FROM xt.qpitem
    WHERE (qpitem_qphead_id = pPlanid);

  INSERT INTO xt.qpheadass (qpheadass_qphead_id, qpheadass_item_id, 
           qpheadass_warehous_id, qpheadass_oper, qpheadass_prod, qpheadass_recv, 
           qpheadass_ship, qpheadass_testfreq, qpheadass_freqtype)
    SELECT _np, qpheadass_item_id, 
           qpheadass_warehous_id, qpheadass_oper, qpheadass_prod, qpheadass_recv, 
           qpheadass_ship, qpheadass_testfreq, qpheadass_freqtype
    FROM xt.qpheadass
    WHERE (qpheadass_qphead_id = pPlanid);
 
  RETURN _np;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION xt.createqualityplanrevision(integer, text)
  OWNER TO admin;
