CREATE OR REPLACE FUNCTION forwardUpdateInvhist(pInvhistId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  UPDATE invhist
     SET invhist_qoh_before=itemsite_qtyonhand, invhist_qoh_after=itemsite_qtyonhand,
         invhist_value_before=itemsite_value, invhist_value_after=itemsite_value
    FROM invhist start, itemsite
   WHERE invhist.invhist_itemsite_id=itemsite_id
     AND start.invhist_transdate <= invhist.invhist_transdate
     AND NOT invhist.invhist_posted;

  UPDATE invhist
     SET invhist_qoh_before=COALESCE(total.qtybefore, 0.0),
         invhist_qoh_after=COALESCE(total.qtyafter, 0.0),
         invhist_value_before=COALESCE(total.valuebefore, 0.0),
         invhist_value_after=COALESCE(total.valueafter, 0.0)
    FROM
    (SELECT next.invhist_id AS invhist_id,
            start.invhist_qoh_after +
            SUM(next.invhist_qoh_after-next.invhist_qoh_before)
            OVER (ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING) AS qtybefore,
            start.invhist_qoh_after +
            SUM(next.invhist_qoh_after-next.invhist_qoh_before)
            OVER (ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS qtyafter,
            start.invhist_value_after +
            SUM(next.invhist_value_after-next.invhist_value_before)
            OVER (ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING) AS valuebefore,
            start.invhist_value_after +
            SUM(next.invhist_value_after-next.invhist_value_before)
            OVER (ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS valueafter
       FROM invhist start
       JOIN invhist next ON start.invhist_itemsite_id=next.invhist_itemsite_id
                        AND start.invhist_transdate<next.invhist_transdate
      WHERE start.invhist_id=pInvhistId) total
   WHERE invhist.invhist_id=total.invhist_id
     AND invhist_posted;

  RETURN pInvhistId;

END;
$$ LANGUAGE plpgsql;
