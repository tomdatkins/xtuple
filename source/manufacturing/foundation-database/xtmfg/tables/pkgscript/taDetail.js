var _time = mywindow.findChild("_time");
var _close = mywindow.findChild("_close");
var _print = mywindow.findChild("_print");
var _new = mywindow.findChild("_new");
var _edit = mywindow.findChild("_edit");
var _reverse = mywindow.findChild("_reverse");
var _emp = mywindow.findChild("_emp");
var _date = mywindow.findChild("_date");

var _employee;
var _datefrom;
var _dateto;

_new.setEnabled(privileges.check("MaintainTimeEntries"));

// Build the List
 with (_time)
 {
   addColumn("Date",-1,1,true,"timedate");
   addColumn("Daily Total",-1,Qt.AlignRight,true,"totaltime");
   addColumn("Type",-1,1,true,"f_type");
   addColumn("Work Order",-1,1,true,"wo_number");
   addColumn("Time In",-1,1,true,"tatc_timein");
   addColumn("Time Out",-1,1,true,"tatc_timeout");
   addColumn("Posted",-1,1,true,"tatc_posted");
   addColumn("Work Order Hrs",-1,Qt.AlignRight,true,"wotime");
   addColumn("Overhead Hrs",-1,Qt.AlignRight,true,"ohtime");
   addColumn("Overtime Hrs",-1,Qt.AlignRight,true,"tatc_overtime");
   addColumn("Notes",-1,1,false,"f_notes");
}

// Build context menu
_time["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(populateMenu);


// Local functions
function populateMenu(pMenu, pItem, pCol)
{
var mCode
if(pMenu == null)
  pMenu = _time.findChild("_menu");

if(pMenu != null)
 {
  var _addsep = false;
  var currentItem = _time.currentItem();
  if(currentItem != null && pItem.rawValue("tatc_posted") == false)
  {
   mCode = pMenu.addAction(qsTr("Edit Time..."),privileges.check("MaintainTimeEntries"));
   mCode.triggered.connect(timeEdit);

  }
 }	
}

function close()
{
  mywindow.close();
}

function sFillList()
{
   var list = toolbox.executeDbQuery("timeattend", "timeDetail", getParams());
   _time.populate(list);
}

function getParams()
{
   var params = new Object();
   params.employee = _employee;
   params.datefrom = _datefrom;
   params.dateto = _dateto;
   
   return params;
}

function set(input)
{
  if ("employee" in input)
  {
    _employee = input.employee;
    _emp.setId(_employee);
  }

  if ("datefrom" in input)
  {
    _datefrom = input.datefrom;
    _date.setStartDate(_datefrom);
  }

  if ("dateto" in input)
  {
    _dateto = input.dateto;
    _date.setEndDate(_dateto);
  }

   sFillList();
}

function timeEdit()
{
  if (_time.id() == -1)
  {
    QMessageBox.warning(mywindow, "Time Selection", "You must select a line first");
    return 0;
  }
  try
  {
     var childwnd = toolbox.openWindow("taTimeEdit",mywindow, 0, 1);
     var wparams = new Object;
     wparams.id = _time.id();
     var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
    print(e);
    QMessageBox.critical(mywindow, "Unexpected Error", "Error:" + e);
  }
}

function timeNew()
{
  try
  {
     var childwnd = toolbox.openWindow("taTimeEdit",mywindow, 0, 1);
     var wparams = new Object;
     wparams.newTime = "new";
     wparams.employee = _emp.id();
     var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
    print(e);
    QMessageBox.critical(mywindow, "Unexpected Error", "Error:" + e);
  }
}

function printReport()
{

   toolbox.printReport("TimeAttendDetail", getParams());
}

function sHandleButtons()
{
   _edit.setEnabled(!_time.rawValue("tatc_posted") && _time.rawValue("f_type") == 'Overhead' && privileges.check("MaintainTimeEntries") && (_time.rawValue("tatc_timeout") != "Invalid Date"));
  if(_time.id() != -1 && _time.rawValue("f_type") == 'Overhead' && _time.rawValue("tatc_posted") && privileges.check("MaintainTimeEntries")) 
    _reverse.setEnabled(true);
  else
    _reverse.setEnabled(false);
}

function reverseTime()
{
  try
  {
     var childwnd = toolbox.openWindow("taTimeEdit",mywindow, 0, 1);
     var wparams = new Object;
     wparams.id = _time.id();
     wparams.reverse = true;
     var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
    print(e);
    QMessageBox.critical(mywindow, "Unexpected Error", e);
  }
}

// Connections
_time["newId(int)"].connect(sHandleButtons);
_close.clicked.connect(close);
_print.clicked.connect(printReport);
_new.clicked.connect(timeNew);
_edit.clicked.connect(timeEdit);
_reverse.clicked.connect(reverseTime);
mainwindow["workOrderOperationsUpdated(int, int, bool)"].connect(sFillList);
