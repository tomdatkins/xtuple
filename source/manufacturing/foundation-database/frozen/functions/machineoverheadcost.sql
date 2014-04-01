
CREATE OR REPLACE FUNCTION xtmfg.machineOverheadCost(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  _type TEXT;
  _trackMethod TEXT;
  _cost NUMERIC;
  _booitem RECORD;

BEGIN

  SELECT item_type INTO _type
  FROM item
  WHERE (item_id=pItemid);

  _cost := 0;

  IF (_type IN ('M', 'F', 'B', 'T')) THEN
    SELECT metric_value INTO _trackMethod
    FROM metric
    WHERE (metric_name='TrackMachineOverhead');

    IF ( (FOUND) AND
         (_trackMethod = 'M') )THEN

      FOR _booitem IN SELECT booitem_rntime, booitem_rnqtyper,
                             booitem_invproduomratio,
                             wrkcnt_nummachs, wrkcnt_brd_ratepermachhr
                    FROM xtmfg.booitem(pItemid), xtmfg.wrkcnt
                    WHERE ((booitem_wrkcnt_id=wrkcnt_id)
                     AND ( CURRENT_DATE BETWEEN booitem_effective
                                        AND (booitem_expires - 1) )) LOOP

--  Overhead per Machine Hour
        _cost := _cost + ( ( _booitem.booitem_rntime /
                             _booitem.booitem_rnqtyper /
                             _booitem.booitem_invproduomratio ) *
                           ( _booitem.wrkcnt_nummachs *
                             _booitem.wrkcnt_brd_ratepermachhr / 60 ) );

      END LOOP;
    END IF;

    RETURN _cost;

  ELSE
    RETURN NULL;
  END IF;

END;
$$ LANGUAGE 'plpgsql';
