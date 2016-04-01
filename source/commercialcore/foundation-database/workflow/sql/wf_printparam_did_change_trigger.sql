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
         var getreportSQL = "SELECT report.wf_printparam_value AS report    "
                + "       ,printer.wf_printparam_value         AS printer   "
                + "       ,fromemail.wf_printparam_value       AS fromemail " 
                + "       ,toemail.wf_printparam_value         AS toemail   "
                + " FROM   workflow.wf_printparam report                    "
                + "       ,workflow.wf_printparam printer                   "
                + "       ,workflow.wf_printparam fromemail                 "
                + "       ,workflow.wf_printparam toemail                   "
                + " WHERE (   report.wf_printparam_name = 'name'            "
                + "        AND    report.wf_printparam_parent_uuid = $1)    "
                + "   AND (  printer.wf_printparam_name = 'reportPrinter'   "
                + "        AND   printer.wf_printparam_parent_uuid = $1)    "
                + "   AND (fromemail.wf_printparam_name = 'fromemail'       "
                + "        AND fromemail.wf_printparam_parent_uuid = $1)    "
                + "   AND (  toemail.wf_printparam_name = 'toemail'         "
                + "        AND   toemail.wf_printparam_parent_uuid = $1)    ";
         var reportparam = plv8.execute(getreportSQL, NEW.wf_printparam_parent_uuid);
         
         reportparam.map(function (reportitems)
         {                
            var getordernumSQL = "SELECT cohead_number FROM cohead "
                + " WHERE cohead.obj_uuid = ( "
                + " SELECT wf_parent_uuid FROM xt.wf "
                + " WHERE wf.obj_uuid = $1 ) ";
            var getordernum = plv8.execute(getordernumSQL, [NEW.wf_printparam_parent_uuid]);
            
            var ordernum = getordernum[0].cohead_number;
            plv8.elog(WARNING, "order number is " + ordernum);
            
            var insertbatchSQL = "INSERT INTO xtbatch.batch "
                + " (batch_action, batch_parameter, "
                + "  batch_user, batch_email, "
                + "  batch_subject, batch_responsebody, "
                + "  batch_fromemail, batch_replyto, "
                + "  batch_submitted, batch_scheduled) "
                + " VALUES "
                + " ('RunReport', $1, " // report name is parameter
                + "   current_user, $4, " // TODO: change this address after testing
                + "   $1||' Printed for Order #'||$2, "
                + "   $1||' for order # '||$2||' sent to printer '||$3||' on '|| localtimestamp, "
                + "   $5, $5, "
                + "   localtimestamp, localtimestamp) "
                + " RETURNING batch_id, batch_parameter" ;
            var insertbatch = plv8.execute(insertbatchSQL, reportitems.report, ordernum,
                reportitems.printer, reportitems.toemail, reportitems.fromemail);
            batchid = insertbatch[0].batch_id;
            plv8.elog(WARNING, "batch_id is " + batchid + " and batch_parameter is " 
                                   + insertbatch[0].batch_parameter);
            
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
  
  
