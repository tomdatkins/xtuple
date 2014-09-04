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
}

function getParams()
{
  var param = new Object();

  param.shiftid = _shiftid;

  return param;
}

function checkFields()
{
// TODO Add field level checks
  return true;
}

_save.clicked.connect(sSave);

_close.clicked.connect(mydialog, "reject");

