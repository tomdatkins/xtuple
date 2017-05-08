CREATE OR REPLACE FUNCTION forwardUpdateInvhist(pInvhistId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  UPDATE invhist
     SET invhist_qoh_before=itemsite_qtyonhand, invhist_qoh_after=itemsite_qtyonhand,
         invhist_value_before=itemsite_value, invhist_value_after=itemsite_value
    FROM invhist start, itemsite
   WHERE invhist.invhist_itemsite_id=itemsite_id
     AND start.invhist_transdate<=invhist.invhist_transdate
     AND start.invhist_id=pInvhistId
     AND NOT invhist.invhist_posted;

  UPDATE invhist
     SET invhist_qoh_before=COALESCE(total.qtybefore, 0.0),
         invhist_qoh_after=COALESCE(total.qtyafter, 0.0),
         invhist_value_before=COALESCE(total.valuebefore, 0.0),
         invhist_value_after=COALESCE(total.valueafter, 0.0)
    FROM
    (SELECT next.invhist_id AS invhist_id,
            start.invhist_qoh_after +
            SUM(next.invhist_qoh_after-next.invhist_qoh_before) OVER prev AS qtybefore,
            start.invhist_qoh_after +
            SUM(next.invhist_qoh_after-next.invhist_qoh_before) OVER curr AS qtyafter,
            start.invhist_value_after +
            SUM(next.invhist_value_after-next.invhist_value_before) OVER prev AS valuebefore,
            start.invhist_value_after +
            SUM(next.invhist_value_after-next.invhist_value_before) OVER curr AS valueafter
       FROM
       (SELECT invhist.invhist_itemsite_id AS invhist_itemsite_id,
               invhist.invhist_transdate AS invhist_transdate,
               COALESCE(prev.invhist_qoh_after, 0.0) AS invhist_qoh_after,
               COALESCE(prev.invhist_value_after, 0.0) AS invhist_value_after
          FROM invhist
          LEFT OUTER JOIN invhist prev ON prev.invhist_itemsite_id=invhist.invhist_itemsite_id
                                      AND prev.invhist_transdate<invhist.invhist_transdate
          WHERE invhist.invhist_id=pInvhistId
          ORDER BY prev.invhist_transdate DESC, prev.invhist_created DESC, prev.invhist_id DESC
          LIMIT 1) start
       JOIN invhist next ON start.invhist_itemsite_id=next.invhist_itemsite_id
                        AND start.invhist_transdate<=next.invhist_transdate
      WINDOW prev AS (ORDER BY next.invhist_transdate, next.invhist_created, next.invhist_id
                      ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
             curr AS (ORDER BY next.invhist_transdate, next.invhist_created, next.invhist_id
                      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
      ORDER BY next.invhist_transdate, next.invhist_created, next.invhist_id) total
   WHERE invhist.invhist_id=total.invhist_id
     AND invhist_posted;

  RETURN pInvhistId;

END;
$$ LANGUAGE plpgsql;
