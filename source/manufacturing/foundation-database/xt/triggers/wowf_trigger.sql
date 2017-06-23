DROP TRIGGER IF EXISTS wowf_after_update ON xt.wowf;

CREATE TRIGGER wowf_after_update
 AFTER UPDATE ON xt.wowf
 FOR EACH ROW
 EXECUTE PROCEDURE xt.workflow_update_successors();
 
