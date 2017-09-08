CREATE OR REPLACE FUNCTION public.createimage(
                                        pTitle text,
                                        pDescription text,
                                        pImageData TEXT)
  RETURNS integer AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECVLARE
  _id integer;
BEGIN
  INSERT INTO image (image_id, image_name, image_descrip, image_data) 
             VALUES (nextval('image_image_id_seq'), pTitle, pDescription, pImageData)
  RETURNING image_id INTO _id;
  return _id;
END;
$$ LANGUAGE plpgsql;
