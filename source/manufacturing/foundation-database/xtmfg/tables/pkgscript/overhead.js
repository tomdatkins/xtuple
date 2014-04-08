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

var _close = mywindow.findChild("_close");
var _save = mywindow.findChild("_save");
var _entryCode = mywindow.findChild("_entryCode");
var _entryDesc = mywindow.findChild("_entryDesc");
var _accnt = mywindow.findChild("_accnt");
var _default = mywindow.findChild("_default");

var _mode;
var _newMode = 0;
var _editMode = 1;
var _viewMode = 2;
var _overheadid;

_default.setChecked(false);

_close.clicked.connect(close);
_save.clicked.connect(saveOverhead);

function close()
{
 mywindow.close();
}

function prepare()
{
  _entryCode.clear();
  _entryDesc.clear();
  _accnt.setId(-1);
}

function populate()
{
  if (_mode == _editMode)
  {
   var p = new Object();
   p.overheadid = _overheadid;
   var d=toolbox.executeQuery("SELECT * FROM xtmfg.ovrhead WHERE ovrhead_id = <? value(\"overheadid\") ?>", p);
   if (d.first())
   {
     _entryCode.text = d.value("ovrhead_code");
     _entryDesc.text = d.value("ovrhead_descrip");
     _accnt.setId(d.value("ovrhead_accnt_id"));
     _default.checked = d.value("ovrhead_default");
   }

   _entryCode.setEnabled(false);
  }
}

function set(input)
{

 if ("mode" in input)
 {
  _mode =input.mode;
  if (input.mode == _newMode)
  {
    prepare();
    _entryCode.setFocus()
  }
 }
 if ("overheadid" in input)
 {
   _overheadid = input.overheadid;
   populate();
   _entryDesc.setFocus();
 } 
 return 0;
}

function saveOverhead()
{
// Check required details have been entered 
  if (_entryCode.text == "" || _entryDesc.text == "" || _accnt.id() == -1)
  {
    QMessageBox.warning(mywindow, qsTr("Missing Information"), qsTr("You must enter all details before saving"));
    return 0;
  }
  if (_mode == _newMode)
  {
    var duplicate = toolbox.executeQuery('SELECT true FROM xtmfg.ovrhead WHERE ovrhead_code = <? value("code") ?>', getParams());
  } else {
    var duplicate = toolbox.executeQuery('SELECT true FROM xtmfg.ovrhead WHERE ovrhead_code = <? value("code") ?> AND ovrhead_id !=<? value("id") ?>', getParams());
  }
  if (duplicate.first())
  {
   QMessageBox.warning(mywindow, qsTr("Duplicate Overhead Code"), qsTr("Ovherade Assignment Codes must be unique within a Site"));
   return 0;
  }
  if (_mode == _newMode)
  {
   var sql = 'INSERT INTO xtmfg.ovrhead (ovrhead_code, ovrhead_descrip, ovrhead_accnt_id, ovrhead_default) VALUES(<? value("code") ?>, <? value("desc") ?>, <? value("accnt") ?>, <? value("isdefault") ?>)';
   var d = toolbox.executeQuery(sql, getParams());
  } else {
   var sql = 'UPDATE xtmfg.ovrhead SET ovrhead_descrip =<? value("desc") ?>, ovrhead_accnt_id = <? value("accnt") ?>, ovrhead_default=<? value("isdefault") ?>'
       + ' WHERE ovrhead_id = <? value("id") ?>';
   var d = toolbox.executeQuery(sql, getParams());
  }

// Set the Default indicator if true for this overhead assignment
  if (_default.checked)
  {
    var def = "UPDATE xtmfg.ovrhead SET ovrhead_default=false WHERE ovrhead_code <> <? value(\"code\") ?>; ";
    var deflt = toolbox.executeQuery(def, getParams());
  }

  mainwindow.sSalesOrdersUpdated(-1);
  close();
}

function getParams()
{
  var params = new Object();
  params.code = _entryCode.text;
  params.desc = _entryDesc.text;
  params.accnt = _accnt.id();
  params.isdefault = _default.checked;
  params.id = _overheadid;
 
  return params;
}
