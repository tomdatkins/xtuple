CREATE OR REPLACE FUNCTION xt.createwf(tg_table_name text, tg_table_row record)
  RETURNS record AS
$BODY$
/* Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

    if (plv8.execute("select fetchmetricbool('TriggerWorkflow') as val;")[0].val) {
      var parent,
        parentId,
        parentIdSql,
        sourceModSql = "select wftype_src_tblname as srctblname from xt.wftype where wftype_code = $1 ",
        sourceModel;

      if (tg_table_name === 'cohead') {
        sourceModel = plv8.execute(sourceModSql, ['SO'])[0].srctblname;

        if (!sourceModel) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4, $5);",
          ["xt." + sourceModel, 'XM.SalesOrderWorkflow', tg_table_row.obj_uuid, tg_table_row.cohead_saletype_id, tg_table_row.cohead_id]);
      }

      if (tg_table_name === 'prj') {
        sourceModel = plv8.execute(sourceModSql, ['PRJ'])[0].srctblname;

        if (!sourceModel) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4, $5);",
          ["xt." + sourceModel, 'XM.ProjectWorkflow', tg_table_row.obj_uuid, tg_table_row.prj_prjtype_id, tg_table_row.prj_id]);
      }

      if (tg_table_name === 'poheadext') {
        sourceModel = plv8.execute(sourceModSql, ['PO'])[0].srctblname;
        parentIdSql = "select poheadext_potype_id as parent_id, pohead_id, pohead.obj_uuid as pohead_uuid " +
          "from xt.poheadext join pohead on poheadext_id = pohead_id where poheadext_id = $1";
        parent = plv8.execute(parentIdSql, [tg_table_row.poheadext_id])[0];
        if (!sourceModel || !parent) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4, $5);",
          ["xt." + sourceModel, 'XM.PurchaseOrderWorkflow', parent.pohead_uuid, parent.parent_id, parent.pohead_id]);
      }

      if (tg_table_name === 'tohead') {
        sourceModel = plv8.execute(sourceModSql, ['TO'])[0].srctblname;
        parentIdSql = "select warehous_sitetype_id as parent_id from warehous where warehous_id = $1";
        parentId = plv8.execute(parentIdSql, [tg_table_row.tohead_src_warehous_id])[0].parent_id;

        if (!sourceModel || !parentId) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4, $5);",
          ["xt." + sourceModel, 'XM.TransferOrderWorkflow', tg_table_row.obj_uuid, parentId, tg_table_row.tohead_id]);
      }

      if (tg_table_name === 'wo') {
        sourceModel = plv8.execute(sourceModSql, ['WO'])[0].srctblname;
        parentIdSql = "select itemsite_plancode_id as parent_id from itemsite where itemsite_id = $1";
        parentId = plv8.execute(parentIdSql, [tg_table_row.wo_itemsite_id])[0].parent_id;

        if (!sourceModel || !parentId) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4, $5);", ["xt." + sourceModel, 'XM.WorkOrderWorkflow', tg_table_row.obj_uuid, parentId, tg_table_row.wo_id]);
      }

      return tg_table_row;
  }

}());

$BODY$
  LANGUAGE plv8 VOLATILE
  COST 100;
ALTER FUNCTION xt.createwf(text, record)
  OWNER TO admin;