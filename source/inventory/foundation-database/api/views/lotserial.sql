SELECT dropIfExists('VIEW', 'lotserial', 'api');

CREATE VIEW api.lotserial AS
SELECT 
  item_number::varchar AS item_number,
  ls_number::varchar AS lotserial_number,
  ls_notes AS notes
FROM ls,item
WHERE (ls_item_id=item_id);
  

GRANT ALL ON TABLE api.lotserial TO xtrole;
COMMENT ON VIEW api.lotserial IS 'Lot/Serial Number';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.lotserial DO INSTEAD

INSERT INTO ls
	(ls_item_id,
	 ls_number,
	 ls_notes )
        VALUES
        (getitemid(NEW.item_number),
         UPPER(TRIM(NEW.lotserial_number)),
         NEW.notes);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.lotserial DO INSTEAD

UPDATE ls SET
    ls_notes=NEW.notes
  WHERE ((ls_item_id=getitemid(NEW.item_number))
  AND (UPPER(ls_number)=OLD.lotserial_number));

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.lotserial DO INSTEAD
NOTHING;
