-- Trigger: wf_printparam_did_change on xt.wf_printparam

-- DROP TRIGGER wf_printparam_did_change ON xt.wf_printparam;

CREATE TRIGGER wf_printparam_did_change
  AFTER INSERT OR UPDATE
  ON workflow.wf_printparam
  FOR EACH ROW
  EXECUTE PROCEDURE workflow.send_printparam_to_batchparam();
  
  
-- Trigger: wf_status_did_change

-- DROP TRIGGER wf_status_did_change ON xt.wf;
  
CREATE TRIGGER wf_status_did_change
  AFTER INSERT OR UPDATE 
  ON xt.wf
  FOR EACH ROW
  EXECUTE PROCEDURE xt.poke_wf_printparam();