select xt.create_view('xt.itemsitedtl', $$
	WITH 
	lsdetail AS (
		SELECT min(lsdetail_created) AS lsdetail_created, 
			lsdetail_itemsite_id, 
			lsdetail_ls_id
    FROM lsdetail
    GROUP BY lsdetail_itemsite_id, lsdetail_ls_id
	)
  SELECT itemloc.*,
    0 as distributed,
    lsdetail_created
  FROM itemloc
  LEFT JOIN lsdetail ON itemloc_itemsite_id = lsdetail_itemsite_id 
  	AND itemloc_ls_id = lsdetail_ls_id
$$);
