INSERT INTO oldinvbal
(oldinvbal_id, oldinvbal_period_id, oldinvbal_itemsite_id,
 oldinvbal_qoh_beginning, oldinvbal_qoh_ending, oldinvbal_qty_in, oldinvbal_qty_out,
 oldinvbal_value_beginning, oldinvbal_value_ending, oldinvbal_value_in, oldinvbal_value_out,
 oldinvbal_nn_beginning, oldinvbal_nn_ending, oldinvbal_nn_in, oldinvbal_nn_out,
 oldinvbal_nnval_beginning, oldinvbal_nnval_ending, oldinvbal_nnval_in, oldinvbal_nnval_out,
 oldinvbal_dirty)
SELECT invbal_id, invbal_period_id, invbal_itemsite_id,
       invbal_qoh_beginning, invbal_qoh_ending, invbal_qty_in, invbal_qty_out,
       invbal_value_beginning, invbal_value_ending, invbal_value_in, invbal_value_out,
       invbal_nn_beginning, invbal_nn_ending, invbal_nn_in, invbal_nn_out,
       invbal_nnval_beginning, invbal_nnval_ending, invbal_nnval_in, invbal_nnval_out,
       invbal_dirty
  FROM invbal;
