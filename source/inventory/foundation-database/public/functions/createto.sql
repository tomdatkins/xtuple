
CREATE OR REPLACE FUNCTION createTo(INTEGER, INTEGER, NUMERIC, DATE, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pSrcItemsiteid ALIAS FOR $1;
  pDstItemsiteid ALIAS FOR $2;
  pQtyOrdered ALIAS FOR $3;
  pDueDate ALIAS FOR $4;
  pAppendTransferOrder ALIAS FOR $5;
  _s RECORD;
  _d RECORD;
  _t RECORD;
  _toheadid INTEGER;
  _toitemid INTEGER;
  _tonumber TEXT := '';
  _tolinenumber INTEGER;
  _result INTEGER;
  _debug BOOLEAN := false;

BEGIN

  if (_debug) THEN
    raise notice 'createTo function';
    raise notice 'pSrcItemsiteid=%', pSrcItemsiteid;
    raise notice 'pDstItemsiteid=%', pDstItemsiteid;
    raise notice 'pQtyOrdered=%', pQtyOrdered;
    raise notice 'pDueDate=%', pDueDate;
    raise notice 'pAppendTransferOrder=%', pAppendTransferOrder;
  end if;

--  Determine source, destination, and transit warehouses
  SELECT *, stdCost(item_id) AS itemstdcost INTO _s
  FROM itemsite JOIN whsinfo ON (warehous_id=itemsite_warehous_id)
                JOIN addr ON (addr_id=warehous_addr_id)
                JOIN cntct ON (cntct_id=warehous_cntct_id)
                JOIN item ON (item_id=itemsite_item_id)
                JOIN uom ON (uom_id=item_inv_uom_id)
  WHERE (itemsite_id=pSrcItemsiteid);
  IF (NOT FOUND) THEN
    if (_debug) then
      raise notice 'Problem with source itemsite';
    end if;
    RETURN -1;
  END IF;

  SELECT * INTO _d
  FROM itemsite JOIN whsinfo ON (warehous_id=itemsite_warehous_id)
                JOIN addr ON (addr_id=warehous_addr_id)
                JOIN cntct ON (cntct_id=warehous_cntct_id)
  WHERE (itemsite_id=pDstItemsiteid);
  IF (NOT FOUND) THEN
    if (_debug) then
      raise notice 'Problem with destination itemsite';
    end if;
    RETURN -2;
  END IF;

  SELECT * INTO _t
  FROM whsinfo  JOIN addr ON (addr_id=warehous_addr_id)
                JOIN cntct ON (cntct_id=warehous_cntct_id)
                JOIN shipvia ON (shipvia_id=warehous_shipvia_id)
  WHERE (warehous_id=fetchMetricValue('DefaultTransitWarehouse'));
  IF (NOT FOUND) THEN
    if (_debug) then
      raise notice 'Problem with transit itemsite';
    end if;
    RETURN -3;
  END IF;

  IF (pAppendTransferOrder) THEN
--  Check for existing unreleased order
    SELECT tohead_id INTO _toheadid
    FROM tohead
    WHERE ( (tohead_status='U')
      AND   (tohead_src_warehous_id=_s.warehous_id)
      AND   (tohead_dest_warehous_id=_d.warehous_id) )
    ORDER BY tohead_number
    LIMIT 1;

    if (_debug) then
      raise notice 'Existing unreleased _toheadid=%', _toheadid;
    end if;

  END IF;

  IF (_toheadid IS NULL) THEN
--  Create a new Transfer Order
    SELECT NEXTVAL('tohead_tohead_id_seq') INTO _toheadid;
    SELECT fetchToNumber() INTO _tonumber;

    if (_debug) then
      raise notice 'Creating _toheadid=%, _tonumber=%', _toheadid, _tonumber;
    end if;

    INSERT INTO tohead
    ( tohead_id, tohead_number, tohead_status, tohead_orderdate,
      tohead_src_warehous_id, tohead_srcname, tohead_srcaddress1,
      tohead_srcaddress2, tohead_srcaddress3, tohead_srccity,
      tohead_srcstate, tohead_srcpostalcode, tohead_srccountry,
      tohead_srccntct_id, tohead_srccntct_name, tohead_srcphone,
      tohead_trns_warehous_id, tohead_trnsname,
      tohead_dest_warehous_id, tohead_destname, tohead_destaddress1,
      tohead_destaddress2, tohead_destaddress3, tohead_destcity,
      tohead_deststate, tohead_destpostalcode, tohead_destcountry,
      tohead_destcntct_id, tohead_destcntct_name, tohead_destphone,
      tohead_agent_username, tohead_shipvia, tohead_shipform_id,
      tohead_shipchrg_id, tohead_taxzone_id )
    VALUES
    ( _toheadid, _tonumber, 'U', CURRENT_DATE,
      _s.warehous_id, _s.warehous_code, _s.addr_line1,
      _s.addr_line2, _s.addr_line3, _s.addr_city,
      _s.addr_state, _s.addr_postalcode, _s.addr_country,
      _s.cntct_id, (_s.cntct_first_name || ' ' || _s.cntct_last_name), _s.cntct_phone,
      _t.warehous_id, _t.warehous_code,
      _d.warehous_id, _d.warehous_code, _d.addr_line1,
      _d.addr_line2, _d.addr_line3, _d.addr_city,
      _d.addr_state, _d.addr_postalcode, _d.addr_country,
      _d.cntct_id, (_d.cntct_first_name || ' ' || _d.cntct_last_name), _d.cntct_phone,
      getEffectiveXtUser(), _t.shipvia_code, _t.warehous_shipform_id,
      NULL, _d.warehous_taxzone_id );
  END IF;

--  Create a new Transfer Order Line
  SELECT NEXTVAL('toitem_toitem_id_seq') INTO _toitemid;
  SELECT nextToLineNumber(_toheadid) INTO _tolinenumber;

  INSERT INTO toitem
  ( toitem_id, toitem_tohead_id, toitem_linenumber,
    toitem_item_id, toitem_status, toitem_duedate,
    toitem_schedshipdate, toitem_schedrecvdate,
    toitem_qty_ordered, toitem_uom, toitem_stdcost )
  VALUES
  ( _toitemid, _toheadid, _tolinenumber,
    _s.item_id, 'U', pDueDate,
    pDueDate, pDueDate,
    pQtyOrdered, _s.uom_name, _s.itemstdcost );

  RETURN _toheadid;

END;
$$ LANGUAGE 'plpgsql';
