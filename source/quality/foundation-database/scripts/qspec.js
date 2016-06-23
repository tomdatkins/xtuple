debugger;

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
populate_testtype();

_testUoMLit.visible = false;
_targetLit.visible = false;
_upperLevelLit.visible = false;
_lowerLevelLit.visible = false;
_testUoM.visible = false;
_target.visible = false;
_upperLevel.visible = false;
_lowerLevel.visible = false;

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
    _upperLevelLit.visible = true;
    _lowerLevelLit.visible = true;
    _testUoM.visible = true;
    _target.visible = true;
    _upperLevel.visible = true;
    _lowerLevel.visible = true;
  }
  else
  {
    _testUoMLit.visible = false;
    _targetLit.visible = false;
    _upperLevelLit.visible = false;
    _lowerLevelLit.visible = false;
    _testUoM.visible = false;
    _target.visible = false;
    _upperLevel.visible = false;
    _lowerLevel.visible = false;
  }
}

function set(input)
{  
  try {
    var params = new Object();
    if("mode" in input)
      params.mode = input.mode;
    if(params.mode == "new") {
      populate_qspectype();
      populate_testtype();
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
        _testtype.text        = qry.value("testtype");
        _target.value         = qry.value("qspec_target");
        _upperLevel.value     = qry.value("qspec_upper");
        _lowerLevel.value     = qry.value("qspec_lower");
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
     _qspectype.id() <= 0 ||
     _testtype.id() <= 0 )
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
    params.type         = _testtype.text;
    params.target       = _target.value;
    params.upper        = _upperLevel.value;
    params.lower        = _lowerLevel.value;
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
           + ", qspec_type = CASE "
           + "    WHEN <? value('type') ?> = 'Text Comment' THEN 'T' "
           + "    WHEN <? value('type') ?> = 'Numeric Value' THEN 'N' "  
           + "    WHEN <? value('type') ?> = 'Pass/Fail' THEN 'B' "
           + "  ELSE <? value('type') ?> END "
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
           + ",   CASE "
           + "       WHEN <? value('type') ?> = 'Text Comment' THEN 'T' "
           + "       WHEN <? value('type') ?> = 'Numeric Value' THEN 'N' "  
           + "       WHEN <? value('type') ?> = 'Pass/Fail' THEN 'B' "
           + "    ELSE <? value('type') ?> END "
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