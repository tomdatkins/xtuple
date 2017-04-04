CREATE OR REPLACE FUNCTION xt.deletePOType(pPotypeid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  IF (EXISTS(SELECT vendinfoext_id
             FROM xt.vendinfoext
             WHERE vendinfoext_potype_id=pPotypeid)) THEN
    RAISE EXCEPTION 'Cannot delete because this Purchase Type is used as a Vendor default Purchase Type';
  END IF;

  IF (EXISTS(SELECT poheadext_id
             FROM xt.poheadext
             WHERE poheadext_potype_id=pPotypeid)) THEN
    RAISE EXCEPTION 'Cannot delete because this Purchase Type is used on a Purchase Order';
  END IF;

  DELETE FROM xt.potype
  WHERE (potype_id=pPotypeid);

  RETURN 0;

END;
$$ LANGUAGE plpgsql;
