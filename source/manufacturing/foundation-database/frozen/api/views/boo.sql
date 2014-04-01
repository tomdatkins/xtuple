
  --Bill of Operations View

  SELECT dropIfExists('VIEW', 'api_boo', 'xtmfg');
  CREATE OR REPLACE VIEW xtmfg.api_boo AS

  SELECT
    item_number::VARCHAR AS item_number,
    boohead_revision::VARCHAR AS revision,
    boohead_docnum AS document_number,
    boohead_revisiondate AS revision_date,
    warehous_code AS final_warehouse,
    formatlocationname(boohead_final_location_id) AS final_location,
    boohead_closewo AS close_wo
  FROM
    xtmfg.boohead
      LEFT OUTER JOIN location ON (boohead_final_location_id=location_id)
      LEFT OUTER JOIN whsinfo ON (location_warehous_id=warehous_id),
    item
  WHERE
    (boohead_item_id=item_id);


GRANT ALL ON TABLE xtmfg.api_boo TO xtrole;
COMMENT ON VIEW xtmfg.api_boo IS 'Bill of Operations Header';

  --Rules

  CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO xtmfg.api_boo DO INSTEAD

  SELECT xtmfg.saveBooHead(
     getItemId(NEW.item_number),
     NEW.revision,
     NEW.revision_date,
     NEW.document_number,
     CASE WHEN COALESCE(NEW.final_location,'N/A') = 'N/A' THEN
       -1
     ELSE
       COALESCE(getLocationId(NEW.final_warehouse,NEW.final_location),-1)
     END,
     COALESCE(NEW.close_wo,FALSE));
 
    CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO xtmfg.api_boo DO INSTEAD

  SELECT xtmfg.saveBooHead(
     getItemId(NEW.item_number),
     NEW.revision,
     NEW.revision_date,
     NEW.document_number,
     CASE WHEN COALESCE(NEW.final_location,'N/A') = 'N/A' THEN
       -1
     ELSE
       COALESCE(getLocationId(NEW.final_warehouse,NEW.final_location),-1)
     END,
     COALESCE(NEW.close_wo,FALSE));

    CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO xtmfg.api_boo DO INSTEAD

    SELECT xtmfg.deleteboo(getItemId(OLD.item_number));

