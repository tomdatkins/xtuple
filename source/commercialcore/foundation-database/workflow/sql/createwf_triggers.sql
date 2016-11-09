/* This file contains triggers and trigger functions for the xt.createwf() function
   which should be moved to private-extensions */
   
/* CLEAN UP OLD TRIGGERS */

DROP TRIGGER IF EXISTS powf_after_insert ON xt.poheadext;
DROP TRIGGER IF EXISTS wowf_after_insert ON wo;

/* TRIGGER FUNCTIONS FOR WORKFLOW */

CREATE OR REPLACE FUNCTION xt.createwf_after_insert() RETURNS TRIGGER AS $$
    BEGIN
/* Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */
    PERFORM xt.createwf(TG_TABLE_NAME, NEW);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE
ALTER FUNCTION xt.createwf_after_insert()
  OWNER TO admin;

CREATE OR REPLACE FUNCTION xt.updatewf_after_update() RETURNS TRIGGER AS $$
   BEGIN
/* Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */
   DELETE FROM xt.wf WHERE wf_parent_uuid = NEW.obj_uuid;
   PERFORM xt.createwf(TG_TABLE_NAME, NEW);
   RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE
ALTER FUNCTION xt.updatewf_after_update()
  OWNER TO admin;
  
CREATE OR REPLACE FUNCTION xt.updatepowf_after_update() RETURNS TRIGGER AS $$
   BEGIN
/* Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */
   DELETE FROM xt.wf WHERE wf_parent_uuid = (SELECT obj_uuid FROM pohead WHERE pohead_id = NEW.poheadext_id);
   PERFORM xt.createwf(TG_TABLE_NAME, NEW);
   RETURN NEW;
END;

$$ LANGUAGE plpgsql VOLATILE
ALTER FUNCTION xt.updatepowf_after_update()
  OWNER TO admin;

/* TRIGGERS FOR TABLES THAT USE WORKFLOW */

DROP TRIGGER IF EXISTS sowf_after_insert ON cohead;
CREATE TRIGGER sowf_after_insert
  AFTER INSERT
  ON cohead
  FOR EACH ROW
  EXECUTE PROCEDURE xt.createwf_after_insert();

DROP TRIGGER IF EXISTS prjwf_after_insert ON prj;
CREATE TRIGGER prjwf_after_insert 
  AFTER INSERT 
  ON prj 
  FOR EACH ROW
  EXECUTE PROCEDURE xt.createwf_after_insert();

/* TRIGGERS FOR TABLES THAT CREATE WORFKFLOW AFTER STATUS UPDATE */

DROP TRIGGER IF EXISTS powf_after_release ON pohead;
CREATE TRIGGER powf_after_release 
  AFTER UPDATE 
  ON pohead
  FOR EACH ROW
  WHEN (OLD.pohead_status IS DISTINCT FROM NEW.pohead_status)
  EXECUTE PROCEDURE xt.createwf_after_insert();
  
DROP TRIGGER IF EXISTS wowf_after_release ON wo;
CREATE TRIGGER wowf_after_release
  AFTER UPDATE
  ON wo
  FOR EACH ROW
  WHEN (OLD.wo_status IS DISTINCT FROM NEW.wo_status)
  EXECUTE PROCEDURE xt.createwf_after_insert();
  
/* TRIGGERS TO PURGE WORKFLOW AND REGENERATE WHEN TYPE IS CHANGED */

DROP TRIGGER IF EXISTS sowf_after_update ON cohead;
CREATE TRIGGER sowf_after_update
  AFTER UPDATE
  ON cohead
  FOR EACH ROW
  WHEN (OLD.cohead_saletype_id IS DISTINCT FROM NEW.cohead_saletype_id)
  EXECUTE PROCEDURE xt.updatewf_after_update();
  
DROP TRIGGER IF EXISTS powf_after_update ON xt.poheadext;
CREATE TRIGGER powf_after_update
  AFTER UPDATE
  ON xt.poheadext
  FOR EACH ROW
  WHEN (OLD.poheadext_potype_id IS DISTINCT FROM NEW.poheadext_potype_id)
  EXECUTE PROCEDURE xt.updatepowf_after_update();
  
DROP TRIGGER IF EXISTS wowf_after_update ON wo;
CREATE TRIGGER wowf_after_update
  AFTER UPDATE
  ON wo
  FOR EACH ROW
  WHEN (OLD.wo_itemsite_id IS DISTINCT FROM NEW.wo_itemsite_id)
  EXECUTE PROCEDURE xt.updatewf_after_update();