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

var _buttonBox    = mywindow.findChild("_buttonBox");
var _code         = mywindow.findChild("_code");
var _descr        = mywindow.findChild("_description");
var _active       = mywindow.findChild("_active");
var _emlprofile   = mywindow.findChild("_emlprofile");

var _mode = "new";
var _potypeid = -1;

var params = new Object;
var qry = toolbox.executeQuery("SELECT emlprofile_id, emlprofile_name"
                             + "  FROM xt.emlprofile ORDER BY emlprofile_name;", params);
_emlprofile.populate(qry);

function set(params)
{
  try {
    if ("potype_id" in params)
    {
      _potypeid = params.potype_id;
      xtCore.poType.populate();
    }

    if ("mode" in params)
      _mode = params.mode;

    return 0;
  } catch (e) { print("set() exception: " + e); }
  return 1;
}

xtCore.poType.save = function()
{
  try {
    if (_code.text.length == 0)
    {
      _code.setFocus();
      throw new Error(qsTr("You must enter in a valid code for this PO Type."));
    }

    var params = new Object;
    if ("new" == _mode)
      params.NewMode = true;
    else if ("edit" == _mode)
      params.EditMode = true;
    params.potype_id   = _potypeid;
    params.potype_code = _code.text;
    params.potype_descr  = _descr.text;
    params.potype_active = _active.checked;
    if (_emlprofile.id() > 0)
      params.potype_emlprofile_id = _emlprofile.id();
    else
      params.potype_emlprofile_id = -1;
    var qry = toolbox.executeDbQuery("potype", "table", params);
    if (qry.first())
      _potypeid = qry.value("potype_id");
    else if (qry.lastError().type != 0)
      throw new Error(qry.lastError().text);

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
    return false;
  }
}

xtCore.poType.sSave = function()
{
  var saveval = xtCore.poType.save();
  if (saveval)
    mydialog.done(_potypeid);
}

xtCore.poType.sCheck = function()
{
  try {
    if (_code.text.length > 0)
    {
      var params = new Object;
      params.CheckMode = true;
      params.potype_id = _potypeid;
      params.potype_code = _code.text;
      var qry = toolbox.executeDbQuery("potype", "table", params);
      if (qry.first())
      {
        _potypeid = qry.value("potype_id");
        _mode = "edit";
        xtCore.poType.populate();
      }
      else if (qry.lastError().type != 0)
        throw new Error(qry.lastError().text);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
  }
}

xtCore.poType.populate = function()
{
  try {
    var params = new Object;
    params.ViewMode = true;
    params.potype_id   = _potypeid;
    var qry = toolbox.executeDbQuery("potype", "table", params);
    if (qry.first())
    {
      _code.text          = qry.value("potype_code");
      _descr.text         = qry.value("potype_descr");
      _active.checked     = qry.value("potype_active");
      _emlprofile.setId(qry.value("potype_emlprofile_id"));
    }
    else if (qry.lastError().type != 0)
      throw new Error(qry.lastError().text);

  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
  }
}

_code.editingFinished.connect(xtCore.poType.sCheck);
_buttonBox.accepted.connect(xtCore.poType.sSave);
_buttonBox.rejected.connect(mywindow, "close");

include("storedProcErrorLookup");
include("xtCoreErrors");
