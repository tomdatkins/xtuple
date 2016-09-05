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

var _test             = mywindow.findChild("_test");
var _desc             = mywindow.findChild("_desc");
var _qspectype        = mywindow.findChild("_qspectype");
var _testtype         = mywindow.findChild("_testtype");
var _targetLit        = mywindow.findChild("_targetLit");
var _target           = mywindow.findChild("_target");
var _resultLit        = mywindow.findChild("_resultLit");
var _result           = mywindow.findChild("_result");
var _testUoMLit       = mywindow.findChild("_testUoMLit");
var _testUoM          = mywindow.findChild("_testUoM");
var _testEquip        = mywindow.findChild("_testEquip");
var _status           = mywindow.findChild("_status");
var _instructions     = mywindow.findChild("_instructions");
var _notes            = mywindow.findChild("_notes")
var _cancel           = mywindow.findChild("_cancel");
var _save             = mywindow.findChild("_save");
var _qtitem_id        = -1;
var _upper;
var _lower;

populate_qspectype();
populate_testtype();
populate_teststat();

_testUoMLit.visible = false;
_testUoM.visible = false;
_targetLit.visible = false;
_target.visible = false;

function populate_qspectype()
{
  var qrytxt = "SELECT 0 AS id, '' AS code "
          + " UNION SELECT qspectype_id AS id, qspectype_code AS code "
          + " FROM xt.qspectype ORDER BY id"
  var qry = toolbox.executeQuery(qrytxt);
  _qspectype.populate(qry);      
  xtquality.errorCheck(qry);
}

function populate_teststat()
{
  var qrytxt = "SELECT 1 AS id, '" + xtquality.status["O"] + "' AS desc, 'O' AS code "
          + " UNION SELECT 2 AS id, '" + xtquality.status["P"] + "' , 'P' "
          + " UNION SELECT 3 AS id, '" + xtquality.status["F"] + "' , 'F' "
          + " ORDER BY id"
  var qry = toolbox.executeQuery(qrytxt);
  _status.populate(qry);      
  xtquality.errorCheck(qry);  
}

function populate_testtype()
{
  var qrytxt =" SELECT 0 AS id, '' AS testtype, NULL::TEXT AS code "
             + " UNION SELECT 1 AS id, '" + xtquality.testtype["T"] + "' , 'T' "
             + " UNION SELECT 2 AS id, '" + xtquality.testtype["N"] + "' , 'N' "
             + " UNION SELECT 3 AS id, '" + xtquality.testtype["B"] + "' , 'B' "
             + " ORDER BY id;";
  var qry = toolbox.executeQuery(qrytxt);
  _testtype.populate(qry);      
  xtquality.errorCheck(qry);
}

function handleTestType()
{
  if(_testtype.code == 'N')
  {
    _testUoMLit.visible = true;
    _targetLit.visible = true;
    _testUoM.visible = true;
    _target.visible = true;
  }
  else
  {
    _testUoMLit.visible = false;
    _targetLit.visible = false;
    _testUoM.visible = false;
    _target.visible = false;
  }
}

function set(input)
{  
  var params = new Object();
  if("qtitem_id" in input) 
  {
    params.qtitem_id = input.qtitem_id;
    _qtitem_id = input.qtitem_id;
  }
  
  var qry = toolbox.executeDbQuery("qtitem", "detail", params);
  if (qry.first() && xtquality.errorCheck(qry))
  {
    _test.text            = qry.value("qtnumber");
    _test.enabled         = false;
    _desc.text            = qry.value("descrip");
    _desc.enabled         = false;

    _qspectype.setId(qry.value("qspectype_id"));
    _qspectype.enabled    = false;

    _testtype.code        = qry.value("qtitem_type");
    _testtype.enabled     = false;
    if (_testtype.code == "N")
      _result.setValidator(mainwindow.qtyPerVal());

    _target.text          = qry.value("qtitem_target");
    _target.enabled       = false;
    _result.text          = qry.value("qtitem_actual");
    _upper                = qry.value("qtitem_upper");
    _lower                = qry.value("qtitem_lower");
    _status.text          = qry.value("status");
    _testUoM.text         = qry.value("qtitem_uom");
    _testUoM.enabled      = false;
    _testEquip.text       = qry.value("qspec_equipment");
    _testEquip.enabled    = false;
    _instructions.setText(qry.value("qspec_instructions"));
    _instructions.enabled = false;
    _notes.setText(qry.value("qtitem_notes"));

    _testtype['currentIndexChanged(int)'].connect(handleTestType);
    handleTestType();
  }
}

function validate()
{
  if(_status.code != 'O' && _result.text.length == 0) 
  {
    QMessageBox.warning(mywindow, "Data Missing", "Please fill in all required fields [Result].");
    return false;
  }

// Numeric test type where the result falls outside of defined tolerances
  if (_testtype.code == 'N' && (_result.toDouble() > _upper || _result.toDouble() < _lower))
    _status.code = "F";

// Numeric test type where the result falls inside of defined tolerances
  if (_testtype.code == 'N' && (_result.toDouble() <= _upper && _result.toDouble() >= _lower))
    _status.code = "P";

  return true;       
}

function save()
{
  if (!validate())
    return;

  var params = new Object();
  params.result       = _result.text;
  params.status       = _status.code;
  params.notes        = _notes.plainText;
  params.qtitem_id = _qtitem_id;

  var qry = toolbox.executeQuery("UPDATE xt.qtitem SET "
           + "  qtitem_actual         = <? value('result') ?> "
           + ", qtitem_status         = <? value('status') ?> "
           + ", qtitem_notes          = <? value('notes') ?> "   
           + " WHERE qtitem_id = <? value('qtitem_id') ?>", params);  
  if(xtquality.errorCheck(qry))
    mydialog.done(1);
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
