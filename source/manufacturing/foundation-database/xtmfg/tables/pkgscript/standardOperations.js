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
var _delete  = mywindow.findChild("_delete");
var _close   = mywindow.findChild("_close");
var _view    = mywindow.findChild("_view");
var _stdopn  = mywindow.findChild("_stdopn");

_stdopn.addColumn(qsTr("Number"),      150, Qt.AlignLeft,  true, "stdopn_number");
_stdopn.addColumn(qsTr("Description"),  -1, Qt.AlignLeft,  true, "descrip");

function sPrint()
{
  var params = new Object;
  toolbox.printReport("StdOperationsMasterList", params);
}

function openLaborRate(params)
{
  try {
    var standardOperation = toolbox.openWindow("standardOperation", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);

    var retval = standardOperation.exec();
    if(retval != 0)
      sFillList(retval);
  } catch(e) {
    print("standardOperations open standardOperation exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  var params = new Object;
  params.mode = "new";

  openLaborRate(params);
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.stdopn_id = _stdopn.id();

  openLaborRate(params);
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.stdopn_id = _stdopn.id();

  openLaborRate(params);
}

function sDelete()
{
  var params = new Object;
  params.stdopn_id = _stdopn.id();

  var qry = toolbox.executeQuery("SELECT booitem_id"
                                +"  FROM xtmfg.booitem"
                                +" WHERE(booitem_stdopn_id=<? value('stdopn_id') ?>)"
                                +" LIMIT 1;", params );
  if(qry.first())
  {
    QMessageBox.information(mywindow,
                       qsTr("Cannot Delete Standard Operation"),
                       qsTr("<p>The selected Standard Operation cannot be "
                          + "deleted as it is referred to by one or more "
                          + "Routing."));
    return;
  }

  qry = toolbox.executeQuery("SELECT wooper_id"
                            +"  FROM xtmfg.wooper"
                            +" WHERE(wooper_stdopn_id=<? value('stdopn_id') ?>)"
                            +" LIMIT 1;", params );
  if(qry.first())
  {
    QMessageBox.information(mywindow,
                       qsTr("Cannot Delete Standard Operation"),
                       qsTr("<p>The selected Standard Operation cannot be deleted "
                          + "as it is currently in use in one or more Work "
                          + "Order Operations. You must remove or close all Work "
                          + "Orders whose Operations use the selected Standard "
                          + "Operation before you may delete it."));
    return;
  }

  qry = toolbox.executeQuery("DELETE FROM xtmfg.stdopn "
                            +" WHERE(stdopn_id=<? value('stdopn_id') ?>);", params );

  sFillList(-1);
}

function sFillList(pStdopnid)
{
  var params = new Object;
  var qry = toolbox.executeDbQuery("standardOperations", "detail", params);
  _stdopn.populate(qry, pStdopnid);
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

_stdopn.valid.connect(_view, "setEnabled");

if(privileges.check("MaintainStandardOperations"))
{
  _stdopn.valid.connect(_edit, "setEnabled");
  _stdopn.valid.connect(_delete, "setEnabled");
  _stdopn.itemSelected.connect(_edit, "animateClick");
}
else
{
  _stdopn.itemSelected.connect(_view, "animateClick");
  _new.enabled=false;
}

sFillList(-1);
