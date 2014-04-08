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

var widgets = toolbox.loadUi("dspTimePhasedCapacityByWorkCenter", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Time Phased Capacity by Work Center"));
mywindow.setListLabel(qsTr("Capacity"));
mywindow.setReportName("TimePhasedCapacityByWorkCenter");
//mywindow.setMetaSQLOptions();
var _queryAct = mywindow.queryAction();
toolbox.coreDisconnect(_queryAct, "triggered()", mywindow, "sFillList()");
_queryAct.triggered.connect(sFillList);

var _columnDates = new Array;

var _load        = mywindow.list();
var _periods     = mywindow.findChild("_periods");
var _print       = mywindow.findChild("_print");
var _query       = mywindow.findChild("_query");
var _warehouse   = mywindow.findChild("_warehouse");
var _selectedTooling    = mywindow.findChild("_selectedTooling");
var _tooling            = mywindow.findChild("_tooling");
var _workCenterGroup    = mywindow.findChild("_workCenterGroup");
var _toolingGroup	    = mywindow.findChild("_toolingGroup");

_load.addColumn(qsTr("Site"),        XTreeWidget.whsColumn, Qt.AlignCenter,true, "warehous_code");
_load.addColumn(qsTr("Type"),       -1,                     Qt.AlignLeft,  true, "resource_type");
_load.addColumn(qsTr("Resource"),   -1,                     Qt.AlignLeft,  true, "resource");

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
    return false;
  }

  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  if (_toolingGroup.checked) {
    params.showTooling = true;
    if (_selectedTooling.checked)
      params.item_id = _tooling.id();
  }

  var selected = _periods.selectedItems();
  var periodList = new Array;
  for (var i = 0; i < selected.length; i++)
    periodList[i] = selected[i].id();
  params.period_id_list = periodList;
  params.report_name    = "TimePhasedCapacityByWorkCenter";
  params.workcenter=qsTr("Work Center");
  params.tooling=qsTr("Tooling");

  return true;
}

function sFillList()
{
  var params = new Object;
  if (! setParams(params))
    return;

  _columnDates = new Array;
  _load.setColumnCount(3);

  var columns = 1;
  var selected = _periods.selectedItems();
  params.extracolumns = "";
  params.extratoolcolumns = "";
  for (var i = 0; i < selected.length; i++)
  {
    var cursor = selected[i];
    var bucketname = "bucket" + (columns++);
    params.extracolumns += ", (xtmfg.workCenterCapacity(wrkcnt_id, " + cursor.id()
                         + ")) AS " + bucketname + ","
                         + "  '1' AS " + bucketname + "_xtnumericrole ";

    params.extratoolcolumns += ", (xtmfg.toolCapacity(itemsite_id, " + cursor.id()
                         + ")) AS " + bucketname + ","
                         + "  '1' AS " + bucketname + "_xtnumericrole ";

    _load.addColumn(toolbox.formatDate(cursor.startDate()), 80,
                    Qt.AlignRight, true, bucketname);
    var newidx = _columnDates.length;
    _columnDates[newidx] = new Object;
    _columnDates[newidx].startDate = cursor.startDate();
    _columnDates[newidx].endDate   = cursor.endDate();
  }

  var qry = toolbox.executeQuery("SELECT wrkcnt_id AS id, warehous_code, wrkcnt_code AS resource, "
                               + '<? value("workcenter") ?> AS resource_type '
                               + '<? literal("extracolumns") ?>'
                               + " FROM xtmfg.wrkcnt JOIN whsinfo ON (warehous_id=wrkcnt_warehous_id) "
                               + '<? if exists("warehous_id") ?>'
                               + 'WHERE (wrkcnt_warehous_id=<? value("warehous_id") ?>) '
                               + "<? endif ?>"
                               + '<? if exists("showTooling") ?>'
							   + "UNION "
                               + "SELECT item_id AS id, warehous_code, item_number AS resource, "
                               + '<? value("tooling") ?> AS resource_type '
                               + '<? literal("extratoolcolumns") ?>'
                               + " FROM itemsite JOIN whsinfo ON (warehous_id=itemsite_warehous_id) "
							   + "               JOIN item ON (item_id=itemsite_item_id) "
							   + "WHERE (item_type='T') "
                               + '<? if exists("warehous_id") ?>'
                               + 'AND (itemsite_warehous_id=<? value("warehous_id") ?>) '
                               + "<? endif ?>"
                               + '<? if exists("item_id") ?>'
                               + 'AND (itemsite_item_id=<? value("item_id") ?>) '
                               + "<? endif ?>"
                               + "<? endif ?>"
                               + "ORDER BY resource;",
                               params);

  _load.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }
}

