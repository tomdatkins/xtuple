SELECT dropIfExists('VIEW', 'lotserialchar', 'api');

CREATE VIEW api.lotserialchar
AS 
   SELECT 
     item_number::VARCHAR AS item_number,
     ls_number::VARCHAR AS lotserial_number,
     char_name::VARCHAR AS characteristic,
     charass_value AS value
   FROM ls, item, char, charass
   WHERE (('LS'=charass_target_type)
   AND (ls_id=charass_target_id)
   AND (ls_item_id=item_id)
   AND (charass_char_id=char_id));

GRANT ALL ON TABLE api.lotserialchar TO xtrole;
COMMENT ON VIEW api.lotserialchar IS 'Lot/Serial Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.lotserialchar DO INSTEAD

  INSERT INTO charass (
    charass_target_type,
    charass_target_id,
    charass_char_id,
    charass_value,
    charass_default
    )
  VALUES (
    'LS',
    getlsId(NEW.item_number,NEW.lotserial_number),
    getCharId(NEW.characteristic,'LS'),
    NEW.value,
    false);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.lotserialchar DO INSTEAD

  UPDATE charass SET
    charass_value=NEW.value
  WHERE ((charass_target_type='LS')
  AND (charass_target_id=getLsId(OLD.item_number,OLD.lotserial_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'LS')));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.lotserialchar DO INSTEAD

  DELETE FROM charass
  WHERE ((charass_target_type='LS')
  AND (charass_target_id=getLsId(OLD.item_number,OLD.lotserial_number))
  AND (charass_char_id=getCharId(OLD.characteristic,'LS')));
