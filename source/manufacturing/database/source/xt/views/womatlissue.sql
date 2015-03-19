SELECT xt.create_view('xt.womatlissue', $$

  SELECT 
    womatl.*,
    itemsite_item_id AS womatl_item_id,
    itemsite_warehous_id AS womatl_warehous_id,
    itemsite_qtyonhand AS qoh_before,
    CASE WHEN (womatl_qtyiss > womatl_qtyreq) THEN 0 ELSE (womatl_qtyreq - womatl_qtyiss) END AS balance,
    null::numeric AS to_issue,
    COALESCE(( SELECT sum(itemsite_qtyonhand) 
      FROM itemsite AS ois
      WHERE itemsite.itemsite_item_id = ois.itemsite_item_id 
        AND ois.itemsite_id != itemsite.itemsite_id
    ), 0.00) AS qoh_other
  FROM womatl
    join itemsite ON itemsite_id=womatl_itemsite_id
    join wo ON wo_id=womatl_wo_id
  WHERE wo_status NOT IN ('C', 'O')

$$);