CREATE OR REPLACE FUNCTION xt.co_schedule_date(cohead) RETURNS DATE STABLE AS $$
  SELECT min(coitem_scheddate)
    FROM coitem
   WHERE coitem_cohead_id = $1.cohead_id
     AND coitem_status    = 'O'
     AND coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned > 0;
$$ LANGUAGE sql;
