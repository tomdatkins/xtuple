CREATE OR REPLACE FUNCTION xt.po_schedule_date(pohead) RETURNS DATE STABLE AS $$
  SELECT min(poitem_duedate)
    FROM poitem
   WHERE poitem_pohead_id = $1.pohead_id
     AND poitem_status    = 'O'
     AND poitem_qty_ordered - poitem_qty_received > 0;
$$ LANGUAGE sql;
