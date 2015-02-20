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

var widgets = toolbox.loadUi("dspWoEffortByWorkOrder", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Production Time Clock By Work Order"));
mywindow.setListLabel(qsTr("Work Orders"));
mywindow.setReportName("WOEffortByWorkOrder");
mywindow.setMetaSQLOptions("woEffort", "detail");
mywindow.setAutoUpdateEnabled(true);

var _wo         = mywindow.findChild("_wo");
var _wotc       = mywindow.list();
var _status = "N";

var empl = false;
if (metrics.value("TimeAttendanceMethod") == "Employee")
  empl = true;

var tickConnected = false;

if (empl)
  _wotc.addColumn(qsTr("Employee"),    XTreeWidget.userColumn,     Qt.AlignLeft, true, "wotc_emp_code");
else
  _wotc.addColumn(qsTr("User"),        XTreeWidget.userColumn,     Qt.AlignLeft, true, "wotc_username");
_wotc.addColumn(qsTr("Operation"),     -1,                         Qt.AlignLeft, true, "wooper_seqnumber");
_wotc.addColumn(qsTr("Description 1"), -1,                         Qt.AlignLeft, true, "wooper_descrip1");
_wotc.addColumn(qsTr("Description 2"), -1,                         Qt.AlignLeft, true, "wooper_descrip2");
_wotc.addColumn(qsTr("Time In"),       XTreeWidget.timeDateColumn, Qt.AlignLeft, true, "wotc_timein");
_wotc.addColumn(qsTr("Time Out"),      XTreeWidget.timeDateColumn, Qt.AlignLeft, true, "wotc_timeout");
_wotc.addColumn(qsTr("Setup Time"),    XTreeWidget.timeColumn,     Qt.AlignRight,true, "setup_time");
_wotc.addColumn(qsTr("Run Time"),      XTreeWidget.timeColumn,     Qt.AlignRight,true, "run_time");
_wotc.addColumn(qsTr("Effort"),        XTreeWidget.timeColumn,     Qt.AlignRight,true, "wotcTime");

function set(pParams)
{
  if ("wo_id" in pParams)
    _wo.setId(pParams.wo_id);

  if ("run" in pParams)
  {
    mywindow.sFillList();
    return mainwindow.NoError_Run;
  }

  return mainwindow.NoError;
}

function setParams(params)
{
  if (! _wo.isValid())
  {
    QMessageBox.warning(mywindow, qsTr("Enter a Work Order"),
                       qsTr("Please enter a work order."));
    _wo.setFocus();
    return false;
  }
  params.wo_id = _wo.id();
  params.total = qsTr("W/O Summary");
  params.report_name = "WOEffortByWorkOrder";

  return true;
}

function sPopulateMenu(pMenu, item)
{
  var tmpaction;
  var clockedOut = item.text("wotc_timeout").length;

  if (_wotc.id() != -1)
  {
    if ((_status == "E") || (_status == "R") || (_status == "I"))
    {
      tmpaction = pMenu.addAction(qsTr("New"));
      tmpaction.setEnabled(privileges.check("MaintainWoTimeClock"));
      tmpaction.triggered.connect(sNew);
    }

    tmpaction = pMenu.addAction(qsTr("View"));
    tmpaction.triggered.connect(sView);

    if (clockedOut)
    {
      tmpaction = pMenu.addAction(qsTr("Edit"));
      tmpaction.setEnabled(privileges.check("MaintainWoTimeClock"));
      tmpaction.triggered.connect(sEdit);
    }

    if (!clockedOut)
    {
      tmpaction = pMenu.addAction(qsTr("Delete"));
      tmpaction.setEnabled(privileges.check("MaintainWoTimeClock"));
      tmpaction.triggered.connect(sDelete);
    }
  }
}

function sNew()
{
  var params = new Object;
  params.wo_id = _wo.id();
  params.mode  = "new";

  var newdlg = toolbox.openWindow("wotc", 0, Qt.NonModal, Qt.Window);
  toolbox.lastWindow().set(params);
  newdlg.exec();

  mywindow.sFillList();
}

function sEdit()
{
  var params = new Object;
  params.wotc_id = _wotc.id();
  params.mode    = "edit";

  var newdlg = toolbox.openWindow("wotc", 0, Qt.NonModal, Qt.Window);
  toolbox.lastWindow().set(params);
  newdlg.exec();

  mywindow.sFillList();
}

function sView()
{
  var params = new Object;
  params.wotc_id = _wotc.id();
  params.mode    = "view";
  
  var newdlg = toolbox.openWindow("wotc", 0, Qt.NonModal, Qt.Window);
  toolbox.lastWindow().set(params);
  newdlg.exec();

  mywindow.sFillList();
}

function sDelete()
{
  if (QMessageBox.question(mywindow, qsTr("Delete Selected Entry?"),
                         qsTr("<p>Are you sure that you want to delete the "
                            + "selected time clock entry?"),
			 QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.Yes)
  {
    var params = new Object;
    params.wotc_id = _wotc.id();
    var qrystr = "";
    if (empl)
      qrystr = "DELETE FROM tatc "
             + 'WHERE (tatc_wotc_id=<? value("wotc_id") ?>);'
             + "DELETE FROM wotc "
             + 'WHERE (wotc_id=<? value("wotc_id") ?>);';
    else
      qrystr = "DELETE FROM wotc "
             + 'WHERE (wotc_id=<? value("wotc_id") ?>);';
    var q = toolbox.executeQuery(qrystr, params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         qry.lastError().text);
      return;
    }

    mywindow.sFillList();
  }
}

function sFillWO()
{
  var params = new Object;
  if (! setParams(params))
    return;

  var sql = "SELECT wo_status FROM wo WHERE wo_id=<? value('wo_id') ?>;";
  var q = toolbox.executeQuery(sql, params);
  if (q.first())
    _status = q.value("wo_status");

  mywindow.sFillList();
}

_wo["newId(int)"].connect(sFillWO);
_wotc["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
mainwindow["workOrdersUpdated(int,bool)"].connect(mywindow, "sFillList");
InputManager.notify(InputManager.cBCWorkOrder, mywindow,
                    _wo, InputManager.slotName("setId(int)"));
