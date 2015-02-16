select xt.create_view('xt.itemsitedtl', $$
   select itemloc.*,
     0 as distributed,
     lsdetail_created
   from itemloc
     join itemsite on itemsite_id = itemloc_itemsite_id
     left join lsdetail on itemloc_ls_id = lsdetail_ls_id;
$$);
