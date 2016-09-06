/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
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
var _save  = mywindow.findChild("_save");
var _id = -1;

function set(input)
{
  if("qtrlscode_id" in input) {
    _id = input.qtrlscode_id;
    var params = new Object();
    params.id = _id;
    var qry = toolbox.executeQuery("SELECT qtrlscode_code, qtrlscode_descrip "
            + "FROM xt.qtrlscode WHERE qtrlscode_id = <? value('id') ?>", params);
    if(qry.first()) {
      _name.text = qry.value("qtrlscode_code");
      _desc.text = qry.value("qtrlscode_descrip");
    } else
      QMessageBox.critical(mywindow, qsTr("Error"), qsTr("Could not find Quality Reason Code"));
  }
}

function sSave()
{
  if(_name.text == '' || _desc.text == '') {
    QMessageBox.warning(mywindow, qsTr("Error"), qsTr("Please enter a value for Quality Reason Code and Description"));
    return;
  }
  
  var params = new Object();
  params.name = _name.text; 
  params.desc = _desc.text;
  params.id = _id;
  
  if(_id > 0) {
    var sql = "UPDATE xt.qtrlscode SET "
         + "qtrlscode_code = <? value('name') ?>, "
         + "qtrlscode_descrip = <? value('desc') ?> "
         + "WHERE qtrlscode_id = <? value('id') ?>";
  } else {
    var sql = "INSERT INTO xt.qtrlscode "
         + "(qtrlscode_code, qtrlscode_descrip) VALUES "
         + "(<? value('name') ?>, <? value('desc') ?>)";
  }
  
  var qry = toolbox.executeQuery(sql, params);
  xtquality.errorCheck(qry);
  mywindow.close();
}
    
mywindow.findChild("_close").clicked.connect(mywindow.close);
_save.clicked.connect(sSave);