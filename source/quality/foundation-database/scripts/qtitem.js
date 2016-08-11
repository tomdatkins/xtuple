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

var _test             = mywindow.findChild("_test");
var _desc             = mywindow.findChild("_desc");
var _qspectype        = mywindow.findChild("_qspectype");
var _testtype         = mywindow.findChild("_testtype");
var _targetLit        = mywindow.findChild("_targetLit");
var _target           = mywindow.findChild("_target");
var _actualLit        = mywindow.findChild("_actualLit");
var _actual           = mywindow.findChild("_actual");
var _testUoMLit       = mywindow.findChild("_testUoMLit");
var _testUoM          = mywindow.findChild("_testUoM");
var _testEquip        = mywindow.findChild("_testEquip");
var _result           = mywindow.findChild("_result");
var _instructions     = mywindow.findChild("_instructions");
var _notes            = mywindow.findChild("_notes")
var _cancel           = mywindow.findChild("_cancel");
var _save             = mywindow.findChild("_save");
var _qtitem_id        = -1;

populate_qspectype();
populate_testtype();
populate_teststat();

_testUoMLit.visible = false;
_testUoM.visible = false;
_targetLit.visible = false;
_target.visible = false;
_actualLit.visible = false;
_actual.visible = false;

function populate_qspectype()
{
  try {
      var qrytxt = "SELECT 0 AS id, '' AS code "
          + " UNION SELECT qspectype_id AS id, qspectype_code AS code "
          + " FROM xt.qspectype ORDER BY id"
      var qry = toolbox.executeQuery(qrytxt);
      _qspectype.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_teststat()
{
  try {
      var qrytxt = "SELECT 1 AS id, 'Open' AS code "
          + " UNION SELECT 2 AS id, 'Pass' AS code "
          + " UNION SELECT 3 AS id, 'Fail' AS code "
          + " ORDER BY id"
      var qry = toolbox.executeQuery(qrytxt);
      _result.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_testtype()
{
  try {
      var qrytxt =" SELECT 0 AS id, '' AS testtype "
                + " UNION SELECT 1 AS id, 'Text Comment' AS testtype "
                + " UNION SELECT 2 AS id, 'Numeric Value' AS testtype "
                + " UNION SELECT 3 AS id, 'Pass/Fail' AS testype ORDER BY id"
      var qry = toolbox.executeQuery(qrytxt);
      _testtype.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function handleTestType()
{
  if(_testtype.id() == 2)
  {
    _testUoMLit.visible = true;
    _targetLit.visible = true;
    _actualLit.visible = true;
    _actual.visible = true;
    _testUoM.visible = true;
    _target.visible = true;
  }
  else
  {
    _testUoMLit.visible = false;
    _targetLit.visible = false;
    _actualLit.visible = false;
    _actual.visible = false;
    _testUoM.visible = false;
    _target.visible = false;
  }
}

function set(input)
{  
  try {
    var params = new Object();
    if("qtitem_id" in input) {
      params.qtitem_id = input.qtitem_id;
      _qtitem_id = input.qtitem_id;
    }
    var qry = toolbox.executeDbQuery("qtitem", "detail", params);
    if (qry.first()) {
        _test.text            = qry.value("qtnumber");
        _test.enabled         = false;
        _desc.text            = qry.value("descrip");
        _desc.enabled         = false;
        _qspectype.text       = qry.value("qspectype_code");
        _qspectype.enabled    = false;
        _testtype.text        = qry.value("testtype");
        _testtype.enabled     = false;
        _target.value         = qry.value("qtitem_target");
        _target.enabled       = false;
        _actual.value         = qry.value("qtitem_actual");
        _result.text          = qry.value("status");
        _testUoM.text         = qry.value("qtitem_uom");
        _testUoM.enabled      = false;
        _testEquip.text       = qry.value("qspec_equipment");
        _testEquip.enabled    = false;
        _instructions.setText(qry.value("qspec_instructions"));
        _instructions.enabled = false;
        _notes.setText(qry.value("qtitem_notes"));
    }
      else if (qry.lastError().type != QSqlError.NoError) 
        throw new Error(qry.lastError().text);
  }
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

function validate()
{
  if(_testtype.text == 'Numeric Value' && _actual.value == 0) {
    QMessageBox.warning(mywindow, "Data Missing", "Please fill in all required fields [Actual, Result, Notes].");
    return false;
  }
  if(
     _result.id() <= 0 ||
     _notes.text == '' )
  {
     QMessageBox.warning(mywindow, "Data Missing", "Please fill in all required fields [Result, Notes].");
     return false;
  }
  else
  {
     return true;       
  }
}

function save()
{
  try {
    if (!validate()) {
      return;
    }
    var params = new Object();
       
    params.actual       = _actual.text;
    params.result       = _result.text;
    params.notes        = _notes.plainText;
      
    params.qtitem_id = _qtitem_id;
    var qry = toolbox.executeQuery("UPDATE xt.qtitem SET "
           + "  qtitem_actual         = <? value('actual') ?> "
           + ", qtitem_status         = CASE "
           + "    WHEN <? value('result') ?> = 'Open' THEN 'O' "
           + "    WHEN <? value('result') ?> = 'Pass' THEN 'P' "
           + "    WHEN <? value('result') ?> = 'Fail' THEN 'F' "
           + "  ELSE <? value('result') ?> END "
           + ", qtitem_notes          = <? value('notes') ?> "   
           + " WHERE qtitem_id = <? value('qtitem_id') ?>", params);  
    if (qry.lastError().type != QSqlError.NoError)
      throw new Error(qry.lastError().text);
    mywindow.close();
  } 
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_testtype['currentIndexChanged(int)'].connect(handleTestType);