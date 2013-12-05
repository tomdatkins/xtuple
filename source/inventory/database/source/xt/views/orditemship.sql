select xt.create_view('xt.orditemship', $$

  select xt.orditem.* 
  from 	xt.orditem
  	join xt.ordhead as ordhead on orditem_ordhead_uuid = ordhead.obj_uuid
  where orditem_status = 'O'
  	and ordhead.ordhead_type IN ('SO', 'TO')
    and orditem_qtyord - orditem_qtytransacted + orditem_qtyreturned > 0

$$);