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

var widgets = toolbox.loadUi("dspTimePhasedProductionByPlannerCode", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Time-Phased Production by Planner Code"));
mywindow.setListLabel(qsTr("Production"));
mywindow.setReportName("TimePhasedProductionByPlannerCode");
//mywindow.setMetaSQLOptions();
var _queryAct = mywindow.queryAction();
toolbox.coreDisconnect(_queryAct, "triggered()", mywindow, "sFillList()");
_queryAct.triggered.connect(sFillList);

var _altCapacityUnits = mywindow.findChild("_altCapacityUnits");
var _capacityUnits    = mywindow.findChild("_capacityUnits");
var _inventoryUnits   = mywindow.findChild("_inventoryUnits");
var _periods          = mywindow.findChild("_periods");
var _plannerCode      = mywindow.findChild("_plannerCode");
var _showInactive     = mywindow.findChild("_showInactive");
var _warehouse        = mywindow.findChild("_warehouse");
var _production       = mywindow.list();

var _column = 0;
var _columnDates = new Array;

/*
QButtonGroup* _unitsGroupInt = new QButtonGroup(this);
_unitsGroupInt.addButton(_inventoryUnits);
_unitsGroupInt.addButton(_capacityUnits);
_unitsGroupInt.addButton(_altCapacityUnits);
*/

_plannerCode.type = ParameterGroup.PlannerCode;

_production.addColumn(qsTr("Planner Code"),-1, Qt.AlignLeft,  true, "plancode_code");
_production.addColumn(qsTr("Site"),        -1, Qt.AlignCenter,true, "warehous_code");
_production.addColumn(qsTr("UOM"),         -1, Qt.AlignLeft,  true, "uom");

function setParams(params)
{
  if (! _periods.isPeriodSelected())
  {
    QMessageBox.critical(mywindow, qsTr("Select a Period"),
                       qsTr("<p>You must select at least one Calendar Period."));
    return false;
  }

  ParameterGroup.appendValue(_plannerCode, params);
  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  var selected = _periods.selectedItems();
  var periodList = new Array;
  for (var i = 0; i < selected.length; i++)
    periodList[i] = selected[i].id();
  params.period_id_list = periodList;

  if (_capacityUnits.checked)
    params.capacityUnits = true;
  else if(_altCapacityUnits.checked)
    params.altCapacityUnits = true;
  else if(_inventoryUnits.checked)
    params.inventoryUnits = true;

  if(_showInactive.checked)
    params.showInactive = true;

  params.report_name = "TimePhasedProductionByPlannerCode";

  return true;
}

function sViewTransactions()
{
  var params = new Object;
  params.plancode_id = _production.id();
  params.warehous_id = _production.altId();
  params.startDate   = _columnDates[_column - 3].startDate;
  params.endDate     = _columnDates[_column - 3].endDate;
  params.transtype   = "R";
  params.run         = true;

  var newdlg = toolbox.openWindow("dspInventoryHistory", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sPopulateMenu(menu, item, pColumn)
{
  _column = pColumn;

  if (_column > 2)
  {
    var menuItem = menu.addAction(qsTr("View Transactions..."));
    menuItem.enabled = privileges.check("ViewInventoryHistory");
    menuItem.triggered.connect(sViewTransactions);
  }
}

function sFillList()
{
  var params = new Object;
  if (! setParams(params))
    return;

  _columnDates = new Array;
  _production.setColumnCount(3);

  if (_inventoryUnits.checked)
  {
    params.uom = "uom_name";
    uomratio  = "1";
  }
  else if (_capacityUnits.checked)
  {
    params.uom = "itemcapuom(item_id)";
    uomratio  = "itemcapinvrat(item_id)";
  }
  else if (_altCapacityUnits.checked)
  {
    params.uom = "itemaltcapuom(item_id)";
    uomratio  = "itemaltcapinvrat(item_id)";
  }

  var columns = 1;
  var selected = _periods.selectedItems();
  params.extracolumns = "";
  for (var i = 0; i < selected.length; i++)
  {
    var cursor = selected[i];
    var bucketname = "bucket" + (columns++);

    params.extracolumns += ", "
              + "SUM(summProd(itemsite_id, " + cursor.id() + ") * " + uomratio
              + ") AS " + bucketname + ","
              + " 'qty' AS " + bucketname + "_xtnumericrole ";

    _production.addColumn(toolbox.formatDate(cursor.startDate()), 80,
                          Qt.AlignRight, true, bucketname);
    var newidx = _columnDates.length;
    _columnDates[newidx] = new Object;
    _columnDates[newidx].startDate = cursor.startDate();
    _columnDates[newidx].endDate   = cursor.endDate();
  }

  var qry = toolbox.executeQuery(
               "SELECT plancode_id, warehous_id, plancode_code, warehous_code, "
             + '       <? literal("uom") ?> AS uom '
             + '       <? literal("extracolumns") ?>'
             + " FROM itemsite"
             + "   JOIN item ON (itemsite_item_id=item_id)"
             + "   JOIN uom ON (item_inv_uom_id=uom_id)"
             + "   JOIN whsinfo ON (itemsite_warehous_id=warehous_id)"
             + "   JOIN plancode ON (itemsite_plancode_id=plancode_id)"
             + " WHERE (TRUE"
             + '<? if not exists("showInactive") ?>'
             + " AND (itemsite_active)"
             + '<? endif ?>'
             + '<? if exists("warehous_id") ?>'
             + '   AND (itemsite_warehous_id=<? value("warehous_id") ?>)'
             + '<? endif ?>'
             + '<? if exists("plancode_id") ?>'
             + '   AND (plancode_id=<? value("plancode_id") ?>)'
             + '<? elseif exists("plancode_pattern") ?>'
             + '   AND (plancode_code ~ <? value("plancode_pattern") ?>) '
             + '<? endif ?>'
             + ") "
             + "GROUP BY plancode_id, warehous_id, plancode_code, warehous_code, uom;",
             params);

  _production.populate(qry, true);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }
}

_production["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);

include("ParameterGroupUtils");
