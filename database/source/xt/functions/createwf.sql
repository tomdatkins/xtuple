CREATE OR REPLACE FUNCTION xt.createwf(text, anyelement)
  RETURNS record AS
$BODY$
/* Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */
DECLARE
tg_table_name ALIAS FOR $1; 
tg_table_row  ALIAS FOR $2;
_wftypecode   TEXT      := '';
_source_model TEXT      := '';
_workflow_class TEXT    := '';
_item_uuid    UUID;
_parent_id    INTEGER   := 0;
_order_id     INTEGER   := 0;
_poparent     RECORD;

BEGIN

   IF (fetchmetricbool('TriggerWorkflow')) THEN
            
      -- Get data by type      
      IF (tg_table_name = 'cohead') THEN
         _wftypecode := 'SO';
         _workflow_class  := 'XM.SalesOrderWorkflow';
         _item_uuid := tg_table_row.obj_uuid;
         _parent_id := tg_table_row.cohead_saletype_id;
         _order_id := tg_table_row.cohead_id;
         
      ELSIF (tg_table_name = 'prj') THEN
         _wftypecode := 'PRJ';
         _workflow_class  := 'XM.ProjectWorkflow';
         _item_uuid := tg_table_row.obj_uuid;
         _parent_id := tg_table_row.prj_prjtype_id;
         _order_id := tg_table_row.prj_id;
         
      ELSIF (tg_table_name = 'poheadext') THEN
         _wftypecode := 'PO';
         _workflow_class  := 'XM.PurchaseOrderWorkflow';
         SELECT poheadext_potype_id AS parent_id, pohead_id, pohead.obj_uuid AS pohead_uuid INTO _poparent
         FROM xt.poheadext JOIN pohead ON poheadext_id = pohead_id WHERE poheadext_id = tg_table_row.poheadext_id;
         IF (NOT FOUND) THEN
           RAISE WARNING 'Missing parentId needed to generate workflow!';
         END IF;
         _item_uuid    := _poparent.pohead_uuid;
         _parent_id    := _poparent.pohead_id;
         _order_id     := _poparent.pohead_id;

      ELSIF (tg_table_name = 'tohead') THEN
         _wftypecode := 'TO';
         _workflow_class  := 'XM.TransferOrderWorkflow';
         _item_uuid := tg_table_row.obj_uuid;
         SELECT warehous_sitetype_id AS parent_id INTO _parent_id FROM warehous WHERE warehous_id = tg_table_row.tohead_src_warehous_id;
         IF (NOT FOUND) THEN
           RAISE WARNING 'Missing parentId needed to generate workflow!';
         END IF;
         _order_id     := tg_table_row.tohead_id;

      ELSIF (tg_table_name = 'wo') THEN
         _wftypecode := 'WO';
         _workflow_class  := 'XM.WorkOrderWorkflow';
         _item_uuid := tg_table_row.obj_uuid;
         SELECT warehous_sitetype_id AS parent_id INTO _parent_id FROM warehous WHERE warehous_id = tg_table_row.wo_itemsite_id;
         IF (NOT FOUND) THEN
           RAISE WARNING 'Missing parentId needed to generate workflow!';
         END IF;
         _order_id = tg_table_row.wo_id;
      END IF;
      
      -- Get _source_model
      SELECT wftype_src_tblname AS srctblname FROM xt.wftype WHERE wftype_code = _wftypecode INTO _source_model;
      IF (NOT FOUND) THEN
        RAISE WARNING 'Missing sourceModel needed to generate workflow!';
      END IF;
     
      -- Generate workflow 
      PERFORM xt.workflow_inheritsource('xt.' || _source_model, _workflow_class, _item_uuid, _parent_id, _order_id);

      RETURN tg_table_row;
  END IF;

END;

$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xt.createwf(text, anyelement)
  OWNER TO admin;