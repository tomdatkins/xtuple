CREATE OR REPLACE FUNCTION updatemiscvouchertax(pvoheadid integer, ptaxzone integer, pdate date, pcurr integer, pamount numeric)
  RETURNS numeric AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
   _distid	integer;
   _total 	numeric := 0;
   _taxd	RECORD;
   _taxt	RECORD;
   _taxamount	numeric;
   _tax		numeric;
   _taxamnt	numeric;
   _subtotal	numeric;
   
BEGIN

   -- Remove existing tax distributions
   DELETE FROM vodist WHERE (vodist_vohead_id = pVoheadid AND vodist_tax_id > 0);

   -- Get Tax Type(s) from configuration
   <<taxtypes>>
   FOR _taxt IN
     SELECT COALESCE(taxass_taxtype_id, getadjustmenttaxtypeid()) AS taxass_taxtype_id
     FROM tax
     JOIN taxass ON (tax_id=taxass_tax_id)
     WHERE ((tax_purch)
      AND   (taxass_taxzone_id = ptaxzone))
     LIMIT 1 
   LOOP  

     _subtotal := (SELECT calculatepretaxtotal(ptaxzone, _taxt.taxass_taxtype_id, pdate, pcurr, pamount));

     -- Determine the Tax details for the Voucher Tax Zone
     <<taxdetail>>
     FOR _taxd IN
	SELECT taxdetail_tax_code, taxdetail_tax_id,taxdetail_taxrate_percent,COALESCE(taxdetail_taxrate_amount,0.00) as taxdetail_taxrate_amount,
	       taxdetail_taxclass_sequence as seq 
	FROM calculatetaxdetail(ptaxzone, _taxt.taxass_taxtype_id, pdate, pcurr, pamount)
	ORDER BY taxdetail_taxclass_sequence DESC
	
     LOOP
     -- Calculate Tax Amount
       _taxamount = (_subtotal * _taxd.taxdetail_taxrate_percent) + _taxd.taxdetail_taxrate_amount;
       
       -- Insert Tax Line
       INSERT INTO vodist (vodist_poitem_id, vodist_vohead_id, vodist_costelem_id, vodist_accnt_id, vodist_amount, vodist_tax_id, vodist_discountable, vodist_notes)
	   VALUES (-1, pVoheadid, -1, -1, round(_taxamount,2), _taxd.taxdetail_tax_id, false, 'Auto Created Tax - '||_taxd.taxdetail_tax_code);   

       _total = _total + _taxamount;
       -- _subtotal = _subtotal - _taxamount;
       
     END LOOP taxdetail;
   END LOOP taxtypes;

    -- All done   
    RETURN _total;
    
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION updatemiscvouchertax(integer, integer, date, integer, numeric) OWNER TO admin;
