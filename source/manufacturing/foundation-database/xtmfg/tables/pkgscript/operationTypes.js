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
var _new     = mywindow.findChild("_new");
var _edit    = mywindow.findChild("_edit");
var _delete  = mywindow.findChild("_delete");
var _close   = mywindow.findChild("_close");
var _view    = mywindow.findChild("_view");
var _opntype  = mywindow.findChild("_opntype");

_opntype.addColumn(qsTr("Code"),      150, Qt.AlignLeft,  true, "opntype_code");
_opntype.addColumn(qsTr("Description"),  -1, Qt.AlignLeft,  true, "opntype_descrip");
_opntype.addColumn(qsTr("System"),  -1, Qt.AlignLeft,  true, "opntype_sys");

function openOperType(params)
{
  try {
    var operationType = toolbox.openWindow("operationType", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);

    var retval = operationType.exec();
    if(retval != 0)
      sFillList(retval);
  } catch(e) {
    print("operationTypes open operationType exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  var params = new Object;
  params.mode = "new";

  openOperType(params);
}

function sEdit()
{
  var params = new Object;
  if (_opntype.rawValue("opntype_sys"))
    params.mode = "view";
  else
    params.mode = "edit";
  params.opntype_id = _opntype.id();

  openOperType(params);
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.opntype_id = _opntype.id();

  openOperType(params);
}

function sDelete()
{
  if (_opntype.rawValue("opntype_sys"))
  {
    QMessageBox.information(mywindow,
                       qsTr("Cannot Delete Operation Type"),
                       qsTr("<p>The selected Operation Type cannot be "
                          + "deleted as it is a System defined type."));
    return;
  }

  var params = new Object;
  params.opntype_id = _opntype.id();

  var qry = toolbox.executeQuery("SELECT stdopn_opntype_id"
                                +"  FROM xtmfg.stdopn"
                                +" WHERE(stdopn_opntype_id=<? value('opntype_id') ?>)"
                                +" LIMIT 1;", params );
  if(qry.first())
  {
    QMessageBox.information(mywindow,
                       qsTr("Cannot Delete Operation Type"),
                       qsTr("<p>The selected Operation Type cannot be "
                          + "deleted as it is referred to by one or more "
                          + "Standard Operations."));
    return;
  }

  qry = toolbox.executeQuery("SELECT wooper_id"
                            +"  FROM xtmfg.wooper"
                            +" WHERE(wooper_opntype_id=<? value('opntype_id') ?>)"
                            +" LIMIT 1;", params );
  if(qry.first())
  {
    QMessageBox.information(mywindow,
                       qsTr("Cannot Delete Operation Type"),
                       qsTr("<p>The selected Operation Type cannot be deleted "
                          + "as it is currently in use in one or more Work "
                          + "Order Operations."));
    return;
  }

  qry = toolbox.executeQuery("DELETE FROM xtmfg.opntype "
                            +" WHERE(opntype_id=<? value('opntype_id') ?>);", params );

  sFillList(-1);
}

function sFillList(pOpnTypeid)
{
  var params = new Object;
  var qry = toolbox.executeQuery("SELECT * FROM xtmfg.opntype", params);
  _opntype.populate(qry, pOpnTypeid);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_delete.clicked.connect(sDelete);
_view.clicked.connect(sView);

_close.clicked.connect(mywindow, "close");

_opntype.valid.connect(_view, "setEnabled");

if(privileges.check("MaintainStandardOperations"))
{
  _opntype.valid.connect(_edit, "setEnabled");
  _opntype.valid.connect(_delete, "setEnabled");
  _opntype.itemSelected.connect(_edit, "animateClick");
}
else
{
  _opntype.itemSelected.connect(_view, "animateClick");
  _new.enabled=false;
}

sFillList(-1);
