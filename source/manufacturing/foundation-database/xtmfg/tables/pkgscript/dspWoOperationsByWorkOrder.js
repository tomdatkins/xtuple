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

include("storedProcErrorLookup");
include("xtmfgErrors");

var widgets = toolbox.loadUi("dspWoOperationsByWorkOrder", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Work Order Operations By Work Order"));
mywindow.setListLabel(qsTr("Operations"));
mywindow.setReportName("WOOperationsByWorkOrder");
mywindow.setMetaSQLOptions("wooper", "detail");

var _wo     = mywindow.findChild("_wo");
var _wooper = mywindow.list();

_wo.type = WoLineEdit.Exploded | WoLineEdit.Issued | WoLineEdit.Released;

InputManager.notify(InputManager.cBCWorkOrder, mywindow, _wo,
                    InputManager.slotName("setId(int)"));

_wooper.addColumn( qsTr("Seq #"),         XTreeWidget.seqColumn, Qt.AlignCenter,true, "wooper_seqnumber");
_wooper.addColumn( qsTr("Scheduled"),    XTreeWidget.dateColumn, Qt.AlignCenter,true, "scheduled");
_wooper.addColumn( qsTr("Work Center"),  XTreeWidget.itemColumn, Qt.AlignLeft,  true, "wrkcnt_code");
_wooper.addColumn( qsTr("Std. Oper."),   XTreeWidget.itemColumn, Qt.AlignLeft,  true, "stdoper");
_wooper.addColumn( qsTr("Description 1"),                    -1, Qt.AlignLeft,  true, "wooper_descrip1");
_wooper.addColumn( qsTr("Description 2"),                    -2, Qt.AlignLeft,  true, "wooper_descrip2");
_wooper.addColumn( qsTr("Setup Remain."),XTreeWidget.itemColumn, Qt.AlignRight, true, "setup");
_wooper.addColumn( qsTr("Run Remain."),  XTreeWidget.itemColumn, Qt.AlignRight, true, "run");
_wooper.addColumn( qsTr("Qty. Complete"), XTreeWidget.qtyColumn, Qt.AlignRight, true, "wooper_qtyrcv");

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
  params.wo_id       = _wo.id();
  params.any         = qsTr("Any");
  params.complete    = qsTr("Complete");
  params.report_name = "WOOperationsByWorkOrder";

  return true;
}

function sPopulateMenu(pMenu)
{
  var menuItem;

  menuItem = pMenu.addAction(qsTr("View Operation..."));
  menuItem.setEnabled(privileges.check("ViewWoOperations") ||
                      privileges.check("MaintainWoOperations"));
  menuItem.triggered.connect(sViewOperation);

  menuItem = pMenu.addAction(qsTr("Edit Operation..."));
  menuItem.setEnabled(privileges.check("MaintainWoOperations"));
  menuItem.triggered.connect(sEditOperation);

  menuItem = pMenu.addAction(qsTr("Delete Operation..."));
  menuItem.setEnabled(privileges.check("MaintainWoOperations"));
  menuItem.triggered.connect(sDeleteOperation);
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
  if (QMessageBox.critical(mywindow, qsTr("Delete W/O Operation"),
                           qsTr("If you delete the selected W/O Operation you "
                              + "will not be able to post Labor to it for this "
                              + "this W/O. Are you sure that you want to "
                              + "delete the selected W/O Operation?"),
                           QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.Yes)
  {
    var params = new Object;
    params.wooper_id = _wooper.id();
    var qry = toolbox.executeQuery("SELECT xtmfg.deleteWooper(<? value('wooper_id') ?>) AS result;", params);
    if(qry.first())
    {
      var result = qry.value("result");
      if(result < 0)
      {
        QMessageBox.information(mywindow, qsTr("Could not Delete W/O Operation"),
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
}

_wooper["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
