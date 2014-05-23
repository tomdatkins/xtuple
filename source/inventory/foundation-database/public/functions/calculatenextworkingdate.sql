CREATE OR REPLACE FUNCTION calculatenextworkingdate(INTEGER, DATE, INTEGER)
  RETURNS DATE AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pwhsid        ALIAS FOR $1;
  pdate         DATE := COALESCE($2, CURRENT_DATE);
  pinterval     ALIAS FOR $3;
  _extra        INTEGER := 0;
BEGIN

IF (fetchmetricbool('UseSiteCalendar')) THEN

  IF pinterval >= 0 THEN
-- Count forward
  WHILE NOT (calculateworkdays(pwhsid, pdate, pdate + _extra) >= pinterval) LOOP
    _extra := _extra + 1;
   
  END LOOP;
--  This next loop ensures that the next day is not also a closed day
   WHILE (calculateworkdays(pwhsid, pdate + _extra, pdate + _extra + 1)) = 0 LOOP
          _extra := _extra + 1;
   END LOOP;     
--

  ELSE
-- Count backward
  WHILE NOT (calculateworkdays(pwhsid, pdate, pdate + _extra) <= pinterval) LOOP
    _extra := _extra - 1;
   
  END LOOP;
    
  END IF;
  
ELSE

  _extra := pinterval;

END IF;

  RETURN pdate + _extra;

END;
$BODY$
LANGUAGE plpgsql VOLATILE;
