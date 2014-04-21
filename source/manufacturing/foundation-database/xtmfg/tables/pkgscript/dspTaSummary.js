debugger;

include("ParameterGroupUtils", "storedProcErrorLookup", "xtmfgErrors");

var widgets = toolbox.loadUi("dspTaSummary", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);
var _queryAct = mywindow.queryAction();

mywindow.setWindowTitle(qsTr("Time Clock Summary"));
mywindow.setListLabel(qsTr("Time Entries"));
mywindow.setReportName("TimeAttendSummary");
mywindow.setMetaSQLOptions("timeattend", "timeSummary");

var _time = mywindow.list();
var _edit = mywindow.findChild("_edit");
var _post = mywindow.findChild("_post");
var _postAll = mywindow.findChild("_postAll");
var _date  = mywindow.findChild("_date");
//var _print = mywindow.findChild("_print");
//var _close = mywindow.findChild("_close");
//var _query = mywindow.findChild("_query");
var _params = mywindow.findChild("_params");

// Build Parameter Selections
_params.append(qsTr("Employee"), "employee", ParameterWidget.Employee, null, false);

var sql = "SELECT shift_id, shift_name FROM shift ORDER BY shift_name";
_params.appendComboBox(qsTr("Shift"), "shift",sql, null, false);

var sql = "SELECT dept_id, dept_name FROM dept ORDER BY dept_name";
_params.appendComboBox(qsTr("Department"), "department",sql, null, false);

var sql = "SELECT emp_id, emp_name FROM emp "
	+ " WHERE emp_id IN (SELECT emp_mgr_emp_id FROM emp WHERE emp_mgr_emp_id IS NOT NULL);";
_params.appendComboBox(qsTr("Manager"), "manager",sql, null, false);

_date.setEndDate(new Date());

// Build the List
mywindow.list().addColumn("Department",-1,1,true,"dept_number");  
mywindow.list().addColumn("Manager",-1,1,true,"mgr_name");  
mywindow.list().addColumn("Shift",-1,1,true,"shift_number");
mywindow.list().addColumn("Employee",-1,1,true,"emp_code");
mywindow.list().addColumn("Work Order Hrs",-1,Qt.AlignRight,true,"wotime");
mywindow.list().addColumn("Overhead Hrs",-1,Qt.AlignRight,true,"ohtime");
mywindow.list().addColumn("Total Hrs",-1,Qt.AlignRight,true,"totaltime");
mywindow.list().addColumn("Unposted Hrs",-1,Qt.AlignRight,true,"unpostedtime");
mywindow.list().addColumn("Overtime Hrs",-1,Qt.AlignRight,true,"overtime");

// Build context menu
_time["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(populateMenu);

function populateMenu(pMenu, pItem, pCol)
{
var mCode
if(pMenu == null)
  pMenu = _time.findChild("_menu");

if(pMenu != null)
 {
  var _addsep = false;
  var currentItem = _time.currentItem();
  if(currentItem != null)
  {
   var tmpact = pMenu.addAction(qsTr("Post Overhead..."));
   tmpact.enabled = (privileges.check("PostTimeEntries"));
   tmpact.triggered.connect(timePost);

   var tmpact = pMenu.addAction(qsTr("Edit Employee Time..."));
   tmpact.enabled = (privileges.check("MaintainTimeEntries"));
   tmpact.triggered.connect(timeEdit);

  }
 }
}

function sFillList()
{

// Validate parameter entry
   if (!_date.allValid())
   {       QMessageBox.warning(mywindow,"Incorrect Dates",qsTr("Please enter a Date From and a Date To"));
       return false;
   }
   if (_date.startDate > _date.endDate)
   {
       QMessageBox.warning(mywindow,"Incorrect Dates",qsTr("Date From must be earlier than Date To"));
       return false;
   }
   
   var list = toolbox.executeDbQuery("timeattend", "timeSummary", getParams());
   _time.populate(list);

  return true;
}

function timePost()
{
 if (_time.id() == -1)
 {
  QMessageBox.warning(mywindow, qsTr("Employee Selection"), qsTr("You must select an Employee first"));
  return 0;
 }

  var resp = QMessageBox.question(mywindow,qsTr("Post Overhead"),
			qsTr("Are you sure you wish to post Overhead time for this Employee?"),
			QMessageBox.Yes | QMessageBox.Cancel);
  if (resp == QMessageBox.Cancel)
 	return false;
  var params = new Object();
  params.employee_code = _time.rawValue("emp_code").toString();
  params.datefrom  = _date.startDate;
  params.dateto  = _date.endDate;
  var post = toolbox.executeDbQuery("timeattend", "postoverheadtime", params);
  if (post.first())
  { 
    if (post.value("ret") != 0)
      QMessageBox.warning(mywindow, qsTr("Post Overhead"), qsTr("There was a problem posting Overhead time"));
    else
      QMessageBox.warning(mywindow, qsTr("Post Overhead"), qsTr("Overhead time was successfully posted"));
  }
}

function timePostAll()
{
  var resp = QMessageBox.question(mywindow,qsTr("Post Overhead"),
			qsTr("Are you sure you wish to post ALL Overhead time for this selection?"),
			QMessageBox.Yes | QMessageBox.Cancel);
  if (resp == QMessageBox.Cancel)
 	return false;

  var post = toolbox.executeDbQuery("timeattend", "postoverheadtime", getParams());
  if (post.first())
  { 
    if (post.value("ret") != 0)
      QMessageBox.warning(mywindow, qsTr("Post Overhead"), qsTr("There was a problem posting Overhead time"));
    else
      QMessageBox.warning(mywindow, qsTr("Post Overhead"), qsTr("Overhead time was successfully posted"));
  }
}

function timeEdit()
{ 
 if (_time.id() == -1)
 {
  QMessageBox.warning(mywindow, "Employee Selection", "You must select a line first");
  return 0;
 }
 try
  {
   var childwnd = toolbox.openWindow("taDetail",mywindow, 0, 1);
   var wparams = new Object;
   wparams.employee = _time.id();
   wparams.datefrom = _date.startDate;
   wparams.dateto   = _date.endDate;

   var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
   print(e);
   QMessageBox.critical(mywindow, "Unexpected Error", "Error: " + e);
  }
}

/*
function sFillList()
  {
    var params = new Object;
    if (! setParams(params))
      return;

    var qry = toolbox.executeDbQuery("timeattend", "timeSummary", params);
    _time.populate(qry, true);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         qry.lastError().text);
      return;
    }
  }
*/  

function getParams()
{
  var param = new Object();
  
  
  param.datefrom = _date.startDate;
  param.dateto	 = _date.endDate;
  if (_params.parameters().employee > 0)
    param.employee = _params.parameters().employee;
  if (_params.parameters().department > 0)
    param.department = _params.parameters().department;
  if (_params.parameters().shift > 0)
    param.shift = _params.parameters().shift;
  if (_params.parameters().manager > 0)
    param.manager = _params.parameters().manager;

  return param;  
	
}

function sHandleButtons()
{
  _post.setEnabled(privileges.check("PostTimeEntries"));
  _postAll.setEnabled(privileges.check("PostTimeEntries"));
  _edit.setEnabled(privileges.check("MaintainTimeEntries"));
  
}

_post.setEnabled(false);
_postAll.setEnabled(false);
_edit.setEnabled(false);

// Connections

 toolbox.coreDisconnect(_queryAct, "triggered()", mywindow, "sFillList()");
 _queryAct.triggered.connect(sFillList);

_post.clicked.connect(timePost);
_edit.clicked.connect(timeEdit);
_postAll.clicked.connect(timePostAll);

_time["newId(int)"].connect(sHandleButtons);
mainwindow["workOrderOperationsUpdated(int, int, bool)"].connect(sFillList);
