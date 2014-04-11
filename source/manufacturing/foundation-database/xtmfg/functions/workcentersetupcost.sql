
CREATE OR REPLACE FUNCTION xtmfg.workCenterSetupCost(INTEGER, NUMERIC) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWrkcntid ALIAS FOR $1;
  pTime ALIAS FOR $2;
  _cost NUMERIC;
  _w RECORD;

BEGIN

  SELECT COALESCE(lbrrate_rate, wrkcnt_setuprate) AS wrkcnt_setuprate,
	 wrkcnt_numpeople, wrkcnt_nummachs,
         wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr,
         wrkcnt_brd_ratepermachhr INTO _w
  FROM xtmfg.wrkcnt LEFT OUTER JOIN
       xtmfg.lbrrate ON (wrkcnt_setup_lbrrate_id = lbrrate_id)
  WHERE (wrkcnt_id=pWrkcntid);

  _cost = (_w.wrkcnt_setuprate * _w.wrkcnt_numpeople / 60) +
          ( _w.wrkcnt_setuprate * _w.wrkcnt_numpeople / 60 *
            _w.wrkcnt_brd_prcntlbr ) +
          (_w.wrkcnt_brd_rateperlbrhr * _w.wrkcnt_numpeople / 60);

  _cost = (_cost * pTime);

  RETURN _cost;

END;
$$ LANGUAGE 'plpgsql';

