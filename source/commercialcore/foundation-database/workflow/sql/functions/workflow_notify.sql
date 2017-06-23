DROP FUNCTION IF EXISTS xt.workflow_notify(uuid);

CREATE OR REPLACE FUNCTION xt.workflow_notify(uuid uuid)
  RETURNS boolean AS $$
DECLARE
  _xtbatch      TEXT;
  _wf           RECORD;
  _eml          RECORD;
  _opts         TEXT;
  _res          INTEGER;
  _docid        INTEGER;
  _docnum       TEXT;
  _doctype      TEXT; 
BEGIN 

  SELECT packageIsEnabled('xtbatch') INTO _xtbatch;
  IF (_xtbatch = 'false') THEN
    RAISE WARNING 'The xtbatch package is not enabled. Print Jobs will not run.';
    RETURN false;
  END IF;
  
  SELECT wf_emlprofile_id, wf_parent_uuid, 
         wftype_table, wftype_id_col, wftype_uuid_col,
         wftype_code, wftype_number_col
    INTO _wf
  FROM xt.wf 
  JOIN xt.wf_parentinfo ON (wf_parentinfo_wf_uuid=wf.obj_uuid::TEXT)
  JOIN xt.wftype ON (wftype_code=wf_parentinfo_wftype_code)
  WHERE obj_uuid = uuid;

  IF (_wf.wf_emlprofile_id IS NULL) THEN
    RAISE WARNING 'No Email Profile for this workflow step [#1]';
    RETURN false;
  END IF;

  SELECT * INTO _eml
  FROM xt.emlprofile 
  WHERE emlprofile_id = _wf.wf_emlprofile_id;

  IF NOT FOUND THEN
    RAISE WARNING 'No Email Profile for this workflow step [#2]';
    RETURN false;
  END IF;
  
  -- Determine variables for workflow messages
  EXECUTE format('SELECT %I FROM %I WHERE %I = ''%s''', _wf.wftype_id_col,
                                                    _wf.wftype_table,
                                                    _wf.wftype_uuid_col,
                                                    _wf.wf_parent_uuid) INTO _docid;
  EXECUTE format('SELECT %I FROM %I WHERE %I = ''%s''', _wf.wftype_number_col,
                                                    _wf.wftype_table,
                                                    _wf.wftype_uuid_col,
                                                    _wf.wf_parent_uuid) INTO _docnum;
                                                                                               
  _opts := (select '{"params": ' || regexp_replace(array_to_json(array_agg(foo))::TEXT, '(\[|\])', '','g') ||'}' AS payload 
            FROM (
               SELECT wf_owner_username AS owner, u1.usr_email AS owner_email, 
               wf_assigned_username AS assigned, u2.usr_email AS assigned_email,
               wf_name, wf_description,
               formatDate(wf_start_date) AS startdate,
               formatDate(wf_due_date) AS duedate,
               CASE wf_status WHEN 'P' THEN 'Pending'
                      WHEN 'I' THEN 'In-Process'
                      WHEN 'C' Then 'Completed'
                      WHEN 'D' THEN 'Deferred' END AS status,
               (SELECT incdtpriority_name FROM incdtpriority 
                WHERE incdtpriority_id = wf_priority_id) AS priority,
                _docid AS docid,
                _docnum AS docnumber,
                _wf.wftype_code AS doctype
               FROM xt.wf 
               JOIN usr u1 ON wf_owner_username = u1.usr_username
               JOIN usr u2 ON wf_assigned_username = u2.usr_username
               WHERE obj_uuid = uuid
          ) foo  );

  /* EMAIL */
  IF (length(_eml.emlprofile_to) > 1) THEN
    SELECT xtbatch.submitemailtobatch(
             COALESCE(xt.parseediprofile(_eml.emlprofile_from, _opts),fetchmetrictext('DefaultBatchFromEmailAddress')),
             xt.parseediprofile(_eml.emlprofile_to, _opts),
             REPLACE(xt.parseediprofile(_eml.emlprofile_cc, _opts), 'null',''),
             REPLACE(xt.parseediprofile(_eml.emlprofile_subject, _opts), 'null',''),
             REPLACE(xt.parseediprofile(_eml.emlprofile_body, _opts), 'null',''),
             NULL,
             CURRENT_timestamp,
             fALSE,
             COALESCE(xt.parseediprofile(_eml.emlprofile_from, _opts),fetchmetrictext('DefaultBatchFromEmailAddress')),
             REPLACE(xt.parseediprofile(_eml.emlprofile_bcc, _opts),'null','')
           )
    INTO _res;
  END IF;

  RETURN true;
  
END;  
$$ LANGUAGE plpgsql;

