select xt.create_view('xt.orditemship', $$

  select xt.orditem.*
  from 	xt.orditem
  join (
     select obj_uuid from cohead
     union all
     select obj_uuid from tohead
     union all
     select obj_uuid from invchead
  ) as ordhead on ordhead.obj_uuid = orditem.orditem_ordhead_uuid
  where orditem_status = 'O'
    and orditem_qtyord - orditem_qtytransacted + orditem_qtyreturned > 0

$$);
