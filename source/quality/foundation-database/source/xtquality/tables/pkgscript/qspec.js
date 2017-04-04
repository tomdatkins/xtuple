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

var _code             = mywindow.findChild("_code");
var _desc             = mywindow.findChild("_desc");
var _active           = mywindow.findChild("_active")
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

_testtype.append(1, xtquality.testtype['T'], 'T');
_testtype.append(2, xtquality.testtype['N'], 'N');
_testtype.append(3, xtquality.testtype['B'], 'B');

_testUoMLit.visible = false;
_targetLit.visible = false;
_upperLevelLit.visible = false;
_lowerLevelLit.visible = false;
_testUoM.visible = false;
_target.visible = false;
_upperLevel.visible = false;
_lowerLevel.visible = false;

_target.setValidator(mainwindow.qtyPerVal());
_upperLevel.setValidator(mainwindow.qtyPerVal());
_lowerLevel.setValidator(mainwindow.qtyPerVal());

function populate_qspectype()
{
  var qrytxt = "SELECT qspectype_id AS id, qspectype_code AS code "
          + " FROM xt.qspectype ORDER BY id"
  var qry = toolbox.executeQuery(qrytxt);
  if (xtquality.errorCheck(qry))
    _qspectype.populate(qry);      
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
  var params = new Object();
  if("mode" in input)
    params.mode = input.mode;
  if(params.mode == "new")
    populate_qspectype();
  else if(params.mode == "edit")
  {
    if("qspec_id" in input) 
    {
       params.qspec_id = input.qspec_id;
       _qspec_id = input.qspec_id;
    }
    var qry = toolbox.executeDbQuery("qspec", "detail", params);
    xtquality.errorCheck(qry);
    if (qry.first()) {
      _code.text            = qry.value("qspec_code");
      _desc.text            = qry.value("qspec_descrip");
      _active.checked       = qry.value("qspec_active");
      _qspectype.text       = qry.value("qspectype_code");
      _testtype.code        = qry.value("qspec_type");
      _testUoM.text         = qry.value("qspec_uom");
      _testEquip.text       = qry.value("qspec_equipment");
      _target.setDouble(qry.value("qspec_target"));
      _upperLevel.setDouble(qry.value("qspec_upper"));
      _lowerLevel.setDouble(qry.value("qspec_lower"));

      _instructions.setText(qry.value("qspec_instructions"));
      _notes.setText(qry.value("qspec_notes"));
    }
  }
}

function validate()
{
  if(_code.text == '' ||
     !_qspectype.isValid() ||
     !_testtype.isValid() ||
     (_testtype.code == 'N' && !_testUoM.isValid()))
  {
     QMessageBox.warning(mywindow, qsTr("Data Missing"), qsTr("Please fill in all required fields [Code, Spec Type, Test Type]."));
     return false;
  }
  if (_testtype.code == 'N' && (_upperLevel.toDouble() < _target.toDouble()))
  {
     QMessageBox.warning(mywindow, qsTr("Test Tolerances"), qsTr("Upper tolerance level must be greater than or equal to the Target"));
     return false;
  }
  if (_testtype.code == 'N' && (_lowerLevel.toDouble() > _target.toDouble()))
  {
     QMessageBox.warning(mywindow, qsTr("Test Tolerances"), qsTr("Lower tolerance level must be lower than or equal to the Target"));
     return false;
  }

  return true;       
}

function save()
{
  if (!validate())
    return;

  var params = new Object();
       
  params.code         = _code.text;
  params.desc         = _desc.text;
  params.qspectype_id = _qspectype.id();
  params.active       = _active.checked;
  params.type         = _testtype.code;
  params.target       = _target.toDouble();
  params.upper        = _upperLevel.toDouble();
  params.lower        = _lowerLevel.toDouble();
  params.uom          = _testUoM.text;
  params.equipment    = _testEquip.text;
  params.instructions = _instructions.plainText;
  params.notes        = _notes.plainText;
      
  if (_qspec_id > 0)
  {
    params.qspec_id = _qspec_id;
    var _sql = "UPDATE xt.qspec SET "
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
         + ", qspec_notes           = <? value('notes') ?> "   
         + ", qspec_active          = <? value('active') ?> "
         + " WHERE qspec_id = <? value('qspec_id') ?>";  
  }
  else 
  {
    var _sql = "INSERT INTO xt.qspec ("
         + "    qspec_code, qspec_descrip, qspec_qspectype_id, "
         + "    qspec_equipment, qspec_type, qspec_target, "
         + "    qspec_upper, qspec_lower, qspec_instructions, qspec_notes "
         + "    ,qspec_active ) "
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
         + ",   <? value('active') ?> "
         + " ) RETURNING qspec_id";  
  }
  var qry = toolbox.executeQuery(_sql, params);
  if (qry.first() && xtquality.errorCheck(qry))
    mydialog.done(1);
  else
    mydialog.done(-1);
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_testtype['currentIndexChanged(int)'].connect(handleTestType);