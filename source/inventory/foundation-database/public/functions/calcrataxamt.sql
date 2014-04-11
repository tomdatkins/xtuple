CREATE OR REPLACE FUNCTION calcRaTaxAmt(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pRaid ALIAS FOR $1;
  _tax NUMERIC := 0.0;

BEGIN

  SELECT COALESCE(SUM(tax), 0.0) INTO _tax
  FROM ( SELECT ROUND(SUM(taxdetail_tax),2) AS tax
         FROM tax
         JOIN calculateTaxDetailSummary('RA', pRaid, 'T') ON (taxdetail_tax_id=tax_id)
         GROUP BY tax_id ) AS data;

  RETURN ROUND(_tax, 2);
END;
$$ LANGUAGE 'plpgsql';
