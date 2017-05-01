CREATE OR REPLACE FUNCTION forwardUpdateInvBalance(pInvbalId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  INSERT INTO invbal
  (invbal_period_id, invbal_itemsite_id, invbal_dirty)
  SELECT after.period_id, invbal_itemsite_id, FALSE
    FROM invbal
    JOIN period ON invbal_period_id=period_id
    JOIN period after ON after.period_start > period_start
   WHERE invbal_id=pInvbalId
     AND NOT EXISTS (SELECT 1
                       FROM invbal test
                      WHERE invbal_itemsite_id=test.invbal_itemsite_id
                        AND invbal_period_id=after.period_id);

  UPDATE invbal
     SET invbal_qoh_beginning=start.invbal_qoh_ending +
                           SUM(next.invbal_qty_in-next.invbal_qty_out)
                           OVER (ORDER BY after.period_start ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
         invbal_qoh_ending=start.invbal_qoh_ending +
                           SUM(next.invbal_qty_in-next.invbal_qty_out)
                           OVER (ORDER BY after.period_start ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
         invbal_value_beginning=start.invbal_value_ending +
                           SUM(next.invbal_value_in-next.invbal_value_out)
                           OVER (ORDER BY after.period_start ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
         invbal_value_ending=start.invbal_value_ending +
                           SUM(next.invbal_value_in-next.invbal_value_out)
                           OVER (ORDER BY after.period_start ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
         invbal_nn_beginning=start.invbal_nn_ending +
                           SUM(next.invbal_nn_in-next.invbal_nn_out)
                           OVER (ORDER BY after.period_start ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
         invbal_nn_ending=start.invbal_nn_ending +
                           SUM(next.invbal_nn_in-next.invbal_nn_out)
                           OVER (ORDER BY after.period_start ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
         invbal_nnval_beginning=start.invbal_nnval_ending +
                           SUM(next.invbal_nnval_in-next.invbal_nnval_out)
                           OVER (ORDER BY after.period_start ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
         invbal_nnval_ending=start.invbal_nnval_ending +
                           SUM(next.invbal_nnval_in-next.invbal_nnval_out)
                           OVER (ORDER BY after.period_start ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
    FROM invbal start
    JOIN period ON invbal_period_id=period_id
    JOIN period after ON after.period_start > period_start
    JOIN invbal next ON start.invbal_itemsite_id=next.invbal_itemsite_id
                    AND after.period_id=next.invbal_period_id
   WHERE start.invbal_id=pInvbalId
     AND invbal_id=next.invbal_id;

  UPDATE invbal
  SET invbal_dirty=FALSE
  WHERE (invbal_id=pInvbalid);

  RETURN pInvbalid;

END;
$$ LANGUAGE plpgsql;
