DROP TRIGGER IF EXISTS towf_after_update ON xt.towf;

CREATE TRIGGER towf_after_update
 AFTER UPDATE ON xt.towf
 FOR EACH ROW
 EXECUTE PROCEDURE xt.workflow_update_successors();
