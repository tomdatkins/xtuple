CREATE OR REPLACE FUNCTION forwardUpdateInvBalance(pInvbalId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  INSERT INTO invbal
  (invbal_period_id, invbal_itemsite_id, invbal_dirty)
  SELECT after.period_id, invbal_itemsite_id, FALSE
    FROM invbal
    JOIN period ON invbal_period_id=period_id
    JOIN period after ON after.period_start > period.period_start
   WHERE invbal_id=pInvbalId
     AND NOT EXISTS (SELECT 1
                       FROM invbal test
                      WHERE invbal_itemsite_id=test.invbal_itemsite_id
                        AND invbal_period_id=after.period_id);

  UPDATE invbal
     SET invbal_qoh_beginning=COALESCE(total.qtystart, 0.0),
         invbal_qoh_ending=COALESCE(total.qtyend, 0.0),
         invbal_value_beginning=COALESCE(total.valstart, 0.0),
         invbal_value_ending=COALESCE(total.valend, 0.0),
         invbal_nn_beginning=COALESCE(total.nnstart, 0.0),
         invbal_nn_ending=COALESCE(total.nnend, 0.0),
         invbal_nnval_beginning=COALESCE(total.nnvalstart, 0.0),
         invbal_nnval_ending=COALESCE(total.nnvalend, 0.0)
    FROM
    (SELECT next.invbal_id AS invbal_id,
            start.invbal_qoh_ending +
            SUM(next.invbal_qty_in-next.invbal_qty_out) OVER prev AS qtystart,
            start.invbal_qoh_ending +
            SUM(next.invbal_qty_in-next.invbal_qty_out) OVER curr AS qtyend,
            start.invbal_value_ending +
            SUM(next.invbal_value_in-next.invbal_value_out) OVER prev AS valstart,
            start.invbal_value_ending +
            SUM(next.invbal_value_in-next.invbal_value_out) OVER curr AS valend,
            start.invbal_nn_ending +
            SUM(next.invbal_nn_in-next.invbal_nn_out) OVER prev AS nnstart,
            start.invbal_nn_ending +
            SUM(next.invbal_nn_in-next.invbal_nn_out) OVER curr AS nnend,
            start.invbal_nnval_ending +
            SUM(next.invbal_nnval_in-next.invbal_nnval_out) OVER prev AS nnvalstart,
            start.invbal_nnval_ending +
            SUM(next.invbal_nnval_in-next.invbal_nnval_out) OVER curr AS nnvalend
     FROM invbal start
     JOIN period ON invbal_period_id=period_id
     JOIN period after ON after.period_start > period.period_start
     JOIN invbal next ON start.invbal_itemsite_id=next.invbal_itemsite_id
                     AND after.period_id=next.invbal_period_id
     WHERE start.invbal_id=pInvbalId
    WINDOW prev AS (ORDER BY invhist_transdate, invhist_created, invhist_id
                    ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
           curr AS (ORDER BY invhist_transdate, invhist_created, invhist_id
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
    ORDER BY after.period_start) total
   WHERE invbal.invbal_id=total.invbal_id;

  UPDATE invbal
  SET invbal_dirty=FALSE
  WHERE (invbal_id=pInvbalid);

  RETURN pInvbalid;

END;
$$ LANGUAGE plpgsql;
