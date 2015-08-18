CREATE OR REPLACE FUNCTION grantPrivToAll(TEXT) RETURNS BOOL AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrivname ALIAS FOR $1;
  _p RECORD;

BEGIN
	FOR _p IN SELECT usr_username FROM usr
		LOOP 
			PERFORM grantPriv(_p.usr_username, pPrivname);
		END LOOP;	
RETURN TRUE;

END;
$$ LANGUAGE plpgsql;
