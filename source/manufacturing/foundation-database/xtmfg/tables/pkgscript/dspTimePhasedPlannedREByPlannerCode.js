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

var widgets = toolbox.loadUi("dspTimePhasedPlannedREByPlannerCode", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Time-Phased Planned Revenue/Expense by Planner Code"));
mywindow.setListLabel(qsTr("Planned Revenue and Expenses"));
mywindow.setReportName("TimePhasedPlannedRevenueExpensesByPlannerCode");
//mywindow.setMetaSQLOptions();
var _queryAct = mywindow.queryAction();
toolbox.coreDisconnect(_queryAct, "triggered()", mywindow, "sFillList()");
_queryAct.triggered.connect(sFillList);

/*
QButtonGroup* _costsGroupInt = new QButtonGroup(this);
_costsGroupInt.addButton(_useStandardCost);
_costsGroupInt.addButton(_useActualCost);

QButtonGroup* _salesPriceGroupInt = new QButtonGroup(this);
_salesPriceGroupInt.addButton(_useListPrice);
_salesPriceGroupInt.addButton(_useAveragePrice);
*/

var _endEvalDate     = mywindow.findChild("_endEvalDate");
var _periods         = mywindow.findChild("_periods");
var _plannerCode     = mywindow.findChild("_plannerCode");
var _startEvalDate   = mywindow.findChild("_startEvalDate");
var _useActualCost   = mywindow.findChild("_useActualCost");
var _useAveragePrice = mywindow.findChild("_useAveragePrice");
var _useListPrice    = mywindow.findChild("_useListPrice");
var _useStandardCost = mywindow.findChild("_useStandardCost");
var _warehouse       = mywindow.findChild("_warehouse");
var _plannedRE       = mywindow.list();

_plannerCode.type = ParameterGroup.PlannerCode;

_plannedRE.addColumn("", 80, Qt.AlignRight);

function isoDate(inputDate)
{
  return inputDate.getFullYear()
         + '-' + inputDate.getMonth()
         + '-' + inputDate.getDate();
}

function setParams(params)
{
  if (_useAveragePrice.checked &&
      !(_startEvalDate.isValid() && _endEvalDate.isValid()))
  {
    QMessageBox.critical(mywindow, qsTr("Average Price Requires Dates"),
                       qsTr("<p>The Average Price option requires that you "
                          + "give a date range to evaluate the average price."));
    return false;
  }

  if (_periods.selectedItems().length <= 0)
  {
    QMessageBox.critical(mywindow, qsTr("No Periods Selected"),
                       qsTr("<p>You must select at least one Calendar Period."));
    return false;
  }

  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  ParameterGroup.appendValue(_plannerCode, params);

  if (_useStandardCost.checked)
    params.standardCost = true;
  else if (_useActualCost.checked)
    params.actualCost = true;

  if (_useListPrice.checked)
    params.listPrice = true;
  else if (_useAveragePrice.checked)
  {
    params.averagePrice  = true;
    params.startEvalDate = _startEvalDate.date;
    params.endEvalDate   = _endEvalDate.date;
  }

  var selected = _periods.selectedItems();
  var periodList = new Array;
  for (var i = 0; i < selected.length; i++)
    periodList[i] = selected[i].id();
  params.period_id_list = periodList;

  params.report_name = "TimePhasedPlannedRevenueExpensesByPlannerCode";

  return true;
}

function sFillList()
{
  var params = new Object;
  if (! setParams(params))
    return;

  var _columnDates = new Array;
  _plannedRE.clear();
  _plannedRE.setColumnCount(1);

  var selected = _periods.selectedItems();
  var costtype = _useStandardCost.checked ? "'S'" : "'A'";
  var pricetype= _useListPrice.checked    ? "'L'" : "'A'";

  params.extracolumns = "";

  for (var i = 1; i <= selected.length; i++)
  {
    var cursor = selected[i - 1];
    // call different versions of plannedRevenue() depending on pricetype
    params.extracolumns += ", SUM(plannedCost(plancode_id, warehous_id,"
                         + costtype + "," + cursor.id() + ")) AS cost" + i
                         + ", SUM(plannedRevenue(plancode_id,warehous_id,"
                         + pricetype + "," + cursor.id()
                         + (_useAveragePrice.checked
                              ? ", date '" + isoDate(_startEvalDate.date)
                                + "', date '" + isoDate(_endEvalDate.date) + "'"
                              : "")
                         + " )) AS revenue" + i;

    _plannedRE.addColumn(toolbox.formatDate(cursor.startDate()),
                         XTreeWidget.qtyColumn, Qt.AlignRight, true, '', '',
                         toolbox.decimalPlaces("curr"));
    var newidx = _columnDates.length;
    _columnDates[newidx] = new Object;
    _columnDates[newidx].startDate = cursor.startDate();
    _columnDates[newidx].endDate   = cursor.endDate();
  }

  // TRUE is a dummy column so we don't have to worry about the number of commas
  var q = toolbox.executeQuery(
                      'SELECT -1 AS dummy <? literal("extracolumns") ?> '
                      + " FROM plancode, whsinfo "
                      + "WHERE (TRUE"
                      + '<? if exists("warehous_id") ?>'
                      + '   AND (warehous_id=<? value("warehous_id") ?>)'
                      + '<? endif ?>'
                      + '<? if exists("plancode_id") ?>'
                      + '   AND (plancode_id=<? value("plancode_id") ?>)'
                      + '<? elseif exists("plancode_pattern") ?>'
                      + ' AND (plancode_code ~ <? value("plancode_pattern") ?>)'
                      + '<? endif ?>'
                      + ");"
                      ,
                      params);

  if (q.first())
  {
    var costrow    = new XTreeWidgetItem(_plannedRE, 0, qsTr("Cost"));
    var revenuerow = new XTreeWidgetItem(_plannedRE, 0, qsTr("Revenue"));
    var profitrow  = new XTreeWidgetItem(_plannedRE, 0, qsTr("Gross Profit"));

    for (var col = 1; col <= selected.length; col++)
    {
      var cost    = Number(q.value("cost" + col));
      var revenue = Number(q.value("revenue" + col));
      var profit  = revenue - cost;
      costrow.setData(col,    XTreeWidget.RawRole, cost);
      revenuerow.setData(col, XTreeWidget.RawRole, revenue);
      profitrow.setData(col,  XTreeWidget.RawRole, profit);

      costrow.setData(col,    Qt.DisplayRole, toolbox.formatMoney(cost));
      revenuerow.setData(col, Qt.DisplayRole, toolbox.formatMoney(revenue));
      profitrow.setData(col,  Qt.DisplayRole, toolbox.formatMoney(profit));

    }
  }
  if (q.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       q.lastError().text);
    return;
  }
}

include("ParameterGroupUtils");
