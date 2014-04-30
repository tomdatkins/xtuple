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

var widgets = toolbox.loadUi("dspInventoryBufferStatusByParameterList", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Inventory Buffer Status By Parameter List"));
mywindow.setListLabel(qsTr("Availability"));
mywindow.setReportName("InventoryBufferStatusByParameterList");
mywindow.setMetaSQLOptions("inventorybufferstatus", "detail");
mywindow.setUseAltId(true);

var _parameter	        = widgets.findChild("_parameter");
var _warehouse	        = widgets.findChild("_warehouse");
var _All		= widgets.findChild("_All");
var _EmergencyZone	= widgets.findChild("_EmergencyZone");
var _GreaterThanZero	= widgets.findChild("_GreaterThanZero");

mywindow.list().addColumn(qsTr("Item Number"), -1, Qt.AlignLeft,  true, "item_number");
mywindow.list().addColumn(qsTr("Description"), -1, Qt.AlignLeft,  true, "itemdescrip");
mywindow.list().addColumn(qsTr("Site"),        -1, Qt.AlignCenter,true, "warehous_code");
mywindow.list().addColumn(qsTr("LT"),          -1, Qt.AlignCenter,true, "itemsite_leadtime");
mywindow.list().addColumn(qsTr("Type"),        -1, Qt.AlignCenter,true, "bufrststype");
mywindow.list().addColumn(qsTr("Status"),      -1, Qt.AlignRight, true, "bufrsts_status");
mywindow.list().addColumn(qsTr("QOH"),         -1, Qt.AlignRight, true, "qoh");
mywindow.list().addColumn(qsTr("Allocated"),   -1, Qt.AlignRight, true, "allocated");
mywindow.list().addColumn(qsTr("Unallocated"), -1, Qt.AlignRight, true, "unallocated");
mywindow.list().addColumn(qsTr("On Order"),    -1, Qt.AlignRight, true, "ordered");
mywindow.list().addColumn(qsTr("Reorder Lvl."),-1, Qt.AlignRight, true, "reorderlevel");
mywindow.list().addColumn(qsTr("OUT Level."),  -1, Qt.AlignRight, true, "outlevel");
mywindow.list().addColumn(qsTr("Available"),   -1, Qt.AlignRight, true, "available");

function set(pParams)
{
  if ("classcode_id" in pParams)
  {
    _parameter.type = ParameterGroup.ClassCode;
    _parameter.setId(pParams.classcode_id);
  }

  if ("classcode_pattern" in pParams)
  {
    _parameter.type = ParameterGroup.ClassCode;
    _parameter.pattern = pParams.classcode_pattern;
  }

  if ("classcode" in pParams)
    _parameter.type = ParameterGroup.ClassCode;

  if ("plancode_id" in pParams)
  {
    _parameter.type = ParameterGroup.PlannerCode;
    _parameter.setId(pParams.plancode_id);
  }

  if ("plancode_pattern" in pParams)
  {
    _parameter.type = ParameterGroup.PlannerCode;
    _parameter.pattern = pParams.plancode_pattern;
  }

  if ("plancode" in pParams)
    _parameter.type = ParameterGroup.PlannerCode;

  if ("itemgrp_id" in pParams)
  {
    _parameter.type = ParameterGroup.ItemGroup;
    _parameter.setId(pParams.itemgrp_id);
  }

  if ("itemgrp_pattern" in pParams)
  {
    _parameter.type = ParameterGroup.ItemGroup;
    _parameter.pattern = pParams.itemgrp_pattern;
  }

  if ("itemgrp" in pParams)
    _parameter.type = ParameterGroup.ItemGroup;

  switch (_parameter.type)
  {
    case ParameterGroup.ClassCode:
      mywindow.setWindowTitle(qsTr("Inventory Buffer Status by Class Code"));
      break;

    case ParameterGroup.PlannerCode:
      mywindow.setWindowTitle(qsTr("Inventory Buffer Status by Planner Code"));
      break;

    case ParameterGroup.ItemGroup:
      mywindow.setWindowTitle(qsTr("Inventory Buffer Status by Item Group"));
      break;

    default:
      break;
  }

  if ("run" in pParams)
  {
    mywindow.sFillList();
    return mainwindow.NoError_Run;
  }

  return mainwindow.NoError;
}

function setParams(params)
{
  if (! ParameterGroup.appendValue(_parameter, params))
  {
    print("unknown parameter group type");
    return false;
  }

  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  params.stock = qsTr("Stock");
  params.time  = qsTr("Time");

  if (_GreaterThanZero.checked)
    params.GreaterThanZero = true;
  else if (_EmergencyZone.checked)
    params.EmergencyZone = true;
  else if (_All.checked)
    params.All = true;

  params.report_name = "InventoryBufferStatusByParameterList";

  return true;
}

function sPopulateMenu(menu, selected)
{
  var menuItem;

  menuItem = menu.addAction(qsTr("View Inventory History..."));
  menuItem.enabled = privileges.check("ViewInventoryHistory");
  menuItem.triggered.connect(sViewHistory);

  menu.addSeparator();

  menuItem = menu.addAction(qsTr("View Allocations..."));
  menuItem.enabled = (selected.rawValue("bufrsts_status") != 0.0);
  menuItem.triggered.connect(sViewAllocations);

  menuItem = menu.addAction(qsTr("View Orders..."));
  menuItem.enabled = (selected.rawValue("allocated") != 0.0);
  menuItem.triggered.connect(sViewOrders);

  menuItem = menu.addAction(qsTr("Running Availability..."));
  menuItem.enabled = true;
  menuItem.triggered.connect(sRunningAvailability);

  menu.addSeparator();
  if (selected.altId() == 1)
  {
    menuItem = menu.addAction(qsTr("Create P/R..."));
    menuItem.enabled = privileges.check("MaintainPurchaseRequests");
    menuItem.triggered.connect(sCreatePR);

    menuItem = menu.addAction(qsTr("Create P/O..."));
    menuItem.enabled = privileges.check("MaintainPurchaseOrders");
    menuItem.triggered.connect(sCreatePO);

    menu.addSeparator();
  }
  else if (selected.altId() == 2)
  {
    menuItem = menu.addAction(qsTr("Create W/O..."));
    menuItem.enabled = privileges.check("MaintainWorkOrders");
    menuItem.triggered.connect(sCreateWO);

    menuItem = menu.addAction(qsTr("Post Misc. Production..."));
    menuItem.enabled = privileges.check("PostMiscProduction");
    menuItem.triggered.connect(sPostMiscProduction);

    menu.addSeparator();
  }
    
  menuItem = menu.addAction(qsTr("View Substitute Availability..."));
  menuItem.enabled = true;
  menuItem.triggered.connect(sViewSubstituteAvailability);

  menu.addSeparator();

  menuItem = menu.addAction(qsTr("Issue Count Tag..."));
  menuItem.enabled = privileges.check("IssueCountTags");
  menuItem.triggered.connect(sIssueCountTag);

  menuItem = menu.addAction(qsTr("Enter Misc. Inventory Count..."));
  menuItem.enabled = privileges.check("EnterMiscCounts");
  menuItem.triggered.connect(sEnterMiscCount);
}

function sViewHistory()
{
  var params = new Object;
  params.itemsite_id = mywindow.list().id();
  params.run = true;

  var newdlg = toolbox.openWindow("dspInventoryHistory", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sViewAllocations()
{
  var params = new Object;
  params.itemsite_id = mywindow.list().id();
  params.byLeadTime  = true;
  params.run         = true;

  var newdlg = toolbox.openWindow("dspAllocations", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sViewOrders()
{
  var params = new Object;
  params.itemsite_id = mywindow.list().id();
  params.byLeadTime  = true;
  params.run         = true;

  var newdlg = toolbox.openWindow("dspOrders", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sRunningAvailability()
{
  var params = new Object;
  params.itemsite_id = mywindow.list().id();
  params.run         = true;

  var newdlg = toolbox.openWindow("dspRunningAvailability", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sCreateWO()
{
  var params = new Object;
  params.mode        = "new";
  params.itemsite_id = mywindow.list().id();

  var newdlg = toolbox.openWindow("workOrder", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sPostMiscProduction()
{
  var params = new Object;
  params.itemsite_id = mywindow.list().id();

  var newdlg = toolbox.openWindow("postMiscProduction", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sCreatePR()
{
  var params = new Object;
  params.mode        = "new";
  params.itemsite_id = mywindow.list().id();

  var newdlg = toolbox.openWindow("purchaseRequest", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sCreatePO()
{
  var params = new Object;
  params.mode        = "new";
  params.itemsite_id = mywindow.list().id();

  var newdlg = toolbox.openWindow("purchaseOrder", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sViewSubstituteAvailability()
{
  var params = new Object;
  params.itemsite_id = mywindow.list().id();
  params.run         = true;
  params.byLeadTime  = true;

  var newdlg = toolbox.openWindow("dspSubstituteAvailabilityByItem", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sIssueCountTag()
{
  var params = new Object;
  params.itemsite_id = mywindow.list().id();
  
  var newdlg = toolbox.openWindow("createCountTagsByItem", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sEnterMiscCount()
{
  var params = new Object;
  params.itemsite_id = mywindow.list().id();
  
  var newdlg = toolbox.openWindow("enterMiscCount", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

mywindow.list()["populateMenu(QMenu*,XTreeWidgetItem*)"].connect(sPopulateMenu);
mainwindow["workOrdersUpdated(int, bool)"].connect(mywindow, "sFillList");

include("ParameterGroupUtils");
