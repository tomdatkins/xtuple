CREATE OR REPLACE FUNCTION xwd.indentComm(pProvider TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r RECORD;

BEGIN
  DELETE FROM xwd.catcomm WHERE (catcomm_provider=pProvider);

  FOR _r IN SELECT *
            FROM xwd.comm
            WHERE (comm_pik=comm_parent_pik)
            ORDER BY comm_comm_code
  LOOP
    INSERT INTO xwd.catcomm
                (catcomm_provider,
                 catcomm_pik, catcomm_parent_pik,
                 catcomm_comm_code, catcomm_comm_desc,
                 catcomm_seq, catcomm_level)
         VALUES (pProvider,
                 _r.comm_pik, _r.comm_parent_pik,
                 _r.comm_comm_code, _r.comm_comm_desc,
                 1, 1);
    PERFORM xwd.explodeComm(pProvider, _r.comm_pik, 1);
  END LOOP;

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';

