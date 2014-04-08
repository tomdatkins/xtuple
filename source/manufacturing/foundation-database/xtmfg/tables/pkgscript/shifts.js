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

//debugger;

include("storedProcErrorLookup");
include("xtmfgErrors");

// create a script var for each child of mywindow with an objectname starting _
var _close     = mywindow.findChild("_close");
var _print     = mywindow.findChild("_print");
var _new       = mywindow.findChild("_new");
var _edit      = mywindow.findChild("_edit");
var _view      = mywindow.findChild("_view");
var _delete    = mywindow.findChild("_delete");
var _shiftList = mywindow.findChild("_shiftList");

with (_shiftList)
{
  addColumn(qsTr("Shift Number"),-1, Qt.AlignLeft, true, "shift_number");
  addColumn(qsTr("Shift Name"),  -1, Qt.AlignLeft, true, "shift_name");
  addColumn(qsTr("Start Time"),-1, Qt.AlignRight, true, "starttime");
  addColumn(qsTr("End Time"),-1, Qt.AlignRight, true, "endtime");
  addColumn(qsTr("Auto Clockout"),-1, Qt.AlignRight, false, "clockout");
  addColumn(qsTr("Labor Rate Code"),-1, Qt.AlignRight, false, "labor_rate_code");
  addColumn(qsTr("Labor Rate"),-1, Qt.AlignRight, false, "labor_rate");
  addColumn(qsTr("Overtime Hours (Day)"),-1, Qt.AlignRight, false, "ot_day");
  addColumn(qsTr("Overtime Hours (Week)"),-1, Qt.AlignRight, false, "ot_week");
  addColumn(qsTr("Overtime Multiplier"),-1, Qt.AlignRight, false, "ot_multiplier");
  addColumn(qsTr("Overhead Account"),-1, Qt.AlignRight, false, "glaccnt");
  addColumn(qsTr("Active"),-1, Qt.AlignRight, false, "active");
}

function sPrint()
{
  var params = new Object;
  toolbox.printReport("ShiftsMasterList", params);
}

function openShift(params)
{
  try {
    var shift = toolbox.openWindow("shift", 0, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = shift.exec();
    if(result != 0)
      sFillList();
  } catch(e) {
    print("shifts open shift exception @ " + e.lineNumber + ": " + e);
  }
}

function populateMenu(pMenu, pItem, pCol)
{
  if(pMenu == null)
    pMenu = _shiftList.findChild("_menu");

  if(pMenu != null)
  {
    var tmpact = pMenu.addAction(qsTr("Edit..."));
    tmpact.enabled = privileges.check("MaintainShifts");
    tmpact.triggered.connect(sEdit);

    tmpact = pMenu.addAction(qsTr("View..."));
    tmpact.enabled = privileges.check("MaintainShifts") || privileges.check("ViewShifts");
    tmpact.triggered.connect(sView);

    tmpact = pMenu.addAction(qsTr("Delete..."));
    tmpact.enabled = privileges.check("MaintainShifts");
    tmpact.triggered.connect(sDelete);
  }
}

function sNew()
{
  var params = new Object;
  params.mode = "new";

  openShift(params);
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.shift_id = _shiftList.id();

  openShift(params);
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.shift_id = _shiftList.id();

  openShift(params);
}

function sDelete()
{
  var params = new Object;
  params.shift_id = _shiftList.id();

  var qry = toolbox.executeQuery("DELETE FROM shift WHERE shift_id = <? value('shift_id') ?>;", params);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  sFillList();
}

function sFillList()
{
  var params = new Object;
  var qry = toolbox.executeDbQuery("shifts", "detail", params);
  _shiftList.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_print.clicked.connect(sPrint);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_view.clicked.connect(sView);
_delete.clicked.connect(sDelete);
_shiftList["populateMenu(QMenu *, QTreeWidgetItem *, int)"].connect(populateMenu)

_close.clicked.connect(mywindow, "close");

if(privileges.check("MaintainShifts"))
{
  _shiftList.valid.connect(_edit, "setEnabled");
  _shiftList.valid.connect(_delete, "setEnabled");
  _shiftList.itemSelected.connect(_edit, "animateClick");
}
else
{
  _shiftList.itemSelected.connect(_view, "animateClick");
  _new.enabled = false;
  _edit.enabled = false;
  _delete.enabled = false;
}
_shiftList.valid.connect(_view, "setEnabled");

sFillList();
