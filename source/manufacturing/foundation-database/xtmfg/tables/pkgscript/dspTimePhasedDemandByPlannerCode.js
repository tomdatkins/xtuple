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

var widgets = toolbox.loadUi("dspTimePhasedDemandByPlannerCode", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Time Phased Demand by Planner Code"));
mywindow.setListLabel(qsTr("Demand"));
mywindow.setReportName("TimePhasedDemandByPlannerCode");
//mywindow.setMetaSQLOptions();
var _queryAct = mywindow.queryAction();
toolbox.coreDisconnect(_queryAct, "triggered()", mywindow, "sFillList()");
_queryAct.triggered.connect(sFillList);

var _altCapacityUnits = mywindow.findChild("_altCapacityUnits");
var _capacityUnits    = mywindow.findChild("_capacityUnits");
var _inventoryUnits   = mywindow.findChild("_inventoryUnits");
var _periods          = mywindow.findChild("_periods");
var _plannerCode      = mywindow.findChild("_plannerCode");
var _warehouse        = mywindow.findChild("_warehouse");
var _demand           = mywindow.list();

var _column = 0;
var _columnDates = new Array;

/*
QButtonGroup* btngrpDisplayUnits = new QButtonGroup(this);
btngrpDisplayUnits.addButton(_inventoryUnits);
btngrpDisplayUnits.addButton(_capacityUnits);
btngrpDisplayUnits.addButton(_altCapacityUnits);
*/

_plannerCode.type = ParameterGroup.PlannerCode;

_demand.addColumn(qsTr("Planner Code"),-1, Qt.AlignLeft,  true,  "plancode_code");
_demand.addColumn(qsTr("Site"),        -1, Qt.AlignCenter,true,  "warehous_code");
_demand.addColumn(qsTr("UOM"),         -1, Qt.AlignLeft,  true,  "uom");

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

  if(_capacityUnits.checked)
    params.capacityUnits = true;
  else if(_altCapacityUnits.checked)
    params.altCapacityUnits = true;
  else if(_inventoryUnits.checked)
    params.inventoryUnits = true;

  params.report_name = "TimePhasedDemandByPlannerCode";

  return true;
}

function sViewDemand()
{
  var params = new Object;
  params.plancode    = true;
  params.plancode_id = _demand.id();
  params.warehous_id = _demand.altId();
  params.startDate   = _columnDates[_column - 3].startDate;
  params.endDate     = _columnDates[_column - 3].endDate;
  params.run         = true;
  
  var newdlg = toolbox.openWindow("dspWoSchedule", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sPopulateMenu(menu, item, pColumn)
{
  _column = pColumn;

  if (_column > 2)
  {
    var menuItem = menu.addAction(qsTr("View Demand..."));
    menuItem.enabled = (privileges.check("MaintainWorkOrders") &&
                        privileges.check("ViewWorkOrders"));
    menuItem.triggered.connect(sViewDemand);
  }
}

function sFillList()
{
  var params = new Object;
  if (! setParams(params))
    return;

  _columnDates = new Array;
  _demand.setColumnCount(3);

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
    var cursor     = selected[i];
    var bucketname = "bucket" + (columns++);

    params.extracolumns += ", "
            + "SUM(summDemand(itemsite_id, " + cursor.id() + ") * " + uomratio
            + ") AS " + bucketname + ","
            + " 'qty' AS " + bucketname + "_xtnumericrole ";

    _demand.addColumn(toolbox.formatDate(cursor.startDate()), 80,
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
        + " FROM itemsite, item, uom, whsinfo, plancode "
        + "WHERE ((itemsite_active)"
        + "   AND (itemsite_warehous_id=warehous_id)"
        + "   AND (itemsite_item_id=item_id)"
        + "   AND (item_inv_uom_id=uom_id)"
        + "   AND (itemsite_plancode_id=plancode_id)"
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

  _demand.populate(qry, true);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }
}

_demand["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);

include("ParameterGroupUtils");
