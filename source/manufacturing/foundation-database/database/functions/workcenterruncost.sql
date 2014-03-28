
CREATE OR REPLACE FUNCTION xtmfg.workCenterRunCost(INTEGER, NUMERIC) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWrkcntid ALIAS FOR $1;
  pTime ALIAS FOR $2;
  _result NUMERIC;

BEGIN

  SELECT xtmfg.workCenterRunCost(pWrkcntid, pTime, 0) INTO _result;
  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION xtmfg.workCenterRunCost(INTEGER, NUMERIC, NUMERIC) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pWrkcntid ALIAS FOR $1;
  pTime ALIAS FOR $2;
  pQty ALIAS FOR $3;
  _cost NUMERIC;
  _w RECORD;

BEGIN

  SELECT COALESCE(lbrrate_rate, wrkcnt_runrate) AS wrkcnt_runrate,
	 wrkcnt_numpeople, wrkcnt_nummachs,
         wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr,
         wrkcnt_brd_ratepermachhr, wrkcnt_brd_rateperunitprod INTO _w
  FROM xtmfg.wrkcnt LEFT OUTER JOIN
       xtmfg.lbrrate ON (wrkcnt_run_lbrrate_id = lbrrate_id)
  WHERE (wrkcnt_id=pWrkcntid);
  IF (FOUND) THEN
    _cost := ( (_w.wrkcnt_runrate * _w.wrkcnt_numpeople / 60) +
             ( _w.wrkcnt_runrate * _w.wrkcnt_numpeople / 60 *
               _w.wrkcnt_brd_prcntlbr ) +
             (_w.wrkcnt_brd_rateperlbrhr * _w.wrkcnt_numpeople / 60) +
             (_w.wrkcnt_brd_ratepermachhr * _w.wrkcnt_nummachs / 60) ) * pTime +
             (_w.wrkcnt_brd_rateperunitprod * pQty);

  ELSE
    _cost := 0;
  END IF;

  RETURN _cost;

END;
$$ LANGUAGE 'plpgsql';
