/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
include("xtQuality"); 
//debugger;

var _name  = mywindow.findChild("_name");
var _desc  = mywindow.findChild("_desc");
var _active  = mywindow.findChild("_active");
var _default  = mywindow.findChild("_default");
var _save  = mywindow.findChild("_save");
var _id = -1;

function set(input)
{
  if("qplantype_id" in input) {
    _id = input.qplantype_id;
    var params = new Object();
    params.id = _id;
    var qry = toolbox.executeQuery("SELECT qplantype_code, qplantype_descr, qplantype_active, qplantype_default "
            + "FROM xt.qplantype WHERE qplantype_id = <? value('id') ?>", params);
    if(qry.first()) {
      _name.text = qry.value("qplantype_code");
      _desc.text = qry.value("qplantype_descr");
      _active.checked = qry.value("qplantype_active");
      _default.checked = qry.value("qplantype_default");
    } else
      QMessageBox.critical(mywindow, qsTr("Error"), qsTr("Could not find Quality Plan Type"));
  }
}

function sSave()
{
  if (_name.text == '' || _desc.text == '') {
    QMessageBox.warning(mywindow, qsTr("Error"),
                        qsTr("Please enter a value for Quality Plan Type Code and Description"));
    return;
  }
  
  var params = {
        name:      _name.text,
        desc:      _desc.text,
        active:    _active.checked,
        qtdefault: _default.checked
      },
      qry;
  if(_id > 0) {
    params.id = _id;
    qry = toolbox.executeQuery("UPDATE xt.qplantype"
        + "   SET qplantype_code    = <? value('name') ?>,"
        + "       qplantype_descr   = <? value('desc') ?>,"
        + "       qplantype_active  = <? value('active') ?>,"
        + "       qplantype_default = <? value('qtdefault') ?>"
        + " WHERE qplantype_id = <? value('id') ?>", params);
    if (! xtquality.errorCheck(qry)) return;
  } 
  else 
  {
    qry = toolbox.executeQuery("INSERT INTO xt.qplantype ("
        + "qplantype_code, qplantype_descr, qplantype_active, qplantype_default"
        + ") VALUES ("
        + "<? value('name') ?>, <? value('desc') ?>, <? value('active') ?>, <? value('qtdefault') ?>"
        + ") RETURNING qplantype_id AS id", params);
    if (qry.first() && xtquality.errorCheck(qry))
      _id = qry.value("id");
    else
      return;
  }
  if (_default.checked)
  {
    qry = toolbox.executeQuery("UPDATE xt.qplantype"
                             + "   SET qplantype_default = false"
                             + " WHERE qplantype_id <> <? value('id') ?>",
                               {id: _id});
    if (! xtquality.errorCheck(qry)) return;
  }
  mywindow.close();
}
    
mywindow.findChild("_close").clicked.connect(mywindow.close);
_save.clicked.connect(sSave);
