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

// create a script var for each child of mywindow with an objectname starting _
var _print   = mywindow.findChild("_print");
var _new     = mywindow.findChild("_new");
var _edit    = mywindow.findChild("_edit");
var _copy    = mywindow.findChild("_copy");
var _delete  = mywindow.findChild("_delete");
var _close   = mywindow.findChild("_close");
var _view    = mywindow.findChild("_view");
var _wrkcnt  = mywindow.findChild("_wrkcnt");

_wrkcnt.addColumn(qsTr("Site"),        -1, Qt.AlignCenter, true, "warehous_code");
_wrkcnt.addColumn(qsTr("Work Cntr."),  -1, Qt.AlignLeft,   true, "wrkcnt_code");
_wrkcnt.addColumn(qsTr("Description"), -1, Qt.AlignLeft,   true, "wrkcnt_descrip");

function sPrint()
{
  var params = new Object;
  toolbox.printReport("WorkCentersMasterList", params);
}

function openWorkCenter(params)
{
  try {
    var workCenter = toolbox.openWindow("workCenter", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);

  } catch(e) {
    print("workCenters open workCenter exception @ " + e.lineNumber + ": " + e);
  }
}

function populateMenu(pMenu, pItem, pCol)
{
  if(pMenu == null)
    pMenu = _wrkcnt.findChild("_menu");

  if(pMenu != null)
  {
    var tmpact = pMenu.addAction(qsTr("Edit Work Center..."));
    tmpact.enabled = (privileges.check("MaintainWorkCenters"));
    tmpact.triggered.connect(sEdit);

    var tmpact = pMenu.addAction(qsTr("View Work Center..."));
    tmpact.enabled = (true);
    tmpact.triggered.connect(sView);

    var tmpact = pMenu.addAction(qsTr("Copy Work Center..."));
    tmpact.enabled = (privileges.check("MaintainWorkCenters"));
    tmpact.triggered.connect(sCopy);

    var tmpact = pMenu.addAction(qsTr("Delete Work Center"));
    tmpact.enabled = (privileges.check("MaintainWorkCenters"));
    tmpact.triggered.connect(sDelete);
  }
}

function sNew()
{
  var params = new Object;
  params.mode = "new";

  openWorkCenter(params);
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.wrkcnt_id = _wrkcnt.id();

  openWorkCenter(params);
}

function sCopy()
{
  var params = new Object;
  params.mode = "copy"
  params.wrkcnt_id = _wrkcnt.id();

  openWorkCenter(params);
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.wrkcnt_id = _wrkcnt.id();

  openWorkCenter(params);
}

function sDelete()
{
  var params = new Object;
  params.wrkcnt_id = _wrkcnt.id();

  var qry = toolbox.executeQuery("SELECT xtmfg.deleteWorkCenter(<? value('wrkcnt_id') ?>) AS result;", params);
  if(qry.first())
  {
    var result = qry.value("result");
    if(result < 0)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Could not Delete Work Center"),
                         storedProcErrorLookup("deleteWorkCenter", result, xtmfgErrors));
      return;
    }
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  sFillList();
}

function sFillList()
{
  var params = new Object;
  var qry = toolbox.executeDbQuery("workCenters", "detail", params);
  _wrkcnt.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_print.clicked.connect(sPrint);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_copy.clicked.connect(sCopy);
_delete.clicked.connect(sDelete);
_view.clicked.connect(sView);
_wrkcnt["populateMenu(QMenu *, QTreeWidgetItem *, int)"].connect(populateMenu)

_close.clicked.connect(mywindow, "close");

_wrkcnt.valid.connect(_view, "setEnabled");

mainwindow.workCentersUpdated.connect(sFillList);

if(privileges.check("MaintainWorkCenters"))
{
  _wrkcnt.valid.connect(_edit, "setEnabled");
  _wrkcnt.valid.connect(_copy, "setEnabled");
  _wrkcnt.valid.connect(_delete, "setEnabled");
  _wrkcnt.itemSelected.connect(_edit, "animateClick");
}
else
{
  _wrkcnt.itemSelected.connect(_view, "animateClick");
  _new.enabled=false;
}

sFillList();
