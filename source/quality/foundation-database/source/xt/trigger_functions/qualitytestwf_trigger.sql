DROP TRIGGER IF EXISTS qualitytestwf_after_update ON xt.qualitytestwf;

CREATE TRIGGER qualitytestwf_after_update
 AFTER UPDATE ON xt.qualitytestwf
 FOR EACH ROW
 EXECUTE PROCEDURE xt.workflow_update_successors();
