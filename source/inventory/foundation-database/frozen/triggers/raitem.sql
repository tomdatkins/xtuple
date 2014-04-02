
CREATE OR REPLACE FUNCTION _raitemTriggerBefore() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _item TEXT;
  _r RECORD;

BEGIN

  IF ((TG_OP = 'INSERT') OR (TG_OP = 'DELETE')) THEN
    IF (NOT checkPrivilege('MaintainReturns')) THEN
      RAISE EXCEPTION 'You do not have privileges to create or change a Return Authorization.';
    END IF;
  END IF;

  IF ((TG_OP = 'INSERT') OR (TG_OP = 'UPDATE')) THEN

    IF (NEW.raitem_disposition = 'C') THEN
      SELECT rahead_creditmethod INTO _r
      FROM rahead
      WHERE (rahead_id=NEW.raitem_rahead_id);
      IF (_r.rahead_creditmethod = 'N') THEN
        RAISE EXCEPTION 'Line item % may not be saved with disposition type Credit while Credit Method on the Header Record is None.',NEW.raitem_linenumber;
      END IF;
    END IF;

  END IF;

  IF (TG_OP = 'INSERT') THEN
--  Only zero quantities on insert
    IF (NEW.raitem_qtyreceived <> 0) THEN
      RAISE EXCEPTION 'Quantity received must be zero when creating a return item record.';
    END IF;

    IF (NEW.raitem_amtcredited <> 0) THEN
      RAISE EXCEPTION 'Amount credited received must be zero when creating a return item record.';
    END IF;

    IF (NEW.raitem_qtycredited <> 0) THEN
      RAISE EXCEPTION 'Quantity credited must be zero when creating a return item record.';
    END IF;

--  If we are shipping something, then must have a date
    IF (NEW.raitem_disposition IN ('P','V','S') AND NEW.raitem_qtyauthorized > 0) THEN
      IF NEW.raitem_scheddate IS NULL THEN
        NEW.raitem_scheddate=current_date;
      END IF;
    END IF;

  ELSIF (TG_OP = 'UPDATE') THEN
    IF ( (NOT checkPrivilege('MaintainReturns')) AND
         (NEW.raitem_qtyreceived = OLD.raitem_qtyreceived) AND
         (NEW.raitem_new_coitem_id = OLD.raitem_new_coitem_id) AND
         (NEW.raitem_status = OLD.raitem_status) ) THEN
      RAISE EXCEPTION 'You do not have privileges to create or change a Return Authorization.';
    END IF;

    IF (OLD.raitem_status = 'C' AND NEW.raitem_status = 'C') THEN
      RAISE EXCEPTION 'Line item % is closed and may not be changed.', OLD.raitem_linenumber;
    END IF;

    IF ((NEW.raitem_qtyauthorized != NEW.raitem_qtyauthorized) AND (
        (NEW.raitem_qtyauthorized < NEW.raitem_qtyreceived) OR
        (NEW.raitem_qtycredited < NEW.raitem_qtycredited) OR
       (NEW.raitem_qtyauthorized < COALESCE((SELECT coitem_qtyshipped FROM coitem WHERE coitem_id=OLD.raitem_new_coitem_id),0)))) THEN
      RAISE EXCEPTION 'Line %1 has transactions. You may not set the authorized qty lower than transacted quantities.', OLD.raitem_linenumber;
    END IF;

--  If we are shipping something, then return must have shipdate and credit must be zero
    IF NEW.raitem_disposition IN ('P','V','S') THEN
      IF (NEW.raitem_scheddate IS NULL) THEN
        NEW.raitem_scheddate=current_date;
      END IF;
    ELSE
      NEW.raitem_scheddate=NULL;
    END IF;

--  Process status when credited qty changes
    IF (NEW.raitem_qtycredited <> OLD.raitem_qtycredited) THEN
      IF (NEW.raitem_qtycredited > NEW.raitem_qtyauthorized) THEN
        RAISE EXCEPTION 'Credit qty on line item % not allowed.  You may not credit more quantity than is authorized.',NEW.raitem_linenumber;
      END IF;
      IF ((NEW.raitem_qtycredited > 0) AND (NEW.raitem_disposition IN ('V','S'))) THEN
        RAISE EXCEPTION 'Credit may not be transacted against line item % unless dispostion type is Credit, Return or Replace.',NEW.raitem_linenumber;
      END IF;
      IF ((NEW.raitem_qtycredited = NEW.raitem_qtyauthorized) AND ((NEW.raitem_disposition = 'C')
           OR (NEW.raitem_disposition = 'R' AND NEW.raitem_qtyreceived = NEW.raitem_qtyauthorized))) THEN  --Process Credit, Return
        NEW.raitem_status = 'C';
      END IF;
    END IF;

--  Process status when received qty changes
    IF (NEW.raitem_qtyreceived <> OLD.raitem_qtyreceived) THEN
      IF (NEW.raitem_qtyreceived > NEW.raitem_qtyauthorized) THEN
        RAISE EXCEPTION 'Receipt qty on line item % not allowed.  You may not received more quantity than is authorized.',NEW.raitem_linenumber;
      END IF;
      IF ((NEW.raitem_qtyreceived > 0) AND (NEW.raitem_disposition IN ('C','S'))) THEN
        RAISE EXCEPTION 'Receipts may not be transacted against line item % unless dispostion type is Return, Replace, or Service.',NEW.raitem_linenumber;
      END IF;
      IF ((NEW.raitem_qtyreceived = NEW.raitem_qtyauthorized) AND (NEW.raitem_disposition = 'R') AND (NEW.raitem_unitprice=0)) THEN  --Process Return
        NEW.raitem_status = 'C';
      END IF;
      IF ((NEW.raitem_qtyreceived = NEW.raitem_qtyauthorized) AND (NEW.raitem_disposition IN ('P','V'))) THEN --Process Replace and Service
         SELECT coitem_qtyshipped INTO _r FROM coitem WHERE (coitem_id = NEW.raitem_new_coitem_id);
         IF (_r.coitem_qtyshipped >= NEW.raitem_qtyauthorized) THEN
           NEW.raitem_status = 'C';
         END IF;
      END IF;
    END IF;

--  Process status when authorized qty changes
    IF (NEW.raitem_qtyauthorized > OLD.raitem_qtyauthorized) THEN
      NEW.raitem_status = 'O';
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN
    IF ( (NOT OLD.raitem_status IN ('C', 'X')) AND
         (OLD.raitem_qtyreceived + COALESCE((SELECT coitem_qtyshipped FROM coitem WHERE coitem_id=OLD.raitem_new_coitem_id),0) > 0) ) THEN
      RAISE EXCEPTION  'This line item has transaction history and cannot be deleted.';
    END IF;

    RETURN OLD;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'raitemTriggerBefore');
CREATE TRIGGER raitemTriggerBefore BEFORE INSERT OR UPDATE OR DELETE ON raitem FOR EACH ROW EXECUTE PROCEDURE _raitemTriggerBefore();

CREATE OR REPLACE FUNCTION _raitemTriggerAfter() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER := -1;
  _ra RECORD;
  _r RECORD;
  _balancedue	NUMERIC;
  _coheadid INTEGER;
  _coitemid INTEGER;
  _linenumber INTEGER;
  _kit BOOLEAN;
  _item TEXT;

BEGIN

  IF (fetchMetricBool('ReturnAuthorizationChangeLog') ) THEN
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
    IF NOT FOUND THEN
      _cmnttypeid := -1;
    END IF;
  END IF;

  IF (TG_OP != 'DELETE') THEN
    --Cache some information
    SELECT * INTO _ra
    FROM rahead
    WHERE (rahead_id=NEW.raitem_rahead_id);

    --Determine if this is a kit for later processing
    SELECT COALESCE(item_type,'')='K' INTO _kit
    FROM itemsite, item
    WHERE((itemsite_item_id=item_id)
      AND (itemsite_id=NEW.raitem_itemsite_id));
    _kit := COALESCE(_kit, false);
  END IF;

  IF (TG_OP = 'INSERT') THEN
    --  Post Insert Comments
    IF (_cmnttypeid <> -1) THEN
      PERFORM postComment(_cmnttypeid, 'RI', NEW.raitem_id, 'Created');

      IF (NEW.raitem_qtyauthorized > 0) THEN
        SELECT item_number INTO _item
        FROM item, itemsite
        WHERE ((itemsite_id=NEW.raitem_itemsite_id) AND (itemsite_item_id=item_id));
        PERFORM postComment(_cmnttypeid, 'RA', NEW.raitem_rahead_id, 'Authorized Qty ' || formatQty(NEW.raitem_qtyauthorized) || ' of '  || _item);
      END IF;
    END IF;

    IF(_kit AND (NEW.raitem_orig_coitem_id IS NULL)) THEN
      PERFORM explodeReturnKit(NEW.raitem_id);
      IF (fetchMetricBool('KitComponentInheritCOS')) THEN
        UPDATE raitem
        SET raitem_cos_accnt_id = CASE WHEN (COALESCE(NEW.raitem_cos_accnt_id, -1) != -1) THEN NEW.raitem_cos_accnt_id
                                       WHEN (NEW.raitem_warranty) THEN resolveCOWAccount(NEW.raitem_itemsite_id, _ra.rahead_cust_id)
                                       ELSE resolveCOSAccount(NEW.raitem_itemsite_id, _ra.rahead_cust_id)
                                  END
        WHERE((raitem_rahead_id=NEW.raitem_rahead_id)
          AND (raitem_linenumber = NEW.raitem_linenumber)
          AND (raitem_subnumber > 0));
      END IF;
    END IF;

  END IF;

  IF (TG_OP != 'DELETE') THEN
--  If authorizing a qty on a shippable and immediate item, create coitem
    IF ((_ra.rahead_timing='I') AND
        (NEW.raitem_disposition IN ('P','V','S')) AND
        (NEW.raitem_new_coitem_id IS NULL) AND
        (NEW.raitem_qtyauthorized > 0) AND
        (NOT _kit)) THEN

--  Do we have a header to work with?
        SELECT rahead_new_cohead_id INTO _coheadid
        FROM rahead
        WHERE (rahead_id=NEW.raitem_rahead_id);

--  No header, so create a Sales Order header first.
        IF (_coheadid IS NULL) THEN
          SELECT nextval('cohead_cohead_id_seq') INTO _coheadid;

          INSERT INTO cohead (
            cohead_id,cohead_number,cohead_cust_id,cohead_custponumber,
            cohead_orderdate,cohead_salesrep_id,cohead_terms_id,
            cohead_shipvia,cohead_shipto_id,cohead_shiptoname,
            cohead_shiptoaddress1,cohead_shiptoaddress2,cohead_shiptoaddress3,
            cohead_shiptocity,cohead_shiptostate,cohead_shiptozipcode,
            cohead_shiptocountry,cohead_freight,cohead_shiptophone,
            cohead_shipto_cntct_id, cohead_shipto_cntct_honorific,
            cohead_shipto_cntct_first_name, cohead_shipto_cntct_middle,
            cohead_shipto_cntct_last_name, cohead_shipto_cntct_suffix,
            cohead_shipto_cntct_phone, cohead_shipto_cntct_title,
            cohead_shipto_cntct_fax, cohead_shipto_cntct_email,
            cohead_shipchrg_id, cohead_shipform_id,cohead_billtoname,
            cohead_billtoaddress1,cohead_billtoaddress2,cohead_billtoaddress3,
            cohead_billtocity,cohead_billtostate,cohead_billtozipcode,
            cohead_billtocountry,cohead_misc_accnt_id,cohead_misc_descrip,
            cohead_commission,cohead_holdtype,cohead_prj_id,cohead_shipcomplete,
            cohead_curr_id, cohead_taxzone_id, cohead_saletype_id, cohead_shipzone_id)
          SELECT _coheadid,fetchsonumber(),rahead_cust_id,rahead_custponumber,
            current_date,rahead_salesrep_id,COALESCE(cohead_terms_id,cust_terms_id),
            COALESCE(cohead_shipvia,cust_shipvia),rahead_shipto_id,rahead_shipto_name,
            rahead_shipto_address1,rahead_shipto_address2,rahead_shipto_address3,
            rahead_shipto_city,rahead_shipto_state,rahead_shipto_zipcode,
            rahead_shipto_country,0,COALESCE(cohead_shiptophone,''),
            cntct_id, cntct_honorific,
            cntct_first_name, cntct_middle,
            cntct_last_name, cntct_suffix,
            cntct_phone, cntct_title,
            cntct_fax, cntct_email,
            COALESCE(cohead_shipchrg_id,cust_shipchrg_id),
            COALESCE(cohead_shipform_id,cust_shipform_id),
            rahead_billtoname,rahead_billtoaddress1,rahead_billtoaddress2,rahead_billtoaddress3,
            rahead_billtocity,rahead_billtostate,rahead_billtozip,
            rahead_billtocountry,NULL,'',rahead_commission, 
            CASE WHEN rahead_timing='R' THEN
              'R'
            ELSE
              'N'
            END,rahead_prj_id,
            COALESCE(cohead_shipcomplete,
              CASE WHEN cust_partialship THEN 
                false 
              ELSE true
              END),rahead_curr_id,rahead_taxzone_id, rahead_saletype_id, rahead_shipzone_id
          FROM rahead
            JOIN custinfo ON (rahead_cust_id=cust_id)
            LEFT OUTER JOIN cohead ON (rahead_orig_cohead_id=cohead_id)
            LEFT OUTER JOIN shiptoinfo ON (rahead_shipto_id=shipto_id)
            LEFT OUTER JOIN cntct ON (shipto_cntct_id=cntct_id)
          WHERE (rahead_id=NEW.raitem_rahead_id);

          UPDATE rahead SET rahead_new_cohead_id=_coheadid WHERE rahead_id=NEW.raitem_rahead_id;
      END IF;

-- Now enter the line item
      SELECT nextval('coitem_coitem_id_seq') INTO _coitemid;

      SELECT COALESCE(MAX(coitem_linenumber),0)+1 INTO _linenumber
      FROM coitem
      WHERE (coitem_cohead_id=_coheadid);
      
      INSERT INTO coitem (
        coitem_id,coitem_cohead_id,coitem_linenumber,coitem_itemsite_id,
        coitem_status,coitem_scheddate,coitem_promdate, coitem_qtyord,
        coitem_unitcost,coitem_price,coitem_custprice,coitem_qtyshipped,
        coitem_order_id,coitem_memo,coitem_qtyreturned,
        coitem_taxtype_id,coitem_qty_uom_id,coitem_qty_invuomratio,
        coitem_price_uom_id,coitem_price_invuomratio,coitem_warranty,
        coitem_cos_accnt_id, coitem_custpn)
      SELECT _coitemid,_coheadid,_linenumber,NEW.raitem_coitem_itemsite_id,
          'O',NEW.raitem_scheddate,NEW.raitem_scheddate,NEW.raitem_qtyauthorized,
          stdcost(itemsite_item_id),COALESCE(NEW.raitem_saleprice,0),
          itemPrice(itemsite_item_id, rahead_cust_id, rahead_shipto_id,
                    NEW.raitem_qtyauthorized, NEW.raitem_qty_uom_id,
                    NEW.raitem_price_uom_id, rahead_curr_id, NEW.raitem_scheddate,
                    CURRENT_DATE, itemsite_warehous_id),
          0, -1,NEW.raitem_notes,0,
          NEW.raitem_taxtype_id,NEW.raitem_qty_uom_id,NEW.raitem_qty_invuomratio,
          NEW.raitem_price_uom_id,NEW.raitem_price_invuomratio,NEW.raitem_warranty,
          NEW.raitem_cos_accnt_id, NEW.raitem_custpn
      FROM rahead, itemsite
      WHERE (rahead_id=NEW.raitem_rahead_id)
        AND (itemsite_id=NEW.raitem_coitem_itemsite_id);

      UPDATE raitem SET raitem_new_coitem_id=_coitemid WHERE (raitem_id=NEW.raitem_id);
    END IF;
  END IF;

  IF (TG_OP = 'UPDATE') THEN

    --  Post Update Comments
    IF (_cmnttypeid <> -1)  THEN
      IF (NEW.raitem_qtyauthorized <> OLD.raitem_qtyauthorized) THEN
        SELECT item_number INTO _item
        FROM item, itemsite
        WHERE ((itemsite_id=NEW.raitem_itemsite_id) AND (itemsite_item_id=item_id));
        PERFORM postComment(_cmnttypeid, 'RA', NEW.raitem_rahead_id, 'Authorized Qty '
          || formatQty(NEW.raitem_qtyauthorized-OLD.raitem_qtyauthorized) || ' of '  || _item);
        PERFORM postComment(_cmnttypeid, 'RI', NEW.raitem_id,
                ( 'Authorized Qty Changed from ' || formatQty(OLD.raitem_qtyauthorized) || ' to ' || formatQty(NEW.raitem_qtyauthorized ) ));
      END IF;
      IF (OLD.raitem_unitprice <> NEW.raitem_unitprice) THEN
        PERFORM postComment(_cmnttypeid, 'RI', NEW.raitem_id, 'Unit Price changed from '
          || OLD.raitem_unitprice || ' to ' || NEW.raitem_unitprice);
      END IF;
      IF (OLD.raitem_qty_uom_id <> NEW.raitem_qty_uom_id) THEN
        PERFORM postComment(_cmnttypeid, 'RI', NEW.raitem_id, 'Qty UOM changed from '
          || (SELECT uom_name FROM uom WHERE (uom_id=OLD.raitem_qty_uom_id)) || ' to '
          || (SELECT uom_name FROM uom WHERE (uom_id=NEW.raitem_qty_uom_id)));
      END IF;
      IF (OLD.raitem_price_uom_id <> NEW.raitem_price_uom_id) THEN
        PERFORM postComment(_cmnttypeid, 'RI', NEW.raitem_id, 'Price UOM changed from '
          || (SELECT uom_name FROM uom WHERE (uom_id=OLD.raitem_price_uom_id)) || ' to '
          || (SELECT uom_name FROM uom WHERE (uom_id=NEW.raitem_price_uom_id)));
      END IF;
      IF (OLD.raitem_rsncode_id <> NEW.raitem_rsncode_id) THEN
        PERFORM postComment(_cmnttypeid, 'RI', NEW.raitem_id, 'Reason Code changed from '
          || (SELECT rsncode_code FROM rsncode WHERE (rsncode_id=OLD.raitem_rsncode_id)) || ' to '
          || (SELECT rsncode_code FROM rsncode WHERE (rsncode_id=NEW.raitem_rsncode_id)));
      END IF;
      IF (NEW.raitem_status <> OLD.raitem_status) THEN
        IF (NEW.raitem_status = 'C') THEN
          PERFORM postComment(_cmnttypeid, 'RI', NEW.raitem_id, 'Closed');
        ELSIF (NEW.raitem_status = 'O') THEN
          PERFORM postComment(_cmnttypeid, 'RI', NEW.raitem_id, 'Opened');
        END IF;
      END IF;
    END IF;

      
--  Process Status changes

    IF (NEW.raitem_qtyreceived <> OLD.raitem_qtyreceived) THEN
      SELECT MAX(raitem_qtyauthorized - raitem_qtyreceived) INTO _balancedue
      FROM raitem JOIN itemsite ON (itemsite_id=raitem_itemsite_id)
                  JOIN item ON ((item_id=itemsite_item_id) AND (item_type <> 'K'))
      WHERE (raitem_rahead_id=NEW.raitem_rahead_id);
      IF (_balancedue <= 0) THEN
	UPDATE cohead SET cohead_holdtype = 'N'
	FROM rahead
	WHERE ((cohead_holdtype ='R')
	  AND  (cohead_id=rahead_new_cohead_id)
	  AND  (rahead_timing='R')
	  AND  (rahead_id=NEW.raitem_rahead_id));
      END IF;

    END IF;

--  Either Receive or Close the Kit line
--  Note: Receiving is necessary for processing the credit
    IF ( (NEW.raitem_subnumber > 0) AND (NEW.raitem_status = 'C') ) THEN
      IF NOT ((SELECT COUNT(*) 
               FROM raitem
               WHERE ( (raitem_rahead_id=NEW.raitem_rahead_id)
                 AND   (raitem_linenumber=NEW.raitem_linenumber)
                 AND   (raitem_subnumber > 0)
                 AND   (raitem_status <> 'C') )) > 0) THEN
        IF ((SELECT COUNT(*)
             FROM raitem JOIN rahead ON (rahead_id=raitem_rahead_id)
             WHERE ( (raitem_rahead_id=NEW.raitem_rahead_id)
               AND   (raitem_linenumber=NEW.raitem_linenumber)
               AND   (raitem_subnumber=0)
               AND   (raitem_disposition IN ('R', 'P'))
               AND   (rahead_timing='R') )) > 0) THEN
          UPDATE raitem SET raitem_qtyreceived = raitem_qtyauthorized
          WHERE ( (raitem_rahead_id=NEW.raitem_rahead_id)
            AND   (raitem_linenumber=NEW.raitem_linenumber)
            AND   (raitem_subnumber=0) );
        ELSE
          UPDATE raitem SET raitem_status = 'C'
          WHERE ( (raitem_rahead_id=NEW.raitem_rahead_id)
            AND   (raitem_linenumber=NEW.raitem_linenumber)
            AND   (raitem_subnumber=0) );
        END IF;
      END IF;
    END IF;

--  Process changes that affect linked sales order
    IF ((NEW.raitem_disposition IN ('P','V','S')) AND
        (OLD.raitem_new_coitem_id IS NOT NULL) AND
        (NEW.raitem_qtyauthorized > 0) AND
        (OLD.raitem_qtyauthorized <> NEW.raitem_qtyauthorized OR
         OLD.raitem_warranty <> NEW.raitem_warranty OR
         COALESCE(OLD.raitem_cos_accnt_id,-1) <> COALESCE(NEW.raitem_cos_accnt_id,-1) OR
         COALESCE(OLD.raitem_taxtype_id,-1) <> COALESCE(NEW.raitem_taxtype_id,-1) OR
         OLD.raitem_qtyauthorized <> NEW.raitem_qtyauthorized AND
         OLD.raitem_qty_uom_id <> NEW.raitem_qty_uom_id OR
         OLD.raitem_qty_invuomratio <> NEW.raitem_qty_invuomratio OR
         OLD.raitem_price_uom_id <> NEW.raitem_price_uom_id OR
         OLD.raitem_price_invuomratio <> NEW.raitem_price_invuomratio OR
         OLD.raitem_scheddate <> NEW.raitem_scheddate OR
         OLD.raitem_notes <> NEW.raitem_notes OR
         OLD.raitem_saleprice <> NEW.raitem_saleprice)) THEN

--  Looks like we have an S/O line to update so check for problems, then update.
        SELECT * INTO _r FROM coitem WHERE coitem_id=NEW.raitem_new_coitem_id;
        IF (_r.coitem_status = 'C') THEN
          RAISE EXCEPTION  'The shipping sales order for line % is closed.  Quantities can not be channged.',OLD.raitem_linenumber;
        END IF;
  --      IF (_r.coitem_order_id > 0) THEN
  --        RAISE EXCEPTION 'A work order exists for the shipping sales order on line %.  Authorization qty can not be changed.',OLD.raitem_linenumber;
  --      END IF;

        UPDATE coitem SET
          coitem_qtyord = NEW.raitem_qtyauthorized,
          coitem_warranty = NEW.raitem_warranty,
          coitem_cos_accnt_id = NEW.raitem_cos_accnt_id,
          coitem_taxtype_id = NEW.raitem_taxtype_id,
          coitem_qty_uom_id = NEW.raitem_qty_uom_id,
          coitem_qty_invuomratio = NEW.raitem_qty_invuomratio,
          coitem_price_uom_id = NEW.raitem_price_uom_id,
          coitem_price_invuomratio = NEW.raitem_price_invuomratio,
          coitem_scheddate = NEW.raitem_scheddate,
          coitem_memo = NEW.raitem_notes,
          coitem_price = COALESCE(NEW.raitem_saleprice, 0)
          WHERE (coitem_id = NEW.raitem_new_coitem_id);
    END IF;

  --  If authorized qty is zeroed, cancel sales line.
    IF (((NEW.raitem_qtyauthorized = 0) 
        AND (OLD.raitem_qtyauthorized != 0)
        OR (NEW.raitem_disposition IN ('C','R')))
        AND (NEW.raitem_new_coitem_id IS NOT NULL)) THEN
          UPDATE coitem SET coitem_status = 'X' WHERE coitem_id=OLD.raitem_new_coitem_id;
          IF (_cmnttypeid <> -1) THEN
            PERFORM postComment(_cmnttypeid, 'SI', coitem_id, 'Line Cancelled by Return Authorization item that was deauthorized')
            FROM coitem WHERE (coitem_id=OLD.raitem_new_coitem_id); 
          END IF;
          UPDATE raitem SET raitem_new_coitem_id = NULL where (raitem_id = NEW.raitem_id);
    END IF;

  ELSIF (TG_OP = 'DELETE') THEN

--  Cancel S/O item
    IF (OLD.raitem_new_coitem_id IS NOT NULL) THEN
      UPDATE coitem SET coitem_status = 'X' WHERE coitem_id=OLD.raitem_new_coitem_id;
      IF (_cmnttypeid <> -1) THEN
        PERFORM postComment(_cmnttypeid, 'SI', coitem_id, 'Line Cancelled by return authorization item that was deleted')
        FROM coitem WHERE (coitem_id=OLD.raitem_new_coitem_id);
      END IF;
    END IF;

    DELETE FROM lsdetail WHERE ((lsdetail_source_type = 'RA') AND (lsdetail_source_id=OLD.raitem_id));

--  Delete any associated Sub Lines
    IF (OLD.raitem_subnumber = 0) THEN
      DELETE FROM comment
      WHERE ( (comment_source='RI')
          AND (comment_source_id=OLD.raitem_id) );

      DELETE FROM raitem
      WHERE ( (raitem_rahead_id=OLD.raitem_rahead_id) AND (raitem_linenumber=OLD.raitem_linenumber) );
    END IF;

    RETURN OLD;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'raitemTriggerAfter');
CREATE TRIGGER raitemTriggerAfter AFTER INSERT OR UPDATE OR DELETE ON raitem FOR EACH ROW EXECUTE PROCEDURE _raitemTriggerAfter();
