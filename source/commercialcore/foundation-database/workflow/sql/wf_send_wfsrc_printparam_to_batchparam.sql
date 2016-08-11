-- Function: workflow.send_wfsrc_printparam_to_batchparam()

-- DROP FUNCTION workflow.send_wfsrc_printparam_to_batchparam();

/* 
This function gets called by xtmi 
to move params from xt.wfsrc_printparam 
to batch.batch and batch.batchparam.
*/

CREATE OR REPLACE FUNCTION workflow.send_wfsrc_printparam_to_batchparam(uuid,integer,integer,text,text)
   RETURNS integer AS
$BODY$
DECLARE
  wfparent_uuid ALIAS FOR $1; 
  shiphead_id   ALIAS FOR $2; 
  order_id      ALIAS FOR $3;
  order_number  ALIAS FOR $4; 
  order_type    ALIAS FOR $5;
  _xtbatch      TEXT;
  _report_name  TEXT = 'no report';
  _wfsrc_uuid   UUID;
  _wfsrcpp      RECORD;
  _batchid      INTEGER;

BEGIN
   /* MAKE SURE XTBATCH IS PRESENT AND ENABLED */
   SELECT packageIsEnabled('xtbatch') INTO _xtbatch;
   IF (_xtbatch = 'false') THEN
     RAISE WARNING 'The xtbatch package is not enabled. Print Jobs will not run.';
     RETURN 1;
   END IF;

   /* find report */
   IF (order_type = 'PO') THEN
      _report_name := 'ReceivingLabel';
   END IF;
   IF (order_type = 'SO') THEN
      SELECT findcustomerform(
        (SELECT cohead_cust_id FROM cohead 
         WHERE cohead_id = order_id), 'P') 
         INTO _report_name;
   END IF;
   IF (order_type = 'TO') THEN
      SELECT findtoform(order_id, 'P') INTO _report_name;
   END IF;
   IF (_report_name = 'no report') THEN
      RAISE EXCEPTION 'Report name not found.';
   END IF;
   
   /* find the wfsrc_uuid from the wfparent_uuid */
   SELECT wf_parentinfo_wfsrc_uuid INTO _wfsrc_uuid
   FROM workflow.wf_parentinfo 
   WHERE wf_parentinfo_wfparent_uuid = wfparent_uuid::text;
   IF (NOT FOUND) THEN
     RAISE EXCEPTION 'wfsrc_uuid not found';
   END IF;
   
   /* insert some params into batch head table */   
   INSERT INTO xtbatch.batch
     (batch_action, batch_parameter, batch_user, batch_email,
      batch_subject, batch_responsebody, batch_fromemail, batch_replyto,
      batch_submitted, batch_scheduled)
     (SELECT 'RunReport' AS job_type, _report_name AS reportname, 
      current_user, toemail.wfsrc_printparam_value AS toemail,
      _report_name||' Printed for Order #'||order_number AS subject,
      _report_name||' for '||head_type.wfsrc_printparam_value||' #'||order_number
      ||' sent to printer '||reportprinter.wfsrc_printparam_value||' on '|| localtimestamp AS body,
      fromemail.wfsrc_printparam_value AS fromemail1, fromemail.wfsrc_printparam_value AS fromemail2,
      localtimestamp, localtimestamp
      FROM workflow.wfsrc_printparam AS toemail,
      workflow.wfsrc_printparam AS fromemail,
      workflow.wfsrc_printparam AS head_type,
      workflow.wfsrc_printparam AS reportprinter
      WHERE toemail.wfsrc_printparam_wfsrc_uuid = '024e4d8d-0b18-4292-9573-6d315e30d1bb'
      AND toemail.wfsrc_printparam_name = 'toemail'
      AND fromemail.wfsrc_printparam_wfsrc_uuid = '024e4d8d-0b18-4292-9573-6d315e30d1bb'
      AND fromemail.wfsrc_printparam_name = 'fromemail'
      AND head_type.wfsrc_printparam_wfsrc_uuid = '024e4d8d-0b18-4292-9573-6d315e30d1bb'
      AND head_type.wfsrc_printparam_name = 'head_type'            
      AND reportprinter.wfsrc_printparam_wfsrc_uuid = '024e4d8d-0b18-4292-9573-6d315e30d1bb'
      AND reportprinter.wfsrc_printparam_name = 'reportPrinter')
   RETURNING batch_id INTO _batchid;

   /* Insert wfsrc_printparam into batchparam */
   INSERT INTO xtbatch.batchparam
          (batchparam_batch_id, batchparam_order,
           batchparam_name, batchparam_value, batchparam_type)
          (SELECT _batchid AS batch_id, wfsrc_printparam_order,
           wfsrc_printparam_name, wfsrc_printparam_value, wfsrc_printparam_type
           FROM workflow.wfsrc_printparam
           WHERE wfsrc_printparam_wfsrc_uuid = _wfsrc_uuid);   
   
   /* Update some batchparams */
   UPDATE xtbatch.batchparam SET batchparam_value = order_id
   WHERE batchparam_name IN ('sohead_id','head_id','orderhead_id')
   AND batchparam_batch_id = _batchid;
   
   UPDATE xtbatch.batchparam SET batchparam_value = order_type 
   WHERE batchparam_name IN ('head_type','orderhead_type')
   AND batchparam_batch_id = _batchid;

   UPDATE xtbatch.batchparam SET batchparam_value = _report_name
   WHERE batchparam_name = 'name'
   AND batchparam_batch_id = _batchid;
   
   UPDATE xtbatch.batchparam SET batchparam_value = shiphead_id
   WHERE batchparam_name = 'shiphead_id'
   AND batchparam_batch_id = _batchid;

   RETURN 0;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION workflow.send_wfsrc_printparam_to_batchparam(uuid,integer,integer,text,text)
  OWNER TO admin;
GRANT EXECUTE ON FUNCTION workflow.send_wfsrc_printparam_to_batchparam(uuid,integer,integer,text,text) TO admin;
GRANT EXECUTE ON FUNCTION workflow.send_wfsrc_printparam_to_batchparam(uuid,integer,integer,text,text) TO public;
GRANT EXECUTE ON FUNCTION workflow.send_wfsrc_printparam_to_batchparam(uuid,integer,integer,text,text) TO xtrole;
