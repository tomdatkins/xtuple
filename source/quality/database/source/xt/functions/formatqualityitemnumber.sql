create or replace function xt.formatqualityitemnumber(qtitem_id integer) returns text stable as $$
  -- Returns a formatted Quality Test Item Number made up of the Quality Test Number and the Item lineNumber
  SELECT qthead_number ||'-'||qtitem_linenumber
    FROM xt.qthead, xt.qtitem
    WHERE qthead_id=qtitem_qthead_id
    AND qtitem_id=$1
$$ language sql;
