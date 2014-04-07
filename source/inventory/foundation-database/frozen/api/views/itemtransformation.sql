SELECT dropIfExists('VIEW', 'itemtransformation', 'api');
CREATE VIEW api.itemtransformation
AS 
   SELECT 
     s.item_number::varchar AS source_item_number,
     t.item_number::varchar AS target_item_number
   FROM item s, item t, itemtrans
   WHERE ((s.item_id=itemtrans_source_item_id)
   AND (t.item_id=itemtrans_target_item_id));

GRANT ALL ON TABLE api.itemtransformation TO xtrole;
COMMENT ON VIEW api.itemtransformation IS 'Item Transformation';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemtransformation DO INSTEAD

  INSERT INTO itemtrans (
    itemtrans_source_item_id,
    itemtrans_target_item_id)
  VALUES (
    getItemId(NEW.source_item_number),
    getItemId(NEW.target_item_number));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.itemtransformation DO INSTEAD NOTHING;
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.itemtransformation DO INSTEAD

  DELETE FROM itemtrans
  WHERE  ((itemtrans_source_item_id=getItemId(OLD.source_item_number))
  AND (itemtrans_target_item_id=getItemId(OLD.target_item_number)));
