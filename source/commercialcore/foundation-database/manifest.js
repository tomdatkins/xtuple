{
  "name": "commercialcore_foundation",
  "version": "",
  "comment": "Commercial Core foundation",
  "loadOrder": 47,
  "defaultSchema": "xtcore",
  "databaseScripts": [
    "update_version.sql",
    "xtcore/functions/uuid_generate_v4.sql",
    "xtcore/functions/obj.sql",
    "xtcore/functions/add_inheritance.sql",
    "workflow/sql/add_uuid.sql",
    "workflow/sql/wf.sql",
    "workflow/sql/wfsrc.sql",
    "workflow/sql/wftype.sql",
    "xtcore/create_xtcore_schema.sql",
    "xtcore/privs.sql",
    "xtcore/tables/emlprofile.sql",
    "xtcore/tables/poemlprofile.sql",
    "xtcore/tables/potype.sql",
    "xtcore/tables/pohead.sql",
    "xtcore/tables/prj.sql",
    "xtcore/tables/prjtask.sql",    
    "xtcore/tables/vendinfo.sql",
    "public/tables/source.sql",
    "xtcore/functions/deletepotype.sql",
    "xtcore/functions/deleteunusedpotypes.sql",
    "xtcore/functions/co_schedule_date.sql",
    "xtcore/functions/po_schedule_date.sql",
    "xtcore/tables/pkgmetasql/pohead-potype.mql",
    "xtcore/tables/pkgmetasql/potype-table.mql",
    "xtcore/tables/pkgmetasql/vendinfo-potype.mql",
    "xtcore/tables/pkgreport/PurchaseOrderTypes.xml",
    "xtcore/tables/pkgscript/itemGroup.js",
    "xtcore/tables/pkgscript/ParameterGroupUtils.js",
    "xtcore/tables/pkgscript/poType.js",
    "xtcore/tables/pkgscript/poTypes.js",
    "xtcore/tables/pkgscript/purchaseOrder.js",
    "xtcore/tables/pkgscript/setup.js",
    "xtcore/tables/pkgscript/vendor.js",
    "xtcore/tables/pkgscript/xtCore.js",
    "xtcore/tables/pkgscript/xtCoreErrors.js",
    "xtcore/tables/pkguiform/poType.ui",
    "xtcore/tables/pkguiform/poTypes.ui",
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
    "workflow/uiforms/printer.ui",
    "workflow/uiforms/printers.ui",
    "workflow/uiforms/Workflow.ui",
    "workflow/uiforms/WorkflowActivity.ui",
    "workflow/uiforms/WorkflowItem.ui"
  ]
}

