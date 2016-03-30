DROP TRIGGER IF EXISTS wf_printparam_did_change ON workflow.wf_printparam CASCADE;

CREATE OR REPLACE FUNCTION workflow.send_printparam_to_batchparam()
  RETURNS trigger AS
$BODY$

return (function () { 
   plv8.elog(WARNING, "send_printparam_to_batchparam: NEW.wf_printparam_parent_uuid is " + NEW.wf_printparam_parent_uuid);
   var batchid = -1;
   var skip_update = false;
   
   /* only copy if printparams_send_to_batch = true */
   if (NEW.wf_printparam_send_to_batch)  
   {
      plv8.elog(WARNING, "wf_printparam_send_to_batch is true");
   
      /* check to see if batch exists */
      var checkbatchSQL = "SELECT batchparam_batch_id from xtbatch.batchparam "
          + " WHERE batchparam_value = $1::text ORDER BY batchparam_batch_id ASC LIMIT 1";   
      var checkbatch = plv8.execute(checkbatchSQL, [NEW.wf_printparam_parent_uuid]);
           
      checkbatch.map(function (batchitems) 
      {
         plv8.elog(WARNING, "batch found: enter batchitems map");
         batchid = batchitems.batchparam_batch_id;       
      })
      /* if not, insert new batch */
      if (batchid < 0) 
      {   
         plv8.elog(WARNING, "batch not found, insert new");
         
         /* get the report name */
         var getreportSQL = "SELECT wf_printparam_value AS report FROM workflow.wf_printparam "
                + " WHERE wf_printparam_name = 'name' "
                + " AND   wf_printparam_parent_uuid = $1"
         var reportparam = plv8.execute(getreportSQL, NEW.wf_printparam_parent_uuid);
         
         reportparam.map(function (reportitems)
         {                
            var insertbatchSQL = "INSERT INTO xtbatch.batch "
                + " (batch_action, batch_parameter, "
                + "  batch_user, batch_submitted, batch_scheduled) "
                + " VALUES "
                + " ('RunReport', $1, " // report name 
                + "   current_user, localtimestamp, localtimestamp) "
                + " RETURNING batch_id, batch_parameter" ;
            var insertbatch = plv8.execute(insertbatchSQL, reportitems.report);
            insertbatch.map(function (batchiditems) 
            {   
               batchid = batchiditems.batch_id;
               plv8.elog(WARNING, "batch_id is " + batchid + " and batch_parameter is " + batchiditems.batch_parameter);
            });
            
            /* insert first batchparam with uuid */
            var insertfirstbatchparamSQL = "INSERT INTO xtbatch.batchparam "
                + " (batchparam_batch_id, batchparam_order, "
                + "  batchparam_name, batchparam_value, batchparam_type) "
                + " VALUES ( $1, 0, "
                + "  'wf_uuid', $2::text, 'text' ) returning batchparam_id"; 
            plv8.execute(insertfirstbatchparamSQL, [batchid, NEW.wf_printparam_parent_uuid]);
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
      plv8.elog(WARNING, "wf_printparams_send_to_batch is false");
   return NEW;
}()); 

$BODY$
  LANGUAGE plv8;
ALTER FUNCTION workflow.send_printparam_to_batchparam()
  OWNER TO admin;
GRANT ALL ON FUNCTION workflow.send_printparam_to_batchparam() TO xtrole;


-- Trigger: wf_printparam_did_change on xt.wf_printparam

CREATE TRIGGER wf_printparam_did_change
  AFTER INSERT OR UPDATE
  ON workflow.wf_printparam
  FOR EACH ROW
  EXECUTE PROCEDURE workflow.send_printparam_to_batchparam();
  
  
