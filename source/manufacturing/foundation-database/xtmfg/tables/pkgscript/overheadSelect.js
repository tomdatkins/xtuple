var _close = mywindow.findChild("_close");
var _select = mywindow.findChild("_select");
var _overhead = mywindow.findChild("_overhead");
var _overheadLit = mywindow.findChild("_overheadLit");

var _employee;
var _categories = false;
var _overhead_accnt = -1;

function set(input)
{
  if ("employee" in input)
    _employee = input.employee;

  populate();
}

function populate()
{
// Check Overhead Assignments have been set up and if so then request user to select option
    var chk = toolbox.executeQuery("SELECT count(*) > 0 as ret FROM xtmfg.ovrhead");
    if (chk.first())
    {
      if (chk.value("ret")) 
      {
	_overhead.populate("SELECT ovrhead_id, ovrhead_descrip FROM xtmfg.ovrhead ORDER BY ovrhead_default DESC, ovrhead_code;");
        _categories = true;
      } else {
      // Default to Shift Overhead Account
        var params = new Object();
        params.employee = _employee;
        var sql = "   SELECT tashift_overhead_accnt_id FROM xtmfg.tashift "
		 +"     JOIN emp ON (emp_shift_id = tashift_shift_id) "
		 +"     WHERE emp_id = <? value(\"employee\") ?>;"; 
        var shift = toolbox.executeQuery(sql, params);
        if (shift.first())
          _overhead_accnt = shift.value("tashift_overhead_accnt_id");
 	_overhead.setVisible(false);
        _overheadLit.setVisible(false);
      }
    }
}

function selectOverhead()
{
  if (_categories)
  {
    var param = new Object();
    param.id  = _overhead.id();
    var sql   = "SELECT ovrhead_accnt_id FROM xtmfg.ovrhead WHERE ovrhead_id = <? value(\"id\") ?>;";
    var accnt = toolbox.executeQuery(sql, param);
    if (accnt.first())
    {
      _overhead_accnt = accnt.value("ovrhead_accnt_id"); 
    } else {
      QMessageBox.critical(mywindow, qsTr("Error"), qsTr("Incomplete configuration of the Overhead Category.  Please contact your System Administrator"));
      return;
    } 
  }
 
  // Send selection back to source screen
  mydialog.done(_overhead_accnt); 
}

function sClose()
{
  mydialog.done(-1)
}

_close.clicked.connect(sClose);
_select.clicked.connect(selectOverhead);
