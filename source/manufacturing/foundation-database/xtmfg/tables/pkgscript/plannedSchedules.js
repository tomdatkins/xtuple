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

// create a script var for each child of mywindow with an objectname starting _
var _print   = mywindow.findChild("_print");
var _new     = mywindow.findChild("_new");
var _edit    = mywindow.findChild("_edit");
var _copy    = mywindow.findChild("_copy");
var _close   = mywindow.findChild("_close");
var _list    = mywindow.findChild("_list");
var _delete  = mywindow.findChild("_delete");

var _debug = false;

_list.addColumn(qsTr("Start Date"),  -1, Qt.AlignCenter, true, "pschhead_start_date");
_list.addColumn(qsTr("End Date"),    -1, Qt.AlignCenter, true, "pschhead_end_date");
_list.addColumn(qsTr("Site"),        -1, Qt.AlignCenter, true, "warehous_code");
_list.addColumn(qsTr("Schd. Number"),-1, Qt.AlignLeft,   true, "pschhead_number");
_list.addColumn(qsTr("Type"),        -1, Qt.AlignCenter, true, "pschhead_type");
_list.addColumn(qsTr("Status"),      -1, Qt.AlignCenter, true, "pschhead_status");
_list.addColumn(qsTr("Description"), -1, Qt.AlignLeft,   true, "pschhead_descrip");

function sPrint()
{
  if (_debug) print("plannedSchedules sPrint called");
  try {
    var params = new Object;
    toolbox.printReport("PlannedSchedulesMasterList", params);
  } catch(e) {
    print("plannedSchedules sPrint exception @ " + e.lineNumber + ": " + e);
  }
}

function openSchedule(params)
{
  if (_debug) print("plannedSchedules openSchedule called");
  try {
    var schedule = toolbox.openWindow("plannedSchedule", 0, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = schedule.exec();
    if(result != 0)
      sFillList();
  } catch(e) {
    print("plannedSchedules openSchedule exception @ " + e.lineNumber + ": " + e);
  }
}

function populateMenu(pMenu, pItem, pCol)
{
  if (_debug) print("plannedSchedules populateMenu called");
  try {
    if(pMenu == null)
      pMenu = _list.findChild("_menu");

    if(pMenu != null)
    {
      if (_list.rawValue("pschhead_status") == "U")
      {
        var tmpact = pMenu.addAction(qsTr("Release"));
        tmpact.enabled = true;
        tmpact.triggered.connect(sRelease);
      }
      else
      {
        var tmpact = pMenu.addAction(qsTr("Recall"));
        tmpact.enabled = true;
        tmpact.triggered.connect(sRecall);
      }
    }
  } catch(e) {
    print("plannedSchedules populateMenu exception @ " + e.lineNumber + ": " + e);
  }
}

function sRelease()
{
  if (_debug) print("plannedSchedules sRelease called");
  try {
    var params = new Object;
    params.pschhead_id = _list.id();

    toolbox.executeQuery("UPDATE xtmfg.pschhead SET pschhead_status = 'R' WHERE (pschhead_id=<? value('pschhead_id') ?>);", params);
    sFillList();
  } catch(e) {
    print("plannedSchedules sRelease exception @ " + e.lineNumber + ": " + e);
  }
}

function sRecall()
{
  if (_debug) print("plannedSchedules sRecall called");
  try {
    var params = new Object;
    params.pschhead_id = _list.id();

    toolbox.executeQuery("UPDATE xtmfg.pschhead SET pschhead_status = 'U' WHERE (pschhead_id=<? value('pschhead_id') ?>);", params);
    sFillList();
  } catch(e) {
    print("plannedSchedules sRecall exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  if (_debug) print("plannedSchedules sNew called");
  try {
    var params = new Object;
    params.mode = "new";

    openSchedule(params);
  } catch(e) {
    print("plannedSchedules sNew exception @ " + e.lineNumber + ": " + e);
  }
}

function sEdit()
{
  if (_debug) print("plannedSchedules sEdit called");
  try {
    var params = new Object;
    params.mode = "edit";
    params.pschhead_id = _list.id();

    openSchedule(params);
  } catch(e) {
    print("plannedSchedules sEdit exception @ " + e.lineNumber + ": " + e);
  }
}

function sCopy()
{
  if (_debug) print("plannedSchedules sCopy called");
  try {
    var params = new Object;
    params.pschhead_id = _list.id();
    var schedule = toolbox.openWindow("copyPlannedSchedule", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = schedule.exec();
    if(result != 0)
      sFillList();
  } catch(e) {
    print("plannedSchedules sCopy exception @ " + e.lineNumber + ": " + e);
  }
}

function sDelete()
{
  if (_debug) print("plannedSchedules sDelete called");
  try {
    if (QMessageBox.question(mywindow, qsTr("Delete Selected Production Plan?"),
                             qsTr("<p>Are you sure that you want to delete the selected\nProduction Plan?"),
                             QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;

    var params = new Object;
    params.pschhead_id = _list.id();

    qry = toolbox.executeQuery("DELETE FROM xtmfg.pschitem "
                              +"WHERE(pschitem_pschhead_id=<? value('pschhead_id') ?>);", params );
    qry = toolbox.executeQuery("DELETE FROM xtmfg.pschhead "
                              +"CASCADE WHERE(pschhead_id=<? value('pschhead_id') ?>);", params );
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
    sFillList();
  } catch(e) {
    print("plannedSchedules sDelete exception @ " + e.lineNumber + ": " + e);
  }
}

function sFillList()
{
  if (_debug) print("plannedSchedules sFillList called");
  try {
    var params = new Object;
    params.released = qsTr("Released");
    params.unreleased = qsTr("Unreleased");
    params.forecast = qsTr("Forecast Reporting");
    params.forecastnet = qsTr("Forecast Netted to MPS");
    params.cumulative = qsTr("Cumulative MPS");

    var qry = toolbox.executeDbQuery("plannedSchedules", "detail", params);
    _list.populate(qry);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  } catch(e) {
    print("plannedSchedules sFillList exception @ " + e.lineNumber + ": " + e);
  }
}

_print.clicked.connect(sPrint);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_copy.clicked.connect(sCopy);
_delete.clicked.connect(sDelete);
_list["populateMenu(QMenu *, QTreeWidgetItem *, int)"].connect(populateMenu)

_close.clicked.connect(mywindow, "close");

sFillList();
