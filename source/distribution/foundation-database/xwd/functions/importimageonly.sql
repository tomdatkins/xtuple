CREATE OR REPLACE FUNCTION xwd.importImageonly(pProvider TEXT,
                                               pMode TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _c RECORD;
  _r RECORD;
  _result INTEGER;

BEGIN

  SELECT * INTO _c FROM xwd.catconfig WHERE (catconfig_provider=pProvider);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Provider % not configured', pProvider;
  END IF;

  FOR _r IN
    SELECT * FROM xwd.imageonly
  LOOP
    UPDATE xwd.catalog SET catalog_pdf_url=_r.imageonly_pdf_url,
                           catalog_web_url=_r.imageonly_web_url
    WHERE (catalog_item_pik=_r.imageonly_item_pik)
      AND (catalog_provider=pProvider);
  END LOOP;

  SELECT xwd.updateImages(pProvider) INTO _result;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

