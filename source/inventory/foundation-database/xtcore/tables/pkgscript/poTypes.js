/* This file is part of the xtconnect Package for xTuple ERP, and is
 * Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

var _close	= mywindow.findChild("_close");
var _delete	= mywindow.findChild("_delete");
var _potype	= mywindow.findChild("_potype");
var _edit	= mywindow.findChild("_edit");
var _new	= mywindow.findChild("_new");
var _print	= mywindow.findChild("_print");

_edit.clicked.connect(sEdit);
_delete.clicked.connect(sDelete);
_print.clicked.connect(sPrint);
_close.clicked.connect(mywindow, "close");
_new.clicked.connect(sNew);

_potype.addColumn(qsTr("Code"), -1, Qt.AlignLeft, true, "potype_code");
_potype.addColumn(qsTr("Description"), -1, Qt.AlignLeft, true, "potype_descr");

sFillList();

function sPrint()
{
  toolbox.printReport("POTypesMasterList", new Object);
}

function sNew()
{
  try {
    var params = new Object;
    params.mode = "new";

    var newdlg = toolbox.openWindow("poType", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() > 0)
      sFillList();
  } catch (e) { QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message); }
}

function sEdit()
{
  try {
    var params = new Object;
    params.mode          = "edit";
    params.potype_id = _potype.id();

    var newdlg = toolbox.openWindow("poType", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() > 0)
      sFillList();
  } catch (e) { QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message); }
}

function sDelete()
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
      sFillList();

  } catch (e) { QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message); }
}

function sFillList()
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

include("storedProcErrorLookup");
include("xtconnectErrors");
