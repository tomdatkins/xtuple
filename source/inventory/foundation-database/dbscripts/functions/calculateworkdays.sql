-- Function: calculateworkdays(integer, date, date)

-- DROP FUNCTION calculateworkdays(integer, date, date);

CREATE OR REPLACE FUNCTION calculateworkdays(integer, date, date)
  RETURNS numeric AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWhseid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pDueDate ALIAS FOR $3;
  _forward BOOLEAN;
  _calcDate DATE;
  _endDate DATE;
  _p RECORD;
  _value INTEGER;
  _whseid INTEGER;
 
BEGIN
 
  _whseid := pWhseid;
 
  IF pStartDate = pDueDate THEN
    RETURN 0;
  END IF;
 
--Make sure at least one day a week is active in this warehouse
 
  SELECT whsewk_id INTO _p
  FROM xtmfg.whsewk
  WHERE (whsewk_warehous_id = _whseid)
  LIMIT 1;
 
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'No work week calendar found';
  END IF;
 
  _calcDate := pStartDate;
  _value := 0;
 
--Determine if we are calculating forward or backward
 
  IF (pStartDate < pDueDate) THEN
    _calcDate := pStartDate;
    _endDate := pDueDate;
    _forward := true;
  ELSE
    _calcDate := pDueDate;
    _endDate := pStartDate;
    _forward := false;
  END IF;
 
 --Calculate work days
  WHILE (_calcDate <= _endDate-1) LOOP 
    SELECT whsecal_effective, whsecal_expires, whsecal_active 
    INTO _p
    FROM xtmfg.whsecal
    WHERE (((whsecal_warehous_id=pWhseid)
      OR   (whsecal_warehous_id IS NULL)
      OR   (whsecal_warehous_id=-1))
      AND  (_calcDate BETWEEN whsecal_effective AND whsecal_expires))
    ORDER BY COALESCE(whsecal_warehous_id,-1) DESC;
 
    --Handle calendar exceptions
    IF (_p.whsecal_active IS NOT NULL) THEN
      IF (_p.whsecal_expires <= _endDate) THEN
        IF (_p.whsecal_active) THEN
          _value := _value + (_p.whsecal_expires-_calcDate) + 1; 
        END IF;
        _calcDate = _p.whsecal_expires + 1;
      ELSE
        IF (_p.whsecal_active) THEN
          _value := _value + (_endDate - _calcDate);
        END IF;
        _calcDate := _endDate;
      END IF;
    ELSE
    --Handle regular work week day
      SELECT whsewk_id INTO _p
      FROM xtmfg.whsewk
      WHERE (whsewk_warehous_id = _whseid)
        AND (whsewk_weekday = EXTRACT(DOW FROM _calcDate))
      LIMIT 1;
 
      IF (_p.whsewk_id IS NOT NULL) THEN
        _value := _value + 1;
      END IF;

      _calcDate := _calcDate + 1;
    END IF;
 
  END LOOP;
 
  IF (NOT _forward) THEN
    _value := _value *-1;
  END IF;
 
  RETURN _value;
 
END;
$BODY$
  LANGUAGE plpgsql STABLE
  COST 100;
