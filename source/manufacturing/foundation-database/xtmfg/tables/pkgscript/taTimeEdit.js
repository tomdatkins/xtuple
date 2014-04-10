include("xtmfgErrors");

var _emp = mywindow.findChild("_emp");
var _type = mywindow.findChild("_type");
var _close = mywindow.findChild("_close");
var _save = mywindow.findChild("_save");
var _start = mywindow.findChild("_start");
var _end = mywindow.findChild("_end");
var _hours = mywindow.findChild("_hours");
var _overtime = mywindow.findChild("_overtime");
var _notes = mywindow.findChild("_notes");
var _overhead = mywindow.findChild("_overhead");
var _overheadLit = mywindow.findChild("_overheadLit");
var _comments =     mywindow.findChild("_comments");

var tatc_id = -1 ;
var _reverse = false;
var _hrs;
var _ot;
var _accnt;
var _categories = false;
var _new = false;

_hours.setValidator(mainwindow.qtyVal());
_overtime.setValidator(mainwindow.qtyVal());
_overheadLit.setVisible(false);
_overhead.setVisible(false);

// Local functions
function close()
{
  mywindow.close();
}
	
function populate()
{
  var data = toolbox.executeDbQuery("timeattend", "getTimeDetail", getParams());
  if (data.first())
  {
    _emp.setId(data.value("tatc_emp_id"));
    _type.text = data.value("f_type");
    _start.setDateTime(data.value("tatc_timein"));
    _end.setDateTime(data.value("tatc_timeout"));
    _hours.text = data.value("f_hours");
    _hrs = data.value("f_hours");
    _overtime.text = data.value("tatc_overtime");
    _ot = data.value("tatc_overtime");
    _accnt = data.value("tatc_glaccnt_id");
    _notes.plainText = data.value("tatc_notes");

    if (data.value("tatc_type") == 'WO')
    {
      _start.setEnabled(false);
      _end.setEnabled(false);
    }
  }
}

function populateNew()
{
// Check Overhead Assignments have been set up and if so then request user to select option
    var chk = toolbox.executeQuery("SELECT count(*) > 0 as ret FROM xtmfg.ovrhead");
    if (chk.first())
    {
      if (chk.value("ret")) 
      {
	_overhead.populate("SELECT ovrhead_id, ovrhead_descrip FROM xtmfg.ovrhead ORDER BY ovrhead_default DESC, ovrhead_code;");
        _categories = true;
 	_overhead.setVisible(false);
        _overheadLit.setVisible(false);
      } else {
      // Default to Shift Overhead Account
        var params = new Object();
        params.employee = _employee;
        var sql = "   SELECT tashift_overhead_accnt_id FROM xtmfg.tashift "
		 +"     JOIN emp ON (emp_shift_id = tashift_shift_id) "
		 +"     WHERE emp_id = <? value(\"employee\") ?>;"; 
        var shift = toolbox.executeQuery(sql, params);
        if (shift.first())
          _accnt = shift.value("tashift_overhead_accnt_id");
      }
    }

    _start.setDateTime(new Date);
    _end.setDateTime(new Date);
    _type.text = "Manual Entry";
    _new = true;
    mywindow.setWindowTitle("Time Entry Manual Adjustment");
}

function set(input)
{
  if ("id" in input)
  {
    tatc_id = input.id;
    _comments.setId(input.id);
  }

  if ("newTime" in input)
  {
    _emp.setId(input.employee);
    populateNew();
  } else {
    populate();
  }

  if ("reverse" in input)
  {
    _start.setDateTime(_end.dateTime);
    _start.setEnabled(false);
    _end.setEnabled(false);   
    _hours.setEnabled(true);
    _hours.text = _hours.text * -1;
    _overtime.text = _overtime.text * -1;
    mywindow.setWindowTitle("Time Clock Reversal");
    _reverse = true;
  }
}

function getParams()
{
  var param = new Object();
  param.id = tatc_id;
  param.employee = _emp.id();
  param.notes = _notes.plainText;
  param.start = _start.dateTime;
  param.end   = _end.dateTime;
  param.hours = _hours.text;
  if (_overtime.text == "")
    param.overtime = 0;
  else
    param.overtime = _overtime.text;
  param.accnt = _accnt;

  return param;
}

function sSave()
{
  if (((_end.dateTime < _start.dateTime)  && _reverse) || ((_end.dateTime <= _start.dateTime)  && !_reverse))
  {
    QMessageBox.warning(mywindow,qsTr("Time Clock Error"), qsTr("The Time Clock End date and time must be greater than the Start date and time"));
    return -1;
  }

  if (_overtime.toDouble() > _hours.toDouble())
  {
    QMessageBox.warning(mywindow,qsTr("Time Clock Error"), qsTr("Overtime hours cannot be greater than the hours worked"));
    return -1;
  }

  if (_reverse)
  {
    if(QMessageBox.question(mywindow,qsTr("Reversal Confirmation"),qsTr("Are you sure you wish to post this reversal?"), QMessageBox.Yes, QMessageBox.No) == QMessageBox.No) 
      return false;
  
    var sql = "INSERT INTO xtmfg.tatc (tatc_emp_id, tatc_type, tatc_timein, tatc_timeout, tatc_adjust, tatc_overtime, tatc_notes, tatc_glaccnt_id) "
		+ " VALUES (<? value(\"employee\") ?>, 'RE', <? value(\"start\") ?> , <? value(\"end\") ?> , <? value(\"hours\") ?>::numeric, <? value(\"overtime\") ?>::numeric "
		+ " , <? value(\"notes\") ?> , <? value(\"accnt\") ?>)"; 
  } else {
    if (_new)
      var sql = "INSERT INTO xtmfg.tatc (tatc_emp_id, tatc_type, tatc_timein, tatc_timeout, tatc_overtime, tatc_notes, tatc_glaccnt_id) "
		+ " VALUES (<? value(\"employee\") ?>, 'OH', <? value(\"start\") ?> , <? value(\"end\") ?>, <? value(\"overtime\") ?>::numeric "
		+ " , <? value(\"notes\") ?> , <? value(\"accnt\") ?>)"; 
    else
      var sql = "UPDATE xtmfg.tatc SET tatc_timein = <? value(\"start\") ?>, tatc_timeout=<? value(\"end\") ?>, tatc_notes=<? value(\"notes\") ?> " 
	        + ", tatc_overtime=<? value(\"overtime\") ?>::numeric WHERE tatc_id = <? value(\"id\") ?>";
  }
  var upd = toolbox.executeQuery(sql, getParams());
  xtmfgErrors.errorCheck(upd);

  //mainwindow.salesOrdersUpdated(-1);
  mainwindow.workOrderOperationsUpdated(-1, -1, false);
  close();  
}

function updateOvertime()
{
  var diff = (_hours.text - (_hrs * -1)) / (_hrs * -1);
  if (diff != 0)
  {
    var n = _ot * diff;
    _overtime.text = n.toFixed(2);
  }
}

function updateOverheadAccnt()
{
  if (_categories)
  {
    var param = new Object();
    param.id  = _overhead.id();
    var sql   = "SELECT ovrhead_accnt_id FROM xtmfg.ovrhead WHERE ovrhead_id = <? value(\"id\") ?>;";
    var accnt = toolbox.executeQuery(sql, param);
    if (accnt.first())
    {
      _accnt = accnt.value("ovrhead_accnt_id"); 
    } else {
      QMessageBox.critical(mywindow, qsTr("Error"), qsTr("Incomplete configuration of the Overhead Category.  Please contact your System Administrator"));
      return;
    } 
  }
}

function updateHours()
{
  var sql = "SELECT ROUND(EXTRACT(epoch FROM to_char((<? value(\"end\") ?>::timestamp - <? value(\"start\") ?>::timestamp),'HH24:MI')::interval)/3600,2) as hr";
  var hr = toolbox.executeQuery(sql, getParams());
  if (hr.first())
    _hours.text = hr.value("hr");
}

// Connections
_close.clicked.connect(close);
_save.clicked.connect(sSave);
_hours["lostFocus()"].connect(updateOvertime);
_overhead["newID(int)"].connect(updateOverheadAccnt);
_start["editingFinished()"].connect(updateHours);
_end["editingFinished()"].connect(updateHours);
