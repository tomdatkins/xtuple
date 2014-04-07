CREATE OR REPLACE FUNCTION createRaCreditMemo(INTEGER,BOOLEAN) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRaid ALIAS FOR $1;
  pPost ALIAS FOR $2;
  _r RECORD;
  _cmheadid INTEGER;
  _check CHAR(1);
  _counter INTEGER;
  _ext NUMERIC;
  _result INTEGER;
  _amount NUMERIC;

BEGIN
  --Check for amount to post
  SELECT rahead_cust_id,rahead_creditmethod, 
    rahead_taxzone_id,calcRaDueAmt(pRaid) AS amount INTO _r
  FROM rahead WHERE (rahead_id=pRaid);
  IF (_r.amount=0) THEN
    RAISE EXCEPTION 'There is no amount to post for this return.';
  END IF;

  --Check to make sure credit memos can be auto numbered
  IF (_r.rahead_creditmethod = 'M') THEN 
    SELECT fetchMetricText('CMNumberGeneration') AS result INTO _check;
    IF (_check NOT IN ('A','O')) THEN
      RAISE EXCEPTION 'The system must be configured to allow Automatic or
              Override Credit Memo generation to Post a Credit Memo from a Return';
    END IF;
  END IF;

  _amount := _r.amount;
  _counter := 1;

--  Create Credit Memo Header
  SELECT nextval('cmhead_cmhead_id_seq') INTO _cmheadid;
  INSERT INTO cmhead (
    cmhead_id, cmhead_number, cmhead_posted, cmhead_invcnumber,
    cmhead_custponumber, cmhead_cust_id, cmhead_docdate,
    cmhead_shipto_id, cmhead_shipto_name, cmhead_shipto_address1,
    cmhead_shipto_address2, cmhead_shipto_address3,
    cmhead_shipto_city, cmhead_shipto_state, cmhead_shipto_zipcode,
    cmhead_salesrep_id, 
    cmhead_freight, 
    cmhead_misc, 
    cmhead_comments, cmhead_printed, cmhead_billtoname, cmhead_billtoaddress1,
    cmhead_billtoaddress2, cmhead_billtoaddress3, cmhead_billtocity,
    cmhead_billtostate, cmhead_billtozip, cmhead_hold, cmhead_commission,
    cmhead_misc_accnt_id, cmhead_misc_descrip, cmhead_rsncode_id,
    cmhead_curr_id, cmhead_gldistdate, cmhead_billtocountry,
    cmhead_shipto_country, cmhead_rahead_id, cmhead_taxzone_id, cmhead_prj_id
  )
  SELECT _cmheadid,fetchCmNumber(), false, -1,
    rahead_custponumber, rahead_cust_id, current_date,
    rahead_shipto_id, rahead_shipto_name, rahead_shipto_address1,
    rahead_shipto_address2, rahead_shipto_address3,
    rahead_shipto_city, rahead_shipto_state, rahead_shipto_zipcode,
    rahead_salesrep_id,
    CASE WHEN rahead_headcredited THEN 0 ELSE rahead_freight END,
    CASE WHEN rahead_headcredited THEN 0 ELSE rahead_misc END,
    rahead_notes, false, rahead_billtoname,rahead_billtoaddress1,
    rahead_billtoaddress2, rahead_billtoaddress3, rahead_billtocity,
    rahead_billtostate, rahead_billtozip, false, rahead_commission,
    rahead_misc_accnt_id, rahead_misc_descrip, rahead_rsncode_id,
    rahead_curr_id, NULL, rahead_billtocountry,
    rahead_shipto_country,rahead_id, rahead_taxzone_id, rahead_prj_id
  FROM rahead
  WHERE (rahead_id=pRaid);

--  Update Return Header about what was done
  UPDATE rahead SET 
   rahead_headcredited=true
  WHERE (rahead_id=pRaid);

--  Loop through to create credit memo lines
  FOR _r IN 
    SELECT rahead_curr_id,rahead_taxzone_id,rahead_timing, raitem.*,
      CASE WHEN (raitem_disposition='C' OR rahead_timing='I') THEN
        raitem_qtyauthorized-raitem_qtycredited
      ELSE
        raitem_qtyreceived-raitem_qtycredited
      END AS qtycredit
    FROM rahead
      LEFT OUTER JOIN taxzone ON (rahead_taxzone_id=taxzone_id),
      raitem
    WHERE ((rahead_id=pRaid)
    AND (rahead_id=raitem_rahead_id)
    AND (raitem_status = 'O')
    AND ((raitem_disposition = 'C' AND raitem_qtyauthorized > raitem_qtycredited)
    OR (raitem_disposition IN ('R','P') AND rahead_timing = 'I' AND raitem_qtyauthorized > raitem_qtycredited)
    OR (raitem_disposition IN ('R','P') AND rahead_timing = 'R' AND raitem_qtyreceived > raitem_qtycredited)))
  LOOP

    IF (_r.raitem_disposition = 'C' OR _r.rahead_timing = 'I') THEN
      _ext := ROUND(((_r.raitem_qtyauthorized - _r.raitem_qtycredited) * _r.raitem_qty_invuomratio) *  (_r.raitem_unitprice / _r.raitem_price_invuomratio),2);
      UPDATE raitem SET
        raitem_qtycredited=raitem_qtyauthorized,
        raitem_amtcredited=raitem_amtcredited+_ext
      WHERE (raitem_id=_r.raitem_id);
    ELSE
      _ext := ROUND(((_r.raitem_qtyreceived - _r.raitem_qtycredited) * _r.raitem_qty_invuomratio) *  (_r.raitem_unitprice / _r.raitem_price_invuomratio),2);
      UPDATE raitem SET
        raitem_qtycredited=raitem_qtyreceived,
        raitem_amtcredited=raitem_amtcredited+_ext
      WHERE (raitem_id=_r.raitem_id);
    END IF;
 
    INSERT INTO cmitem (cmitem_cmhead_id,cmitem_linenumber,cmitem_itemsite_id,cmitem_qtycredit,
        cmitem_qtyreturned, cmitem_updateinv,cmitem_unitprice,cmitem_comments,cmitem_rsncode_id,
        cmitem_taxtype_id,cmitem_qty_uom_id,cmitem_qty_invuomratio,cmitem_price_uom_id,
        cmitem_price_invuomratio,cmitem_raitem_id)
    VALUES (_cmheadid,_counter,_r.raitem_itemsite_id,_r.qtycredit,
        _r.raitem_qtyauthorized, false,_r.raitem_unitprice,_r.raitem_notes,_r.raitem_rsncode_id,
        _r.raitem_taxtype_id,_r.raitem_qty_uom_id,_r.raitem_qty_invuomratio,_r.raitem_price_uom_id,
        _r.raitem_price_invuomratio,_r.raitem_id);

    _counter := _counter + 1;
  END LOOP;

--  Post the credit memo if applicable
  IF (pPost) THEN
    SELECT postCreditMemo(_cmheadid,0) INTO _result;
    IF (_result < 0) THEN
      RAISE EXCEPTION 'Error % encounterd posting credit memo.',_result;
    END IF;
  END IF;
  
--  Record the history
  INSERT INTO rahist (rahist_date,rahist_descrip,rahist_curr_id,rahist_source,rahist_source_id,
    rahist_amount,rahist_rahead_id)
  SELECT current_date,'Credit Memo ' || cmhead_number::text,cmhead_curr_id,'CM',_cmheadid,
    _amount,pRaid
  FROM cmhead
  WHERE (cmhead_id=_cmheadid);

  RETURN _cmheadid;
END;
$$ LANGUAGE 'plpgsql';
