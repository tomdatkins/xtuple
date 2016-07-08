CREATE OR REPLACE FUNCTION createwf_after_insert() RETURNS TRIGGER AS $createwf_after_insert$
    BEGIN
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
    if (TG_OP === 'INSERT') {
      createwf(TG_TABLE_NAME, NEW);
      return NEW;
    }
}());

$BODY$
  LANGUAGE plv8 VOLATILE
  COST 100;
ALTER FUNCTION xt.createwf_after_insert()
  OWNER TO admin;

CREATE OR REPLACE FUNCTION updatewf_after_update() RETURNS TRIGGER AS $updatewf_after_update$
    BEGIN
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {
    if (TG_OP === 'UPDATE') {
      DELETE FROM xt.wf WHERE parent_obj_uuid = NEW.obj_uuid;
      createwf(TG_TABLE_NAME, NEW);
      return NEW;
    }
}());

$BODY$
  LANGUAGE plv8 VOLATILE
  COST 100;
ALTER FUNCTION xt.updatewf_after_update()
  OWNER TO admin;
  
CREATE TRIGGER sowf_after_insert
  AFTER INSERT
  ON cohead
  FOR EACH ROW
  EXECUTE PROCEDURE xt.createwf_after_insert();
  
CREATE TRIGGER sowf_after_update
  AFTER UPDATE
  ON cohead
  FOR EACH ROW
  WHEN (OLD.cohead_saletype_id IS DISTINCT FROM NEW.cohead_saletype_id)
  EXECUTE PROCEDURE xt.updatewf_after_update();