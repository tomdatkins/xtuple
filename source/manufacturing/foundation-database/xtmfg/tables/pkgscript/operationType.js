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

include("xtmfgErrors");

var _code = mywindow.findChild("_code");
var _description = mywindow.findChild("_description");
var _close = mywindow.findChild("_close");
var _save = mywindow.findChild("_save");

var mode;
var _opntype = -1;

_save.setEnabled(false);

set = function (input) {
  if ("mode" in input)
    mode = input.mode;

  if ("opntype_id" in input)
    _opntype = input.opntype_id;

  if (mode == "edit")
    sPopulate();

  if  (mode == "view") {
    sPopulate();
    _code.setEnabled(false);
   _description.setEnabled(false);
 }
}

sPopulate = function () {
  var sel = toolbox.executeQuery("SELECT * FROM xtmfg.opntype WHERE opntype_id=<? value('opntype') ?>", getParams());
  if (sel.first()){
    _code.text = sel.value("opntype_code");
    _description.text = sel.value("opntype_descrip");
  }
  sHandleButtons();
}

getParams = function () {
  var p = new Object;
  if (_opntype != -1)
    p.opntype = _opntype;
  p.code = _code.text;
  p.description = _description.text;

  return p;
}

sSave = function () {
  var sql;
  if (mode == "new") {
    sql = "INSERT INTO xtmfg.opntype (opntype_code, opntype_descrip, opntype_sys) VALUES (<? value('code') ?>, <? value('description') ?>, false);";
  } else if (mode == "edit") {
    sql = "UPDATE xtmfg.opntype SET opntype_code = <? value('code') ?>,, opntype_descrip = <? value('description') ?> WHERE opntype_id = <? value('opntype') ?>";
  } else {
    mydialog.done(QDialog.Rejected); 
  } 

  var data = toolbox.executeQuery(sql, getParams());
  if (xtmfgErrors.errorCheck(data))
    mydialog.done(QDialog.Accepted); 
  else
   mydialog.done(QDialog.Rejected); 
}

sHandleButtons = function () {
  _save.setEnabled(_code.text.length > 0 && _description.text.length > 0);
}

_close.clicked.connect(mywindow.close);
_save.clicked.connect(sSave);
_code["editingFinished()"].connect(sHandleButtons);
_description["editingFinished()"].connect(sHandleButtons);
