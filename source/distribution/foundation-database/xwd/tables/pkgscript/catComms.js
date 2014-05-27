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

try {
  var _new        = mywindow.findChild("_new");
  var _edit       = mywindow.findChild("_edit");
  var _delete     = mywindow.findChild("_delete");
  var _close      = mywindow.findChild("_close");
  var _view       = mywindow.findChild("_view");
  var _catcomm    = mywindow.findChild("_catcomm");

  _catcomm.addColumn(qsTr("Provider"),        XTreeWidget.itemColumn, Qt.AlignLeft,  true, "catcomm_provider");
  _catcomm.addColumn(qsTr("Commodity Code"),  XTreeWidget.itemColumn, Qt.AlignLeft,  true, "catcomm_comm_code");
  _catcomm.addColumn(qsTr("Description"),     -1,                     Qt.AlignLeft,  true, "catcomm_comm_desc");
  _catcomm.addColumn(qsTr("Parent PIK"),      XTreeWidget.itemColumn, Qt.AlignLeft,  false, "catcomm_parent_pik");
  _catcomm.addColumn(qsTr("PIK"),             XTreeWidget.itemColumn, Qt.AlignLeft,  false, "catcomm_pik");

  _new.clicked.connect(sNew);
  _edit.clicked.connect(sEdit);
//  _delete.clicked.connect(sDelete);
  _delete.hide();
  _view.clicked.connect(sView);

  _close.clicked.connect(mywindow, "close");

  if(privileges.check("MaintainCatalogConfig"))
  {
    _catcomm.valid.connect(_edit, "setEnabled");
//    _catcomm.valid.connect(_delete, "setEnabled");
    _catcomm.itemSelected.connect(_edit, "animateClick");
  }
  else
  {
    _catcomm.itemSelected.connect(_view, "animateClick");
    _new.enabled=false;
  }

  sFillList();
} catch (e) {
  QMessageBox.critical(mywindow, "catComms",
                       "catComms.js exception: " + e);
}

function openCatComm(params)
{
  try {
    var catComm = toolbox.openWindow("catComm", mywindow, Qt.WindowModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = catComm.exec();
    if(result != 0)
      sFillList();

  } catch(e) {
    print("catComms open catComm exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  var params = new Object;
  params.mode = "new";

  openCatComm(params);
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.catcomm_id = _catcomm.id();

  openCatComm(params);
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.catcomm_id = _catcomm.id();

  openCatComm(params);
}

function sDelete()
{
  try {
    var params = new Object;
    params.catcomm_id = _catcomm.id();

    var qry = toolbox.executeQuery("DELETE FROM xwd.catcomm WHERE (catcomm_id=<? value('catcomm_id') ?>);", params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }

    sFillList();
  } catch (e) {
    QMessageBox.critical(mywindow, "catComms",
                         "sDelete exception: " + e);
  }
}

function sFillList()
{
  try {
    var params = new Object;
    var qry = toolbox.executeDbQuery("catcomm", "detail", params);
    _catcomm.populate(qry, true);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "catComms",
                         "sFillList exception: " + e);
  }
}
