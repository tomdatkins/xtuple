CREATE OR REPLACE FUNCTION _invdetailTrigger() RETURNS TRIGGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _lsregid INTEGER;
  _qty 	   NUMERIC;
BEGIN

  IF (TG_OP = ''INSERT'') THEN
    -- If shipped and auto register then create registration
    IF ( SELECT (count(itemsite_id) = 1)
        FROM invhist,itemsite
        WHERE ((invhist_id=NEW.invdetail_invhist_id)
        AND (invhist_itemsite_id=itemsite_id)
        AND (invhist_transtype = ''SH'')
        AND (itemsite_autoreg)) ) THEN
        
      SELECT lsreg_id INTO _lsregid
        FROM invhist,lsreg,shiphead
        WHERE ((invhist_id=NEW.invdetail_invhist_id)
        AND (invhist_transtype=''SH'')
        AND (invhist_docnumber=shiphead_number)
        AND (lsreg_shiphead_id=shiphead_id)
        AND (lsreg_ls_id=NEW.invdetail_ls_id) );

      IF (FOUND) THEN
        UPDATE lsreg SET 
          lsreg_qty=lsreg_qty + NEW.invdetail_qty * -1
        WHERE (lsreg_id=_lsregid);
      ELSE
        INSERT INTO lsreg (lsreg_number,lsreg_crmacct_id,lsreg_regtype_id,
          lsreg_regdate,lsreg_solddate,lsreg_expiredate,lsreg_ls_id,
          lsreg_cohead_id,lsreg_shiphead_id,lsreg_qty,lsreg_cntct_id)
        SELECT fetchlsregnumber(),crmacct_id,regtype_id,current_date,
          current_date,current_date + item_warrdays, NEW.invdetail_ls_id,
          shiphead_order_id,shiphead_id,NEW.invdetail_qty * -1,crmacct_cntct_id_1
        FROM invhist,itemsite,item,shiphead,cohead,crmacct,regtype
        WHERE ((invhist_id=NEW.invdetail_invhist_id)
        AND (invhist_itemsite_id=itemsite_id)
        AND (itemsite_item_id=item_id)
        AND (invhist_docnumber=shiphead_number)
        AND (cohead_id=shiphead_order_id)
        AND (crmacct_cust_id=cohead_cust_id)
        AND (regtype_code=''Shipment''));
      END IF;
      
    -- If returned then update or delete registration
    ELSE
      SELECT lsreg_id, lsreg_qty INTO _lsregid, _qty
        FROM invhist,lsreg,shiphead
        WHERE ((invhist_id=NEW.invdetail_invhist_id)
        AND (invhist_transtype=''RS'')
        AND (invhist_docnumber=shiphead_number)
        AND (lsreg_shiphead_id=shiphead_id)
        AND (lsreg_ls_id=NEW.invdetail_ls_id) );

      IF (FOUND) THEN
        IF (_qty - NEW.invdetail_qty <= 0) THEN
          DELETE FROM lsreg
          WHERE (lsreg_id=_lsregid);
        ELSE
          UPDATE lsreg SET
            lsreg_qty=lsreg_qty-NEW.invdetail_qty
          WHERE (lsreg_id=_lsregid);
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;

END;
' LANGUAGE 'plpgsql';

SELECT dropifexists('TRIGGER', 'invdetailTrigger');
CREATE TRIGGER invdetailTrigger AFTER INSERT OR UPDATE OR DELETE ON invdetail FOR EACH ROW EXECUTE PROCEDURE _invdetailTrigger();
