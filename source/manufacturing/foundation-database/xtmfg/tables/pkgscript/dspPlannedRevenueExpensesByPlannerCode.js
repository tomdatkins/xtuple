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

var widgets = toolbox.loadUi("dspPlannedRevenueExpensesByPlannerCode", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Planned Revenue/Expenses by Planner Code"));
mywindow.setListLabel(qsTr("Planned Orders"));
mywindow.setReportName("PlannedRevenueExpensesByPlannerCode");
mywindow.setMetaSQLOptions("schedule", "plannedorders");

/*
QButtonGroup* _costGroupInt = new QButtonGroup(this);
_costGroupInt.addButton(_useStandardCost);
_costGroupInt.addButton(_useActualCost);

QButtonGroup* _salesPriceGroupInt = new QButtonGroup(this);
_salesPriceGroupInt.addButton(_useListPrice);
_salesPriceGroupInt.addButton(_useAveragePrice);
*/

var _endDate         = mywindow.findChild("_endDate");
var _endEvalDate     = mywindow.findChild("_endEvalDate");
var _plannerCode     = mywindow.findChild("_plannerCode");
var _startDate       = mywindow.findChild("_startDate");
var _startEvalDate   = mywindow.findChild("_startEvalDate");
var _useActualCost   = mywindow.findChild("_useActualCost");
var _useAveragePrice = mywindow.findChild("_useAveragePrice");
var _useListPrice    = mywindow.findChild("_useListPrice");
var _useStandardCost = mywindow.findChild("_useStandardCost");
var _warehouse       = mywindow.findChild("_warehouse");
var _planord         = mywindow.list();

_plannerCode.type = ParameterGroup.PlannerCode;

_planord.addColumn(qsTr("Order #"),   XTreeWidget.orderColumn, Qt.AlignLeft,  true, "ordernum");
_planord.addColumn(qsTr("Type"),        XTreeWidget.uomColumn, Qt.AlignCenter,true, "ordtype");
_planord.addColumn(qsTr("Site"),        XTreeWidget.whsColumn, Qt.AlignCenter,true, "warehous_code");
_planord.addColumn(qsTr("From Site"),   XTreeWidget.whsColumn, Qt.AlignCenter,true, "supply_warehous_code");
_planord.addColumn(qsTr("Item Number"),XTreeWidget.itemColumn, Qt.AlignLeft,  true, "item_number");
_planord.addColumn(qsTr("Description"),                    -1, Qt.AlignLeft,  true, "item_descrip");
_planord.addColumn(qsTr("Due Date"),   XTreeWidget.dateColumn, Qt.AlignCenter,true, "planord_duedate");
_planord.addColumn(qsTr("Qty"),         XTreeWidget.qtyColumn, Qt.AlignRight, true, "planord_qty");
_planord.addColumn(qsTr("Firm"),         XTreeWidget.ynColumn, Qt.AlignCenter,true, "planord_firm");
_planord.addColumn(qsTr("Cost"),      XTreeWidget.moneyColumn, Qt.AlignRight, true, "plocost");
_planord.addColumn(qsTr("Revenue"),   XTreeWidget.moneyColumn, Qt.AlignRight, true, "plorevenue");
_planord.addColumn(qsTr("Gr. Profit"),XTreeWidget.moneyColumn, Qt.AlignRight, true, "profit");

_startDate.setAllowNullDate(true);
_startDate.setNullString(qsTr("Earliest"));
_startDate.setNullDate(mainwindow.startOfTime());
_endDate.setAllowNullDate(true);
_endDate.setNullString(qsTr("Latest"));
_endDate.setNullDate(mainwindow.endOfTime());

_startEvalDate.setAllowNullDate(true);
_startEvalDate.setNullString(qsTr("Earliest"));
_startEvalDate.setNullDate(mainwindow.startOfTime());
_endEvalDate.setAllowNullDate(true);
_endEvalDate.setNullString(qsTr("Latest"));
_endEvalDate.setNullDate(mainwindow.endOfTime());

function setParams(params)
{
  params.soldOnly = true;
  params.startDate = _startDate.date;
  params.endDate = _endDate.date;
  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  ParameterGroup.appendValue(_plannerCode, params);

  if (_useStandardCost.checked)
    params.useStandardCost = true;

  if (_useActualCost.checked)
    params.useActualCost = true;

  if (_useListPrice.checked)
    params.useListPrice = true;

  if (_useAveragePrice.checked)
  {
    params.useAveragePrice = true;
    params.startEvalDate   = _startEvalDate.date;
    params.endEvalDate     = _endEvalDate.date;
  }

  params.report_name = "PlannedRevenueExpensesByPlannerCode";

  return true;
}

function sPostFillList()
{
  // set color if profit is negative
  var last = _planord.topLevelItem(_planord.topLevelItemCount - 1);
  if (last && last.rawValue("plocost") < 0)
    last.setData(last.column("plocost"), Qt.ForegroundRole,
                 toolbox.getNamedColor("error"));
}

mywindow.fillListAfter.connect(sPostFillList);

include("ParameterGroupUtils");
