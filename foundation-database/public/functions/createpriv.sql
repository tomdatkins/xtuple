DROP FUNCTION IF EXISTS createPriv(text, text, text);

CREATE OR REPLACE FUNCTION createPriv(pModule text, pName text, pDesc text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _id     INTEGER;
BEGIN
  SELECT priv_id INTO _id
    FROM priv
   WHERE (priv_name=pName);

  IF (FOUND) THEN
    UPDATE priv
       SET priv_module  = pModule,
           priv_descrip = pDesc
     WHERE priv_id = _id;
  ELSE
    INSERT INTO priv (priv_module, priv_name, priv_descrip)
      VALUES (pModule, pName, pDesc)
      RETURNING priv_id;
  END IF;

  RETURN _id;
END;
$$ LANGUAGE plpgsql;
