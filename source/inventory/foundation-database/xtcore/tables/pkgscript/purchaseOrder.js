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
xtCore.purchaseOrder = new Object;

var _vendor       = mywindow.findChild("_vendor");
var _agent        = mywindow.findChild("_agent");

var _layout  = toolbox.widgetGetLayout(_agent);

var _potypeLit = toolbox.createWidget("QLabel", mywindow, "_potypeLit");
_potypeLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
_potypeLit.text = "Purchase Type:";
_layout.addWidget(_potypeLit, 3, 4);

var _potype = toolbox.createWidget("XComboBox", mywindow, "_potype");
_layout.addWidget(_potype, 3, 5);

var _mode = "new";
var _poheadid = -1;
var _potypeid = -1;

var params = new Object;
var qry = toolbox.executeQuery("SELECT potype_id, potype_code"
                             + "  FROM xt.potype ORDER BY potype_code;", params);
_potype.populate(qry);

xtCore.purchaseOrder.save = function()
{
  try {
    if (3 == mywindow.mode()) // view
      return;

    var params = new Object;
    if (1 == mywindow.mode() || -1 == _potypeid)
      params.NewMode = true;
    else if (2 == mywindow.mode())
      params.EditMode = true;
    params.poheadext_id   = mywindow.id();
    if (_potype.id() > 0)
      params.poheadext_potype_id   = _potype.id();
    var qry = toolbox.executeDbQuery("poheadext", "table", params);
    if (qry.lastError().type != 0)
      throw new Error(qry.lastError().text);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
  }
}

xtCore.purchaseOrder.populate = function()
{
  try {
    var params = new Object;
    params.ViewMode = true;
    params.poheadext_id   = mywindow.id();
    var qry = toolbox.executeDbQuery("poheadext", "table", params);
    if (qry.first())
    {
      _potypeid = qry.value("poheadext_potype_id");
      _potype.setId(_potypeid);
    }
    else if (qry.lastError().type != 0)
      throw new Error(qry.lastError().text);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
  }
}

xtCore.purchaseOrder.setdefault = function()
{
  try {
    if (1 != mywindow.mode()) // not new
      return;

    var params = new Object;
    params.ViewMode = true;
    params.vendinfoext_id   = _vendor.id();
    var qry = toolbox.executeDbQuery("vendinfoext", "table", params);
    if (qry.first())
    {
      _potypeid = qry.value("vendinfoext_potype_id");
      _potype.setId(_potypeid);
    }
    else if (qry.lastError().type != 0)
      throw new Error(qry.lastError().text);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
  }
}

_vendor.newId.connect(xtCore.purchaseOrder.setdefault);
mywindow.populated.connect(xtCore.purchaseOrder.populate);
mywindow.saved.connect(xtCore.purchaseOrder.save);

include("storedProcErrorLookup");
include("xtCoreErrors");
