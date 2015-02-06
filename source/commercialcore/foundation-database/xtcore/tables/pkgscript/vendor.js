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
xtCore.vendor = new Object;

var _default        = mywindow.findChild("_defaultCurrLit");

var _layout  = toolbox.widgetGetLayout(_default);

var _potypeLit = toolbox.createWidget("QLabel", mywindow, "_potypeLit");
_potypeLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
_potypeLit.text = "Purchase Type:";
_layout.addWidget(_potypeLit, 6, 0);

var _potype = toolbox.createWidget("XComboBox", mywindow, "_potype");
_potype.allowNull = true;
_layout.addWidget(_potype, 6, 1);

var _mode = "new";
var _vendid = -1;
var _potypeid = -1;

var params = new Object;
var qry = toolbox.executeQuery("SELECT potype_id, potype_code"
                             + "  FROM xt.potype ORDER BY potype_code;", params);
_potype.populate(qry);

xtCore.vendor.save = function()
{
  try {
    if (3 == mywindow.mode()) // view
      return;

    var params = new Object;
    if (_potype.id() > 0 && (mywindow.mode() == 1 || _potypeid == -1))
      params.NewMode = true;
    else if (_potype.id() > 0 && mywindow.mode() == 2 && _potypeid > 0)
      params.EditMode = true;
    else if (_potype.id() == -1 && _potypeid > 0)
      params.DeleteMode = true;
    else
      params.ViewMode = true;
    params.vendinfoext_id   = mywindow.id();
    if (_potype.id() > 0)
      params.vendinfoext_potype_id   = _potype.id();
    var qry = toolbox.executeDbQuery("vendinfoext", "table", params);
    if (qry.lastError().type != 0)
      throw new Error(qry.lastError().text);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
  }
}

xtCore.vendor.populate = function()
{
  try {
    var params = new Object;
    params.ViewMode = true;
    params.vendinfoext_id   = mywindow.id();
    var qry = toolbox.executeDbQuery("vendinfoext", "table", params);
    if (qry.first())
    {
      _potypeid = qry.value("vendinfoext_potype_id");
      _potype.setId(_potypeid);
    }
    else if (qry.lastError().type != 0)
      throw new Error(qry.lastError().text);

    if (mywindow.mode() == 3) // view
      _potype.enabled = false;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
  }
}

mywindow.populated.connect(xtCore.vendor.populate);
mywindow.saved.connect(xtCore.vendor.save);

include("storedProcErrorLookup");
include("xtCoreErrors");
