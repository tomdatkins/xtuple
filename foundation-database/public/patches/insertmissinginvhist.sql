SELECT forwardUpdateInvhist(first_value(invhist_id) OVER (ORDER BY invhist_created, invhist_id))
FROM invhist;

UPDATE invhist
SET invhist_invqty=0.0
WHERE invhist_transtype='SC';

INSERT INTO invhist
(invhist_itemsite_id, invhist_transdate, invhist_transtype, invhist_invqty,
invhist_qoh_before,
invhist_qoh_after,
invhist_comments,
invhist_invuom, invhist_unitcost, invhist_costmethod,
invhist_value_before,
invhist_value_after,
invhist_series)
SELECT itemsite_id, created, 'SC', 0.0,
last_value(invhist_qoh_after) OVER (PARTITION BY id ORDER BY invhist_transdate),
last_value(invhist_qoh_after) OVER (PARTITION BY id ORDER BY invhist_transdate),
CASE WHEN trigger THEN 'Itemsite converted from Average to Standard cost.'
ELSE 'Item Standard cost updated' END,
uom_name, amount, 'S',
last_value(invhist_value_after) OVER (PARTITION BY id ORDER BY invhist_transdate),
last_value(invhist_value_after) OVER (PARTITION BY id ORDER BY invhist_transdate) + amount,
0
FROM
(SELECT gltrans_id AS id, gltrans_misc_id AS misc_id, gltrans_amount AS amount, gltrans_created AS created,
 gltrans_notes='Itemsite converted from Average to Standard cost.' AS trigger
 FROM gltrans
 WHERE gltrans_source='P/D'
 UNION
 SELECT sltrans_id AS id, sltrans_misc_id AS misc_id, sltrans_amount AS amount, sltrans_created AS created,
 sltrans_notes='Itemsite converted from Average to Standard cost.' AS trigger
 FROM sltrans
 WHERE sltrans_source='P/D'
) trans
JOIN itemsite ON misc_id=itemsite_id
JOIN item ON itemsite_item_id=item_id
JOIN uom ON item_inv_uom_id=uom_id
JOIN invhist ON invhist_itemsite_id=itemsite_id AND invhist_transdate < created
WHERE trigger OR NOT (SELECT invhist_transtype='SC' AND invhist_transdate < created + interval '1 second'
                      FROM invhist
                      WHERE invhist_transdate >= created
                      ORDER BY invhist_transdate LIMIT 1)
ORDER BY created;
