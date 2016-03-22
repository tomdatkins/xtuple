-- Function: workflow.send_printparam_to_batchparam()

-- DROP FUNCTION workflow.send_printparam_to_batchparam();

/* apply this trigger function to wf_printparam after insert on each row */
CREATE OR REPLACE FUNCTION workflow.send_printparam_to_batchparam()
  RETURNS trigger AS
$BODY$

return (function () { 
  plv8.elog(WARNING, "send_printparam_to_batchparam: NEW.wf_printparam_parent_uuid is " + NEW.wf_printparam_parent_uuid);

/* only copy printparams if wf_status is "I" */
  var batchid = -1;
  var skip_update = false;

  var checkstatusSQL = "SELECT wf_status FROM xt.wf WHERE obj_uuid = $1 "
  var checkstatus = plv8.execute(checkstatusSQL, [NEW.wf_printparam_parent_uuid]);
  
  checkstatus.map(function (wfitems) 
  {
     if (wfitems.wf_status === "I")  
     {
        plv8.elog(WARNING, "wf_status is I");
   
        /* check to see if batch exists */
        var checkbatchSQL = "SELECT batch_id from xtbatch.batch "
            + " WHERE batch_parameter = $1::text";
        var checkbatch = plv8.execute(checkbatchSQL, [NEW.wf_printparam_parent_uuid]);
           
        checkbatch.map(function (batchitems) 
        {
            plv8.elog(WARNING, "batch found: enter batchitems map");
            batchid = batchitems.batch_id;       
        })
        /* if not, insert new batch */
        if (batchid < 0) 
        {   
           plv8.elog(WARNING, "batch not found, insert new");

           var insertbatchSQL = "INSERT INTO xtbatch.batch "
                + " (batch_action, batch_parameter, "
                + "  batch_user, batch_submitted, batch_scheduled) "
                + " VALUES "
                + " ('RunReport', $1::text, "
                + "  current_user, localtimestamp, localtimestamp) "
                + " RETURNING batch_id" ;
  
           var insertbatch = plv8.execute(insertbatchSQL, NEW.wf_printparam_parent_uuid);
           insertbatch.map(function (batchiditems) 
           {   
               plv8.elog(WARNING, "batch inserted");
               batchid = batchiditems.batch_id
           });
        }  
            
        plv8.elog(WARNING, "batchid is " + batchid);
        
        /* check for batchparam */ 
        plv8.elog(WARNING, "finding batchid " + batchid + ", order " + NEW.wf_printparam_order);

        var checkbatchparamSQL = "SELECT batchparam_id FROM xtbatch.batchparam "
            + " WHERE batchparam_batch_id = $1 "
            + "   AND batchparam_order = $2";
        var checkbatchparam = plv8.execute(checkbatchparamSQL, [batchid, NEW.wf_printparam_order]);
                      
        checkbatchparam.map(function (bpitems) 
        { 
              /* Update batchparam value*/
              plv8.elog(WARNING, "updating batchid " + batchid + ", order " + NEW.wf_printparam_order);

              var updatebpSQL = "UPDATE xtbatch.batchparam "
                  + " SET batchparam_value = $1 "
                  + " WHERE batchparam_batch_id = $2 "
                  + " AND batchparam_order = $3 ";
                   
              plv8.execute(updatebpSQL, [NEW.wf_printparam_value, batchid, NEW.wf_printparam_order]);
              skip_update = true;
        });
        if (!skip_update)  
        {
           /* Insert printparam into batchparam */
           plv8.elog(WARNING, "inserting batchid " + batchid + ", order " + NEW.wf_printparam_order);

           var insertbpSQL = "INSERT INTO xtbatch.batchparam "
               + " (batchparam_batch_id, batchparam_order, "
               + "  batchparam_name, batchparam_value, batchparam_type) "
               + " (SELECT $1 AS batch_id, wf_printparam_order, "
               + "  wf_printparam_name, wf_printparam_value, wf_printparam_type "
               + " FROM workflow.wf_printparam "
               + " WHERE wf_printparam_id = $2) "; 
  
           plv8.execute(insertbpSQL, [batchid, NEW.wf_printparam_id]);
        }
     }
     else
        plv8.elog(WARNING, "wf_status is not I");
  });
  return NEW;

}()); 

$BODY$
  LANGUAGE plv8;
ALTER FUNCTION workflow.send_printparam_to_batchparam()
  OWNER TO admin;
GRANT ALL ON FUNCTION workflow.send_printparam_to_batchparam() TO xtrole;
