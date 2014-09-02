CREATE OR REPLACE FUNCTION xtmfg.mrpExceptions(integer, date, date)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemsiteId ALIAS FOR $1;
  pCutOff     ALIAS FOR $2;
  pFence      ALIAS FOR $3;
  _r          RECORD;
  _counter    integer;
  _type       text[];
  _id         integer[];
  _qty        numeric[];
  _due_date   date[];
  _alloted    numeric;
  _remaining  numeric;
  _row        RECORD;
  _result     INTEGER;

BEGIN

  _counter := 0;

  -- Cache itemsite and plancode info
  SELECT * INTO _r
  FROM itemsite JOIN plancode ON (plancode_id=itemsite_plancode_id)
  WHERE (itemsite_id=pItemsiteId);

  -- Delete existing exceptions
  DELETE FROM xtmfg.mrpexcp
  WHERE (mrpexcp_itemsite_id=pItemsiteId);

  -- Fetch all open supply source quantities
  FOR _row IN
    SELECT type, id, qty, due_date
    FROM (-- Fetch inventory (qty on hand)
          SELECT 'On-hand'::TEXT AS type, itemsite_id AS id,
                 qtyNetable(itemsite_id) AS qty, startOfTime() AS due_date -- startOfTime() to ensure it is the first supply source
          FROM itemsite
          WHERE (itemsite_id=pItemsiteId)

          UNION

          -- Fetch quantities for inbound orders (P/O, W/O, T/O) due on or before the cut off date
          SELECT 'P/O-'::TEXT || pohead_number || '-' || poitem_linenumber::TEXT AS type, poitem_id AS id,
                 noneg(poitem_invvenduomratio * (poitem_qty_ordered - poitem_qty_received + poitem_qty_returned)) AS qty,
                 poitem_duedate AS due_date
          FROM poitem JOIN pohead ON (poitem_pohead_id=pohead_id)
          WHERE ((poitem_itemsite_id=pItemsiteId)
             AND (poitem_duedate BETWEEN startOfTime() AND pCutoff)
             AND (poitem_status NOT IN ('C', 'X'))
             AND ((poitem_qty_ordered - poitem_qty_received + poitem_qty_returned) > 0))

          UNION

          SELECT 'W/O-'::TEXT || formatWoNumber(wo_id) AS type, wo_id AS id,
                 noneg(wo_qtyord - wo_qtyrcv) AS qty,
                 wo_duedate AS due_date
          FROM wo
          WHERE ((wo_itemsite_id=pItemsiteId)
             AND (wo_duedate BETWEEN startOfTime() AND pCutoff)
             AND (wo_status NOT IN ('C', 'X'))
             AND ((wo_qtyord - wo_qtyrcv) > 0))

          UNION

          SELECT 'T/O-'::TEXT || tohead_number || '-' || toitem_linenumber::TEXT AS type, toitem_id AS id,
                 noneg(toitem_qty_ordered - toitem_qty_received - toitem_qty_shipped) AS qty,
                 toitem_duedate AS due_date
          FROM toitem JOIN tohead ON (toitem_tohead_id=tohead_id)
          WHERE ((toitem_item_id=(SELECT itemsite_item_id
                                  FROM itemsite
                                  WHERE itemsite_id=pItemsiteId))
             AND (tohead_dest_warehous_id=(SELECT itemsite_warehous_id
                                           FROM itemsite
                                           WHERE itemsite_id=pItemsiteId))
             AND (toitem_duedate BETWEEN startOfTime() AND pCutoff)
             AND (toitem_status NOT IN ('C', 'X'))
             AND ((toitem_qty_ordered - toitem_qty_received - toitem_qty_shipped) > 0))
          ORDER BY due_date
         ) AS data
  LOOP
        _counter := _counter + 1;
        _type[_counter] := _row.type;
        _id[_counter] := _row.id;
        _qty[_counter] := _row.qty;
        _due_date[_counter] := _row.due_date;
  END LOOP;

-- Fetch demand quantities
  FOR _row IN
    SELECT type, id, qty, due_date
    FROM (-- Fetch demand from inventory (reorder level + safety stock)
          SELECT 'Inventory - demand'::TEXT AS type, itemsite_id AS id,
                 (itemsite_reorderlevel + itemsite_safetystock) AS qty,
                 startOfTime() AS due_date
          FROM itemsite
          WHERE (itemsite_id=pItemsiteId)

          UNION

          -- Fetch demand from all open demand orders (S/O, W/O Matl., T/O)
          SELECT 'S/O-'::TEXT || formatSoNumber(coitem_id) AS type, coitem_id AS id,
                 noneg(coitem_qty_invuomratio * (coitem_qtyord - coitem_qtyshipped)) AS qty,
                 coitem_scheddate AS due_date
          FROM coitem JOIN cohead ON (coitem_cohead_id=cohead_id)
          WHERE ((coitem_itemsite_id=pItemsiteId)
             AND (coitem_scheddate BETWEEN startOfTime() AND pCutoff)
             AND (coitem_status NOT IN ('C', 'X'))
             AND ((coitem_qtyord - coitem_qtyshipped) > 0))

          UNION

          SELECT 'W/O Matl-'::TEXT || formatWoNumber(wo_id) AS type, womatl_id AS id,
                 noneg(womatl_qtyreq - womatl_qtyiss) AS qty,
                 womatl_duedate AS due_date
          FROM womatl JOIN wo ON (womatl_wo_id=wo_id)
          WHERE ((womatl_itemsite_id=pItemsiteId)
             AND (womatl_duedate BETWEEN startOfTime() AND pCutoff)
             AND (wo_status NOT IN ('C', 'X')))

          UNION

          SELECT 'T/O-'::TEXT || tohead_number AS type, toitem_id AS id,
                 noneg(toitem_qty_ordered - toitem_qty_received - toitem_qty_shipped) AS qty,
                 toitem_duedate AS due_date
          FROM toitem JOIN tohead ON (toitem_tohead_id=tohead_id)
          WHERE ((toitem_item_id=(SELECT itemsite_item_id
                                  FROM itemsite
                                  WHERE itemsite_id=pItemsiteId))
             AND (toitem_duedate BETWEEN startOfTime() AND pCutoff)
             AND (tohead_src_warehous_id=(SELECT itemsite_warehous_id
                                          FROM itemsite
                                          WHERE itemsite_id=pItemsiteId))
             AND ((toitem_qty_ordered - toitem_qty_received - toitem_qty_shipped) > 0))
          ORDER BY due_date
         ) AS data
  LOOP
    _remaining := _row.qty;
    FOR i IN 1.._counter LOOP
      EXIT WHEN _remaining <= 0;
      CONTINUE WHEN _qty[i] <= 0;
      IF _remaining <= _qty[i] THEN
        _alloted := _remaining;
        _remaining := 0;
        _qty[i] := _qty[i] - _alloted;
      ELSE
        _alloted := _qty[i];
        _qty[i] := 0;
        _remaining := _remaining - _alloted;
      END IF;

      -- Insert a record of the demand and supply information into the mrpexcp table
      INSERT INTO xtmfg.mrpexcp(mrpexcp_itemsite_id,    mrpexcp_created,
                                mrpexcp_demand_type,    mrpexcp_demand_id,
                                mrpexcp_demand_qty,     mrpexcp_demand_date,
                                mrpexcp_supply_type,    mrpexcp_supply_id,
                                mrpexcp_supply_qty,     mrpexcp_supply_date,
                                mrpexcp_supply_suggqty, mrpexcp_supply_suggdate)
      VALUES(pItemsiteId, CURRENT_DATE,
             _row.type, _row.id,
             _row.qty, _row.due_date,
             _type[i], _id[i],
             _alloted, _due_date[i],
             _alloted,
             CASE WHEN (_due_date[i] = startOfTime()) THEN startOfTime()
                  WHEN ((_row.due_date < pFence) AND (_due_date[i] < pFence)) THEN _due_date[i]
                  WHEN ((_row.due_date < pFence) AND (_due_date[i] >= pFence)) THEN pFence
                  ELSE _row.due_date
             END);
    END LOOP;
  END LOOP;

  -- When all demand is accounted for loop through remaining supply in the array
  -- and insert records into the alloc table with the demand type and id as null
  FOR i IN 1.._counter LOOP
    IF _qty[i] > 0 THEN
      INSERT INTO xtmfg.mrpexcp(mrpexcp_itemsite_id,    mrpexcp_created,
                                mrpexcp_demand_type,    mrpexcp_demand_id,
                                mrpexcp_demand_qty,     mrpexcp_demand_date,
                                mrpexcp_supply_type,    mrpexcp_supply_id,
                                mrpexcp_supply_qty,     mrpexcp_supply_date,
                                mrpexcp_supply_suggqty, mrpexcp_supply_suggdate)
      VALUES(pItemsiteId, CURRENT_DATE,
             NULL, NULL,
             0.00, NULL,
             _type[i], _id[i],
             _qty[i], _due_date[i],
             0.00, _due_date[i]);
    END IF;
  END LOOP;

  IF (_r.plancode_mrpexcp_resched) THEN

  -- Reschedule unreleased W/O's
    FOR _row IN SELECT mrpexcp_supply_id, wo_duedate,
                       MIN(mrpexcp_supply_suggdate) AS minsuggdate
    FROM xtmfg.mrpexcp JOIN wo ON (wo_id=mrpexcp_supply_id)
    WHERE ( (mrpexcp_itemsite_id=pItemsiteId)
      AND   (mrpexcp_supply_type ~ 'W/O-')
      AND   (mrpexcp_demand_qty > 0.0)
      AND   (wo_ordtype <> 'S')
      AND   (wo_status IN ('O', 'E')) )
    GROUP BY mrpexcp_supply_id, wo_duedate LOOP

      IF (_row.minsuggdate <> _row.wo_duedate) THEN
        SELECT changeWoDates(_row.mrpexcp_supply_id,
                             (_row.minsuggdate - _r.itemsite_leadtime),
                             _row.minsuggdate,
                             true) INTO _result;
      END IF;

    END LOOP;

  -- Reschedule unreleased P/O's
    FOR _row IN SELECT mrpexcp_supply_id, poitem_duedate,
                MIN(mrpexcp_supply_suggdate) AS minsuggdate
    FROM xtmfg.mrpexcp JOIN poitem ON (poitem_id=mrpexcp_supply_id)
    WHERE ( (mrpexcp_itemsite_id=pItemsiteId)
      AND   (mrpexcp_supply_type ~ 'P/O-')
      AND   (mrpexcp_demand_qty > 0.0)
      AND   (poitem_order_id IS NULL)
      AND   (poitem_status = 'U') )
    GROUP BY mrpexcp_supply_id, poitem_duedate LOOP

      IF (_row.minsuggdate <> _row.poitem_duedate) THEN
        SELECT changePoitemDueDate(_row.mrpexcp_supply_id,
                                   _row.minsuggdate) INTO _result;
      END IF;

    END LOOP;

  END IF;

  IF (_r.plancode_mrpexcp_delete) THEN

  -- Delete unreleased W/O's
    FOR _row IN SELECT *
    FROM xtmfg.mrpexcp JOIN wo ON (wo_id=mrpexcp_supply_id)
    WHERE ( (mrpexcp_itemsite_id=pItemsiteId)
      AND   (mrpexcp_supply_type ~ 'W/O-')
      AND   (wo_ordtype <> 'S')
      AND   (wo_status IN ('O', 'E')) ) LOOP

      IF ( (_row.mrpexcp_demand_qty = 0.0) AND (_row.mrpexcp_supply_suggqty = 0.0) AND (_row.mrpexcp_supply_qty = _row.wo_qtyord) ) THEN
        SELECT deleteWo(_row.mrpexcp_supply_id, true) INTO _result;
      END IF;

    END LOOP;

  -- Delete unreleased P/O's
    FOR _row IN SELECT *
    FROM xtmfg.mrpexcp JOIN poitem ON (poitem_id=mrpexcp_supply_id)
    WHERE ( (mrpexcp_itemsite_id=pItemsiteId)
      AND   (mrpexcp_supply_type ~ 'P/O-')
      AND   (poitem_order_id IS NULL)
      AND   (poitem_status = 'U') ) LOOP

      IF ( (_row.mrpexcp_demand_qty = 0.0) AND (_row.mrpexcp_supply_suggqty = 0.0) AND (_row.mrpexcp_supply_qty = _row.poitem_qty_ordered) ) THEN
        SELECT deletePoitem(_row.mrpexcp_supply_id) INTO _result;
      END IF;

    END LOOP;

  END IF;

  RETURN 0;
END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
