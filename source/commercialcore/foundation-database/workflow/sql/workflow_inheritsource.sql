-- Function: xt.workflow_inheritsource(text, text, uuid, integer, integer)

-- DROP FUNCTION xt.workflow_inheritsource(text, text, uuid, integer, integer);

CREATE OR REPLACE FUNCTION xt.workflow_inheritsource(
    source_model text,
    workflow_class text,
    item_uuid uuid,
    parent_id integer,
    order_id integer)
  RETURNS text AS
$BODY$
  /*
     This function has been modified to copy printparams from wfsrc_printparam instead
     of wf_printparam. wf_printparam no longer exists.
     wf_printinfo is a new table that will join the wf parent object (the SO, PO, etc)
     with the wfsrc object (the workflow template that contains the print params).
  */
  if (!parent_id) {
    return '';
  }

  var DEBUG = true;
  
  var orm,
    namespace,
    modeltype,
    sourceTable,
    workflowTable,
    wfsource,
    wfmodel,
    templateExistsSql,
    templateSQL,
    insertSQL,
    updateCompletedSQL,
    updateDeferredSQL,
    templateItems = [],
    options = { superUser: true },
    i = 0;

  namespace = source_model.split(".")[0];
  modeltype = source_model.split(".")[1];
  /* Check the first param to see if it's a 'workflow source table' */
  wfsource = plv8.execute("SELECT true AS wfsrc FROM xt.wftype WHERE wftype_src_tblname = $1; ",
    [modeltype])[0].wfsrc == true ? true : false;
  if (wfsource) {
    sourceTable = source_model; /*i.e. xt.saletypewf */
  } else {
    wfsource = XT.Data.fetchOrm(namespace, modeltype, options).properties.filter(function (wf) {
      return wf.name === "workflow";
    })[0].toMany.type;
    sourceTable = XT.Orm.fetch(namespace, wfsource, options).table; /* i.e. xt.coheadwf */
  }

  namespace = workflow_class.split(".")[0];
  modeltype = workflow_class.split(".")[1];

  workflowTable = XT.Orm.fetch(namespace, modeltype, options).table;

  if (!sourceTable || !workflowTable || !item_uuid) {
    plv8.elog(ERROR, "Missing parameters supplied or invalid source/target models supplied. Values are:\n" +
                     "  sourceTable = " + sourceTable + "\n" +
                     "  workflowTable = " + workflowTable + "\n" +
                     "  item_uuid = " + item_uuid +  "\n" +
                     "  parent_id = " + parent_id
             );
  }

  templateExistsSql = "SELECT count(*) AS count FROM %1$I.%2$I WHERE wf_parent_uuid = $1";
  templateSQL = "SELECT\n" +
                "  obj_uuid,\n" +
                "  wfsrc_id,\n" +
                "  wfsrc_name as name,\n" +
                "  wfsrc_description as descr,\n" +
                "  wfsrc_type as type,\n" +
                "  wfsrc_status as status,\n" +
                "  CASE WHEN wfsrc_start_set\n" +
                "    THEN current_date + wfsrc_start_offset\n" +
                "    ELSE null\n" +
                "  END as startDate, " +
                "  CASE WHEN wfsrc_due_set\n" +
                "    THEN current_date + wfsrc_due_offset\n" +
                "    ELSE null\n" +
                "  END as dueDate,\n" +
                "  wfsrc_notes as notes,\n" +
                "  wfsrc_priority_id as priority,\n" +
                "  wfsrc_owner_username as owner,\n" +
                "  wfsrc_assigned_username as assigned,\n" +
                "  wfsrc_completed_parent_status as compl_status,\n" +
                "  wfsrc_deferred_parent_status as defer_status,\n" +
                "  wfsrc_sequence as sequence,\n" +
                "  wfsrc_completed_successors as compl_successor,\n" +
                "  wfsrc_deferred_successors as defer_successor\n" +
                "FROM %1$I.%2$I\n" +
                "WHERE wfsrc_parent_id = $1 ";
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
              "  wf_deferred_successors\n" +
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
              "  $16\n" +
              ") RETURNING obj_uuid";
  updateCompletedSQL = "UPDATE %1$I.%2$I SET\n" +
                       "  wf_completed_successors=$1\n" +
                       "WHERE wf_completed_successors = $2\n" +
                       "  AND wf_parent_uuid = $3";
  updateDeferredSQL = "UPDATE %1$I.%2$I SET\n" +
                      "  wf_deferred_successors=$1\n" +
                      "WHERE wf_deferred_successors = $2\n" +
                      "  AND wf_parent_uuid = $3";   
    
  /* 
     Added July 27, 2016 
     Create link between wf parent (SO, PO, etc) and wfsrc (the workflow template). 
  */     
  var insertParentSQL = "INSERT INTO workflow.wf_parentinfo (\n" +
                        "  wf_parentinfo_wfparent_uuid,\n" +
                        "  wf_parentinfo_wfsrc_uuid\n" +
                        ") VALUES (\n" +
                        "  $1,\n" +
                        "  $2\n" +
                        ")";
  /* end */
  
  var templateExistsSqlf = XT.format(templateExistsSql,
                                     [
                                       workflowTable.split(".")[0],
                                       workflowTable.split(".")[1]
                                     ]);
  var templateWfExists = plv8.execute(templateExistsSqlf, [item_uuid])[0].count;

  if (templateWfExists > 0) {
    return '';
  }

/* Retrieve source workflow information */
  var templateWfsql = XT.format(templateSQL,
                                [
                                  sourceTable.split(".")[0],
                                  sourceTable.split(".")[1]
                                ]);
  var templateWf = plv8.execute(templateWfsql, [parent_id]);

/* Create target workflow items and retain relationship between source and target uuid */
  templateWf.map(function (items) {
    templateItems[i] = [];
    templateItems[i]["sourceUuid"] = items.obj_uuid;

    var insertWfsql = XT.format(insertSQL,
                                [
                                  workflowTable.split(".")[0],
                                  workflowTable.split(".")[1]
                                ]);
    var workflowWf = plv8.execute(insertWfsql,
                                  [
                                    items.name,
                                    items.descr,
                                    items.type,
                                    items.status,
                                    items.startDate,
                                    items.dueDate,
                                    items.notes,
                                    items.priority,
                                    items.owner,
                                    items.assigned,
                                    item_uuid,
                                    items.compl_status,
                                    items.defer_status,
                                    items.sequence,
                                    items.compl_successor,
                                    items.defer_successor
                                  ]);
    templateItems[i]["newUuid"] = workflowWf[0].obj_uuid;
        
    /* Added July 27, 2016 
       Insert into wf_parentinfo to establish link between parent order and wfsrc template 
    */
      plv8.execute(insertParentSQL,
                   [
                     item_uuid,
                     items.obj_uuid
                   ]);
    i++;
  });

  /* Reiterate through new workflow items and fix successor mappings */
  templateItems.map(function (items) {
    var completedSQL,
      deferredSQL,
      updateWf;

    /* Update Completed successors */
    completedSQL = XT.format(updateCompletedSQL,
                             [
                               workflowTable.split(".")[0],
                               workflowTable.split(".")[1]
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
                              workflowTable.split(".")[0],
                              workflowTable.split(".")[1]
                            ]);
    updateWf = plv8.execute(deferredSQL,
                            [
                              items["newUuid"],
                              items["sourceUuid"],
                              item_uuid
                            ]);

  });

  return item_uuid;

$BODY$
  LANGUAGE plv8 VOLATILE
  COST 100;
ALTER FUNCTION xt.workflow_inheritsource(text, text, uuid, integer, integer)
  OWNER TO admin;
