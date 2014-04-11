
CREATE OR REPLACE FUNCTION xtmfg.machineOverheadCostOper(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pBooitemid ALIAS FOR $1;
  _trackMethod TEXT;
  _cost NUMERIC := 0.0;
  _booitem RECORD;

BEGIN

  SELECT metric_value INTO _trackMethod
  FROM metric
  WHERE (metric_name='TrackMachineOverhead');

  IF ( (FOUND) AND
       (_trackMethod = 'M') )THEN

    SELECT booitem_rntime, booitem_rnqtyper,
           booitem_invproduomratio,
           wrkcnt_nummachs, wrkcnt_brd_ratepermachhr
    INTO _booitem
    FROM xtmfg.booitem JOIN xtmfg.wrkcnt ON (booitem_wrkcnt_id=wrkcnt_id)
    WHERE ((booitem_id=pBooitemid)
      AND ( CURRENT_DATE BETWEEN booitem_effective
                             AND (booitem_expires - 1) ));

--  Overhead per Machine Hour
  _cost := _cost + ( ( _booitem.booitem_rntime /
                       _booitem.booitem_rnqtyper /
                       _booitem.booitem_invproduomratio ) *
                     ( _booitem.wrkcnt_nummachs *
                       _booitem.wrkcnt_brd_ratepermachhr / 60 ) );

  END IF;

  RETURN COALESCE(_cost, 0.0);

END;
$$ LANGUAGE 'plpgsql';
