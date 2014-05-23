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

var widgets = toolbox.loadUi("dspTimePhasedRoughCutByWorkCenter", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Time-Phased Planned Rough Cut by Work Center"));
mywindow.setListLabel(qsTr("Rough Cut"));
mywindow.setReportName("TimePhasedRoughCutByWorkCenter");
//mywindow.setMetaSQLOptions();
var _queryAct = mywindow.queryAction();
toolbox.coreDisconnect(_queryAct, "triggered()", mywindow, "sFillList()");
_queryAct.triggered.connect(sFillList);

var _periods           = mywindow.findChild("_periods");
var _warehouse         = mywindow.findChild("_warehouse");
var _selectedWorkCenter= mywindow.findChild("_selectedWorkCenter");
var _workCenters       = mywindow.findChild("_workCenters");
var _workCenterGroup    = mywindow.findChild("_workCenterGroup");
var _selectedTooling    = mywindow.findChild("_selectedTooling");
var _tooling            = mywindow.findChild("_tooling");
var _toolingGroup	 = mywindow.findChild("_toolingGroup");
var _roughCut          = mywindow.list();

_roughCut.addColumn("", 80, Qt.AlignRight);

var sql = "SELECT item_id, item_number || '-' || item_descrip1, item_number "
	+ "FROM item "
	+ "WHERE ((item_type='T') "
	+ " AND (item_active)) ";
_tooling.populate(sql);

function setParams(params)
{
  if (! _periods.isPeriodSelected())
  {
    QMessageBox.critical(mywindow, qsTr("Select a Period"),
                       qsTr("<p>You must select at least one Calendar Period."));
    _periods.setFocus();
  }

  if (!_workCenterGroup.checked && !_toolingGroup.checked) {
    QMessageBox.critical(mywindow, qsTr("Selection Error"),
	qsTr("You must select Work Center or Tooling as a criteria."));
    return false;
  }

  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  if (_workCenterGroup.checked) {
    params.showWorkCenters = true;
    if (_selectedWorkCenter.checked)
      params.wrkcnt_id = _workCenters.id();
  }

  if (_toolingGroup.checked) {
    params.showTooling = true;
    if (_selectedTooling.checked)
      params.item_id = _tooling.id();
  }

  var selected   = _periods.selectedItems();
  var periodList = new Array;
  for (var i = 0; i < selected.length; i++)
    periodList[i] = selected[i].id();
  params.period_id_list = periodList;
    
  params.report_name = "TimePhasedRoughCutByWorkCenter";
  params.workcenter=qsTr("Work Center");
  params.tooling=qsTr("Tooling");

  return true;
}

function sFillList()
{
  var params = new Object;
  if (! setParams(params))
    return;

  _roughCut.clear();
  _roughCut.setColumnCount(1);

  var columnDates = new Array;
  var selected = _periods.selectedItems();
  params.Wextracolumns = "";
  params.Textracolumns = "";
  for (var i = 1; i <= selected.length; i++)
  {
    var cursor = selected[i - 1];

    params.Wextracolumns +=
        ",SUM(xtmfg.plannedSetupTime('W', wrkcnt_id,"+ cursor.id() + ")) AS setup" + i
      + ",SUM(xtmfg.plannedSetupTime('W', wrkcnt_id,"+ cursor.id() + ") * wrkcnt_setuprate / 60.0) AS setupcost" + i
      + ",SUM(xtmfg.plannedRunTime('W', wrkcnt_id, " + cursor.id() + ")) AS run" + i
      + ",SUM(xtmfg.plannedRunTime('W', wrkcnt_id, " + cursor.id() + ") * wrkcnt_runrate / 60.0) AS runcost" + i ;

    params.Textracolumns +=
        ",SUM(xtmfg.plannedSetupTime('T', item_id,"+ cursor.id() + ")) AS setup" + i
      + ",0.0 AS setupcost" + i
      + ",SUM(xtmfg.plannedRunTime('T', item_id, " + cursor.id() + ")) AS run" + i
      + ",0.0 AS runcost" + i ;

    _roughCut.addColumn(toolbox.formatDate(cursor.startDate()),
                        XTreeWidget.qtyColumn, Qt.AlignRight, true, "" + i);
    var newidx = columnDates.length;
    columnDates[newidx] = new Object
    columnDates[newidx].startDate = cursor.startDate()
    columnDates[newidx].endDate   = cursor.endDate();
  }

  var qw = toolbox.executeQuery(
                     'SELECT -1 AS dummy '
                   + '       <? literal("Wextracolumns") ?>'
                   + " FROM xtmfg.wrkcnt "
                   + " WHERE (TRUE "
                   + '<? if exists("warehous_id") ?>'
                   + '    AND (wrkcnt_warehous_id=<? value("warehous_id") ?>)'
                   + '<? endif ?>'
                   + '<? if exists("wrkcnt_id") ?>'
                   + ' AND (wrkcnt_id=<? value("wrkcnt_id") ?>)'
                   + '<? endif ?>'
                   + ');',
                    params);

  var qt = toolbox.executeQuery(
                     'SELECT -1 AS dummy '
                   + '       <? literal("Textracolumns") ?>'
                   + " FROM itemsite JOIN item ON (item_id=itemsite_item_id) "
                   + " WHERE ( (item_type='T') "
                   + '<? if exists("warehous_id") ?>'
                   + '    AND (itemsite_warehous_id=<? value("warehous_id") ?>)'
                   + '<? endif ?>'
                   + '<? if exists("item_id") ?>'
                   + ' AND (item_id=<? value("item_id") ?>)'
                   + '<? endif ?>'
                   + ');',
                    params);

  qw.first();
  qt.first();
  if (qw.first() || qt.first())
  {
    var setuprow    = new XTreeWidgetItem(_roughCut, 0, qsTr("Setup Time"));
    var setupCostrow= new XTreeWidgetItem(_roughCut, 0, qsTr("Setup Cost"));
    var runrow      = new XTreeWidgetItem(_roughCut, 0, qsTr("Run Time"));
    var runCostrow  = new XTreeWidgetItem(_roughCut, 0, qsTr("Run Cost"));
                     
    for (var column = 1; column <= selected.length; column++)
    {
      var setup     = 0.0;
      var setupCost = 0.0;
      var run       = 0.0;
      var runCost   = 0.0;

      if (_workCenterGroup.checked)
      {
        setup     = setup     + Number(qw.value("setup"     + column));
        setupCost = setupCost + Number(qw.value("setupcost" + column));
        run       = run       + Number(qw.value("run"       + column));
        runCost   = runCost   + Number(qw.value("runcost"   + column));
      }

      if (_toolingGroup.checked)
      {
        setup     = setup     + Number(qt.value("setup"     + column));
        setupCost = setupCost + Number(qt.value("setupcost" + column));
        run       = run       + Number(qt.value("run"       + column));
        runCost   = runCost   + Number(qt.value("runcost"   + column));
      }

      setuprow.setData(column,    XTreeWidget.RawRole, setup);
      setupCostrow.setData(column,XTreeWidget.RawRole, setupCost);
      runrow.setData(column,      XTreeWidget.RawRole, run);
      runCostrow.setData(column,  XTreeWidget.RawRole, runCost);

      setuprow.setData(column,    Qt.DisplayRole, toolbox.formatMoney(setup));
      setupCostrow.setData(column,Qt.DisplayRole, toolbox.formatMoney(setupCost));
      runrow.setData(column,      Qt.DisplayRole, toolbox.formatMoney(run));
      runCostrow.setData(column,  Qt.DisplayRole, toolbox.formatMoney(runCost));
    }
  }
}

