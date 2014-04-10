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

var widgets = toolbox.loadUi("dspWoBufferStatusByParameterList", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Work Order Buffer Status"));
mywindow.setListLabel(qsTr("Work Orders"));
mywindow.setReportName("WOBufferStatusByParameterList");
mywindow.setMetaSQLOptions("wooperbufferstatus", "parameterlist");
mywindow.setAutoUpdateEnabled(true);
mywindow.setUseAltId(true);

var _parameter  = mywindow.findChild("_parameter");
var _showOnlyRI = mywindow.findChild("_showOnlyRI");
var _showOnlyTopLevel = mywindow.findChild("_showOnlyTopLevel");
var _warehouse  = mywindow.findChild("_warehouse");
var _wo         = mywindow.list();

_wo.addColumn(qsTr("parentType"),    0, Qt.AlignCenter, true, "wo_ordtype");
_wo.addColumn(qsTr("W/O #"),        -1, Qt.AlignLeft,   true, "wonumber");
_wo.addColumn(qsTr("Status"),       -1, Qt.AlignCenter, true, "wo_status");
_wo.addColumn(qsTr("Pri."),         -1, Qt.AlignCenter, true, "wo_priority");
_wo.addColumn(qsTr("Site"),         -1, Qt.AlignCenter, true, "warehous_code");
_wo.addColumn(qsTr("Item Number"),  -1, Qt.AlignLeft,   true, "item_number");
_wo.addColumn(qsTr("Description"),  -1, Qt.AlignLeft,   true, "description");
_wo.addColumn(qsTr("UOM"),          -1, Qt.AlignCenter, true, "uom_name");
_wo.addColumn(qsTr("Ordered"),      -1, Qt.AlignRight,  true, "wo_qtyord");
_wo.addColumn(qsTr("Received"),     -1, Qt.AlignRight,  true, "wo_qtyrcv");
_wo.addColumn(qsTr("Buffer Type"),  -1, Qt.AlignCenter, true, "bufrststype");
_wo.addColumn(qsTr("Buffer Status"),-1, Qt.AlignRight,  true, "bufrsts_status");

function set(pParams)
{
  if ("classcode" in pParams)
  {
    _parameter.type = ParameterGroup.ClassCode;
    mywindow.windowTitle = qsTr("W/O Buffer Status by ClassCode");
  }

  if ("plancode" in pParams)
  {
    _parameter.type = ParameterGroup.PlannerCode;
    mywindow.windowTitle = qsTr("W/O Buffer Status by Planner Code");
  }

  if ("plancode_id" in pParams)
    _parameter.setId(pParams.plancode_id);

  if ("itemgrp" in pParams)
  {
    _parameter.type = ParameterGroup.ItemGroup;
    mywindow.windowTitle = qsTr("W/O Buffer Status by Item Group");
  }

  if ("warehous_id" in pParams)
    _warehouse.setId(pParams.warehous_id);
    
  if ("run" in pParams)
  {
    mywindow.sFillList();
    return mainwindow.NoError_Run;
  }

  return mainwindow.NoError;
}


function setParams(params)
{
  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  ParameterGroup.appendValue(_parameter, params);

  if (_parameter.isAll())
  {
    if (_parameter.type == ParameterGroup.ItemGroup)
      params.itemgrp = true;
    else if(_parameter.type == ParameterGroup.PlannerCode)
      params.plancode = true;
    else if (_parameter.type == ParameterGroup.ClassCode)
      params.classcode = true;
  }

  if (_showOnlyRI.checked)
    params.showOnlyRI = true;

  if (_showOnlyTopLevel.checked)
    params.showOnlyTopLevel = true;

  params.stock = qsTr("Stock");
  params.time = qsTr("Time");
  params.report_name = "WOBufferStatusByParameterList";

  return true;
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("workOrder", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("workOrder", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sPostProduction()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("postProduction", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sCorrectProductionPosting()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("correctProductionPosting", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sPostOperations()
{
  try {
    var params = new Object;
    params.wo_id = _wo.id();

    var wnd = toolbox.openWindow("postOperations", 0, Qt.NonModal, Qt.Dialog);
    var result = toolbox.lastWindow().set(params);
    if(result != mainwindow.UndefinedError)
      wnd.exec();
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

function sCorrectOperationsPosting()
{
  try {
    var params = new Object;
    params.wo_id = _wo.id();

    var wnd = toolbox.openWindow("correctOperationsPosting", 0, Qt.NonModal, Qt.Dialog);
    var result = toolbox.lastWindow().set(params);
    if(result != mainwindow.UndefinedError)
      wnd.exec();
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

function sReleaseWO()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var qry = toolbox.executeQuery('SELECT releaseWo(<? value("wo_id") ?>, FALSE)'
                               + ' AS result;',
                                 params);
  if (qry.first())
  {
    var result = qry.value("result");
    if (result < 0)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         storedProcErrorLookup("releaseWo", result));
      return;
    }
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }

  mainwindow.sWorkOrdersUpdated(_wo.id(), true);
}

function sRecallWO()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var qry = toolbox.executeQuery('SELECT recallWo(<? value("wo_id") ?>, FALSE)'
                               + ' AS result;',
                                 params);
  if (qry.first())
  {
    var result = qry.value("result");
    if (result < 0)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         storedProcErrorLookup("recallWo", result));
      return;
    }
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }

  mainwindow.sWorkOrdersUpdated(_wo.id(), true);
}

function sExplodeWO()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("explodeWo", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sImplodeWO()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("implodeWo", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sDeleteWO()
{
  var params = new Object;
  params.wo_id = _wo.id();
  var qry = toolbox.executeQuery("SELECT wo_ordtype, wo_ordid "
                               + "FROM wo "
                               + 'WHERE (wo_id=<? value("wo_id") ?>);',
                               params);
  if (qry.first())
  {
    if (qry.value("wo_ordtype") == "W")
    {
      if (QMessageBox.question(mywindow, qsTr("Delete Work Order"),
                             qsTr("<p>The Work Order that you selected to "
                              + "delete is a child of another Work Order. If "
                              + "you delete the selected Work Order then the "
                              + "Work Order Materials Requirements for the "
                              + "Component Item will remain but the Work Order "
                              + "to relieve that demand will not."
                              + "<p>Are you sure that you want to delete the "
                              + "selected Work Order?"),
                              QMessageBox.Yes | QMessageBox.No,
                              QMessageBox.No) == QMessageBox.No)
        return;
    }
    else if (qry.value("wo_ordtype") == "S")
    {
      if (QMessageBox.question(mywindow, qsTr("Delete Work Order"),
                             qsTr("<p>The Work Order that you selected to "
                                + "delete was created to satisfy a Sales Order "
                                + "demand.  If you delete the selected Work "
                                + "Order then the Sales Order demand will "
                                + "remain but the Work Order to relieve that "
                                + "demand will not."
                                + "<p>Are you sure that you want to delete the "
                                + "selected Work Order?"),
                              QMessageBox.Yes | QMessageBox.No,
                              QMessageBox.No) == QMessageBox.No)
        return;
    }
    else if (QMessageBox.question(mywindow, qsTr("Delete Work Order"),
                                qsTr("<p>Are you sure that you want to delete "
                                   + "the selected Work Order?"),
                                QMessageBox.Yes | QMessageBox.No,
                                QMessageBox.No) == QMessageBox.No)
      return;

    qry = toolbox.executeQuery('SELECT deleteWo(<? value("wo_id") ?>, TRUE) '
                             + '    AS result;',
                               params);
    if (qry.first())
    {
      var result = qry.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                           storedProcErrorLookup("recallWo", result));
        return;
      }
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         qry.lastError().text);
      return;
    }
    mainwindow.sWorkOrdersUpdated(params.wo_id, true);
  }

  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       q.lastError().text);
    return;
  }
}

function sCloseWO()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("closeWo", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sPrintTraveler()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("printWoTraveler", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sViewWomatl()
{
  var params = new Object;
  params.wo_id = _wo.id();
  params.run = true;

  var newdlg = toolbox.openWindow("dspWoMaterialsByWorkOrder", 0,
                                 Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sViewWooper()
{
  var params = new Object;
  params.wo_id = _wo.id();
  params.run = true;

  var newdlg = toolbox.newDisplay("dspWoOperationsByWorkOrder", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sInventoryAvailabilityByWorkOrder()
{
  var params = new Object;
  params.wo_id = _wo.id();
  params.run = true;

  var newdlg = toolbox.openWindow("dspInventoryAvailabilityByWorkOrder", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sReprioritizeWo()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("reprioritizeWo", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sRescheduleWO()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("rescheduleWo", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sChangeWOQty()
{
  var params = new Object;
  params.wo_id = _wo.id();

  var newdlg = toolbox.openWindow("changeWoQty", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sViewParentSO()
{
  var params = new Object;
  params.soitem_id = _wo.altId();

  var newdlg = toolbox.openWindow("salesOrderInformation", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sViewParentWO()
{
  var params = new Object;
  params.mode = "view";
  params.wo_id = _wo.altId();

  var newdlg = toolbox.openWindow("workOrder", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sPopulateMenu(pMenu, selected)
{
  var status = selected.text(2);
  var menuItem;

  menuItem = pMenu.addAction(qsTr("View W/O"), true);
  menuItem.triggered.connect(sView);

  menuItem = pMenu.addAction(qsTr("Edit W/O"));
  menuItem.enabled = privileges.check("MaintainWorkOrders");
  menuItem.triggered.connect(sEdit);

  pMenu.addSeparator();

  if (status == "E")
  {
    menuItem = pMenu.addAction(qsTr("Release W/O"));
    menuItem.enabled = privileges.check("ReleaseWorkOrders");
    menuItem.triggered.connect(sReleaseWO);
  }
  else if (status == "R")
  {
    menuItem = pMenu.addAction(qsTr("Recall W/O"));
    menuItem.enabled = privileges.check("RecallWorkOrders");
    menuItem.triggered.connect(sRecallWO);
  }

  if ((status == "E") || (status == "R") || (status == "I"))
  {
    menuItem = pMenu.addAction(qsTr("Post Production..."));
    menuItem.enabled = privileges.check("PostProduction");
    menuItem.triggered.connect(sPostProduction);

    if (status != "E")
    {
      menuItem = pMenu.addAction(qsTr("Correct Production Posting..."));
      menuItem.enabled = privileges.check("PostProduction");
      menuItem.triggered.connect(sCorrectProductionPosting);
    }

    menuItem = pMenu.addAction(qsTr("Post Operations..."));
    menuItem.enabled = privileges.check("PostWoOperations");
    menuItem.triggered.connect(sPostOperations);

    if (status != "E")
    {
      menuItem = pMenu.addAction(qsTr("Correct Operations Posting..."));
      menuItem.enabled = privileges.check("PostWoOperations");
      menuItem.triggered.connect(sCorrectOperationsPosting);
    }

    pMenu.addSeparator();
  }

  if (status == "O")
  {
    menuItem = pMenu.addAction(qsTr("Explode W/O..."));
    menuItem.enabled = privileges.check("ExplodeWorkOrders");
    menuItem.triggered.connect(sExplodeWO);
  }
  else if (status == "E")
  {
    menuItem = pMenu.addAction(qsTr("Implode W/O..."));
    menuItem.enabled = privileges.check("ImplodeWorkOrders");
    menuItem.triggered.connect(sImplodeWO);
  }

  if ((status == "O") || (status == "E"))
  {
    menuItem = pMenu.addAction(qsTr("Delete W/O..."));
    menuItem.enabled = privileges.check("DeleteWorkOrders");
    menuItem.triggered.connect(sDeleteWO);
  }
  else
  {
    menuItem = pMenu.addAction(qsTr("Close W/O..."));
    menuItem.enabled = privileges.check("CloseWorkOrders");
    menuItem.triggered.connect(sCloseWO);
  }

  pMenu.addSeparator();

  if ((status == "E") || (status == "R") || (status == "I"))
  {
    menuItem = pMenu.addAction(qsTr("View W/O Material Requirements..."));
    menuItem.enabled = privileges.check("ViewWoMaterials");
    menuItem.triggered.connect(sViewWomatl);

    menuItem = pMenu.addAction(qsTr("View W/O Operations..."));
    menuItem.enabled = privileges.check("ViewWoOperations");
    menuItem.triggered.connect(sViewWooper);

    menuItem = pMenu.addAction(qsTr("Inventory Availability by Work Order..."));
    menuItem.enabled = privileges.check("ViewInventoryAvailability");
    menuItem.triggered.connect(sInventoryAvailabilityByWorkOrder);

    pMenu.addSeparator();

    menuItem = pMenu.addAction(qsTr("Print Traveler..."));
    menuItem.enabled = privileges.check("PrintWorkOrderPaperWork");
    menuItem.triggered.connect(sPrintTraveler);
  }

  if ((status == "O") || (status == "E"))
  {
    pMenu.addSeparator();

    menuItem = pMenu.addAction(qsTr("Reprioritize W/O..."));
    menuItem.enabled = privileges.check("ReprioritizeWorkOrders");
    menuItem.triggered.connect(sReprioritizeWo);

    menuItem = pMenu.addAction(qsTr("Reschedule W/O..."));
    menuItem.enabled = privileges.check("RescheduleWorkOrders");
    menuItem.triggered.connect(sRescheduleWO);

    menuItem = pMenu.addAction(qsTr("Change W/O Quantity..."));
    menuItem.enabled = privileges.check("ChangeWorkOrderQty");
    menuItem.triggered.connect(sChangeWOQty);
  }

  if (_wo.altId() != -1)
  {
    if (selected.text(0) == "S")
    {
      pMenu.addSeparator();
      menuItem = pMenu.addAction(qsTr("View Parent Sales Order Information..."));
      menuItem.triggered.connect(sViewParentSO);
    }
    else if (selected.text(0) == "W")
    {
      pMenu.addSeparator();
      menuItem = pMenu.addAction(qsTr("View Parent Work Order Information..."));
      menuItem.triggered.connect(sViewParentWO);
    }
  }
}

_wo["populateMenu(QMenu*,XTreeWidgetItem*)"].connect(sPopulateMenu);
mainwindow["workOrdersUpdated(int, bool)"].connect(mywindow, "sFillList");

include("ParameterGroupUtils");
