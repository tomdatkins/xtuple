/* This file is part of the xtCore Package for xTuple ERP, and is
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
debugger;

include("xtCore");
xtCore.poType = new Object;

var _close	= mywindow.findChild("_close");
var _delete	= mywindow.findChild("_delete");
var _potype	= mywindow.findChild("_potype");
var _edit	= mywindow.findChild("_edit");
var _new	= mywindow.findChild("_new");
var _print	= mywindow.findChild("_print");

_potype.addColumn(qsTr("Code"), -1, Qt.AlignLeft, true, "potype_code");
_potype.addColumn(qsTr("Active"), -1, Qt.AlignCenter, true, "potype_active");
_potype.addColumn(qsTr("Description"), -1, Qt.AlignLeft, true, "potype_descr");

xtCore.poType.sPrint = function()
{
  toolbox.printReport("PoTypesMasterList", new Object);
}

xtCore.poType.sNew = function()
{
  try {
    var params = new Object;
    params.mode = "new";

    var newdlg = toolbox.openWindow("poType", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() > 0)
      xtCore.poType.sFillList();
  } catch (e) { QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message); }
}

xtCore.poType.sEdit = function()
{
  try {
    var params = new Object;
    params.mode      = "edit";
    params.potype_id = _potype.id();

    var newdlg = toolbox.openWindow("poType", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() > 0)
      xtCore.poType.sFillList();
  } catch (e) { QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message); }
}

xtCore.poType.sDelete = function()
{
  try {
    if (QMessageBox.question(mywindow, qsTr("Delete PO Type?"),
                             qsTr("<p>Are you sure you want to delete this PO Type?"),
                             QMessageBox.Yes, QMessageBox.No) == QMessageBox.No)
      return;

    var params = new Object;
    params.DeleteMode = true;
    params.potype_id = _potype.id();
    var qry = toolbox.executeDbQuery("potype", "table", params);
    if (qry.lastError().type != QSqlError.NoError)
      throw new Error(qry.lastError().text);
    else
      xtCore.poType.sFillList();

  } catch (e) { QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message); }
}

xtCore.poType.sFillList = function()
{
  try {
    var params = new Object;
    params.ViewMode = true;
    var qry = toolbox.executeDbQuery("potype", "table", params);
    _potype.populate(qry);
    if (qry.lastError().type != QSqlError.NoError)
      throw new Error(qry.lastError().text);
  } catch (e) { QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message); }
}

xtCore.poType.sFillList();

_edit.clicked.connect(xtCore.poType.sEdit);
_delete.clicked.connect(xtCore.poType.sDelete);
_print.clicked.connect(xtCore.poType.sPrint);
_close.clicked.connect(mywindow, "close");
_new.clicked.connect(xtCore.poType.sNew);

if(privileges.check("MaintainPurchaseTypes"))
{
  _potype.valid.connect(_edit, "setEnabled");
  _potype.valid.connect(_delete, "setEnabled");
  _potype.itemSelected.connect(_edit, "animateClick");
}
else
{
  _new.enabled=false;
}

include("storedProcErrorLookup");
include("xtCoreErrors");
