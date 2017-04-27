CREATE OR REPLACE FUNCTION buildInvBal(pItemsiteId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  DELETE FROM invbal
  WHERE invbal_itemsite_id=pItemsiteId;

  INSERT INTO invbal
  (invbal_period_id, invbal_itemsite_id,
   invbal_qoh_beginning, invbal_qoh_ending, invbal_qty_in, invbal_qty_out,
   invbal_value_beginning, invbal_value_ending, invbal_value_in, invbal_value_out,
   invbal_nn_beginning, invbal_nn_ending, invbal_nn_in, invbal_nn_out,
   invbal_nnval_beginning, invbal_nnval_ending, invbal_nnval_in, invbal_nnval_out,
   invbal_dirty)
  SELECT period_id, pItemsiteId,
  COALESCE(SUM(qtyin-qtyout) OVER (ORDER BY period_start ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING), 0.0) AS qtybegin,
  COALESCE(SUM(qtyin-qtyout) OVER (ORDER BY period_start ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 0.0) AS qtyend,
  qtyin, qtyout,
  COALESCE(SUM(valin-valout) OVER (ORDER BY period_start ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING), 0.0) AS valbegin,
  COALESCE(SUM(valin-valout) OVER (ORDER BY period_start ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 0.0) AS valend,
  valin, valout,
  COALESCE(SUM(nnin-nnout) OVER (ORDER BY period_start ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING), 0.0) AS nnbegin,
  COALESCE(SUM(nnin-nnout) OVER (ORDER BY period_start ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 0.0) AS nnend,
  nnin, nnout,
  COALESCE(SUM(nnvalin-nnvalout) OVER (ORDER BY period_start ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING), 0.0) AS nnvalbegin,
  COALESCE(SUM(nnvalin-nnvalout) OVER (ORDER BY period_start ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 0.0) AS nnvalend,
  nnvalin, nnvalout, false
  FROM
  (SELECT period_id, period_start, 
   COALESCE(SUM(CASE WHEN COALESCE(sense * invhist_invqty > 0, false) THEN abs(invhist_invqty) END), 0.0) AS qtyin,
   COALESCE(SUM(CASE WHEN COALESCE(sense * invhist_invqty < 0, false) THEN abs(invhist_invqty) END), 0.0) AS qtyout,
   COALESCE(SUM(CASE WHEN COALESCE(val > 0, false) THEN abs(val) END), 0.0) AS valin,
   COALESCE(SUM(CASE WHEN COALESCE(val < 0, false) THEN abs(val) END), 0.0) AS valout,
   COALESCE(SUM(nnin), 0.0) AS nnin,
   COALESCE(SUM(nnout), 0.0) AS nnout,
   COALESCE(SUM(round(nnin * invhist_unitcost, 2)), 0.0) AS nnvalin,
   COALESCE(SUM(round(nnout * invhist_unitcost, 2)), 0.0) AS nnvalout
   FROM
   (SELECT period_id, period_start, CASE WHEN invhist_id IS NOT NULL THEN invhistSense(invhist_id) ELSE 0 END AS sense,
    invhist_invqty, invhist_unitcost, invhist_value_after-invhist_value_before AS val,
    COALESCE(SUM(CASE WHEN COALESCE(NOT location_netable, false) AND COALESCE(invdetail_qty > 0, false) THEN abs(invdetail_qty) END), 0.0) AS nnin,
    COALESCE(SUM(CASE WHEN COALESCE(NOT location_netable, false) AND COALESCE(invdetail_qty < 0, false) THEN abs(invdetail_qty) END), 0.0) AS nnout
    FROM period
    LEFT OUTER JOIN invhist ON invhist_transdate BETWEEN period_start AND period_end
    AND invhist_itemsite_id=pItemsiteId
    AND invhist_posted
    LEFT OUTER JOIN invdetail ON invhist_id=invdetail_invhist_id
    LEFT OUTER JOIN location ON invdetail_location_id=location_id
    GROUP BY period_id, period_start, invhist_id, invhist_invqty) nn
   GROUP BY period_id, period_start) inout
   ORDER BY period_start;

  RETURN 1;

END;
$$ LANGUAGE plpgsql;
