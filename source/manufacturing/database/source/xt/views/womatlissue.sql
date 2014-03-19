select xt.create_view('xt.womatlissue', $$

  select 
    womatl.*,
    itemsite_item_id as womatl_item_id,
    itemsite_warehous_id as womatl_warehous_id,
    itemsite_qtyonhand as qoh_before,
    case when (womatl_qtyiss > womatl_qtyreq) then 0 else (womatl_qtyreq - womatl_qtyiss) end AS balance,
    null::numeric AS to_issue
  from womatl
    join itemsite on itemsite_id=womatl_itemsite_id
    join wo on wo_id=womatl_wo_id
  where wo_status != 'C'

$$);