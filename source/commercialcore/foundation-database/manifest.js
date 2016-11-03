{
  "name": "commercialcore_foundation",
  "version": "",
  "comment": "Commercial Core foundation",
  "loadOrder": 47,
  "defaultSchema": "xtcore",
  "databaseScripts": [
    "update_version.sql",
    "xtcore/create_xtcore_schema.sql",
    "xtcore/privs.sql",
    "xtcore/tables/emlprofile.sql",
    "xtcore/tables/poemlprofile.sql",
    "xtcore/tables/potype.sql",
    "xtcore/tables/poheadext.sql",
    "xtcore/tables/vendinfoext.sql",
    "public/tables/source.sql",
    "xtcore/functions/deletepotype.sql",
    "xtcore/functions/deleteunusedpotypes.sql",
    "xtcore/tables/pkgmetasql/poheadext-table.mql",
    "xtcore/tables/pkgmetasql/potype-table.mql",
    "xtcore/tables/pkgmetasql/vendinfoext-table.mql",
    "xtcore/tables/pkgreport/PurchaseOrderTypes.xml",
    "xtcore/tables/pkgscript/initMenu.js",
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
    "workflow/sql/createwf_after_insert.sql",
    "workflow/sql/update_metric.sql",
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
