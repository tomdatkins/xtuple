DROP TRIGGER IF EXISTS wf_printparam_did_change ON workflow.wf_printparam CASCADE;

CREATE OR REPLACE FUNCTION workflow.send_printparam_to_batchparam()
  RETURNS trigger AS
$BODY$

return (function () { 
   /* MAKE SURE XTBATCH IS PRESENT AND ENABLED */
   var xtbatchSQL = "SELECT packageIsEnabled(pkghead_name) AS enabled FROM pkghead WHERE pkghead_name = 'xtbatch'";
   var xtbatch = plv8.execute(xtbatchSQL);
   if (!xtbatch[0].enabled)
   {
     plv8.elog("xtbatch schema is not installed or is inactive");
     return;
   }  
   
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
           
      if (checkbatch.length > 0 )
      {
         batchid = checkbatch[0].batchparam_batch_id;       
         plv8.elog(WARNING, "batch found: " + batchid);
      }
      
      /* if not, insert new batch */
      if (batchid < 0) 
      {   
         plv8.elog(WARNING, "batch not found, insert new");
         
         /* get the params */
         var param = new Object;
         var getreportSQL = "SELECT wf_printparam_name, "
           + " wf_printparam_value, wf_printparam_parent_uuid "
           + " FROM workflow.wf_printparam "
           + " WHERE wf_printparam_name IN "
           + " ('head_type','billing','invoice','name','reportPrinter','fromemail','toemail') "
           + " AND wf_printparam_parent_uuid = $1 ";
         var reportparam = plv8.execute(getreportSQL, [NEW.wf_printparam_parent_uuid]);
         reportparam.forEach(function (elem) {
           param[elem.wf_printparam_name] = elem.wf_printparam_value
           plv8.elog(WARNING, elem.wf_printparam_name + ": " + elem.wf_printparam_value);
         });
               
         if(param.head_type == 'SO')
         {
              var getordernumSQL = "SELECT cohead_number AS ordernum FROM cohead "
                + " WHERE cohead.obj_uuid = ( "
                + " SELECT wf_parent_uuid FROM xt.wf "
                + " WHERE wf.obj_uuid = $1 ) ";
         } else if(param.head_type == 'PO')
         {
              var getordernumSQL = "SELECT pohead_number AS ordernum FROM pohead "
                + " WHERE pohead.obj_uuid = ( "
                + " SELECT wf_parent_uuid FROM xt.wf "
                + " WHERE wf.obj_uuid = $1 ) ";
         } else if(param.head_type == 'TO')
         {
              var getordernumSQL = "SELECT tohead_number AS ordernum FROM tohead "
                + " WHERE tohead.obj_uuid = ( "
                + " SELECT wf_parent_uuid FROM xt.wf "
                + " WHERE wf.obj_uuid = $1 ) ";            
         }
         var getordernum = plv8.execute(getordernumSQL, [NEW.wf_printparam_parent_uuid]);
            
         var ordernum = getordernum[0].ordernum;
         plv8.elog(WARNING, param.head_type + " number is " + ordernum);
          
         /* insert the params */   
         var insertbatchSQL = "INSERT INTO xtbatch.batch "
                + " (batch_action, batch_parameter, "
                + "  batch_user, batch_email, "
                + "  batch_subject, batch_responsebody, "
                + "  batch_fromemail, batch_replyto, "
                + "  batch_submitted, batch_scheduled) "
                + " VALUES "
                + " ('RunReport', $1, "   
                + "   current_user, $4, " 
                + "   $1||' Printed for Order #'||$2, "
                + "   $1||' for '||$6||' # '||$2||' sent to printer '||$3||' on '|| localtimestamp, "
                + "   $5, $5, "
                + "   localtimestamp, localtimestamp) "
                + " RETURNING batch_id, batch_parameter" ;
         var insertbatch = plv8.execute(insertbatchSQL, [param.name, ordernum,
                param.reportPrinter, param.toemail, param.fromemail, param.head_type]);
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
                                        
         /* check for batchparam */ 
         plv8.elog(WARNING, "finding batchparam for batchid " + batchid + ", order " + NEW.wf_printparam_order);

         var checkbatchparamSQL = "SELECT batchparam_id FROM xtbatch.batchparam "
            + " WHERE batchparam_batch_id = $1 "
            + "   AND batchparam_order = $2";
         var checkbatchparam = plv8.execute(checkbatchparamSQL, [batchid, NEW.wf_printparam_order]);
                      
         checkbatchparam.map(function (bpitems) 
         { 
         /* Update batchparam value*/
         plv8.elog(WARNING, "updating batchparam for batchid " + batchid + ", order " + NEW.wf_printparam_order);

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
         plv8.elog(WARNING, "inserting batchparam for batchid " + batchid + ", order " + NEW.wf_printparam_order);

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
  
  
