CREATE OR REPLACE FUNCTION findTOForm(INTEGER, TEXT) RETURNS TEXT AS $$
-- Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  ptoheadid	ALIAS FOR $1;
  pformtype	ALIAS FOR $2;
  _formname	TEXT;
BEGIN
  IF (pformtype = 'P') THEN
    SELECT shipform_report_name INTO _formname
    FROM tohead, shipform
    WHERE ((tohead_id=ptoheadid)
    AND  (tohead_shipform_id=shipform_id));
  ELSIF (pformtype = 'L') THEN
    SELECT shipform_report_name INTO _formname
    FROM tohead 
    LEFT OUTER JOIN whsinfo ON (tohead_trns_warehous_id=warehous_id)
    LEFT OUTER JOIN shipform ON (warehous_picklist_shipform_id=shipform_id)
    WHERE (tohead_id=ptoheadid);  
  END if;

  IF (NOT FOUND OR _formname IS NULL) THEN
    IF (pformtype = 'P') THEN
      RETURN 'PackingList-Shipment';
    ELSIF (pformtype = 'L') THEN
      RETURN 'PackingList';
    END IF;
  END IF;

  RETURN _formname;
END;
$$ LANGUAGE plpgsql;
