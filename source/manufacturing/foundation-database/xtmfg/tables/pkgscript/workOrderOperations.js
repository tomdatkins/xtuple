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

// create a script var for each child of mywindow with an objectname starting _
var _wo       = mywindow.findChild("_wo");
var _wooper   = mywindow.findChild("_wooper");
var _new      = mywindow.findChild("_new");
var _edit     = mywindow.findChild("_edit");
var _view     = mywindow.findChild("_view");
var _delete   = mywindow.findChild("_delete");
var _close    = mywindow.findChild("_close");
var _moveUp   = mywindow.findChild("_moveUp");
var _moveDown = mywindow.findChild("_moveDown");

_wooper.addColumn(qsTr("Seq #"),         -1, Qt.AlignCenter, true, "wooper_seqnumber");
_wooper.addColumn(qsTr("Work Center"),   -1, Qt.AlignLeft,   true, "wrkcnt_code");
_wooper.addColumn(qsTr("Std. Oper."),    -1, Qt.AlignLeft,   true, "stdoperation");
_wooper.addColumn(qsTr("Description"),   -1, Qt.AlignLeft,   true, "wooperdescrip");
_wooper.addColumn(qsTr("Setup Remain."), -1, Qt.AlignRight,  true, "setupremain");
_wooper.addColumn(qsTr("Status"),        -1, Qt.AlignRight,  true, "setupcomplete");
_wooper.addColumn(qsTr("Run Remain."),   -1, Qt.AlignRight,  true, "runremain");
_wooper.addColumn(qsTr("Status"),        -1, Qt.AlignRight,  true, "runcomplete");

function set(params)
{
  if("wo_id" in params)
  {
    _wo.setId(params.wo_id);
    _wooper.setFocus();
  }

  return mainwindow.NoError;
}

function populateMenu(pMenu, pItem, pCol)
{
  if(pMenu == null)
    pMenu = _wooper.findChild("_menu");

  if(pMenu != null)
  {
    var tmpact = pMenu.addAction(qsTr("View Operation..."));
    tmpact.enabled = (privileges.check("ViewWoOperations") || privileges.check("MaintainWoOperations"));
    tmpact.triggered.connect(sViewOperation);

    tmpact = pMenu.addAction(qsTr("Edit Operation..."));
    tmpact.enabled = (privileges.check("MaintainWoOperations"));
    tmpact.triggered.connect(sEditOperation);

    tmpact = pMenu.addAction(qsTr("Delete Operation..."));
    tmpact.enabled = (privileges.check("MaintainWoOperations"));
    tmpact.triggered.connect(sDeleteOperation);
  }
}

function openOperation(params)
{
  try {
    var wnd = toolbox.openWindow("woOperation", mywindow, 0, 1);
    toolbox.lastWindow().set(params);
    wnd.exec();
  } catch(e) {
    print("workOrderOperations open woOperation exception @ " + e.lineNumber + ": " + e);
  }
}

function sNewOperation()
{
  var params = new Object;
  params.mode = "new";
  params.wo_id = _wo.id();

  openOperation(params);
}

function sEditOperation()
{
  var params = new Object;
  params.mode = "edit";
  params.wooper_id = _wooper.id();

  openOperation(params);
}

function sViewOperation()
{
  var params = new Object;
  params.mode = "view";
  params.wooper_id = _wooper.id();

  openOperation(params);
}

function sDeleteOperation()
{
  if (QMessageBox.question(mywindow, qsTr("Delete W/O Operation"),
                         qsTr("<p>If you Delete the selected W/O Operation you "
                            + "will not be able to post Labor to this Operation"
                            + ".<p>Are you sure that you want to delete the "
                            + "selected W/O Operation?"),
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

  sFillList();
}

function sMoveUp()
{
  var params = new Object;
  params.wooper_id = _wooper.id();
  var qry = toolbox.executeQuery("SELECT xtmfg.moveWooperUp(<? value('wooper_id') ?>) AS result;", params);
  if(qry.first())
  {
    var result = qry.value("result");
    if(result < 0)
    {
      QMessageBox.critical(mywindow, qsTr("Could not Move Operation"),
                         storedProcErrorLookup("moveWooperUp", result, xtmfgErrors));
      return;
    }
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }
  mainwindow.sWorkOrderOperationsUpdated(_wo.id(), _wooper.id(), true);
}

function sMoveDown()
{
  var params = new Object;
  params.wooper_id = _wooper.id();
  var qry = toolbox.executeQuery("SELECT xtmfg.moveWooperDown(<? value('wooper_id') ?>) AS result;", params);
  if(qry.first())
  {
    var result = qry.value("result");
    if(result < 0)
    {
      QMessageBox.critical(mywindow, qsTr("Could not Move Operation"),
                         storedProcErrorLookup("moveWooperDown", result, xtmfgErrors));
      return;
    }
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
  mainwindow.sWorkOrderOperationsUpdated(_wo.id(), _wooper.id(), true);
}

function sCatchOperationsUpdated(pWoid, pWooperid, pBool)
{
  if(pWoid == _wo.id())
    sFillList();
}

function sFillList()
{
  var params = new Object;
  params.wo_id = _wo.id();
  params.none = qsTr("None");
  params.complete = qsTr("Complete");
  var qry = toolbox.executeDbQuery("workOrderOperations", "detail", params);
  _wooper.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_wo.newId.connect(sFillList);
_new.clicked.connect(sNewOperation);
_edit.clicked.connect(sEditOperation);
_view.clicked.connect(sViewOperation);
_delete.clicked.connect(sDeleteOperation);
_moveUp.clicked.connect(sMoveUp);
_moveDown.clicked.connect(sMoveDown);
_wooper["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu)

_close.clicked.connect(mywindow, "close");

_wo.type = 14; // cWoExploded(2) | cWoIssued(4) | cWoReleased(8)
InputManager.notify(InputManager.cBCWorkOrder, mywindow, _wo,
                    InputManager.slotName("setId(int)"));
if(privileges.check("MaintainWoOperations"))
{
  _wooper.valid.connect(_edit, "setEnabled");
  _wooper.valid.connect(_delete, "setEnabled");
  _wooper.valid.connect(_moveUp, "setEnabled");
  _wooper.valid.connect(_moveDown, "setEnabled");
  _wooper.itemSelected.connect(_edit, "animateClick");
}
else
{
  _wooper.itemSelected.connect(_view, "animateClick");
  _new.enabled=false;
}

mainwindow.workOrderOperationsUpdated.connect(sCatchOperationsUpdated);
_wo.setFocus();
