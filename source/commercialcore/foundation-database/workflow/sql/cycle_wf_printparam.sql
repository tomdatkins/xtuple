-- Function: workflow.poke_wf_printparam

-- DROP FUNCTION workflow.poke_wf_printparam();

CREATE OR REPLACE FUNCTION workflow.poke_wf_printparam()
  RETURNS trigger AS
$BODY$

  /* update printparam values to trigger batchparam insert*/
  var updateppSQL = "UPDATE workflow.wf_printparam "
                  + "SET wf_printparam_value = wf_printparam_value "
                  + "WHERE wf_printparam_parent_uuid = $1 "; 
  plv8.execute(updateppSQL, [NEW.obj_uuid]);

  return NEW;

$BODY$
  LANGUAGE plv8;
ALTER FUNCTION workflow.poke_wf_printparam()
  OWNER TO admin;
GRANT ALL ON FUNCTION workflow.poke_wf_printparam() TO xtrole;