/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
 
//debugger;

var _name  = mywindow.findChild("_name");
var _desc  = mywindow.findChild("_desc");
var _save  = mywindow.findChild("_save");
var _close = mywindow.findChild("_close");
var _id = -1;

function set(input)
{
  if("qspectype_id" in input) {
    _id = input.qspectype_id;
    var params = new Object();
    params.id = _id;
    var qry = toolbox.executeQuery("SELECT qspectype_code, qspectype_descrip "
            + "FROM xt.qspectype WHERE qspectype_id = <? value('id') ?>", params);
    if(qry.first()) {
      _name.text = qry.value("qspectype_code");
      _desc.text = qry.value("qspectype_descrip");
    } else
      QMessageBox.critical(mywindow, "Error", "Could not find Quality Reason Code");
  }
}

function sSave()
{
  if(_name.text == '' || _desc.text == '') {
    QMessageBox.warning(mywindow, "Error", "Please enter a value for Quality Reason Code and Description");
    return;
  }
  
  var params = new Object();
  params.name = _name.text; 
  params.desc = _desc.text;
  if(_id > 0) {
    params.id = _id;
    var qry = toolbox.executeQuery("UPDATE xt.qspectype SET "
         + "qspectype_code = <? value('name') ?>, "
         + "qspectype_descrip = <? value('desc') ?> "
         + "WHERE qspectype_id = <? value('id') ?>", params);
    if (qry.lastError().type != QSqlError.NoError) {
          QMessageBox.critical(mywindow,
                        qsTr("Database Error"), qry.lastError().text);
    }
  } 
  else 
  {
    var qry = toolbox.executeQuery("INSERT INTO xt.qspectype "
         + "(qspectype_code, qspectype_descrip) VALUES "
         + "(<? value('name') ?>, <? value('desc') ?>)", params);
    if (qry.lastError().type != QSqlError.NoError) {
          QMessageBox.critical(mywindow,
                        qsTr("Database Error"), qry.lastError().text);
    }
  } 
  mywindow.close();
}
    
_close.clicked.connect(mywindow.close);
_save.clicked.connect(sSave);