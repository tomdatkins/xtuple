
CREATE OR REPLACE FUNCTION xtmfg.overheadCostOper(int4) RETURNS NUMERIC AS $$
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

  IF (NOT FOUND) THEN
    _trackMethod := 'G';
  END IF;

  SELECT booitem_rntime, booitem_rnqtyper, booitem_sutime,
         booitem_invproduomratio,
         wrkcnt_numpeople,
         CASE WHEN wrkcnt_run_lbrrate_id = -1 THEN wrkcnt_runrate
              ELSE (SELECT lbrrate_rate
                    FROM xtmfg.lbrrate
                    WHERE lbrrate_id = wrkcnt_run_lbrrate_id)
         END AS wrkcnt_runrate,
         CASE WHEN wrkcnt_setup_lbrrate_id = -1 THEN wrkcnt_setuprate
              ELSE (SELECT lbrrate_rate
                    FROM xtmfg.lbrrate
                    WHERE lbrrate_id = wrkcnt_setup_lbrrate_id)
         END AS wrkcnt_setuprate,
         wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr, 
         wrkcnt_nummachs, wrkcnt_brd_ratepermachhr,
         wrkcnt_brd_rateperunitprod
  INTO _booitem
  FROM xtmfg.booitem JOIN xtmfg.wrkcnt ON (wrkcnt_id=booitem_wrkcnt_id)
  WHERE ((booitem_id=pBooitemid)
    AND ( CURRENT_DATE BETWEEN booitem_effective
                           AND (booitem_expires - 1) ));

--  Overhead % of Labor
  IF (_booitem.wrkcnt_brd_prcntlbr <> 0) THEN
--  Run
    _cost := _cost + ( ( _booitem.booitem_rntime /
                         _booitem.booitem_rnqtyper /
                         _booitem.booitem_invproduomratio ) *
                         ( _booitem.wrkcnt_numpeople *
                           _booitem.wrkcnt_runrate / 60 ) *
                           _booitem.wrkcnt_brd_prcntlbr );

--  Setup
    _cost := _cost + ( ( _booitem.booitem_sutime /
                         _booitem.booitem_rnqtyper /
                         _booitem.booitem_invproduomratio ) *
                         ( _booitem.wrkcnt_numpeople *
                           _booitem.wrkcnt_setuprate / 60) *
                           _booitem.wrkcnt_brd_prcntlbr );
  END IF;

--  Overhead per Labor Hour
--  Run
  _cost := _cost + ( ( _booitem.booitem_rntime /
                       _booitem.booitem_rnqtyper /
                       _booitem.booitem_invproduomratio ) *
                     ( _booitem.wrkcnt_numpeople *
                       _booitem.wrkcnt_brd_rateperlbrhr / 60 ) );

--  Setup
    _cost := _cost + ( ( _booitem.booitem_sutime /
                         _booitem.booitem_rnqtyper /
                         _booitem.booitem_invproduomratio ) *
                         ( _booitem.wrkcnt_numpeople *
                           _booitem.wrkcnt_brd_rateperlbrhr / 60) );

  IF (_trackMethod = 'G') THEN
--  Overhead per Machine Hour
    _cost := _cost + ( ( _booitem.booitem_rntime /
                         _booitem.booitem_rnqtyper /
                         _booitem.booitem_invproduomratio ) *
                       ( _booitem.wrkcnt_nummachs *
                         _booitem.wrkcnt_brd_ratepermachhr / 60 ) );
  END IF;

--  Overhead per Unit
  _cost := _cost + _booitem.wrkcnt_brd_rateperunitprod;

--  Determine the overhead run costs
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
    AND (booitem_rncosttype='O')
    AND ( CURRENT_DATE BETWEEN booitem_effective
                           AND (booitem_expires - 1) ));

  _cost := _cost + ( ( _booitem.booitem_rntime /
                       _booitem.booitem_rnqtyper /
                       _booitem.booitem_invproduomratio ) *
                     ( _booitem.wrkcnt_numpeople *
                       _booitem.wrkcnt_runrate / 60) );

--  Determine the overhead setup costs
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
    AND (booitem_sucosttype='O')
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
