
-- Item Image

SELECT dropIfExists('VIEW', 'api_booitemimage', 'xtmfg');
CREATE VIEW xtmfg.api_booitemimage
AS 
   SELECT 
     item_number::VARCHAR AS boo_item_number,
     boohead_revision::VARCHAR AS boo_revision,
     booitem_seqnumber AS sequence_number,
     CASE
       WHEN booimage_purpose = 'P' THEN
        'Product Description'
       WHEN booimage_purpose = 'I' THEN
        'Inventory Description'
       WHEN booimage_purpose = 'E' THEN
        'Engineering Reference'
       WHEN booimage_purpose = 'M' THEN
        'Miscellaneos'
       ELSE
        'Other'
     END AS purpose,
     image_name AS image_name
   FROM item, xtmfg.booimage, xtmfg.booitem
     LEFT OUTER JOIN xtmfg.boohead ON ((booitem_item_id=boohead_item_id)
                             AND (booitem_rev_id=boohead_rev_id)),
     image
   WHERE ((item_id=booitem_item_id)
   AND (booimage_booitem_id=booitem_id)
   AND (booimage_image_id=image_id));

GRANT ALL ON TABLE xtmfg.api_booitemimage TO xtrole;
COMMENT ON VIEW xtmfg.api_booitemimage IS 'Bill of Operations Item Image';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO xtmfg.api_booitemimage DO INSTEAD

  SELECT xtmfg.savebooitemimage(
    xtmfg.getBooItemId(NEW.boo_item_number::text,NEW.boo_revision::text,NEW.sequence_number::text),
    CASE
      WHEN NEW.purpose = 'Product Description' THEN
        'P'
      WHEN NEW.purpose = 'Inventory Description' THEN
        'I'
      WHEN NEW.purpose = 'Engineering Reference' THEN
        'E'
      WHEN NEW.purpose = 'Miscellaneous' THEN
        'M'
      ELSE
        'X'
     END,
    getImageId(NEW.image_name));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO xtmfg.api_booitemimage DO INSTEAD

  SELECT xtmfg.savebooitemimage(
    xtmfg.getBooItemId(OLD.boo_item_number::text,OLD.boo_revision::text,OLD.sequence_number::text),
    CASE
      WHEN NEW.purpose = 'Product Description' THEN
        'P'
      WHEN NEW.purpose = 'Inventory Description' THEN
        'I'
      WHEN NEW.purpose = 'Engineering Reference' THEN
        'E'
      WHEN NEW.purpose = 'Miscellaneous' THEN
        'M'
      ELSE
        'X'
     END,
    getImageId(NEW.image_name));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO xtmfg.api_booitemimage DO INSTEAD

  DELETE FROM xtmfg.booimage
  WHERE ((booimage_booitem_id=xtmfg.getBooItemId(OLD.boo_item_number::text,OLD.boo_revision::text,OLD.sequence_number::text))
  AND (booimage_image_id=getImageId(OLD.image_name)));

