/*
This file is part of the xtmfg Package for xTuple ERP,
and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
is licensed to you under the xTuple End-User License Agreement ("the
EULA"), the full text of which is available at www.xtuple.com/EULA.
While the EULA gives you access to source code and encourages your
involvement in the development process, this Package is not free
software.  By using this software, you agree to be bound by the
terms of the EULA.
*/
debugger;

include("ParameterGroupUtils", "storedProcErrorLookup", "xtmfgErrors");

var widgets = toolbox.loadUi("dspMRPException", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("MRP Exceptions"));
mywindow.setListLabel(qsTr("Exceptions"));
mywindow.setReportName("MRPException");
mywindow.setMetaSQLOptions("MRPExceptions", "detail");

try
{
  var _exceptions         = mywindow.list();
  var _plannerCode        = mywindow.findChild("_plannerCode");
  var _item               = mywindow.findChild("_item");
  var _byPlannerCode      = mywindow.findChild("_byPlannerCode");
  var _byItem             = mywindow.findChild("_byItem");
  var _warehouse          = mywindow.findChild("_warehouse");
  var _scheduleExceptions = mywindow.findChild("_scheduleExceptions");
  var _cancelExceptions   = mywindow.findChild("_cancelExceptions");
  var _minDays            = mywindow.findChild("_minDays");
  var _minQty             = mywindow.findChild("_minQty");
  var _filterHead         = mywindow.findChild("_filterHead");

  _exceptions["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu);

  _item.hide();

  _exceptions.addColumn("Site", -1, 1, true, "site");
  _exceptions.addColumn("Item #", -1, 1, true, "itemno");
  _exceptions.addColumn("Description", -1, 1, true, "descrip");
  _exceptions.addColumn("Inv. UOM", -1, 1, true, "uom");
  _exceptions.addColumn("Demand Order", -1, 1, true, "mrpexcp_demand_type");
  _exceptions.addColumn("Demand Qty", -1, 1, true, "mrpexcp_demand_qty");
  _exceptions.addColumn("Demand Date", -1, 1, true, "mrpexcp_demand_date");
  _exceptions.addColumn("Supply Order", -1, 1, true, "mrpexcp_supply_type");
  _exceptions.addColumn("Supply Qty", -1, 1, true, "mrpexcp_supply_qty");
  _exceptions.addColumn("Supply Date", -1, 1, true, "mrpexcp_supply_date");
  _exceptions.addColumn("Suggested Qty", -1, 1, true, "mrpexcp_supply_suggqty");
  _exceptions.addColumn("Suggested Date", -1, 1, true, "mrpexcp_supply_suggdate");
  _exceptions.addColumn("Exception Message", -1, 1, true, "excp_msg");

  var checkPrivSql = "SELECT checkprivilege('MaintainPlannedSchedules') AS res;";
  var privData = toolbox.executeQuery(checkPrivSql, -1);
  if (privData.first())
  {
    mywindow.setNewVisible(true);
    mywindow.newAction().triggered.connect(sCreate);
  }
}
catch (e)
{
  QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("dspMRPException.js exception: ") + e);
}

function sQuery()
{
  try
  {
    var checkDateSql = "SELECT"
                     + " CASE WHEN (MAX(mrpexcp_created)<CURRENT_DATE)"
                     + " OR (COUNT(mrpexcp_created)=0) THEN 1"
                     + " ELSE 0"
                     + " END AS res"
                     + " FROM xtmfg.mrpexcp;";
	var data = toolbox.executeQuery(checkDateSql, -1);
    if(data.first())
    {
      if(data.value("res") == 1)
      {
        var msg = qsTr("Exceptions out of date"
                     + " or no exceptions are found."
                     + " Do you want to refresh exceptions?");
        if(QMessageBox.question(mywindow, qsTr("Exceptions Expired"), msg,
                                QMessageBox.Yes | QMessageBox.No,
                                QMessageBox.No) == QMessageBox.Yes)
        {
          var checkPrivSql = "SELECT checkprivilege('MaintainPlannedSchedules') AS res;";
          var privData = toolbox.executeQuery(checkPrivSql, -1);
          if(privData.first())
            if(privData.value("res") == true)
              sCreate();
            else
              QMessageBox.critical(mywindow, "No Privilege",
                         qsTr("You do not have privilege to refresh exceptions. "
                             +"Contact your Administrator to get privilege."));
        }
      }
    }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                         qsTr("sQuery() exception: ") + e);
  }
}

function sCreate()
{
  try
  {
    var params = new Object;
    if (!(setParams(params)))
      return;
    var newdlg = toolbox.openWindow("runMRPException", mywindow, Qt.WindowModal, Qt.Dialog);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                         qsTr("sCreate() exception: ") + e);
  }
}

function setParams(params)
{
  try
  {
    if (_byPlannerCode.checked)
      ParameterGroup.appendValue(_plannerCode, params);

    if (_byItem.checked)
      if (_item.isValid())
        params.item_id = _item.id();
      else
      {
        QMessageBox.warning(mywindow, qsTr("Enter Item Number"),
                            qsTr("<p>You must enter a valid Item Number before "
                               + "searching for Exceptions."));
        _item.setFocus();
        return false;
      }

    if (_warehouse.isSelected() && _warehouse.id() != -1)
      params.warehous_id = _warehouse.id();

    if (_scheduleExceptions.checked)
      params.minDays = _minDays.value;

    if (_cancelExceptions.checked)
      params.minQty = _minQty.value;

    if (_byPlannerCode.checked)
      params.byPlannerCode = true;

    if (_byItem.checked)
      params.byItem = true;

    return true;
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                         qsTr("setParams() exception: ") + e);
  }
}

function populateMenu(pMenu, pItem, pCol)
{
  try
  {
    if (pMenu == null)
      pMenu = _exceptions.findChild("_menu");

    var params = new Object();
    params.mrpexcp_demand_type = pItem.rawValue("mrpexcp_demand_type");
    params.mrpexcp_supply_type = pItem.rawValue("mrpexcp_supply_type");

    var checktype = " SELECT substr( <? value('mrpexcp_demand_type') ?>, 1, 1) AS demand_type, "
                  + "        substr( <? value('mrpexcp_supply_type') ?>, 1, 1) AS supply_type;";
    var datatype = toolbox.executeQuery(checktype, params);
    if (datatype.first())
    {
      var tmpact = pMenu.addAction(qsTr("Running Availability..."));
      tmpact.enabled = (privileges.check("ViewInventoryAvailability"));
      tmpact.triggered.connect(sRunningAvailability);

      var tmpact = pMenu.addAction(qsTr("Edit Itemsite..."));
      tmpact.enabled = (privileges.check("MaintainItemSites"));
      tmpact.triggered.connect(sEditItemsite);

      // Add demand menu
      if (datatype.value("demand_type") == "W")
      {
        var tmpact = pMenu.addAction(qsTr("View Demand Work Order..."));
        tmpact.enabled = (privileges.check("ViewWoMaterials")
                       || privileges.check("MaintainWoMaterials"));
        tmpact.triggered.connect(viewDemandWorkOrder);

        var tmpact = pMenu.addAction(qsTr("Edit Demand Work Order..."));
        tmpact.enabled = (privileges.check("MaintainWoMaterials"));
        tmpact.triggered.connect(editDemandWorkOrder);
      }
      else if (datatype.value("demand_type") == "T")
      {
        var tmpact = pMenu.addAction(qsTr("View Demand Transfer Order..."));
        tmpact.enabled = (privileges.check("ViewTransferOrders")
                       || privileges.check("MaintainTransferOrders"));
        tmpact.triggered.connect(viewDemandTransferOrder);

        var tmpact = pMenu.addAction(qsTr("Edit Demand Transfer Order..."));
        tmpact.enabled = (privileges.check("MaintainTransferOrders"));
        tmpact.triggered.connect(editDemandTransferOrder);
      }
      else if (datatype.value("demand_type") == "S")
      {
        var tmpact = pMenu.addAction(qsTr("View Demand Sales Order..."));
        tmpact.enabled = (privileges.check("ViewSalesOrders")
                       || privileges.check("MaintainSalesOrders"));
        tmpact.triggered.connect(viewDemandSalesOrder);

        var tmpact = pMenu.addAction(qsTr("Edit Demand Sales Order..."));
        tmpact.enabled = (privileges.check("MaintainSalesOrders"));
        tmpact.triggered.connect(editDemandSalesOrder);
      }

      // Add supply menu
      if (datatype.value("supply_type") == "W")
      {
        var tmpact = pMenu.addAction(qsTr("View Supply Work Order..."));
        tmpact.enabled = (privileges.check("ViewWorkOrders")
                       || privileges.check("MaintainWorkOrders"));
        tmpact.triggered.connect(viewSupplyWorkOrder);

        var tmpact = pMenu.addAction(qsTr("Edit Supply Work Order..."));
        tmpact.enabled = (privileges.check("MaintainWorkOrders"));
        tmpact.triggered.connect(editSupplyWorkOrder);
      }
      else if (datatype.value("supply_type") == "T")
      {
        var tmpact = pMenu.addAction(qsTr("View Supply Transfer Order..."));
        tmpact.enabled = (privileges.check("ViewTransferOrders")
                       || privileges.check("MaintainTransferOrders"));
        tmpact.triggered.connect(viewSupplyTransferOrder);

        var tmpact = pMenu.addAction(qsTr("Edit Supply Transfer Order..."));
        tmpact.enabled = (privileges.check("MaintainTransferOrders"));
        tmpact.triggered.connect(editSupplyTransferOrder);
      }
      else if(datatype.value("supply_type") == "P")
      {
        var tmpact = pMenu.addAction(qsTr("View Supply Purchase Order..."));
        tmpact.enabled = (privileges.check("ViewPurchaseOrders")
                       || privileges.check("MaintainPurchaseOrders"));
        tmpact.triggered.connect(viewSupplyPurchaseOrder);

        var tmpact = pMenu.addAction(qsTr("Edit Supply Purchase Order..."));
        tmpact.enabled = (privileges.check("MaintainPurchaseOrders"));
        tmpact.triggered.connect(editSupplyPurchaseOrder);
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("populateMenu(pMenu, pItem, pCol) exception: ") + e);
  }
}

function sRunningAvailability()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT mrpexcp_itemsite_id "
            + "FROM xtmfg.mrpexcp "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.itemsite_id = data.value("mrpexcp_itemsite_id");
    params.run = true;

    var newdlg = toolbox.openWindow("dspRunningAvailability", mywindow, 0,
                                    Qt.NonModal, Qt.Window);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("dspRunningAvailability exception: ") + e);
  }
}

function sEditItemsite()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT mrpexcp_itemsite_id "
            + "FROM xtmfg.mrpexcp "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.itemsite_id = data.value("mrpexcp_itemsite_id");
    params.mode = "edit";

    var newdlg = toolbox.openWindow("itemSite", mywindow, 0,
                                    Qt.WindowModal, Qt.Dialog);
    newdlg.set(params);
    newdlg.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("itemSite exception: ") + e);
  }
}

function viewDemandWorkOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT womatl_wo_id "
            + "FROM xtmfg.mrpexcp JOIN womatl "
            + "     ON (womatl_id = mrpexcp_demand_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.wo_id = data.value("womatl_wo_id");
    params.mode = "view";

    var newdlg = toolbox.openWindow("workOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("viewDemandWorkOrder exception: ") + e);
  }
}

function editDemandWorkOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT womatl_wo_id "
            + "FROM xtmfg.mrpexcp JOIN womatl "
            + "     ON (womatl_id = mrpexcp_demand_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.wo_id = data.value("womatl_wo_id");
    params.mode = "edit";

    var newdlg = toolbox.openWindow("workOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("editDemandWorkOrder exception: ") + e);
  }
}

function viewDemandTransferOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT toitem_tohead_id "
            + "FROM xtmfg.mrpexcp JOIN toitem "
            + "     ON (toitem_id = mrpexcp_demand_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.tohead_id = data.value("toitem_tohead_id");
    params.mode = "view";

    var newdlg = toolbox.openWindow("transferOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("viewDemandTransferOrder exception: ") + e);
  }
}

function editDemandTransferOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT toitem_tohead_id "
            + "FROM xtmfg.mrpexcp JOIN toitem "
            + "     ON (toitem_id = mrpexcp_demand_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.tohead_id = data.value("toitem_tohead_id");
    params.mode = "edit";

    var newdlg = toolbox.openWindow("transferOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("editDemandTransferOrder exception: ") + e);
  }
}

function viewDemandSalesOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT coitem_cohead_id "
            + "FROM xtmfg.mrpexcp JOIN coitem "
            + "     ON (coitem_id = mrpexcp_demand_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.sohead_id = data.value("coitem_cohead_id");
    params.mode = "view";

    var newdlg = toolbox.openWindow("salesOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("viewDemandSalesOrder exception: ") + e);
  }
}

function editDemandSalesOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT coitem_cohead_id "
            + "FROM xtmfg.mrpexcp JOIN coitem "
            + "     ON (coitem_id = mrpexcp_demand_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.sohead_id = data.value("coitem_cohead_id");
    params.mode = "edit";

    var newdlg = toolbox.openWindow("salesOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("editDemandSalesOrder exception: ") + e);
  }
}

function viewSupplyWorkOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT mrpexcp_supply_id AS wo_id "
            + "FROM xtmfg.mrpexcp "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.wo_id = data.value("wo_id");
    params.mode = "view";

    var newdlg = toolbox.openWindow("workOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("viewSupplyWorkOrder exception: ") + e);
  }
}

function editSupplyWorkOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT mrpexcp_supply_id AS wo_id "
            + "FROM xtmfg.mrpexcp "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.wo_id = data.value("wo_id");
    params.mode = "edit";

    var newdlg = toolbox.openWindow("workOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("editSupplyWorkOrder exception: ") + e);

  }
}

function viewSupplyTransferOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT toitem_tohead_id "
            + "FROM xtmfg.mrpexcp JOIN toitem "
            + "     ON (toitem_id = mrpexcp_supply_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.tohead_id = data.value("toitem_tohead_id");
    params.mode = "view";

    var newdlg = toolbox.openWindow("transferOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("viewSupplyTransferOrder exception: ") + e);

  }
}

function editSupplyTransferOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT toitem_tohead_id "
            + "FROM xtmfg.mrpexcp JOIN toitem "
            + "     ON (toitem_id = mrpexcp_supply_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.tohead_id = data.value("toitem_tohead_id");
    params.mode = "edit";

    var newdlg = toolbox.openWindow("transferOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("editSupplyTransferOrder exception: ") + e);
  }
}

function viewSupplyPurchaseOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT poitem_pohead_id " 
            + "FROM xtmfg.mrpexcp JOIN poitem "
            + "     ON (poitem_id = mrpexcp_supply_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.pohead_id =data.value("poitem_pohead_id");
    params.mode = "view";

    var newdlg = toolbox.openWindow("purchaseOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("viewSupplyPurchaseOrder exception: ") + e);
  }
}

function editSupplyPurchaseOrder()
{
  try
  {
    var params = new Object();
    params.mrpexcp_id = _exceptions.id();

    var qry = "SELECT poitem_pohead_id " 
            + "FROM xtmfg.mrpexcp JOIN poitem "
            + "     ON (poitem_id = mrpexcp_supply_id) "
            + "WHERE (mrpexcp_id = <? value('mrpexcp_id') ?>)";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
      params.pohead_id = data.value("poitem_pohead_id");
    params.mode = "edit";

    var newdlg = toolbox.openWindow("purchaseOrder", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspMRPException",
                       qsTr("editSupplyPurchaseOrder exception: ") + e);
  }
}


mywindow.fillListBefore.connect(sQuery);

