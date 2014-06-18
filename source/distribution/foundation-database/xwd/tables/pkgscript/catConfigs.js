/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

include("storedProcErrorLookup");
include("xwdErrors");

// create a script var for each child of mywindow with an objectname starting _
var _new        = mywindow.findChild("_new");
var _edit       = mywindow.findChild("_edit");
var _delete     = mywindow.findChild("_delete");
var _close      = mywindow.findChild("_close");
var _view       = mywindow.findChild("_view");
var _catconfig  = mywindow.findChild("_catconfig");

_catconfig.addColumn(qsTr("Provider"),    -1, Qt.AlignLeft, true, "catconfig_provider");
_catconfig.addColumn(qsTr("Description"), -1, Qt.AlignProvider, true, "catconfig_provider_descrip");

function openCatConfig(params)
{
  try {
    var catConfig = toolbox.openWindow("catConfig", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = catConfig.exec();
    if(result != 0)
      sFillList();

  } catch(e) {
    print("catConfigs open catConfig exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  var params = new Object;
  params.mode = "new";

  openCatConfig(params);
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.catconfig_id = _catconfig.id();

  openCatConfig(params);
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.catconfig_id = _catconfig.id();

  openCatConfig(params);
}

function sDelete()
{
  var params = new Object;
  params.catconfig_id = _catconfig.id();

  var qry = toolbox.executeQuery("DELETE FROM xwd.catconfig WHERE (catconfig_id=<? value('catconfig_id') ?>);", params);
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
  var qry = toolbox.executeQuery("SELECT * "
                                +"FROM xwd.catconfig "
                                +"ORDER BY catconfig_provider;", params);
  _catconfig.populate(qry);
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

if(privileges.check("MaintainCatalogConfig"))
{
  _catconfig.valid.connect(_edit, "setEnabled");
  _catconfig.valid.connect(_delete, "setEnabled");
  _catconfig.itemSelected.connect(_edit, "animateClick");
}
else
{
  _catconfig.itemSelected.connect(_view, "animateClick");
  _new.enabled=false;
}

sFillList();
