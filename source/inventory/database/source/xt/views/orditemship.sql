select xt.create_view('xt.orditemship', $$

  select * from xt.orditem
  where orditem_status = 'O'
    and orditem_qtyord - orditem_qtytransacted + orditem_qtyreturned > 0

$$);