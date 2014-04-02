CREATE OR REPLACE FUNCTION findTOForm(INTEGER, TEXT) RETURNS TEXT AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  ptoheadid	ALIAS FOR $1;
  pformtype	ALIAS FOR $2;
  _formname	TEXT;
BEGIN
  SELECT shipform_report_name INTO _formname
  FROM tohead, shipform
  WHERE ((tohead_id=ptoheadid)
    AND  (tohead_shipform_id=shipform_id));

  IF (NOT FOUND OR _formname IS NULL) THEN
    IF (pformtype = ''P'') THEN
      RETURN ''PackingList-Shipment'';
    ELSIF (pformtype = ''L'') THEN
      RETURN ''PackingList'';
    END IF;
  END IF;

  RETURN _formname;
END;
' LANGUAGE 'plpgsql';
