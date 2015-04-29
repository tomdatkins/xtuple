
CREATE OR REPLACE FUNCTION getOldestLocationId(integer, numeric) RETURNS text AS $$
	-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
	-- See www.xtuple.com/CPAL for the full text of the software license.
	DECLARE
	  pItemsiteid ALIAS FOR $1;
	  pQty ALIAS FOR $2;
	  _locId text;
	  
	BEGIN

	  SELECT itemloc.obj_uuid INTO _locId
	  FROM itemloc
	    LEFT JOIN lsdetail ON itemloc_ls_id = lsdetail_ls_id
	  WHERE (itemloc_itemsite_id = pItemSiteId)
	  	AND (CASE WHEN pQty < 1 THEN itemloc_qty >= pQty ELSE itemloc_qty > 1 END)
	  ORDER BY itemloc_expiration, lsdetail_created
	  LIMIT 1;

	  RETURN _locId;

	END;

$$ LANGUAGE plpgsql;

