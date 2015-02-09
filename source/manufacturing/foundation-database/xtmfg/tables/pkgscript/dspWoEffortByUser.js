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

var widgets = toolbox.loadUi("dspWoEffortByUser", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

var empl = false;
if (metrics.value("TimeAttendanceMethod") == "Employee")
  empl = true;

if (empl)
  mywindow.setWindowTitle(qsTr("Production Time Clock By Employee"));
else
  mywindow.setWindowTitle(qsTr("Production Time Clock By User"));

mywindow.setListLabel(qsTr("Work Orders"));
mywindow.setReportName("WOEffortByUser");
mywindow.setMetaSQLOptions("woEffort", "detail");
mywindow.setAutoUpdateEnabled(true);

var _dates      = widgets.findChild("_dates");
var _user       = widgets.findChild("_user");
var _emp	= widgets.findChild("_emp");
var _wotc       = mywindow.list();

_dates.setStartCaption(qsTr("Start W/O Start Date:"));
_dates.setEndCaption(qsTr("End W/O Start Date:"));
_dates.setStartNull(qsTr("Earliest"), mainwindow.startOfTime(), true);
_dates.setEndNull(qsTr("Latest"),     mainwindow.endOfTime(),   true);
_dates.startDate = new Date;
_dates.endDate   = new Date;

_wotc.addColumn(qsTr("W/O #"),       XTreeWidget.orderColumn, Qt.AlignLeft,  true, "wonumber");
_wotc.addColumn(qsTr("Status"),     XTreeWidget.statusColumn, Qt.AlignCenter,true, "wo_status");
_wotc.addColumn(qsTr("Pri."),       XTreeWidget.statusColumn, Qt.AlignCenter,true, "wo_priority");
_wotc.addColumn(qsTr("Site"),          XTreeWidget.whsColumn, Qt.AlignCenter,true, "warehous_code");
_wotc.addColumn(qsTr("Operation"),                        -1, Qt.AlignLeft,  true, "wooper_seqnumber");
_wotc.addColumn(qsTr("Description 1"),                    -1, Qt.AlignLeft,  true, "wooper_descrip1");
_wotc.addColumn(qsTr("Description 2"),                    -1, Qt.AlignLeft,  true, "wooper_descrip2");
_wotc.addColumn(qsTr("Clock In"), XTreeWidget.timeDateColumn, Qt.AlignLeft,  true, "wotc_timein");
_wotc.addColumn(qsTr("Clock Out"),XTreeWidget.timeDateColumn, Qt.AlignLeft,  true, "wotc_timeout");
_wotc.addColumn(qsTr("Effort"),       XTreeWidget.timeColumn, Qt.AlignLeft,  true, "wotcTime");

mainwindow["workOrdersUpdated(int, bool)"].connect(mywindow, "sFillList");


_wotc["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);

_emp.setVisible(empl);
_user.setVisible(!empl);

if (!empl)
  _user.setExtraClause(" (usr_active) ");
if (empl)
  _emp.setFocus();
else  
  _user.setFocus();

function setParams(params)
{
  if (empl)
  {
    if (! _emp.isValid())
    {
      QMessageBox.warning(mywindow, qsTr("Enter Employee"),
                       qsTr("Please enter an Employee"));
      _emp.setFocus();
      return false;
    }
  } else {
    if (! _user.isValid())
    {
      QMessageBox.warning(mywindow, qsTr("Enter User"),
                       qsTr("Please enter a User"));
      _user.setFocus();
      return false;
    }
  }
  if (! _dates.allValid())
  {
    QMessageBox.warning(mywindow, qsTr("Enter Dates"),
                       qsTr("Please enter Start and End Dates"));
    _dates.setFocus();
    return false;
  }

  if(empl)
    params.employee       = _emp.number;
  else
    params.username       = _user.username();
  params.includeFormatted = true;
  params.startDate        = _dates.startDate;
  params.endDate          = _dates.endDate;
  params.total            = qsTr("W/O Summary");
  params.report_name      = "WOEffortByUser";

  return true;
}

function getWoId()
{
  var params = new Object;
  params.wotc_id = _wotc.id();

  var qry = toolbox.executeQuery("SELECT wotc_wo_id "
                               + "FROM xtmfg.wotc "
                               + 'WHERE (wotc_id=<? value("wotc_id") ?>);',
            params);
  if (qry.first())
    return (qry.value("wotc_wo_id") == null) ? -1 : qry.value("wotc_wo_id");
  else if (qry.lastError().type != QSqlError.NoError)
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
  return -1;
}

function sViewWO()
{
  var params = new Object;
  params.mode  = "view";
  params.wo_id = getWoId();

  var newdlg = toolbox.openWindow("workOrder", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sCloseWO()
{
  var params = new Object;
  params.wo_id = getWoId();

  var newdlg = toolbox.openWindow("closeWo", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sViewWomatl()
{
  var params = new Object;
  params.wo_id = getWoId();
  params.run   = true;

  var newdlg = toolbox.openWindow("dspWoMaterialsByWorkOrder", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sViewWooper()
{
  var params = new Object;
  params.wo_id = getWoId();
  params.run   = true;

  var newdlg = toolbox.newDisplay("dspWoOperationsByWorkOrder", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sNew()
{
  var params = new Object;
  params.wo_id  = _wotc.altId();
  if(empl)
    params.emp_id = _emp.id();
  else
    params.usr_id = _user.id();
  params.mode   = "new";

  var newdlg = toolbox.openWindow("wotc", 0, Qt.WindowModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  if (newdlg.exec() == QDialog.Accepted)
    mywindow.sFillList();
}

function sEdit()
{
  var params = new Object;
  params.wotc_id = _wotc.id();
  params.mode    = "edit";

  var newdlg = toolbox.openWindow("wotc", 0, Qt.WindowModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  if (newdlg.exec() == QDialog.Accepted)
    mywindow.sFillList();
}

function sView()
{
  var params = new Object;
  params.wotc_id = _wotc.id();
  params.mode    = "view";
  
  var newdlg = toolbox.openWindow("wotc", 0, Qt.WindowModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
}

function sDelete()
{
  if (QMessageBox.question(mywindow, qsTr("Delete Selected Entry?"),
                         qsTr("<p>Are you sure that you want to delete the "
                            + "selected time clock entry?"),
                         QMessageBox.Yes | QMessageBox.No) == QMessageBox.Yes)
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
    var qry = toolbox.executeQuery(qrystr, params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         qry.lastError().text);
      return;
    }
    mywindow.sFillList();
  }
}

function sPopulateMenu(pMenu, selected)
{
  var status = selected.rawValue("wo_status");
  var clockedOut = selected.rawValue("wotc_timeout").length;
  var menuItem;

  if (_wotc.id() != -1)
  {
    if ((status == "E") || (status == "R") || (status == "I"))
    {
      menuItem = pMenu.addAction(qsTr("New"));
      menuItem.setEnabled(privileges.check("MaintainWoTimeClock"));
      menuItem.triggered.connect(sNew);
    }

    menuItem = pMenu.addAction(qsTr("View"));
    menuItem.triggered.connect(sView);
 
    if (clockedOut)
    {
      tmpaction = pMenu.addAction(qsTr("Edit"));
      tmpaction.setEnabled(privileges.check("MaintainWoTimeClock"));
      tmpaction.triggered.connect(sEdit);
    }

    if (!clockedOut)
    {
      menuItem = pMenu.addAction(qsTr("Delete"));
      menuItem.setEnabled(privileges.check("MaintainWoTimeClock"));
      menuItem.triggered.connect(sDelete);
    }

    pMenu.addSeparator();

    menuItem = pMenu.addAction(qsTr("View W/O"));
    menuItem.triggered.connect(sViewWO);

    if ((status == "R") || (status == "I"))
    {
      menuItem = pMenu.addAction(qsTr("Close W/O..."));
      menuItem.setEnabled(privileges.check("CloseWorkOrders"));
      menuItem.triggered.connect(sCloseWO);
    }

    if ((status == "E") || (status == "R") || (status == "I"))
    {
      pMenu.addSeparator();

      menuItem = pMenu.addAction(qsTr("View W/O Material Requirements..."));
      menuItem.setEnabled(privileges.check("ViewWoMaterials"));
      menuItem.triggered.connect(sViewWomatl);

      menuItem = pMenu.addAction(qsTr("View W/O Operations..."));
      menuItem.setEnabled(privileges.check("ViewWoOperations"));
      menuItem.triggered.connect(sViewWooper);
    }
  }
}
