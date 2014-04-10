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

//debugger;

var _mode = "new";
var _shiftid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _save   = mywindow.findChild("_save");
var _close  = mywindow.findChild("_close");
var _number = mywindow.findChild("_number");
var _name   = mywindow.findChild("_name");
var _active = mywindow.findChild("_active");
var _shstart = mywindow.findChild("_shstart");
var _shstartround1 = mywindow.findChild("_shstartround1");
var _shstartround2 = mywindow.findChild("_shstartround2");
var _shend = mywindow.findChild("_shend");
var _shendround1 = mywindow.findChild("_shendround1");
var _shendround2 = mywindow.findChild("_shendround2");
var _shclockout = mywindow.findChild("_shclockout");
var _br1start = mywindow.findChild("_br1start");
var _br1end = mywindow.findChild("_br1end");
var _br1paid = mywindow.findChild("_br1paid");
var _br2start = mywindow.findChild("_br2start");
var _br2end = mywindow.findChild("_br2end");
var _br2paid = mywindow.findChild("_br2paid");
var _lnchstart = mywindow.findChild("_lnchstart");
var _lnchend = mywindow.findChild("_lnchend");
var _lnchpaid = mywindow.findChild("_lnchpaid");
var _laborrate = mywindow.findChild("_laborrate");
var _otdaily = mywindow.findChild("_otdaily");
var _otweekly = mywindow.findChild("_otweekly");
var _otmultiplier = mywindow.findChild("_otmultiplier");
var _ohglaccnt = mywindow.findChild("_ohglaccnt");

// Set Validation on screen widgets
_otdaily.setValidator(mainwindow.runTimeVal());
_otweekly.setValidator(mainwindow.runTimeVal());
_otmultiplier.setValidator(mainwindow.runTimeVal());

// Hide Daily Overtime as not using (yet)
_otdaily.setVisible(false);
mywindow.findChild("_otdailyLit").setVisible(false);

// Set Default Values
_laborrate.populate("SELECT lbrrate_id, lbrrate_code FROM xtmfg.lbrrate");
_ohglaccnt.setType(0x04);
_shstartround1.text = "0";
_shstartround2.text = "0";
_shendround1.text = "0";
_shendround2.text = "0";
_otdaily.text = "8";
_otweekly.text = "40";

function set(params)
{
  if("shift_id" in params)
  {
    _shiftid = params.shift_id;
    populate();
  }

  if("mode" in params)
  {
    if (params.mode == "new")
    {
      _mode = "new";
      _number.setFocus();
      var qry = toolbox.executeQuery("SELECT NEXTVAL('shift_shift_id_seq') AS shift_id;");
      if (qry.first())
        _shiftid =  qry.value("shift_id");
      else
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return mainwindow.UndefinedError;
      }
    }
    else if (params.mode == "edit")
    {
      _mode = "edit";
      _name.setFocus();
    }
    else if (params.mode == "view")
    {
      _mode = "view";

      _number.enabled = false;
      _name.enabled = false;
      _close.text = qsTr("&Close");
      _active.enabled = false;
      _save.hide();

      _close.setFocus();
    }
  }

  return mainwindow.NoError;
}

function sSave()
{
  if (_number.text.length == 0)
  {
    QMessageBox.critical(mywindow, qsTr("Cannot Save Shift"),
                       qsTr("You must enter a Shift Number"));
    _number.setFocus();
    return;
  }

  if (_name.text.length == 0)
  {
    QMessageBox.critical(mywindow, qsTr("Cannot Save Shift"),
                       qsTr("You must enter a Shift Name"));
    _name.setFocus();
    return;
  }

  if (checkFields() == false)
  {
    _name.setFocus();
    return;
  }

  var params2 = new Object;
  params2.shift_id = _shiftid;
  params2.shift_number = _number.text.toUpperCase();
  var qry2 = toolbox.executeQuery("SELECT shift_id "
                                 +"  FROM shift "
                                 +" WHERE((shift_id != <? value('shift_id') ?>)"
                                 +"   AND (UPPER(shift_number)=UPPER(<? value('shift_number') ?>)) );", params2);
  if(qry2.first())
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Create Shift"),
                       qsTr("A Shift with the entered number already exists. You may not create a Shift with the number."));
    _number.setFocus();
    return;
  }
  else if (qry2.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry2.lastError().text);
    return;
  }

  var q_str = "";
  if (_mode == "new")
  {
    q_str = "INSERT INTO shift"
           +"      (shift_id, shift_number, shift_name ) "
           +"VALUES(<? value('shift_id') ?>, <? value('shift_number') ?>, <? value('shift_name') ?> );";
  }
  else if (_mode == "edit")
  {
    q_str = "UPDATE shift"
           +"   SET shift_number=<? value('shift_number') ?>,"
           +"       shift_name=<? value('shift_name') ?>"
           +" WHERE(shift_id=<? value('shift_id') ?>);";
  }

  var params = new Object;
  params.shift_id = _shiftid;
  params.shift_number = _number.text.toUpperCase();
  params.shift_name = _name.text;

  var qry = toolbox.executeQuery(q_str, params);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

// Time and Attendance Shift Parameters
  if (_mode == "new")
  {
    var ta = toolbox.executeDbQuery("timeattend","insertshift", getParams());
  } 
  else if (_mode == "edit")
  {
    var ta = toolbox.executeDbQuery("timeattend","updateshift", getParams());
  }
  if (ta.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), ta.lastError().text);
    return;
  }

  mydialog.accept();
}

function populate()
{
  var params = new Object;
  params.shift_id = _shiftid;
  var qry = toolbox.executeQuery("SELECT shift_number, shift_name "
                                +"FROM shift "
                                +"WHERE (shift_id=<? value('shift_id') ?>);", params);
  if(qry.first())
  {
    _number.text = qry.value("shift_number");
    _name.text = qry.value("shift_name");
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  var ta = toolbox.executeQuery("SELECT * FROM xtmfg.tashift WHERE (tashift_shift_id=<? value('shift_id') ?>);", params);
  if(ta.first())
  {
// Populate Time & Attendance fields
    _active.checked = ta.value("tashift_active");
    _shstart.time = ta.value("tashift_starttime");
    _shstartround1.text = ta.value("tashift_rndbeforestart");
    _shstartround2.text = ta.value("tashift_rndafterstart");
    _shend.time = ta.value("tashift_endtime");
    _shendround1.text = ta.value("tashift_rndbeforeend");
    _shendround2.text = ta.value("tashift_rndafterend");
    _shclockout.time = ta.value("tashift_default_clockout");
    _br1start.time = ta.value("tashift_firstbreakstart");
    _br1end.time = ta.value("tashift_firstbreakend");
    _br1paid.checked = ta.value("tashift_firstbreakpaid");
    _br2start.time = ta.value("tashift_scndbreakstart");
    _br2end.time = ta.value("tashift_scndbreakend");
    _br2paid.checked = ta.value("tashift_scndbreakpaid");
    _lnchstart.time = ta.value("tashift_lnchbreakstart");
    _lnchend.time = ta.value("tashift_lnchbreakend");
    _lnchpaid.checked = ta.value("tashift_lnchbreakpaid");
    _laborrate.setId(ta.value("tashift_labor_rate"));
    _otdaily.text = ta.value("tashift_overtimehours_day");
    _otweekly.text = ta.value("tashift_overtimehours_week");
    _otmultiplier.text = ta.value("tashift_overtimemultiplier");
    _ohglaccnt.setId(ta.value("tashift_overhead_accnt_id"));
  } 
  else if (ta.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), ta.lastError().text);
    return;
  }
}

function getParams()
{
  var param = new Object();

  param.shiftid = _shiftid;
  param.active = _active.checked;
  param.shstart = _shstart.text;
  param.shstartround1 = _shstartround1.text;
  param.shstartround2 = _shstartround2.text;
  param.shend = _shend.text;
  param.shendround1 = _shendround1.text;
  param.shendround2 = _shendround2.text;
  param.shclockout = _shclockout.text;
  if(_br1start.text != "")
    param.br1start = _br1start.text;
  
  if(_br1end.text != "")
    param.br1end = _br1end.text;
  
  param.br1paid = _br1paid.checked;

  if(_br2start.text != "")
    param.br2start = _br2start.text;
  
  if(_br2end.text != "")
    param.br2end = _br2end.text;

  param.br2paid = _br2paid.checked;

  if(_lnchstart.text != "")
    param.lnchstart = _lnchstart.text;
  
  if(_lnchend.text != "")
    param.lnchend = _lnchend.text;

  param.lnchpaid = _lnchpaid.checked;
  param.laborrate = _laborrate.id();

  if(_otdaily.text != "")
    param.otdaily = _otdaily.text;

  if(_otweekly.text != "")
    param.otweekly = _otweekly.text;
  
  if(_otmultiplier.text != "")
    param.otmultiplier = _otmultiplier.text;

  param.ohglaccnt = _ohglaccnt.id();

  return param;
}

function checkFields()
{
// TODO Add field level checks
  return true;
}

_save.clicked.connect(sSave);

_close.clicked.connect(mydialog, "reject");

