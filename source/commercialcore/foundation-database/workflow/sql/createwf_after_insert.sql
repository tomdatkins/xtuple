CREATE OR REPLACE FUNCTION xt.createwf_after_insert() RETURNS TRIGGER AS $$
    BEGIN
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

    IF (TG_OP = 'INSERT') THEN
      PERFORM xt.createwf(TG_TABLE_NAME, NEW);
      RETURN NEW;
    END IF;
END;

$$ LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xt.createwf_after_insert()
  OWNER TO admin;

CREATE OR REPLACE FUNCTION xt.updatewf_after_update() RETURNS TRIGGER AS $$
   BEGIN
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

   IF (TG_OP = 'UPDATE') THEN
      DELETE FROM xt.wf WHERE wf_parent_uuid = NEW.obj_uuid;
      PERFORM xt.createwf(TG_TABLE_NAME, NEW);
      RETURN NEW;
   END IF;
END;

$$ LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xt.updatewf_after_update()
  OWNER TO admin;

/* CREATE TRIGGERS FOR TABLES THAT USE WORKFLOW */

DROP TRIGGER IF EXISTS sowf_after_insert ON cohead;
CREATE TRIGGER sowf_after_insert
  AFTER INSERT
  ON cohead
  FOR EACH ROW
  EXECUTE PROCEDURE xt.createwf_after_insert();

DROP TRIGGER IF EXISTS sowf_after_update ON cohead;
CREATE TRIGGER sowf_after_update
  AFTER UPDATE
  ON cohead
  FOR EACH ROW
  WHEN (OLD.cohead_saletype_id IS DISTINCT FROM NEW.cohead_saletype_id)
  EXECUTE PROCEDURE xt.updatewf_after_update();
  
DROP TRIGGER IF EXISTS prjwf_after_insert ON prj;
CREATE TRIGGER prjwf_after_insert 
  AFTER INSERT 
  ON prj 
  FOR EACH ROW
  EXECUTE PROCEDURE xt.createwf_after_insert();
  
DROP TRIGGER IF EXISTS powf_after_insert ON xt.poheadext;
CREATE TRIGGER powf_after_insert 
  AFTER INSERT 
  ON xt.poheadext 
  FOR EACH ROW
  EXECUTE PROCEDURE xt.createwf_after_insert();