{
  "name": "commercialcore_foundation",
  "version": "",
  "comment": "Commercial Core foundation",
  "loadOrder": 47,
  "defaultSchema": "xtcore",
  "databaseScripts": [
    "update_version.sql",
    "xtcore/tables/obj.sql",
    "workflow/sql/add_uuid.sql",
    "workflow/sql/tables/wf.sql",
    "workflow/sql/tables/wfsrc.sql",
    "workflow/sql/tables/wftype.sql",
    "workflow/sql/tables/printer.sql",
    "xtcore/create_xtcore_schema.sql",
    "xtcore/privs.sql",
    "public/tables/source.sql",
    "xtcore/functions/co_schedule_date.sql",
    "xtcore/functions/po_schedule_date.sql",
    "xtcore/tables/pkgscript/_obsolete.sql",
    "xtcore/tables/pkgscript/itemGroup.js",
    "xtcore/tables/pkgscript/ParameterGroupUtils.js",
    "xtcore/tables/pkgscript/xtCore.js",
    "xtcore/tables/pkgscript/xtCoreErrors.js",
    "workflow/create_workflow_schema.sql",
    "workflow/sql/tables/emlprofile.sql",
    "workflow/sql/tables/coheadwf.sql",
    "workflow/sql/functions/createwf.sql",
    "workflow/sql/trigger_functions/createwf_triggers.sql",
    "workflow/sql/trigger_functions/workflow_update_successors.sql",
    "workflow/sql/trigger_functions/recv_item_did_change.sql",
    "workflow/sql/trigger_functions/ship_head_did_change.sql",
    "workflow/sql/trigger_functions/ship_item_did_change.sql",
    "workflow/sql/tables/potypewf.sql",
    "workflow/sql/tables/powf.sql",
    "workflow/sql/tables/prjtypewf.sql",
    "workflow/sql/tables/prjwf.sql",
    "workflow/sql/tables/saletypewf.sql",
    "workflow/sql/tables/sitetypewf.sql",
    "workflow/sql/acttype.sql",
    "workflow/metasql/WorkflowActivities-detail.mql",
    "workflow/metasql/WorkflowList-detail.mql",
    "workflow/patches/remove_databaseinformation_script.sql",
    "workflow/scripts/initMenu.js",
    "workflow/scripts/setup.js",
    "workflow/scripts/configureWF.js",
    "workflow/scripts/initMenu.js",
    "workflow/scripts/setup.js",
    "workflow/scripts/printer.js",
    "workflow/scripts/printers.js",
    "workflow/scripts/sharedwf.js",
    "workflow/scripts/Workflow.js",
    "workflow/scripts/WorkflowActivities.js",
    "workflow/scripts/WorkflowActivity.js",
    "workflow/scripts/WorkflowItem.js",
    "workflow/sql/functions/copychars.sql",
    "workflow/sql/tables/wf_parentinfo.sql",
    "workflow/sql/tables/recv.sql",
    "workflow/sql/tables/shiphead.sql",
    "workflow/sql/tables/shipitem.sql",
    "workflow/sql/functions/workflow_inheritsource.sql",
    "workflow/sql/functions/workflow_notify.sql",
    "workflow/sql/trigger_functions/updatewf_triggers.sql",
    "workflow/uiforms/configureWF.ui",
    "workflow/uiforms/printer.ui",
    "workflow/uiforms/printers.ui",
    "workflow/uiforms/Workflow.ui",
    "workflow/uiforms/WorkflowActivity.ui",
    "workflow/uiforms/WorkflowItem.ui"
  ]
}

