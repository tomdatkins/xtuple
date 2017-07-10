DROP FUNCTION IF EXISTS xt.workflow_inheritsource(text, text, uuid, integer, integer);

CREATE OR REPLACE FUNCTION xt.workflow_inheritsource(
    sourcetbl text,
    item_uuid uuid,
    parent_id integer,
    order_id integer)
  RETURNS text AS $$

  if (!parent_id) {
    return '';
  }

  var DEBUG = false;

  var namespace = 'xt',
      sourceTable = sourcetbl,
      typeTable,
      workflowTable,
      workflowType,
      templateExistsSql,
      templateSQL,
      insertSQL,
      updateCompletedSQL,
      updateDeferredSQL,
      notifySQL,
      insertParentSQL,
      templateItems = [],
      options = { superUser: true };


  /* Check the first param to see if it's a 'workflow source table' */
  typeTable = plv8.execute("SELECT wftype_tblname AS wftbl, wftype_code FROM xt.wftype WHERE wftype_src_tblname = $1; ",
    [sourceTable]);
  workflowTable = typeTable[0].wftbl;
  workflowType  = typeTable[0].wftype_code;

  if (!sourceTable || !workflowTable || !item_uuid) {
    plv8.elog(ERROR, "Missing parameters supplied or invalid source/target models supplied. Values are:",
                     " sourceTable=", sourceTable, 
                     " item_uuid=", item_uuid,
                     " parent_id=", parent_id
             );
  }

  templateExistsSql = "SELECT count(*) AS count FROM %1$I.%2$I WHERE wf_parent_uuid = $1";
  templateSQL = "SELECT\n" +
                "  obj_uuid,\n" +
                "  wfsrc_id,\n" +
                "  wfsrc_name AS name,\n" +
                "  wfsrc_description AS descr,\n" +
                "  wfsrc_type AS type,\n" +
                "  wfsrc_status AS status,\n" +
                "  CASE WHEN wfsrc_start_set\n" +
                "    THEN current_date + wfsrc_start_offset\n" +
                "    ELSE current_date\n" +
                "  END AS startdate,\n" +
                "  CASE WHEN wfsrc_due_set\n" +
                "    THEN current_date + wfsrc_due_offset\n" +
                "    ELSE current_date\n" +
                "  END AS duedate,\n" +
                "  wfsrc_notes AS notes,\n" +
                "  wfsrc_priority_id AS priority,\n" +
                "  wfsrc_owner_username AS owner,\n" +
                "  wfsrc_assigned_username AS assigned,\n" +
                "  wfsrc_completed_parent_status AS compl_status,\n" +
                "  wfsrc_deferred_parent_status AS defer_status,\n" +
                "  wfsrc_sequence AS sequence,\n" +
                "  wfsrc_completed_successors AS compl_successor,\n" +
                "  wfsrc_deferred_successors AS defer_successor,\n" +
                "  wfsrc_emlprofile_id AS email_profile\n" +
                "FROM %1$I.%2$I\n" +
                "WHERE wfsrc_parent_id = $1";
  insertSQL = "INSERT INTO %1$I.%2$I (\n" +
              "  wf_name,\n" +
              "  wf_description,\n" +
              "  wf_type,\n" +
              "  wf_status,\n" +
              "  wf_start_date,\n" +
              "  wf_due_date,\n" +
              "  wf_notes,\n" +
              "  wf_priority_id,\n" +
              "  wf_owner_username,\n" +
              "  wf_assigned_username,\n" +
              "  wf_parent_uuid,\n" +
              "  wf_completed_parent_status,\n" +
              "  wf_deferred_parent_status,\n" +
              "  wf_sequence,\n" +
              "  wf_completed_successors,\n" +
              "  wf_deferred_successors,\n" +
              "  wf_emlprofile_id\n" +
              ") VALUES (\n" +
              "  $1,\n" +
              "  $2,\n" +
              "  $3,\n" +
              "  $4,\n" +
              "  $5,\n" +
              "  $6,\n" +
              "  $7,\n" +
              "  $8,\n" +
              "  $9,\n" +
              "  $10,\n" +
              "  $11,\n" +
              "  $12,\n" +
              "  $13,\n" +
              "  $14,\n" +
              "  $15,\n" +
              "  $16,\n" +
              "  $17\n" +
              ") RETURNING obj_uuid";
  updateCompletedSQL = "UPDATE %1$I.%2$I SET\n" +
                       "  wf_completed_successors=$1\n" +
                       "WHERE wf_completed_successors = $2\n" +
                       "  AND wf_parent_uuid = $3";
  updateDeferredSQL = "UPDATE %1$I.%2$I SET\n" +
                      "  wf_deferred_successors=$1\n" +
                      "WHERE wf_deferred_successors = $2\n" +
                      "  AND wf_parent_uuid = $3";
  notifySQL = "SELECT xt.workflow_notify($1);";
  insertParentSQL = "INSERT INTO xt.wf_parentinfo (\n" +
                        "  wf_parentinfo_wf_uuid,\n" +
                        "  wf_parentinfo_wfparent_uuid,\n" +
                        "  wf_parentinfo_wfsrc_uuid,\n" +
                        "  wf_parentinfo_wftype_code\n" +
                        ") VALUES (\n" +
                        "  $1,\n" +
                        "  $2,\n" +
                        "  $3,\n" +
                        "  $4\n" +
                        ")";

  var templateExistsSqlf = XT.format(templateExistsSql,
                                     [
                                       namespace,
				       workflowTable
                                     ]);

  var templateWfExists = plv8.execute(templateExistsSqlf, [item_uuid])[0].count;

  if (templateWfExists > 0) {
    return '';
  }

  /* Retrieve source workflow information */
  var templateWfsql = XT.format(templateSQL,
                                [
                                  namespace,
				  sourceTable
                                ]);
  var templateWf = plv8.execute(templateWfsql, [parent_id]);

  if (templateWf.length > 0)
  {
    /* Create target workflow items and retain relationship between source and target uuid */
    templateWf.map(function (items, index) {
      var insertWfsql = XT.format(insertSQL,
                                [
                                  namespace,
				  workflowTable
                                ]);
      var workflowWf = plv8.execute(insertWfsql,
                                  [
                                    items.name,
                                    items.descr,
                                    items.type,
                                    items.status,
                                    items.startdate,
                                    items.duedate,
                                    items.notes,
                                    items.priority,
                                    items.owner,
                                    items.assigned,
                                    item_uuid,
                                    items.compl_status,
                                    items.defer_status,
                                    items.sequence,
                                    items.compl_successor,
                                    items.defer_successor,
                                    items.email_profile
                                  ]);

      templateItems[index] = { sourceUuid: items.obj_uuid,
                               newUuid: workflowWf[0].obj_uuid
                             };
      /*
         Insert into wf_parentinfo to establish link between parent order and wfsrc template
         as well as the workflow type
      */
      plv8.execute(insertParentSQL,
                   [
                     templateItems[index].newUuid,
                     item_uuid,
                     items.obj_uuid,
                     workflowType
                   ]);
      /* Workflow Notifications (In-Process status) */
      if (items.status === 'I') {
        var notification = plv8.execute(notifySQL, [ templateItems[index].newUuid ]);
      }
    });

    /* Reiterate through new workflow items and fix successor mappings */
    templateItems.map(function (items) {
      var completedSQL,
          deferredSQL,
          updateWf;

      /* Update Completed successors */
      completedSQL = XT.format(updateCompletedSQL,
                               [
                                 namespace,
	                         workflowTable
                               ]);
      updateWf = plv8.execute(completedSQL,
                              [
                                items["newUuid"],
                                items["sourceUuid"],
                                item_uuid
                              ]);
      /* Update Deferred successors */
      deferredSQL = XT.format(updateDeferredSQL,
                              [
                                namespace,
                                workflowTable
                              ]);
      updateWf = plv8.execute(deferredSQL,
                              [
                                items["newUuid"],
                                items["sourceUuid"],
                                item_uuid
                              ]);

    });

  }

  return item_uuid;

$$
  LANGUAGE plv8;

