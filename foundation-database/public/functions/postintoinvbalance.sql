CREATE OR REPLACE FUNCTION postIntoInvBalance(pInvhistId INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN

  SELECT invhist_id, invhist_transdate,
         qty, CASE WHEN qty != 0.0 THEN qty ELSE 1.0 END * invhist_unitcost AS value,
         nnqty, nnqty * invhist_unitcost AS nnval,
         invhist_itemsite_id, period_id, invbal_id INTO _r
  FROM
  (
   SELECT invhist_id, invhist_transdate,
          invhist_qty * invhistSense(invhist_id) AS qty,
          COALESCE(SUM(CASE WHEN COALESCE(NOT location_netable, FALSE) THEN invdetail_qty END), 0.0) AS nnqty,
          invhist_unitcost,
          period_id, invbal_id
     FROM invhist
     JOIN period ON invhist_transdate::DATE BETWEEN period_start AND period_end
     LEFT OUTER JOIN invbal ON invhist_itemsite_id=invbal_itemsite_id
                           AND period_id=invbal_period_id
     LEFT OUTER JOIN invdetail ON invhist_id=invdetail_invhist_id
     LEFT OUTER JOIN location ON invdetail_location_id=location_id
   WHERE invhist_id=pInvhistId
   GROUP BY invhist_id, invhist_transdate, invhist_qty, invhist_unitcost, period_id, invbal_id) nn;

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'No accounting period exists for invhist_id %, transaction date % [xtuple: postIntoInvBalance, -1, %, %]',
                    _r.invhist_id, formatDate(_r.invhist_transdate), _r.invhist_id, formatDate(_r.invhist_transdate);
  END IF;

  IF (_r.invbal_id IS NULL) THEN
    INSERT INTO invbal
    (invbal_itemsite_id, invbal_period_id)
    VALUES (_r.invhist_itemsite_id, _r.period_id)
    RETURNING invbal_id INTO _r.invbal_id;

    UPDATE invbal
       SET invbal_qoh_beginning=last_value(before.invbal_qoh_ending) OVER (ORDER BY pbefore.period_start),
           invbal_value_beginning=last_value(before.invbal_value_ending) OVER (ORDER BY pbefore.period_start),
           invbal_nn_beginning=last_value(before.invbal_nn_ending) OVER (ORDER BY pbefore.period_start),
           invbal_nnval_beginning=last_value(before.invbal_nnval_ending) OVER (ORDER BY pbefore.period_start)
      FROM period
      JOIN invbal before ON invbal_itemsite_id=before.invbal_itemsite_id
      JOIN period pbefore ON before.invbal_period_id=pbefore.period_id
      WHERE invbal_id=_r.invbal_id
        AND period_id=invbal_period_id
        AND pbefore.period_start < period_start;
  END IF;

  UPDATE invbal
     SET invbal_qty_in=invbal_qty_in +       CASE WHEN _r.qty > 0 THEN abs(_r.qty)
                                                  ELSE 0.0 END,
         invbal_qty_out=invbal_qty_out +     CASE WHEN _r.qty < 0 THEN abs(_r.qty)
                                                  ELSE 0.0 END,
         invbal_value_in=invbal_value_in +   CASE WHEN _r.value > 0 THEN abs(_r.value)
                                                  ELSE 0.0 END,
         invbal_value_out=invbal_value_out + CASE WHEN _r.value < 0 THEN abs(_r.value)
                                                  ELSE 0.0 END,
         invbal_nn_in=invbal_nn_in +         CASE WHEN _r.nn > 0 THEN abs(_r.nn)
                                                  ELSE 0.0 END,
         invbal_nn_out=invbal_nn_out +       CASE WHEN _r.nn < 0 THEN abs(_r.nn)
                                                  ELSE 0.0 END,
         invbal_nnval_in=invbal_nnval_in +   CASE WHEN _r.nnval > 0 THEN abs(_r.nnval)
                                                  ELSE 0.0 END,
         invbal_nnval_out=invbal_nnval_out + CASE WHEN _r.nnval < 0 THEN abs(_r.nnval)
                                                  ELSE 0.0 END
   WHERE invbal_id=_r.invbal_id;

  UPDATE invbal
     SET invbal_qoh_ending=invbal_qoh_beginning + invbal_qty_in - invbal_qty_out,
         invbal_value_ending=invbal_value_beginning + invbal_value_in - invbal_value_out,
         invbal_nn_ending=invbal_nn_beginning + invbal_nn_in - invbal_nn_out,
         invbal_nnval_ending=invbal_nnval_beginning + invbal_nnval_in - invbal_nnval_out
   WHERE invbal_id=_r.invbal_id;

  PERFORM forwardUpdateInvBalance(_r.invbal_id);

  IF (SELECT invbal_qoh_ending < 0.0 AND itemsite_costmethod = 'A'
        FROM invbal
        JOIN itemsite ON invbal_itemsite_id=itemsite_id
       WHERE invbal_id=_r.invbal_id) THEN
    RAISE EXCEPTION 'Average costed Item with negative balance for invhist_id %, transaction date % [xtuple: postIntoInvBalance, -2, %, %]',
                    _r.invhist_id, formatDate(_r.invhist_transdate), _r.invhist_id, formatDate(_r.invhist_transdate);
  END IF;

  RETURN TRUE;

END;
$$ LANGUAGE plpgsql;
