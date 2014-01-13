select xt.create_view('xt.orditemreceipt', $$

  select xt.orditem.*
  from 	xt.orditem
  	join xt.ordhead as ordhead on orditem_ordhead_uuid = ordhead.obj_uuid
  where orditem_status = 'O'
  	and ordhead.ordhead_type IN ('PO', 'RA', 'CM', 'TO')
$$);
