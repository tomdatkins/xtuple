select xt.create_view('xtstd.orditemship', $$

  select * from xtstd.orditem
  where orditem_status = 'O'
    and orditem_qtyord - orditem_qtyshipped + orditem_qtyreturned > 0

$$);