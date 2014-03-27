
CREATE OR REPLACE FUNCTION lshist(integer, integer, text, boolean, integer, date, date, char, integer) RETURNS SETOF lshist AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemId    	ALIAS FOR $1;
  pWarehousId	ALIAS FOR $2;
  pLotSerial 	ALIAS FOR $3;
  pPattern     	ALIAS FOR $4;
  pTransType 	ALIAS FOR $5;
  pStartDate 	ALIAS FOR $6;
  pEndDate   	ALIAS FOR $7;
  pTrace 	ALIAS FOR $8;
  pLevel       	ALIAS FOR $9;
  _row lshist%ROWTYPE;
  _x RECORD;
  _y RECORD;
  _z RECORD;
  _transtype TEXT;
  _transint INTEGER;
  _trace BOOLEAN := FALSE;

  _debug BOOLEAN := FALSE;
  
BEGIN

-- Validate
  IF (pLotSerial IS NULL AND pItemId IS NULL) THEN
    RAISE EXCEPTION 'Lot/Serial number or Item number must be provided';
  ELSIF (pTrace NOT IN ('N','F','B')) THEN
    RAISE EXCEPTION 'Multi-level trace flag must be provided: N=None, F=Forward, B=Backward';
--  ELSIF (pLevel > 10) THEN
--    RAISE NOTICE 'Cannot explore lot/serial history >= % levels deep.', pLevel;
--    RETURN;
  END IF;

-- Fetch Data
  FOR _x IN

    SELECT invhist_id,
      warehous_code,
      invhist_transdate,
      invhist_transtype, 
      (invhist_ordtype || '-' || invhist_ordnumber) AS ordernumber,
      invhist_invuom,
      item_number, 
      ls_number,
      CASE 
        WHEN (invdetail_location_id=-1) THEN 
          ''
        ELSE 
          formatLocationName(invdetail_location_id)
        END AS locationname,
      invdetail_qty,
      invdetail_qty_before,
      invdetail_qty_after,
      invhist_posted,
      CASE WHEN (NOT invhist_posted) THEN 'warning'
      END AS status,
      invhist_ordtype,
      invhist_ordnumber
      FROM invdetail, invhist, itemsite, item, whsinfo, ls 
      WHERE ( (invdetail_invhist_id=invhist_id)
      AND (invdetail_ls_id=ls_id)
      AND (invhist_itemsite_id=itemsite_id)
      AND (itemsite_item_id=item_id)
      AND (itemsite_warehous_id=warehous_id)
      AND ((pWarehousId IS NULL) OR (warehous_id=pWarehousId))
      AND ((pLotSerial IS NULL) 
        OR (pPattern AND (ls_number ~ pLotSerial))
        OR (ls_number=pLotSerial))
      AND (DATE(invhist_transdate) BETWEEN COALESCE(pStartDate,startoftime()) AND COALESCE(pEndDate,endoftime()))
      AND (transType(invhist_transtype, pTransType))
      AND ((pItemId IS NULL) OR (item_id=pItemId)) )
      ORDER BY invhist_transdate DESC, invhist_transtype
    LOOP
      IF (_debug) THEN
        RAISE NOTICE 'lshist_id %: item_number %, lotserial % level %',
                           _x.invhist_id, _x.item_number, _x.ls_number, pLevel;
      END IF;
                               
      _row.lshist_id			:= _x.invhist_id;
      _row.lshist_level			:= pLevel;
      _row.lshist_warehous_code	:= _x.warehous_code;
      _row.lshist_transdate		:= _x.invhist_transdate;
      _row.lshist_transtype		:= _x.invhist_transtype;
      _row.lshist_ordernumber		:= _x.ordernumber;
      _row.lshist_invuom		:= _x.invhist_invuom;
      _row.lshist_item_number		:= _x.item_number;
      _row.lshist_lotserial		:= _x.ls_number;
      _row.lshist_locationname		:= _x.locationname;
      _row.lshist_transqty		:= _x.invdetail_qty;
      _row.lshist_qty_before		:= _x.invdetail_qty_before;
      _row.lshist_qty_after		:= _x.invdetail_qty_after;
      _row.lshist_posted		:= _x.invhist_posted;
      _row.lshist_transqty_xtnumericrole     := 'qty';
      _row.lshist_qty_before_xtnumericrole   := 'qty';
      _row.lshist_qty_after_xtnumericrole    := 'qty';
      _row.qtforegroundrole                  := _x.status;
      _row.xtindentrole                      := (pLevel - 1);
      RETURN NEXT _row;

      IF ((pTrace = 'F')
        AND (issues(_x.invhist_transtype))
	AND (_x.invhist_ordtype='WO')
	AND (_x.invhist_ordnumber != 'Misc.')) THEN
        _transtype := 'RM';
        _transint := 255;
        _trace := TRUE;
      ELSIF ((pTrace = 'B')
        AND (receipts(_x.invhist_transtype))
	AND (_x.invhist_ordtype='WO')
	AND (_x.invhist_ordnumber != 'Misc.')) THEN
	_transtype := 'IM';
	_transint := 1;
	_trace := TRUE;
      END IF;

      IF (_trace) THEN
        FOR _y IN
          SELECT invhist_id,
            warehous_code,
            invhist_transdate,
            invhist_transtype, 
            (invhist_ordtype || '-' || invhist_ordnumber) AS ordernumber,
            invhist_invuom,
            item_number, 
            ls_number,
            CASE 
              WHEN (invdetail_location_id=-1) THEN 
               ''
              ELSE 
               formatLocationName(invdetail_location_id)
            END AS locationname,
            invdetail_qty,
            invdetail_qty_before,
            invdetail_qty_after,
            invhist_posted,
            CASE WHEN (NOT invhist_posted) THEN 'warning'
            END AS status,
            itemsite_item_id,
            itemsite_warehous_id
          FROM invdetail, invhist, itemsite, item, whsinfo, ls
          WHERE ( (invdetail_invhist_id=invhist_id)
          AND (invdetail_ls_id=ls_id)
          AND (invhist_itemsite_id=itemsite_id)
          AND (itemsite_item_id=item_id)
          AND (itemsite_warehous_id=warehous_id)
          AND (invhist_transtype=_transtype)
          AND (invhist_ordtype='WO')
          AND (invhist_ordnumber=_x.invhist_ordnumber)
          AND (invhist_id!=_x.invhist_id))
        LOOP
          IF (_debug) THEN
            RAISE NOTICE 'lshist_id %: item_number %, lotserial % level %',
                        _y.invhist_id, _y.item_number, _y.ls_number, pLevel +1;
          END IF;
                                   
          _row.lshist_id		:= _y.invhist_id;
          _row.lshist_level		:= pLevel+1;
          _row.lshist_warehous_code	:= _y.warehous_code;
          _row.lshist_transdate	:= _y.invhist_transdate;
          _row.lshist_transtype	:= _y.invhist_transtype;
          _row.lshist_ordernumber	:= _y.ordernumber;
          _row.lshist_invuom		:= _y.invhist_invuom;
          _row.lshist_item_number	:= _y.item_number;
          _row.lshist_lotserial	:= _y.ls_number;
          _row.lshist_locationname	:= _y.locationname;
          _row.lshist_transqty		:= _y.invdetail_qty;
          _row.lshist_qty_before	:= _y.invdetail_qty_before;
          _row.lshist_qty_after	:= _y.invdetail_qty_after;
          _row.lshist_posted		:= _y.invhist_posted;
          _row.lshist_transqty_xtnumericrole     := 'qty';
          _row.lshist_qty_before_xtnumericrole   := 'qty';
          _row.lshist_qty_after_xtnumericrole    := 'qty';
          _row.qtforegroundrole                  := _y.status;
          _row.xtindentrole                      := pLevel;
          RETURN NEXT _row;

	  IF (LENGTH(_y.ls_number) > 0) THEN
            FOR _z IN
              SELECT * FROM lshist(_y.itemsite_item_id,pWarehousId,_y.ls_number,FALSE,_transint,pStartDate,pEndDate,pTrace,pLevel+2)
              WHERE (lshist_transtype != 'RM')
            LOOP
              IF (_debug) THEN
                RAISE NOTICE 'lshist_id %: item_number %, lotserial % level %',
                            _z.lshist_id, _z.lshist_item_number,
                            _z.lshist_lotserial, _z.lshist_level;
              END IF;
                                       
              _row.lshist_id		:= _z.lshist_id;
              _row.lshist_level	:= _z.lshist_level;
              _row.lshist_warehous_code:= _z.lshist_warehous_code;
              _row.lshist_transdate	:= _z.lshist_transdate;
              _row.lshist_transtype	:= _z.lshist_transtype;
              _row.lshist_ordernumber	:= _z.lshist_ordernumber;
              _row.lshist_invuom	:= _z.lshist_invuom;
              _row.lshist_item_number	:= _z.lshist_item_number;
              _row.lshist_lotserial	:= _z.lshist_lotserial;
              _row.lshist_locationname	:= _z.lshist_locationname;
              _row.lshist_transqty	:= _z.lshist_transqty;
              _row.lshist_qty_before	:= _z.lshist_qty_before;
              _row.lshist_qty_after	:= _z.lshist_qty_after;
              _row.lshist_posted	:= _z.lshist_posted;
              _row.lshist_transqty_xtnumericrole     := _z.lshist_transqty_xtnumericrole;
              _row.lshist_qty_before_xtnumericrole   := _z.lshist_qty_before_xtnumericrole;
              _row.lshist_qty_after_xtnumericrole    := _z.lshist_qty_before_xtnumericrole;
              _row.qtforegroundrole                  := _z.qtforegroundrole;
              _row.xtindentrole                      := _z.xtindentrole;
              RETURN NEXT _row;

            END LOOP;
          END IF;
        END LOOP;
      END IF;
    END LOOP;
  RETURN;
END;
$$ LANGUAGE 'plpgsql';

