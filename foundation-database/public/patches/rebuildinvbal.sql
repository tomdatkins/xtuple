SELECT buildInvBal(invbal_itemsite_id)
FROM
(SELECT DISTINCT ON (invbal_itemsite_id) invbal_itemsite_id, COALESCE(SUM(abs(invhist_invqty)), 0.0)=CASE WHEN qtyin THEN invbal_qty_in
                                                                         WHEN qtyout THEN invbal_qty_out
                                                                         ELSE 0.0 END AS valid
 FROM
 (SELECT invbal_itemsite_id, period_id,
  CASE WHEN invhist_id IS NOT NULL THEN invhistSense(invhist_id) * invhist_invqty ELSE 0 END > 0 AS qtyin,
  CASE WHEN invhist_id IS NOT NULL THEN invhistSense(invhist_id) * invhist_invqty ELSE 0 END < 0 AS qtyout,
  invhist_invqty, invbal_qty_in, invbal_qty_out
  FROM invbal
  JOIN period ON invbal_period_id=period_id
  LEFT OUTER JOIN invhist ON invbal_itemsite_id=invhist_itemsite_id
  AND invhist_transdate BETWEEN period_start AND period_end) transactions
 GROUP BY invbal_itemsite_id, period_id, qtyin, qtyout, invbal_qty_in, invbal_qty_out) invbal
WHERE NOT valid;
