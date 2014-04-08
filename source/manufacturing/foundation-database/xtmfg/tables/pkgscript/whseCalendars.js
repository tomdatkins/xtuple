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

// create a script var for each child of mywindow with an objectname starting _
var _print   = mywindow.findChild("_print");
var _new     = mywindow.findChild("_new");
var _edit    = mywindow.findChild("_edit");
var _delete  = mywindow.findChild("_delete");
var _view    = mywindow.findChild("_view");
var _close   = mywindow.findChild("_close");
var _whsecal = mywindow.findChild("_whsecal");

_whsecal.addColumn(qsTr("Site"),        70, Qt.AlignLeft,  true, "code");
_whsecal.addColumn(qsTr("Description"), -1, Qt.AlignLeft,  true, "whsecal_descrip");

function sPrint()
{
  var params = new Object;
  toolbox.printReport("WarehouseCalendarExceptionsMasterList", params);
}

function openWhseCalendar(params)
{
  try {
    var whseCalendar = toolbox.openWindow("whseCalendar", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);

    var result = whseCalendar.exec();
    if(result > 0)
      sFillList(result);
  } catch(e) {
    print("whseCalendars open whseCalendar exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  var params = new Object;
  params.mode = "new";

  openWhseCalendar(params);
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.whsecal_id = _whsecal.id();

  openWhseCalendar(params);
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.whsecal_id = _whsecal.id();

  openWhseCalendar(params);
}

function sDelete()
{
  var params = new Object;
  params.whsecal_id = _whsecal.id();

  qry = toolbox.executeQuery("DELETE FROM xtmfg.whsecal "
                            +" WHERE(whsecal_id=<? value('whsecal_id') ?>);", params );

  sFillList(-1);
}

function sFillList(nid)
{
  var params = new Object;
  var qry = toolbox.executeDbQuery("whseCalendars", "detail", params);
  _whsecal.populate(qry, nid);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_print.clicked.connect(sPrint);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_delete.clicked.connect(sDelete);
_view.clicked.connect(sView);

_close.clicked.connect(mywindow, "close");

//_whsecal.valid.connect(_view, "setEnabled");

if(privileges.check("MaintainWarehouseCalendarExceptions"))
{
  _whsecal.valid.connect(_edit, "setEnabled");
  _whsecal.valid.connect(_delete, "setEnabled");
  _whsecal.itemSelected.connect(_edit, "animateClick");
}
else
{
  _whsecal.itemSelected.connect(_view, "animateClick");
  _new.enabled=false;
}

sFillList(-1);
