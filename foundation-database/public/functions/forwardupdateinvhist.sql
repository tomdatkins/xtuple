CREATE OR REPLACE FUNCTION forwardUpdateInvhist(pInvhistId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  UPDATE invhist
     SET invhist_qoh_before=start.invhist_qoh_after +
                           SUM(next.invhist_qoh_after-next.invhist_qoh_before)
                           OVER (ORDER BY invhist_transdate ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
         invhist_qoh_after=start.invhist_qoh_after +
                           SUM(next.invhist_qoh_after-next.invhist_qoh_before)
                           OVER (ORDER BY invhist_transdate ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
         invhist_value_before=start.invhist_value_after +
                           SUM(next.invhist_value_after-next.invhist_value_before)
                           OVER (ORDER BY invhist_transdate ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
         invhist_value_after=start.invhist_value_after +
                           SUM(next.invhist_value_after-next.invhist_value_before)
                           OVER (ORDER BY invhist_transdate ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
    FROM invhist start
    JOIN invhist next ON start.invhist_itemsite_id=next.invhist_itemsite_id
                     AND start.invhist_transdate<next.invhist_transdate
   WHERE start.invhist_id=pInvhistId
     AND invhist_id=next.invhist_id;

  RETURN pInvhistId;

END;
$$ LANGUAGE plpgsql;
