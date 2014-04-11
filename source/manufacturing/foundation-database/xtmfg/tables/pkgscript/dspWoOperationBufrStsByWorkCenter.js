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

include("storedProcErrorLookup");
include("xtmfgErrors");

var widgets = toolbox.loadUi("dspWoOperationBufrStsByWorkCenter", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Work Order Operation Buffer Status By Work Center"));
mywindow.setListLabel(qsTr("Operations"));
mywindow.setReportName("WOOperationBufrStsByWorkCenter");
mywindow.setMetaSQLOptions("wooperbufferstatus", "workcenter");
mywindow.setAutoUpdateEnabled(true);

var _QtyAvailOnly= mywindow.findChild("_QtyAvailOnly");
var _issuedOnly  = mywindow.findChild("_issuedOnly");
var _user        = mywindow.findChild("_user");
var _description = mywindow.findChild("_description");
var _warehouse   = mywindow.findChild("_warehouse");
var _wrkcnt      = mywindow.findChild("_wrkcnt");
var _wooper      = mywindow.list();

_wrkcnt.populate("SELECT wrkcnt_id, wrkcnt_code "
               + "FROM xtmfg.wrkcnt "
               + "ORDER BY wrkcnt_code;");

_wooper.addColumn(qsTr("W/O #"),             -1, Qt.AlignLeft,  true, "wonumber");
_wooper.addColumn(qsTr("Status"),            -1, Qt.AlignCenter,true, "bufrsts_status");
_wooper.addColumn(qsTr("Type"),              -1, Qt.AlignLeft,  true, "bufrststype");
_wooper.addColumn(qsTr("Item Number"),       -1, Qt.AlignLeft,  true, "item_number");
_wooper.addColumn(qsTr("Seq #"),             -1, Qt.AlignCenter,true, "wooper_seqnumber");
_wooper.addColumn(qsTr("Std. Oper."),        -1, Qt.AlignLeft,  true, "stdoper");
_wooper.addColumn(qsTr("Description"),       -1, Qt.AlignLeft,  true, "wooperdescrip");
_wooper.addColumn(qsTr("Setup Remain."),     -1, Qt.AlignRight, true, "setup");
_wooper.addColumn(qsTr("Run Remain."),       -1, Qt.AlignRight, true, "run");
_wooper.addColumn(qsTr("Qty. Remain."),      -1, Qt.AlignRight, true, "qtyremain");
_wooper.addColumn(qsTr("UOM"),               -1, Qt.AlignCenter,true, "uom_name");
_wooper.addColumn(qsTr("Clocked In"),        -1, Qt.AlignLeft,  true, "clockin_user");
_wooper.addColumn(qsTr("Prev. Work Center"), -1, Qt.AlignLeft,  true, "prev_wrkcnt");
_wooper.addColumn(qsTr("Next Work Center"),  -1, Qt.AlignLeft,  true, "next_wrkcnt");

function set(pParams)
{
  if ("wrkcnt_id" in pParams)
    _wrkcnt.setId(pParams.wrkcnt_id);

  if ("run" in pParams)
  {
    mywindow.sFillList();
    return mainwindow.NoError_Run;
  }

  return mainwindow.NoError;
}

function setParams(params)
{
  params.wrkcnt_id = _wrkcnt.id();
  params.complete  = qsTr("Complete");

  if(_QtyAvailOnly.checked)
    params.QtyAvailOnly = true;

  if(_issuedOnly.checked)
    params.issuedOnly = true;

  params.report_name = "WOOperationBufrStsByWorkCenter";

  return true;
}

function sPopulateMenu(pMenu, pSelected)
{
  var menuItem;

  menuItem = pMenu.addAction(qsTr("View Operation..."));
  menuItem.enabled = (privileges.check("ViewWoOperations") &&
                      privileges.check("MaintainWoOperations"));
  menuItem.triggered.connect(sViewOperation);

  menuItem = pMenu.addAction(qsTr("Edit Operation..."));
  menuItem.enabled = privileges.check("MaintainWoOperations");
  menuItem.triggered.connect(sEditOperation);

  menuItem = pMenu.addAction(qsTr("Delete Operation..."));
  menuItem.enabled = privileges.check("MaintainWoOperations");
  menuItem.triggered.connect(sDeleteOperation);

  menuItem = pMenu.addAction(qsTr("Clock In..."));
  menuItem.enabled = privileges.check("WoTimeClock");
  menuItem.triggered.connect(sClockIn);

  if (pSelected.rawValue("clockin_user").length > 0)
  {
    menuItem = pMenu.addAction(qsTr("Clock Out..."));
    menuItem.enabled = privileges.check("WoTimeClock");
    menuItem.triggered.connect(sClockOut);
  }
}

function sViewOperation()
{
  var params = new Object;
  params.mode      = "view";
  params.wooper_id = _wooper.id();

  var newdlg = toolbox.openWindow("woOperation", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
}

function sEditOperation()
{
  var params = new Object;
  params.mode      = "edit";
  params.wooper_id = _wooper.id();

  var newdlg = toolbox.openWindow("woOperation", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  toolbox.lastWindow().set(params);

  if (newdlg.exec() != QDialog.Rejected)
    mywindow.sFillList();
}

function sDeleteOperation()
{
  if (QMessageBox.question(mywindow, qsTr("Delete W/O Operation"),
                         qsTr("<p>If you Delete the selected W/O Operation you "
                            + "will not be able to post Labor to this "
                            + "Operation to this W/O."
                            + "<p>Are you sure that you want to delete the "
                            + "selected W/O Operation?"),
                         QMessageBox.Yes | QMessageBox.No,
                         QMessageBox.No) == QMessageBox.No)
    return;

  var params = new Object;
  params.wooper_id = _wooper.id();
  var q = toolbox.executeQuery("DELETE FROM xtmfg.wooper "
                             + 'WHERE (wooper_id=<? value("wooper_id") ?>);',
                             params);
  if (q.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       q.lastError().text);
    return;
  }
  mywindow.sFillList();
}

function sClockIn()
{
  if (!_user.isValid())
  {
    QMessageBox.critical(mywindow, qsTr("Invalid User"),
                       qsTr("You must select a User before you can clock-in."));
    return;
  }

  var params = new Object;
  params.wotc_wo_id = _wooper.altId();
  params.wotc_username = _user.username();
  params.wotc_wooper_id = _wooper.id();
  var qry = toolbox.executeQuery('SELECT xtmfg.woClockIn(<? value("wotc_wo_id") ?>,'
                                +'                       <? value("wotc_username") ?>,'
                                +'                       NOW(),'
                                +'                       <? value("wotc_wooper_id") ?>) AS result;', params);
  if(qry.first())
  {
    var result = qry.value("result");
    if(result < 0)
    {
      QMessageBox.critical(mywindow, qsTr("W/O ClockIn Error"), storedProcErrorLookup("woClockIn", result, xtmfgErrors));

      return;
    }
  }
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
  mywindow.sFillList();
}

function sClockOut()
{
  if (!_user.isValid())
  {
    QMessageBox.critical(mywindow, qsTr("Invalid User"),
                       qsTr("You must select a User before you can clock-out."));
    return;
  }

  var wotc_id = -1;
  var params = new Object;
  params.wotc_wo_id = _wooper.altId();
  params.wotc_username = _user.username();
  params.wotc_wooper_id = _wooper.id();
  var qry = toolbox.executeQuery('SELECT xtmfg.woClockOut(<? value("wotc_wo_id") ?>,'
                                +'                        <? value("wotc_username") ?>,'
                                +'                        NOW(),'
                                +'                        <? value("wotc_wooper_id") ?>) AS result;', params);
  if(qry.first())
  {
    wotc_id = qry.value("result");
    if(wotc_id < 0)
    {
      QMessageBox.critical(mywindow, qsTr("W/O ClockOut Error"), storedProcErrorLookup("woClockOut", wotc_id, xtmfgErrors));
      return;
    }  
  }
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  var result = 1;
  if(metrics.value("WOTCPostStyle") == "Operations")
    result = callPostOperations(wotc_id);
  else if(metrics.value("WOTCPostStyle") == "Production")
    result = callPostProduction(wotc_id);

  if(result < 1)
  // cancel the clockout
  {
    params = new Object;
    params.wotc_id = wotc_id;
    qry = toolbox.executeQuery("SELECT xtmfg.unwoClockOut(<? value('wotc_id') ?>) AS result", params);
    if(qry.first())
    {
      result = qry.value("result");
      if(result < 0)
        QMessageBox.critical(mywindow, qsTr("W/O UnClockOut Error"), storedProcErrorLookup("unWoClockOut", result, xtmfgErrors));
      else if (qry.lastError().type != QSqlError.NoError)
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    }
  }
  mywindow.sFillList();
}

function callPostProduction(wotc_id)
{
  var result = 0;
  try {
    var params = new Object;
    params.wo_id = _wooper.altId();
    params.usr_id = _user.id();
    params.backflush = true;
    params.fromWOTC = true;
    if(wotc_id != -1)
      params.wotc_id = wotc_id;

    // Post Production not valid for Job Costing itemsites
    var qry = toolbox.executeQuery("SELECT itemsite_costmethod "
                                 + "FROM wo JOIN itemsite ON (itemsite_id=wo_itemsite_id) "
                                 + "WHERE (wo_id=<? value('wo_id') ?>);", params);
    if(qry.first())
    {
      var costmethod = qry.value("itemsite_costmethod");
      if(costmethod == "J")
      {
        return 1;
      }  
    }
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return -1;
    }

    var wnd = toolbox.openWindow("postProduction", 0, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    result = wnd.exec();
  } catch(e) {
    print("postProduction exception @ " + e.lineNumber + ": " + e);
  }
  return result;
}

function callPostOperations(wotc_id)
{
  var result = 0;
  try {
    var params = new Object;
    params.usr_id = _user.id();
    if(wotc_id != -1)
      params.wotc_id = wotc_id;
    params.wooper_id = _wooper.id();
    params.issueComponents = true;
    params.fromWOTC = true;

    var wnd = toolbox.openWindow("postOperations", 0, Qt.NonModal, Qt.Dialog);
    if(toolbox.lastWindow().set(params) != mainwindow.UndefinedError)
      result = wnd.exec();
  } catch (e) {
    print(e.lineNumber + ": " + e);
  }
  return result;
}

function sFillWC()
{
  var params = new Object;
  if (! setParams(params))
    return;

  var q = toolbox.executeQuery("SELECT wrkcnt_descrip, warehous_code "
                             + "FROM xtmfg.wrkcnt, whsinfo "
                             + "WHERE ( (wrkcnt_warehous_id=warehous_id)"
                             + ' AND (wrkcnt_id=<? value("wrkcnt_id") ?>));',
                               params);
  if (q.first())
  {
    _description.text = q.value("wrkcnt_descrip");
    _warehouse.text   = q.value("warehous_code");
  }
  else if (q.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("DatabaseError"),
                       q.lastError().text);
    return;
  }
}

mywindow.setUseAltId(true);
_wrkcnt["newID(int)"].connect(sFillWC);
_wooper["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
