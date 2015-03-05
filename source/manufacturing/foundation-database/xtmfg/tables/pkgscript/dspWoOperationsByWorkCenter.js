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

var widgets = toolbox.loadUi("dspWoOperationsByWorkCenter", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Work Order Operations By Work Center"));
mywindow.setListLabel(qsTr("Operations"));
mywindow.setReportName("WOOperationsByWorkCenter");
mywindow.setMetaSQLOptions("wooper", "detail");

_dates       = mywindow.findChild("_dates");
_description = mywindow.findChild("_description");
_loadOnly    = mywindow.findChild("_loadOnly");
_warehouse   = mywindow.findChild("_warehouse");
_wrkcnt      = mywindow.findChild("_wrkcnt");
_wooper      = mywindow.list();

_dates.setStartNull(qsTr("Earliest"), mainwindow.startOfTime(), true);
_dates.setEndNull(qsTr("Latest"),     mainwindow.endOfTime(),   true);

_wrkcnt.populate("SELECT wrkcnt_id, wrkcnt_code, wrkcnt_code "
                + "FROM xtmfg.wrkcnt "
                + "ORDER BY wrkcnt_code;" );
sGetWrkCntInfo()

_wooper.addColumn(qsTr("Source"),      XTreeWidget.orderColumn, Qt.AlignLeft,  true, "source");
_wooper.addColumn(qsTr("W/O #"),       XTreeWidget.orderColumn, Qt.AlignLeft,  true, "wonumber");
_wooper.addColumn(qsTr("Status"),        XTreeWidget.seqColumn, Qt.AlignCenter,true, "wo_status");
_wooper.addColumn(qsTr("Due Date"),     XTreeWidget.dateColumn, Qt.AlignCenter,true, "scheduled");
_wooper.addColumn(qsTr("Item Number"),  XTreeWidget.itemColumn, Qt.AlignLeft,  true, "item_number");
_wooper.addColumn(qsTr("Seq #"),         XTreeWidget.seqColumn, Qt.AlignCenter,true, "wooper_seqnumber");
_wooper.addColumn(qsTr("Std. Oper."),   XTreeWidget.itemColumn, Qt.AlignLeft,  true, "stdoper");
_wooper.addColumn(qsTr("Description"),                      -1, Qt.AlignLeft,  true, "wooper_descrip1");
_wooper.addColumn(qsTr("Description"),                      -1, Qt.AlignLeft,  true, "wooper_descrip2");
_wooper.addColumn(qsTr("Setup Remain."),XTreeWidget.itemColumn, Qt.AlignRight, true, "setup");
_wooper.addColumn(qsTr("Run Remain."),  XTreeWidget.itemColumn, Qt.AlignRight, true, "run");
_wooper.addColumn(qsTr("Qty. Remain."),  XTreeWidget.qtyColumn, Qt.AlignRight, true, "qtyremain");

if (preferences.boolean("XCheckBox/forgetful"))
  _loadOnly.setChecked(true);

function set(pParams)
{
  if ("wrkcnt_id" in pParams)
    _wrkcnt.setId(pParams.wrkcnt_id)

  if ("startDate" in pParams)
    _dates.setStartDate(pParams.startDate);

  if ("endDate" in pParams)
    _dates.setEndDate(pParams.endDate);

  _loadOnly.setChecked("loadOnly" in pParams);

  if ("run" in pParams)
  {
    mywindow.sFillList();
    return mainwindow.NoError_Run;
  }

  return mainwindow.NoError;
}

function setParams(params)
{
  if (! _dates.allValid())
  {
    QMessageBox.warning( mywindow, qsTr("Incomplete query request"),
                       qsTr("<p>Please enter start and end dates."));
    _dates.setFocus();
    return false;
  }

  params.wrkcnt_id = _wrkcnt.id();
  params.startDate = _dates.startDate;
  params.endDate   = _dates.endDate;

  if(_loadOnly.checked)
    params.loadOnly = true;

  params.complete    = qsTr("Complete");
  params.mrp         = qsTr("MRP");
  params.mps         = qsTr("MPS");
  params.so          = qsTr("SO");
  params.wo          = qsTr("WO");
  params.manual      = qsTr("Manual");
  params.report_name = "WOOperationsByWorkCenter";

  return true;
}

function sPopulateMenu(pMenu, selected)
{
try {
  var status = selected.rawValue("wo_status");
  var menuItem;
  var multi = (_wooper.selectedItems().length > 1);

  menuItem = pMenu.addAction(qsTr("View Operation..."));
  menuItem.enabled = ! multi && (privileges.check("ViewWoOperations") ||
                                 privileges.check("MaintainWoOperations"));
  menuItem.triggered.connect(sViewOperation);

  if ( (status == "E") || (status == "I") || (status == "R") )
  {
    menuItem = pMenu.addAction(qsTr("Edit Operation..."));
    menuItem.enabled = ! multi && privileges.check("MaintainWoOperations");
    menuItem.triggered.connect(sEditOperation);

    menuItem = pMenu.addAction(qsTr("Delete Operation..."));
    menuItem.enabled = ! multi && privileges.check("MaintainWoOperations");
    menuItem.triggered.connect(sDeleteOperation);

    pMenu.addSeparator();

    menuItem = pMenu.addAction(qsTr("Print Pick List(s)..."));
    menuItem.enabled = privileges.check("PrintWorkOrderPaperWork");
    menuItem.triggered.connect(sPrintPickLists);

    pMenu.addSeparator();

    menuItem = pMenu.addAction(qsTr("Post Production..."));
    menuItem.enabled = (! multi && privileges.check("PostProduction"));
    menuItem.triggered.connect(sPostProduction);

    menuItem = pMenu.addAction(qsTr("Post Operations..."));
    menuItem.enabled = (! multi && privileges.check("PostWoOperations"));
    menuItem.triggered.connect(sPostOperations);

    pMenu.addSeparator();
  }

  menuItem = pMenu.addAction(qsTr("Running Availability..."));
  menuItem.enabled = (! multi && privileges.check("ViewInventoryAvailability"));
  menuItem.triggered.connect(sRunningAvailability);

  menuItem = pMenu.addAction(qsTr("MPS Detail..."));
  menuItem.enabled = (! multi && privileges.check("ViewMPS"));
  menuItem.triggered.connect(sMPSDetail);
}
catch (e) { QMessageBox(mywindow, qsTr("Processing Error"), e.message()); }
}

function sViewOperation()
{
  var params = new Object;
  params.mode = "view";
  params.wooper_id = _wooper.id();

  var newdlg = toolbox.openWindow("woOperation", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
}

function sEditOperation()
{
  var params = new Object;
  params.mode = "edit";
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
                           qsTr("<p>If you Delete the selected W/O Operation "
                              + "you will not be able to post Labor to this "
                              + "Operation.<p>Are you sure that you want to "
                              + "delete the selected W/O Operation?"),
                             QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
    return;

  var params = new Object;
  params.wooper_id = _wooper.id();

  var qry = toolbox.executeQuery("SELECT xtmfg.deleteWooper(<? value('wooper_id') ?>) AS result;", params);
  if(qry.first())
  {
    var result = qry.value("result");
    if(result < 0)
    {
      QMessageBox.critical(mywindow, qsTr("Could not Delete W/O Operation"),
                         storedProcErrorLookup("deleteWooper", result, xtmfgErrors));
      return;
    }
    else
      mainwindow.sWorkOrderOperationsUpdated(_wo.id(), _wooper.id(), true);
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  mywindow.sFillList();
}

function sRunningAvailability()
{
  var params = new Object;
  params.wo_id = _wooper.altId();

  var qry = toolbox.executeQuery("SELECT wo_itemsite_id"
                               + "  FROM wo"
                               + ' WHERE (wo_id=<? value("wo_id") ?>);',
                               params);
  if(qry.first())
  {
    var params = new Object;
    params.itemsite_id = qry.value("wo_itemsite_id");

    var newdlg = toolbox.openWindow("dspRunningAvailability", 0,
                                    Qt.NonModal, Qt.Window);
    newdlg.set(params);
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), q.lastError().text);
    return;
  }
}

function sMPSDetail()
{
  var params = new Object;
  params.wo_id = _wooper.altId();

  var qry = toolbox.executeQuery("SELECT wo_itemsite_id"
                               + "  FROM wo"
                               + ' WHERE (wo_id=<? value("wo_id") ?>);',
                                 params);
  if (qry.first())
  {
    var params = new Object;
    params.itemsite_id = qry.value("wo_itemsite_id");

    var newdlg = toolbox.openWindow("dspMPSDetail", 0, Qt.NonModal, Qt.Window);
    newdlg.set(params);
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }
}

function sGetWrkCntInfo()
{
  var params = new Object;
  params.wrkcnt_id = _wrkcnt.id();
  var qry = toolbox.executeQuery("SELECT wrkcnt_descrip, warehous_code "
                               + "FROM xtmfg.wrkcnt, whsinfo "
                               + "WHERE ((wrkcnt_warehous_id=warehous_id)"
                               + '  AND (wrkcnt_id=<? value("wrkcnt_id") ?>));',
                               params);
  if (qry.first())
  {
    _description.text = qry.value("wrkcnt_descrip");
    _warehouse.text   = qry.value("warehous_code");
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }
}

function sPostProduction()
{
  var params = new Object;
  params.wo_id = _wooper.altId();

  var newdlg = toolbox.openWindow("postProduction", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sPostOperations()
{
  var params = new Object;
  params.wo_id = _wooper.altId();

  var newdlg = toolbox.openWindow("postOperations", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  if(toolbox.lastWindow().set(params) != mainwindow.UndefinedError)
    newdlg.exec();
}

function sPrintPickLists()
{
  var printer = new QPrinter(QPrinter.HighResolution);
  var userCanceled = false;

  if (orReport.beginMultiPrint(printer, userCanceled) == false)
  {
    if (!userCanceled)
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           qsTr("Could not initialize printing system for "
                              + "multiple reports."));
    return;
  }

  var selected = _wooper.selectedItems();
  for (var i = 0; i < selected.length; i++)
  {
    var params = new Object;
    params.wo_id = selected[i].altId();

    var report = new orReport("PickList", params);
    if (! report.isValid() || ! report.print(printer, (i == 0)))
    {
      report.reportError(mywindow);
      break;
    }
  }
  orReport.endMultiPrint(printer);
}

_wooper["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_wrkcnt["newID(int)"].connect(sGetWrkCntInfo);
mywindow.setUseAltId(true);
