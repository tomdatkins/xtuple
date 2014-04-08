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

var widgets = toolbox.loadUi("dspTimePhasedProductionByItem", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Time-Phased Production by Item"));
mywindow.setListLabel(qsTr("Production"));
mywindow.setReportName("TimePhasedProductionByItem");
//mywindow.setMetaSQLOptions();
var _queryAct = mywindow.queryAction();
toolbox.coreDisconnect(_queryAct, "triggered()", mywindow, "sFillList()");
_queryAct.triggered.connect(sFillList);

var _column      = 0;
var _columnDates = new Array;

var _periods    = mywindow.findChild("_periods");
var _plannerCode= mywindow.findChild("_plannerCode");
var _warehouse  = mywindow.findChild("_warehouse");
var _production = mywindow.list();

_plannerCode.type = ParameterGroup.PlannerCode;

_production.addColumn(qsTr("Item Number"),-1, Qt.AlignLeft,  true, "item_number");
_production.addColumn(qsTr("Site"),       -1, Qt.AlignCenter,true, "warehous_code");
_production.addColumn(qsTr("UOM"),        -1, Qt.AlignLeft,  true, "uom_name");

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

  params.report_name = "TimePhasedProductionByItem";

  return true;
}

function sViewTransactions()
{
  var params = new Object;
  params.itemsite_id = _production.id();
  params.startDate   = _columnDates[_column - 3].startDate;
  params.endDate     = _columnDates[_column - 3].endDate;
  params.transtype   = "R";
  params.run         = true;

  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  var newdlg = toolbox.openWindow("dspInventoryHistory", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sPopulateMenu(menu, item, pColumn)
{
  _column = pColumn;

  if (_column > 1)
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

  var columns = 1;
  var selected = _periods.selectedItems();
  params.extracolumns = "";
  for (var i = 0; i < selected.length; i++)
  {
    var cursor = selected[i];
    var bucketname = "bucket" + (columns++);
    params.extracolumns += ", summProd(itemsite_id, " + cursor.id()
                         + ") AS " + bucketname + ", 'qty' AS "
                         + bucketname + "_xtnumericrole ";

    _production.addColumn(toolbox.formatDate(cursor.startDate()), 80,
                          Qt.AlignRight, true, bucketname);
    var newidx = _columnDates.length;
    _columnDates[newidx] = new Object;
    _columnDates[newidx].startDate = cursor.startDate();
    _columnDates[newidx].endDate   = cursor.endDate();
  }

  var qry = toolbox.executeQuery(
                           "SELECT itemsite_id, item_number, warehous_code, uom_name"
                         + '       <? literal("extracolumns") ?> '
                         + " FROM itemsite"
                         + "   JOIN item ON (itemsite_item_id=item_id)"
                         + "   JOIN uom ON (item_inv_uom_id=uom_id)"
                         + "   JOIN whsinfo ON (itemsite_warehous_id=warehous_id)"
                         + "WHERE (TRUE"
                         + '<? if exists("warehous_id") ?>'
                         + '   AND (itemsite_warehous_id=<? value("warehous_id") ?>)'
                         + '<? endif ?>'
                         + '<? if exists("plancode_id") ?>'
                         + '   AND (itemsite_plancode_id=<? value("plancode_id") ?>)'
                         + '<? elseif exists("plancode_pattern") ?>'
                         + '   AND (itemsite_plancode_id IN (SELECT plancode_id '
                         + '                                 FROM plancode '
                         + '                                 WHERE (plancode_code ~ <? value("plancode_pattern") ?>))) '
                         + '<? endif ?>'

                         + ') '
                         + 'ORDER BY item_number;',
                         params);

  _production.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }
}

_production["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);

include("ParameterGroupUtils");
