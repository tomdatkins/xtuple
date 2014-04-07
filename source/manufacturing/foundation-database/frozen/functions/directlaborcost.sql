
CREATE OR REPLACE FUNCTION xtmfg.directLaborCost(int4) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  _type TEXT;
  _cost NUMERIC;
  _booitem RECORD;

BEGIN

  SELECT item_type INTO _type
  FROM item
  WHERE (item_id=pItemid);

  IF (_type IN ('M', 'F', 'B', 'T')) THEN
    _cost := 0;

--  Determine the direct labor run costs
    FOR _booitem IN SELECT booitem_rntime, booitem_rnqtyper,
                           booitem_invproduomratio,
                           wrkcnt_numpeople,
			   COALESCE(lbrrate_rate, wrkcnt_runrate) AS wrkcnt_runrate
                    FROM xtmfg.booitem(pItemid), xtmfg.wrkcnt LEFT OUTER JOIN
			 xtmfg.lbrrate ON (wrkcnt_run_lbrrate_id = lbrrate_id)
                    WHERE ((booitem_wrkcnt_id=wrkcnt_id)
                     AND (booitem_rnqtyper <> 0)
                     AND (booitem_invproduomratio <> 0)
                     AND (booitem_rncosttype='D')
                     AND ( CURRENT_DATE BETWEEN booitem_effective
                                        AND (booitem_expires - 1) )) LOOP

      _cost := _cost + ( ( _booitem.booitem_rntime /
                           _booitem.booitem_rnqtyper /
                           _booitem.booitem_invproduomratio ) *
                         ( _booitem.wrkcnt_numpeople *
                           _booitem.wrkcnt_runrate / 60) );

    END LOOP;

--  Determine the direct labor setup costs
    FOR _booitem IN SELECT booitem_sutime, booitem_rnqtyper,
                           booitem_invproduomratio,
                           wrkcnt_numpeople,
			   COALESCE(lbrrate_rate, wrkcnt_setuprate) AS wrkcnt_setuprate
                    FROM xtmfg.booitem(pItemid), xtmfg.wrkcnt LEFT OUTER JOIN
			 xtmfg.lbrrate ON (wrkcnt_setup_lbrrate_id = lbrrate_id)
                    WHERE ((booitem_wrkcnt_id=wrkcnt_id)
                     AND (booitem_rnqtyper <> 0)
                     AND (booitem_invproduomratio <> 0)
                     AND (booitem_sucosttype='D')
                     AND ( CURRENT_DATE BETWEEN booitem_effective
                                        AND (booitem_expires - 1) )) LOOP

      _cost := _cost + ( ( _booitem.booitem_sutime /
                           _booitem.booitem_rnqtyper /
                           _booitem.booitem_invproduomratio ) *
                         ( _booitem.wrkcnt_numpeople *
                           _booitem.wrkcnt_setuprate / 60) );

    END LOOP;

    RETURN _cost;

  ELSE
    RETURN NULL;
  END IF;

END;
$$ LANGUAGE 'plpgsql';
