{
  "name": "commercialcore_foundation",
  "version": "",
  "comment": "Commercial Core foundation",
  "loadOrder": 47,
  "defaultSchema": "xtcore",
  "databaseScripts": [
    "update_version.sql",
    "workflow/sql/add_uuid.sql",
    "workflow/sql/wf.sql",
    "workflow/sql/wfsrc.sql",
    "workflow/sql/wftype.sql",
    "xtcore/create_xtcore_schema.sql",
    "xtcore/privs.sql",
    "xtcore/tables/emlprofile.sql",
    "xtcore/tables/poemlprofile.sql",
    "public/tables/source.sql",
    "xtcore/functions/co_schedule_date.sql",
    "xtcore/functions/po_schedule_date.sql",
    "xtcore/tables/pkgscript/itemGroup.js",
    "xtcore/tables/pkgscript/ParameterGroupUtils.js",
    "xtcore/tables/pkgscript/xtCore.js",
    "xtcore/tables/pkgscript/xtCoreErrors.js",
    "workflow/create_workflow_schema.sql",
    "workflow/sql/wf.sql",
    "workflow/sql/wfsrc.sql",
    "workflow/sql/wftype.sql",
    "workflow/sql/coheadwf.sql",
    "workflow/sql/createwf.sql",
    "workflow/sql/potypewf.sql",
    "workflow/sql/powf.sql",
    "workflow/sql/prjtypewf.sql",
    "workflow/sql/prjwf.sql",
    "workflow/sql/saletypewf.sql",
    "workflow/sql/sitetypewf.sql",
    "workflow/sql/acttype.sql",    
    "workflow/metasql/WorkflowActivities-detail.mql",
    "workflow/metasql/WorkflowList-detail.mql",
    "workflow/patches/remove_databaseinformation_script.sql",
    "workflow/scripts/configureWF.js",
    "workflow/scripts/printer.js",
    "workflow/scripts/printers.js",
    "workflow/scripts/sharedwf.js",
    "workflow/scripts/Workflow.js",
    "workflow/scripts/WorkflowActivities.js",
    "workflow/scripts/WorkflowActivity.js",
    "workflow/scripts/WorkflowItem.js",
    "workflow/sql/copychars.sql",
    "workflow/sql/wf_parentinfo.sql",
    "workflow/sql/wf_send_wfsrc_printparam_to_batchparam.sql",
    "workflow/sql/wfsrc_printparam.sql",
    "workflow/sql/workflow_inheritsource.sql",
    "workflow/sql/workflow_notify.sql",    
    "workflow/uiforms/configureWF.ui",    
    "workflow/uiforms/printer.ui",
    "workflow/uiforms/printers.ui",
    "workflow/uiforms/Workflow.ui",
    "workflow/uiforms/WorkflowActivity.ui",
    "workflow/uiforms/WorkflowItem.ui"
  ]
}

