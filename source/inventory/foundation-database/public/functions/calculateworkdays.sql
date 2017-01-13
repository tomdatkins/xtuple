CREATE OR REPLACE FUNCTION calculateworkdays(pWhseid    integer,
                                             pStartDate date,
                                             pDueDate   date)
  RETURNS numeric AS
$$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _forward BOOLEAN      := (pStartDate < pDueDate);
  _calcDate DATE;
  _endDate DATE;
  _p RECORD;
  _value   INTEGER      := 0;

BEGIN

  IF pStartDate = pDueDate THEN
    RETURN 0;
  END IF;

  IF _forward THEN
    _calcDate := pStartDate;
    _endDate := pDueDate;
  ELSE
    _calcDate := pDueDate;
    _endDate := pStartDate;
  END IF;

  IF packageIsEnabled('xtmfg') THEN
    IF NOT EXISTS(SELECT 1 FROM xtmfg.whsewk WHERE whsewk_warehous_id = pWhseid) THEN
      RAISE EXCEPTION 'No work week calendar found [xtuple: calculateWorkDays, -1, %]',
                      pWhseid;
    END IF;

    WHILE (_calcDate <= _endDate-1) LOOP
      SELECT whsecal_effective, whsecal_expires, whsecal_active INTO _p
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
        IF EXISTS(SELECT 1 FROM xtmfg.whsewk
                   WHERE whsewk_warehous_id = pWhseid
                     AND whsewk_weekday = EXTRACT(DOW FROM _calcDate)) THEN
          _value := _value + 1;
        END IF;

        _calcDate := _calcDate + 1;
      END IF;

    END LOOP;

  ELSE
    _value := _endDate - _calcDate;
    /* WHILE _calcDate <= _endDate - 1 LOOP
      _value    := _value    + 1;
      _calcDate := _calcDate + 1;
    END LOOP; */
  END IF;

  IF (NOT _forward) THEN
    _value := _value *-1;
  END IF;

  RETURN _value;

END;
$$ LANGUAGE plpgsql;
