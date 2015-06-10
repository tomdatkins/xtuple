CREATE OR REPLACE VIEW invoiceline AS 
 SELECT invchead.invchead_invcnumber AS invoice_number, invcitem.invcitem_linenumber AS line_number, item.item_number, invcitem.invcitem_number AS misc_item_number, whsinfo.warehous_code AS site, invcitem.invcitem_descrip AS misc_item_description, salescat.salescat_name AS sales_category, invcitem.invcitem_custpn AS customer_part_number, invcitem.invcitem_ordered AS qty_ordered, invcitem.invcitem_billed AS qty_billed, invcitem.invcitem_updateinv AS update_inventory, invcitem.invcitem_price AS net_unit_price, COALESCE(taxtype.taxtype_name, 'None'::text) AS tax_type, COALESCE(qty_uom.uom_name, 'None'::text) AS qty_uom, COALESCE(price_uom.uom_name, 'None'::text) AS price_uom, invcitem.invcitem_notes AS notes, 
        CASE
            WHEN invcitemaccnt.invcitemaccnt_accnt_id <> (-1) THEN ( SELECT accnt.accnt_name
               FROM accnt
              WHERE accnt.accnt_id = invcitemaccnt.invcitemaccnt_accnt_id)
            ELSE ''::text
        END AS override_accnt
   FROM invcitem
   LEFT JOIN invchead ON invcitem.invcitem_invchead_id = invchead.invchead_id
   LEFT JOIN item ON item.item_id = invcitem.invcitem_item_id
   LEFT JOIN whsinfo ON invcitem.invcitem_warehous_id = whsinfo.warehous_id
   LEFT JOIN salescat ON salescat.salescat_id = invcitem.invcitem_salescat_id
   LEFT JOIN taxtype ON taxtype.taxtype_id = invcitem.invcitem_taxtype_id
   LEFT JOIN uom qty_uom ON qty_uom.uom_id = invcitem.invcitem_qty_uom_id
   LEFT JOIN uom price_uom ON price_uom.uom_id = invcitem.invcitem_price_uom_id
   LEFT JOIN invcitemaccnt ON invcitem.invcitem_id = invcitemaccnt.invcitemaccnt_invcitem_id;

REVOKE ALL ON TABLE invoiceline FROM PUBLIC;
ALTER TABLE  invoiceline OWNER TO "admin";
GRANT ALL ON TABLE invoiceline TO "admin";
GRANT ALL ON TABLE invoiceline TO xtrole;
COMMENT ON VIEW invoiceline IS '
This view can be used as an interface to import Invoice Line Items data directly  
into the system.  Required fields will be checked and default values will be 
populated.  Includes Revenue Override Account';


-- Rule: "_DELETE" ON invoiceline

-- DROP RULE "_DELETE" ON invoiceline;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO invoiceline DO INSTEAD  DELETE FROM invcitem
  WHERE invcitem.invcitem_invchead_id = (( SELECT invchead.invchead_id
           FROM invchead
          WHERE invchead.invchead_invcnumber = old.invoice_number AND invchead.invchead_posted = false));

CREATE OR REPLACE FUNCTION insertinvoicelineitem(invoiceline)
  RETURNS boolean AS
$BODY$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
	pNew ALIAS FOR $1;
	_r RECORD;
BEGIN
	INSERT INTO invcitem (
		invcitem_invchead_id,
		invcitem_linenumber,
		invcitem_item_id,
		invcitem_warehous_id,
		invcitem_custpn,
		invcitem_number,
		invcitem_descrip,
		invcitem_ordered,
		invcitem_billed,
                invcitem_updateinv,
		invcitem_custprice,
		invcitem_price,
		invcitem_notes,
		invcitem_salescat_id,
		invcitem_taxtype_id,
		invcitem_qty_uom_id,
		invcitem_qty_invuomratio,
		invcitem_price_uom_id,
		invcitem_price_invuomratio
	) SELECT
		invchead_id,
		COALESCE(pNew.line_number,(
			SELECT (COALESCE(MAX(invcitem_linenumber), 0) + 1)
			FROM invcitem WHERE (invcitem_invchead_id=invchead_id)
		)),
		COALESCE(item_id, -1),
		COALESCE(getwarehousid(pNew.site,'ALL'),-1),
		pNew.customer_part_number,
		(CASE WHEN item_id IS NULL THEN pNew.misc_item_number ELSE NULL END),
		(CASE WHEN item_id IS NULL THEN pNew.misc_item_description ELSE NULL END),
		pNew.qty_ordered,
		COALESCE(pNew.qty_billed, 0),
                COALESCE(pNew.update_inventory,FALSE),
		0, -- invcitem_custprice
		COALESCE(pNew.net_unit_price,itemPrice(item_id,invchead_cust_id,
			invchead_shipto_id,pNew.qty_ordered,invchead_curr_id,invchead_orderdate)),
		COALESCE(pNew.notes,''),
		CASE
			WHEN item_id IS NULL THEN
				(SELECT salescat_id FROM salescat WHERE salescat_name = pNew.sales_category)
			ELSE NULL
		END,
		taxtype_id,
		CASE
			WHEN item_id IS NOT NULL THEN
				COALESCE((SELECT uom_id FROM uom WHERE (uom_name=pNew.qty_uom)), item_price_uom_id)
			ELSE NULL
		END,
		CASE
			WHEN item_id IS NOT NULL THEN
				itemuomtouomratio(item_id,
					COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.qty_uom),item_price_uom_id),
					item_price_uom_id
				)
			ELSE 1
		END,
		CASE
			WHEN item_id IS NOT NULL THEN
				COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.price_uom),item_price_uom_id)
			ELSE NULL
		END,
		CASE
			WHEN item_id IS NOT NULL THEN
				itemuomtouomratio(item_id,
					COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.price_uom),item_price_uom_id),
					item_price_uom_id
				)
			ELSE 1
		END
	FROM invchead
		LEFT OUTER JOIN item ON (item_id=getItemId(pNew.item_number))
		LEFT OUTER JOIN taxtype ON (taxtype_id=CASE
			WHEN pNew.tax_type IS NULL THEN getItemTaxType(item_id,invchead_taxzone_id)
			WHEN pNew.tax_type = 'None' THEN NULL
			ELSE (SELECT taxtype_id FROM taxtype WHERE taxtype_name=pNew.tax_type)
		END)
	WHERE (invchead_invcnumber=pNew.invoice_number) AND (invchead_posted=FALSE);

--  Now insert the Alternate Revenue override Account
	INSERT INTO invcitemaccnt (invcitem_invchead_id, invcitemaccnt_invcitem_id, invcitemaccnt_accnt_id)
		SELECT invchead_id, invcitem_id, pNew.override_accnt
		  FROM invchead JOIN invcitem ON invchead_id=invcitem_invchead_id
		  WHERE ((invchead_invcnumber=pNew.invoice_number) 
		    AND (invcitem_linenumber=pNew.line_number));
		    
	RETURN TRUE;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION insertinvoicelineitem(invoiceline) OWNER TO "admin";

-- Rule: "_INSERT" ON invoiceline

-- DROP RULE "_INSERT" ON invoiceline;

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO invoiceline DO INSTEAD  SELECT insertinvoicelineitem(new.*) AS insertinvoicelineitem;

CREATE OR REPLACE FUNCTION updateinvoicelineitem(invoiceline, invoiceline)
  RETURNS boolean AS
$BODY$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
	pNew ALIAS FOR $1;
	pOld ALIAS FOR $2;
	_r    RECORD;
	_tmp  INTEGER;
BEGIN
	UPDATE invcitem SET
		invcitem_linenumber=pNew.line_number,
		invcitem_item_id=COALESCE(item_id, -1),
		invcitem_custpn=pNew.customer_part_number,
		invcitem_number=(CASE WHEN item_id IS NULL THEN pNew.misc_item_number ELSE NULL END),
		invcitem_warehous_id=(CASE WHEN invcitem_warehous_id IS NULL THEN COALESCE(getwarehousid(pNew.site,'ALL'),-1) ELSE NULL END),
		invcitem_descrip=(CASE WHEN item_id IS NULL THEN pNew.misc_item_description ELSE NULL END),
		invcitem_ordered=pNew.qty_ordered,
		invcitem_billed=COALESCE(pNew.qty_billed, 0),
                invcitem_updateinv=COALESCE(pNew.update_inventory,FALSE),
		invcitem_price=COALESCE(pNew.net_unit_price,itemPrice(item_id,invchead_cust_id,
			invchead_shipto_id,pNew.qty_ordered,invchead_curr_id,invchead_orderdate)),
		invcitem_notes=COALESCE(pNew.notes,''),
		invcitem_salescat_id=CASE
			WHEN item_id IS NULL THEN
				(SELECT salescat_id FROM salescat WHERE salescat_name = pNew.sales_category)
			ELSE NULL
		END,
		invcitem_taxtype_id=taxtype_id,
		invcitem_qty_uom_id=CASE
			WHEN item_id IS NOT NULL THEN
				COALESCE((SELECT uom_id FROM uom WHERE (uom_name=pNew.qty_uom)), item_price_uom_id)
			ELSE NULL
		END,
		invcitem_qty_invuomratio=CASE
			WHEN item_id IS NOT NULL THEN
				itemuomtouomratio(item_id,
					COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.qty_uom),item_price_uom_id),
					item_price_uom_id
				)
			ELSE 1
		END,
		invcitem_price_uom_id=CASE
			WHEN item_id IS NOT NULL THEN
				COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.price_uom),item_price_uom_id)
			ELSE NULL
		END,
		invcitem_price_invuomratio=CASE
			WHEN item_id IS NOT NULL THEN
				itemuomtouomratio(item_id,
					COALESCE((SELECT uom_id FROM uom WHERE uom_name=pNew.price_uom),item_price_uom_id),
					item_price_uom_id
				)
			ELSE 1
		END
	FROM invchead
		LEFT OUTER JOIN item ON (item_id=getItemId(pNew.item_number))
		LEFT OUTER JOIN taxtype ON (taxtype_id=CASE
			WHEN pNew.tax_type IS NULL THEN getItemTaxType(item_id,invchead_taxzone_id)
			WHEN pNew.tax_type = 'None' THEN NULL
			ELSE (SELECT taxtype_id FROM taxtype WHERE taxtype_name=pNew.tax_type)
		END)
	WHERE invcitem_invchead_id=invchead_id
		AND invcitem_linenumber=pOld.line_number
		AND invchead_invcnumber=pOld.invoice_number
		AND invchead_posted=FALSE;

--  RCPTBYCUSTGRP - Update Invoice Item override Account
       SELECT invcitemaccnt_id FROM invcitemaccnt 
                    WHERE invcitemaccnt_invcitem_id = (SELECT invcitem_id from invchead, invcitem
				WHERE invchead_id=invcitem_invchead_id 
				  AND invchead_invcnumber = pOld.invoice_number
				  AND invcitem_linenumber = pOld.line_number);
       IF (NOT FOUND) THEN
	   	INSERT INTO invcitemaccnt (invcitem_invchead_id, invcitemaccnt_invcitem_id, invcitemaccnt_accnt_id)
		SELECT invchead_id, invcitem_id, pNew.override_accnt
		  FROM invchead JOIN invcitem ON invchead_id=invcitem_invchead_id
		  WHERE ((invchead_invcnumber=pNew.invoice_number) 
		    AND (invcitem_linenumber=pNew.line_number));
	ELSE	    		  
		UPDATE invcitemaccnt SET invcitemaccnt_accnt_id = pNew.override_accnt
		WHERE invcitemaccnt_invcitem_id = (SELECT invcitem_id from invchead, invcitem
				WHERE invchead_id=invcitem_invchead_id 
				  AND invchead_invcnumber = pOld.invoice_number
				  AND invcitem_linenumber = pOld.line_number);
	END IF;
		
	RETURN TRUE;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION updateinvoicelineitem(invoiceline, invoiceline)
  OWNER TO admin;

-- Rule: "_UPDATE" ON invoiceline

-- DROP RULE "_UPDATE" ON invoiceline;

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO invoiceline DO INSTEAD  SELECT updateinvoicelineitem(new.*, old.*) AS updateinvoicelineitem;


