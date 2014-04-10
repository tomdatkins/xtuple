
CREATE OR REPLACE FUNCTION xtmfg.directLaborCostOper(int4) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pBooitemid ALIAS FOR $1;
  _booitem RECORD;
  _cost NUMERIC := 0.0;

BEGIN

--  Determine the direct labor run costs
  SELECT booitem_rntime, booitem_rnqtyper,
         booitem_invproduomratio,
         wrkcnt_numpeople,
         COALESCE(lbrrate_rate, wrkcnt_runrate) AS wrkcnt_runrate
  INTO _booitem
  FROM xtmfg.booitem JOIN xtmfg.wrkcnt ON (wrkcnt_id=booitem_wrkcnt_id)
                     LEFT OUTER JOIN xtmfg.lbrrate ON (wrkcnt_run_lbrrate_id=lbrrate_id)
  WHERE ((booitem_id=pBooitemid)
    AND (booitem_rnqtyper <> 0)
    AND (booitem_invproduomratio <> 0)
    AND (booitem_rncosttype='D')
    AND ( CURRENT_DATE BETWEEN booitem_effective
                           AND (booitem_expires - 1) ));

  _cost := _cost + ( ( _booitem.booitem_rntime /
                       _booitem.booitem_rnqtyper /
                       _booitem.booitem_invproduomratio ) *
                     ( _booitem.wrkcnt_numpeople *
                       _booitem.wrkcnt_runrate / 60) );

--  Determine the direct labor setup costs
  SELECT booitem_sutime, booitem_rnqtyper,
         booitem_invproduomratio,
         wrkcnt_numpeople,
         COALESCE(lbrrate_rate, wrkcnt_setuprate) AS wrkcnt_setuprate
  INTO _booitem
  FROM xtmfg.booitem JOIN xtmfg.wrkcnt ON (wrkcnt_id=booitem_wrkcnt_id)
                     LEFT OUTER JOIN xtmfg.lbrrate ON (wrkcnt_setup_lbrrate_id=lbrrate_id)
  WHERE ((booitem_id=pBooitemid)
    AND (booitem_rnqtyper <> 0)
    AND (booitem_invproduomratio <> 0)
    AND (booitem_sucosttype='D')
    AND ( CURRENT_DATE BETWEEN booitem_effective
                           AND (booitem_expires - 1) ));

  _cost := _cost + ( ( _booitem.booitem_sutime /
                       _booitem.booitem_rnqtyper /
                       _booitem.booitem_invproduomratio ) *
                     ( _booitem.wrkcnt_numpeople *
                       _booitem.wrkcnt_setuprate / 60) );

  RETURN COALESCE(_cost, 0.0);

END;
$$ LANGUAGE 'plpgsql';
