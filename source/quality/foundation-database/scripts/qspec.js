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

var _code             = mywindow.findChild("_code");
var _desc             = mywindow.findChild("_desc");
var _qspectype        = mywindow.findChild("_qspectype");
var _testtype         = mywindow.findChild("_testtype");
var _targetLit        = mywindow.findChild("_targetLit");
var _target           = mywindow.findChild("_target");
var _upperLevelLit    = mywindow.findChild("_upperLevelLit");
var _upperLevel       = mywindow.findChild("_upperLevel");
var _lowerLevelLit    = mywindow.findChild("_lowerLevelLit");
var _lowerLevel       = mywindow.findChild("_lowerLevel");
var _testUoMLit       = mywindow.findChild("_testUoMLit");
var _testUoM          = mywindow.findChild("_testUoM");
var _testEquip        = mywindow.findChild("_testEquip");
var _instructions     = mywindow.findChild("_instructions");
var _notes            = mywindow.findChild("_notes")
var _cancel           = mywindow.findChild("_cancel");
var _save             = mywindow.findChild("_save");
var _qspec_id         = 0;

populate_qspectype();

_testtype.append(1, 'Text Comment',  'T');
_testtype.append(2, 'Numeric Value', 'N');
_testtype.append(3, 'Pass/Fail',     'B');

_testUoMLit.visible = false;
_targetLit.visible = false;
_upperLevelLit.visible = false;
_lowerLevelLit.visible = false;
_testUoM.visible = false;
_target.visible = false;
_upperLevel.visible = false;
_lowerLevel.visible = false;

_target.setValidator(mainwindow.ratioVal());
_upperLevel.setValidator(mainwindow.ratioVal());
_lowerLevel.setValidator(mainwindow.ratioVal());

function populate_qspectype()
{
  try {
      var qrytxt = "SELECT qspectype_id AS id, qspectype_code AS code "
          + " FROM xt.qspectype ORDER BY id"
      var qry = toolbox.executeQuery(qrytxt);
      _qspectype.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function handleTestType()
{
   _testUoMLit.visible    = (_testtype.code == 'N');
   _targetLit.visible     = (_testtype.code == 'N');
   _upperLevelLit.visible = (_testtype.code == 'N');
   _lowerLevelLit.visible = (_testtype.code == 'N');
   _testUoM.visible       = (_testtype.code == 'N');
   _target.visible        = (_testtype.code == 'N');
   _upperLevel.visible    = (_testtype.code == 'N');
   _lowerLevel.visible    = (_testtype.code == 'N');
}

function set(input)
{  
  try {
    var params = new Object();
    if("mode" in input)
      params.mode = input.mode;
    if(params.mode == "new") {
      populate_qspectype();
    }
    else if(params.mode == "edit")
    {
      if("qspec_id" in input) {
         params.qspec_id = input.qspec_id;
         _qspec_id = input.qspec_id;
      }
      var qry = toolbox.executeDbQuery("qspec", "detail", params);
      if (qry.first()) {
        _code.text            = qry.value("qspec_code");
        _desc.text            = qry.value("qspec_descrip");
        _qspectype.text       = qry.value("qspectype_code");
        _testtype.code        = qry.value("qspec_type");
        _target.text          = qry.value("qspec_target");
        _upperLevel.text      = qry.value("qspec_upper");
        _lowerLevel.text      = qry.value("qspec_lower");
        _testUoM.text         = qry.value("qspec_uom");
        _testEquip.text       = qry.value("qspec_equipment");

        _instructions.setText(qry.value("qspec_instructions"));
        _notes.setText(qry.value("qspec_notes"));
      }
      else if (qry.lastError().type != QSqlError.NoError) 
        throw new Error(qry.lastError().text);
    }
  }
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

function validate()
{
  if(_code.text == '' ||
     !_qspectype.isValid() ||
     !_testtype.isValid() ||
     (_testtype.code == 'N' && !_testUoM.isValid()))
  {
     QMessageBox.warning(mywindow, "Data Missing", "Please fill in all required fields [Code, Spec Type, Test Type].");
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
       
    params.code         = _code.text;
    params.desc         = _desc.text;
    params.qspectype_id = _qspectype.id();
    params.type         = _testtype.code;
    params.target       = _target.text;
    params.upper        = _upperLevel.text;
    params.lower        = _lowerLevel.text;
    params.uom          = _testUoM.text;
    params.equipment    = _testEquip.text;
    params.instructions = _instructions.plainText;
    params.notes        = _notes.plainText;
      
    if (_qspec_id > 0)
    {
      params.qspec_id = _qspec_id;
      var qry = toolbox.executeQuery("UPDATE xt.qspec SET "
           + "  qspec_code            = <? value('code') ?> "
           + ", qspec_descrip         = <? value('desc') ?> "
           + ", qspec_qspectype_id    = <? value('qspectype_id') ?> "
           + ", qspec_type            = <? value('type') ?> "
           + ", qspec_target          = <? value('target') ?> "
           + ", qspec_upper           = <? value('upper') ?> "
           + ", qspec_lower           = <? value('lower') ?> "
           + ", qspec_uom             = <? value('uom') ?> "
           + ", qspec_equipment       = <? value('equipment') ?> "
           + ", qspec_instructions    = <? value('instructions') ?> "
           + ", qspec_notes          = <? value('notes') ?> "   
           + " WHERE qspec_id = <? value('qspec_id') ?>", params);  
      if (qry.lastError().type != QSqlError.NoError)
        throw new Error(qry.lastError().text);
    }
    else 
    {
      var qry = toolbox.executeQuery("INSERT INTO xt.qspec ("
           + "    qspec_code, qspec_descrip, qspec_qspectype_id, "
           + "    qspec_equipment, qspec_type, qspec_target, "
           + "    qspec_upper, qspec_lower, qspec_instructions, qspec_notes ) "
           + " VALUES (<? value('code') ?> "
           + ",   <? value('desc') ?> "
           + ",   <? value('qspectype_id') ?> "
           + ",   <? value('equipment') ?> "
           + ",   <? value('type') ?> "
           + ",   <? value('target') ?> "
           + ",   <? value('upper') ?> "
           + ",   <? value('lower') ?> "
           + ",   <? value('instructions') ?> "
           + ",   <? value('notes') ?> "
           + " ) RETURNING qspec_id", params);  
        if (qry.lastError().type != QSqlError.NoError)
          throw new Error(qry.lastError().text);
      }
    mywindow.close();
  } 
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_testtype['currentIndexChanged(int)'].connect(handleTestType);