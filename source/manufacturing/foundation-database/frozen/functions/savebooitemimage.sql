
CREATE OR REPLACE FUNCTION xtmfg.saveBooItemImage(INTEGER, CHAR, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pBooitemid ALIAS FOR $1;
  pPurpose ALIAS FOR $2;
  pImageid ALIAS FOR $3;
  _booimageId INTEGER;

BEGIN
-- See if a record with this purpose already exists
  SELECT booimage_id INTO _booimageId
  FROM booimage
  WHERE ((booimage_booitem_id=pBooItemid)
  AND (booimage_purpose=pPurpose));

  IF (FOUND) THEN
    UPDATE booimage SET
      booimage_image_id=pImageId
    WHERE (booimage_id=_booimageId);
  ELSE
    _booimageId := NEXTVAL('booimage_booimage_id_seq');
    INSERT INTO booimage VALUES (_booimageId,pBooitemid,pImageid,pPurpose);
  END IF;
  
  RETURN _booimageId;
END;
$$ LANGUAGE 'plpgsql';
