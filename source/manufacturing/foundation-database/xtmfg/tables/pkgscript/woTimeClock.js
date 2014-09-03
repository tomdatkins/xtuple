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

include("storedProcErrorLookup");
include("xtmfgErrors");

if(preferences.value("window") == "woTimeClock")
{
  // change the search_path to ensure existing client code works with tables moved to xtmfg
  var qry = toolbox.executeQuery("SHOW search_path;", new Object);
  if (! qry.first())
    QMessageBox.critical(mainwindow, qsTr("Initialize xtmfg failed"),
                       qsTr("Failed to initialize the xtmfg package. "
                          + "This functionality may not work correctly. ")
                          .arg(qry.lastError().databaseText));
  else
  {
    // If the search path is empty set the base value to public
    var search_path = qry.value("search_path");
    if(search_path == "")
    {
      search_path = "public";
    }

    // Prepend xtmfg to the existing search path.
    qry = toolbox.executeQuery("SET search_path TO xtmfg, " + search_path + ";", new Object);
    if(!qry.isActive())
    {
      QMessageBox.critical(mainwindow, qsTr("Initialize xtmfg failed"),
                         qsTr("Failed to initialize the xtmfg package. This "
                            + "functionality may not work correctly. %1")
                            .arg(qry.lastError().databaseText));
    }
  }

}

// Determine WOTC Basis (Employee or User)
var empl = false;
if (metrics.value("TimeAttendanceMethod") == "Employee")
  empl = true;

var _woclockedin = false;
var _captive = false;
var _timer = new QTimer;
_timer.singleShot = true;

// create a script var for each child of mywindow with an objectname starting _
var _clockIn    = mywindow.findChild("_clockIn");
var _clockOut   = mywindow.findChild("_clockOut");
var _lastEvent  = mywindow.findChild("_lastEvent");
var _user       = mywindow.findChild("_user");
var _employee   = mywindow.findChild("_employee");
var _wo         = mywindow.findChild("_wo");
var _wooper     = mywindow.findChild("_wooper");
var _wooperList = mywindow.findChild("_wooperList");
var _wooperLit  = mywindow.findChild("_wooperLit");
var _close      = mywindow.findChild("_close");

// Display widget depending on employee setting
_user.setVisible(!empl);
_employee.setVisible(empl);

// Handler widget for wooper scans
var _wooperhndl = toolbox.createWidget("QSpinBox", mywindow, "_woperhndl");
_wooperhndl.maximum = 2147483647;
_wooperhndl.hide();

_wooperList.addColumn(qsTr("W/O #"),       -1, Qt.AlignLeft,  true, "wonum");
_wooperList.addColumn(qsTr("Operation"),   -1, Qt.AlignLeft,  true, "woseq");
_wooperList.addColumn(qsTr("Clock In"),    -1, Qt.AlignLeft,  true, "wotc_timein");

function getWooperId()
{
  if(_wooperList.currentItem() == null)
    return _wooper.id();
  return _wooperList.id();
}

function getWoId()
{
  if(_wooperList.currentItem() == null)
    return _wo.id();
  return _wooperList.altId();
}

function getWoNumber()
{
  if(_wooperList.currentItem() == null)
    return _wo.id();
  return _wooperList.rawValue("wonum");
}

function set(params)
{
  if("captive" in params)
  {
    _captive = true;
    _close.text = qsTr("Quit");
  }

  return mainwindow.NoError;
}

function closeEvent(closeEvent)
{
  if(_captive)
  {
    var answer = QMessageBox.question(mywindow,
                       qsTr("Quit the application?"),
                       qsTr("Are you sure you want to quit the application?"),
                       QMessageBox.Yes | QMessageBox.No,
                       QMessageBox.Yes);
    if(answer == QMessageBox.No)
    {
      closeEvent.ignore();
      return;
    }
  }
  closeEvent.accept();
}

function sClockIn()
{
  var result = -1;

/*  *************************************
 *  Clock in to Work Order
 *  ************************************* 
*/
  var now = new Date;
  var params = new Object;
  params.wotc_wo_id = _wo.id();
  if (empl) 
    params.wotc_username = _employee.number;
  else
    params.wotc_username = _user.username();

  params.wotc_wooper_id = _wooper.id();
  var qry = toolbox.executeQuery('SELECT xtmfg.woClockIn(<? value("wotc_wo_id") ?>,'
                                +'   <? value("wotc_username") ?>, NOW(),'
                                +'   <? value("wotc_wooper_id") ?>) AS result;',
                                 params);
  if(qry.first())
  {
    result = qry.value("result");
    if(result < 0)
    {
      QMessageBox.critical(mywindow,
                       qsTr("W/O ClockIn Error"),
                       storedProcErrorLookup("woClockIn", result, xtmfgErrors));
      return;
    }
    mainwindow.sWorkOrdersUpdated(getWoId(), true);
  }
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                     qsTr("Database Error"), qry.lastError().text);
    return;
  }

  if (empl)
    var statusMsg = qsTr("Employee %1 clocked in to %2")
                 .arg(_employee.number)
                 .arg(_wo.number);
  else
    var statusMsg = qsTr("User %1 clocked in to %2")
                 .arg(_user.username())
                 .arg(_wo.number);

  _lastEvent.text = statusMsg;
  clear();
}


function sClockOut()
{

/*  *************************************************
 *   Clock Out of Work Order
 *  *************************************************
*/
  var wotc_id = -1;
  var params = new Object;
  params.wotc_wo_id = getWoId();
  params.wotc_wooper_id = getWooperId();
  if(empl)
    params.wotc_username = _employee.number;
  else
    params.wotc_username = _user.username();

  var qry = toolbox.executeQuery("SELECT xtmfg.woClockOut(<? value('wotc_wo_id') ?>, <? value('wotc_username') ?>, NOW(),"
                              +"                  <? value('wotc_wooper_id') ?>) AS result;", params);
  if(qry.first())
  {
    wotc_id = qry.value("result");
    if(wotc_id < 0) {
      QMessageBox.critical(mywindow,
                       qsTr("W/O ClockOut Error"), storedProcErrorLookup("woClockOut", wotc_id, xtmfgErrors));
      return;
    }  
  }
  if (qry.lastError().type != QSqlError.NoError)  {
    QMessageBox.critical(mywindow,
                     qsTr("Database Error"), qry.lastError().text);
    return;
  }

  var now = new Date;
  var result = 1;
  if(metrics.value("WOTCPostStyle") == "Operations")
    result = callPostOperations(wotc_id);
  else if(metrics.value("WOTCPostStyle") == "Production")
    result = callPostProduction(wotc_id);

  if(result < 1){
  // cancel the clockout
    params = new Object;
    params.wotc_id = wotc_id;
    qry = toolbox.executeQuery("SELECT xtmfg.unwoClockOut(<? value('wotc_id') ?>) AS result", params);
    if(qry.first()){
      result = qry.value("result");
      if(result < 0)
        QMessageBox.critical(mywindow,
                       qsTr("W/O UnClockOut Error"), storedProcErrorLookup("unWoClockOut", result, xtmfgErrors));
      else if (qry.lastError().type != QSqlError.NoError)
        QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
      if (empl)
        var cancelMsg = qsTr("Employee %1 canceled clock out of %2\n")
                        .arg(_employee.number)
                        .arg(getWoNumber());
      else
        var cancelMsg = qsTr("User %1 canceled clock out of %2\n")
                        .arg(_user.username())
                        .arg(getWoNumber());

      _lastEvent.text = cancelMsg;
    }
  }

  if (empl)
    var statusMsg = qsTr("Employee %1 clocked out of %2")
                 .arg(_employee.number)
                 .arg(getWoNumber());
  else
    var statusMsg = qsTr("User %1 clocked out of %2")
                 .arg(_user.username())
                 .arg(getWoNumber());

  _lastEvent.text = statusMsg;
  clear();
}

function callPostProduction(wotc_id)
{
  var now = new Date;
  var result = 0;

  try {
    if (!privileges.check("PostProduction"))
    {
      QMessageBox.critical(mywindow,
                           mywindow.windowTitle,
                           qsTr("User does not have Post Production privilege."));
      return 1;
    }

    var params = new Object;
    params.wo_id = getWoId();
    params.usr_id = _user.id();
    params.emp_id = _employee.id();
    params.backflush = true;	
    params.fromWOTC = true;
    if(wotc_id != -1)
      params.wotc_id = wotc_id;

    // Post Production not valid for Job Costing itemsites
    var qry = toolbox.executeQuery("SELECT itemsite_costmethod "
                                 + "FROM wo JOIN itemsite ON (itemsite_id=wo_itemsite_id) "
                                 + "WHERE (wo_id=<? value('wo_id') ?>);", params);
    if(qry.first())
    {
      var costmethod = qry.value("itemsite_costmethod");
      if(costmethod == "J")
      {
        return 1;
      }  
    }
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return -1;
    }

    var wnd = toolbox.openWindow("postProduction", 0, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    result = wnd.exec();
    if(result > 0)
    {
      if(empl)
        var statusMsg = qsTr("Employee %1 posted production\n")
                            .arg(_employee.name());
      else
        var statusMsg = qsTr("User %1 posted production\n")
                            .arg(_user.username());
      _lastEvent.text = statusMsg;
    }
    else
    {
      if(empl)
        var statusMsg = qsTr("Employee %1 post production result %2\n")
                            .arg(_employee.name().arg(result));
      else
        var statusMsg = qsTr("User %1 post production result %2\n")
                            .arg(_user.username().arg(result));
      _lastEvent.text = statusMsg;
    }
  } catch(e) {
    print("woTimeClock open postProduction exception @ " + e.lineNumber + ": " + e);
  }
  return result;
}

function callPostOperations(wotc_id)
{
  var now = new Date;
  var result = 0;

  try {
    if (!privileges.check("PostWoOperations"))
    {
      QMessageBox.critical(mywindow,
                           mywindow.windowTitle,
                           qsTr("User does not have Post WO Operations privilege."));
      return 1;
    }

    var params = new Object;
    params.usr_id = _user.id();
    params.emp_id = _employee.id();
    if(wotc_id != -1)
      params.wotc_id = wotc_id;
    else if(getWooperId() != -1)
      params.wooper_id = getWooperId();
    else
      params.wo_id = getWoId();
    params.issueComponents = true;
    params.fromWOTC = true;

    var wnd = toolbox.openWindow("postOperations", 0, Qt.NonModal, Qt.Dialog);
    if(toolbox.lastWindow().set(params) != mainwindow.UndefinedError)
      result = wnd.exec();
    if(result == 1)
    {
      if(empl)
        var statusMsg = qsTr("Employee %1 posted operation\n")
                            .arg(_employee.name());
      else
        var statusMsg = qsTr("User %1 posted operation\n")
                            .arg(_user.username());
      _lastEvent.text = statusMsg;
    }
    else
    {
      if(empl)
        var statusMsg = qsTr("Employee %1 post operation result %2\n")
                            .arg(_employee.name().arg(result));
      else
        var statusMsg = qsTr("User %1 post operation result %2\n")
                            .arg(_user.username().arg(result));

      _lastEvent.text = statusMsg;
    }
  } catch (e) {
    print(e.lineNumber + ": " + e);
  }

  return result;
}

function sCheckValid()
{
  if(_wo.id() != -1 && _wo.method() == "D")
  {
    QMessageBox.critical(mywindow,
                       mywindow.windowTitle,
                       qsTr("Posting of time against disassembly work orders is not supported."));
    _wo.setId(-1);
    _wo.setFocus();
    return;
  }

  if(_user.isValid() || _employee.isValid())
  {
    var params = new Object;
    params.username = _user.username();
    params.employee = _employee.number;
    if(_wo.isValid())
      params.wo_id = _wo.id();
    if(empl)
      var qry = toolbox.executeQuery("SELECT wotc_wooper_id, wotc_wo_id, formatWoNumber(wo_id) AS wonum,"
                                  +"      (wooper_seqnumber || ' - ' || wooper_descrip1 ||"
                                  +"                  ' - ' || wooper_descrip2) AS woseq,"
                                  +"      wotc_timein "
                                  +"  FROM wo, xtmfg.wotc LEFT OUTER JOIN"
                                  +"     xtmfg.wooper ON (wooper_id=wotc_wooper_id) "
                                  +" WHERE((wo_id=wotc_wo_id)"
                                  +"   AND (wotc_emp_code = <? value('employee') ?> ) "
                                  +"   AND (wotc_timeout IS NULL)"
                                  +" <? if exists('wo_id') ?> AND (wotc_wo_id= <? value('wo_id') ?> ) <? endif ?>"
                                  +");", params);
    else
      var qry = toolbox.executeQuery("SELECT wotc_wooper_id, wotc_wo_id, formatWoNumber(wo_id) AS wonum,"
                                  +"      (wooper_seqnumber || ' - ' || wooper_descrip1 ||"
                                  +"                  ' - ' || wooper_descrip2) AS woseq,"
                                  +"      wotc_timein "
                                  +"  FROM wo, xtmfg.wotc LEFT OUTER JOIN"
                                  +"     xtmfg.wooper ON (wooper_id=wotc_wooper_id) "
                                  +" WHERE((wo_id=wotc_wo_id)"
                                  +"   AND (wotc_username= <? value('username') ?> ) "
                                  +"   AND (wotc_timeout IS NULL)"
                                  +" <? if exists('wo_id') ?> AND (wotc_wo_id= <? value('wo_id') ?> ) <? endif ?>"
                                  +");", params);
    _wooperList.populate(qry, true);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return;
    }

    if(_wooperList.topLevelItemCount > 0)
      _clockOut.setFocus();
    else
      _clockIn.setFocus();
  }
  else
    _wooperList.clear();

  sHandleButtons();
}

function sHandleButtons()
{
  if(metrics.value("WOTCPostStyle") == "Operations")
  {
    _wooper.enabled = (_wo.isValid() && _wooperList.currentItem() == null);
    if (empl)
    {
      _clockIn.enabled = (_employee.isValid() && 
                          (!_wo.isValid() || _wooper.id() > -1));
      _clockOut.enabled = (_employee.isValid());
    }
    else
    {
       _clockIn.enabled = (_user.isValid() && _wooper.id() > -1 &&
                           (_wooperList.findItems(_wooper.currentText,
                                                  Qt.MatchExactly).length == 0));
       _clockOut.enabled = (_user.isValid() && getWooperId() > -1 &&
                            (!(_wooperList.findItems(_wooper.currentText, Qt.MatchExactly).length == 0) ||
                               (_wooper.currentText.length == 0)));
    }
  }
  else
  {
    if (empl)
    {
      _clockIn.enabled = (_employee.isValid());
      _clockOut.enabled = (_employee.isValid());
    }
    else
    {
       _clockIn.enabled = (_user.isValid() && _wo.id() > -1)
       _clockOut.enabled = (_user.isValid() && (_wooperList.altId() > 0 ||
                              (_wo.isValid() &&
                               _wooperList.currentItem() == null &&
                               !(_wooperList.findItems(_wo.woNumber, Qt.MatchExactly).length == 0))));
    }
  }
}

function sPopulateWooper()
{
  if(metrics.value("WOTCPostStyle") == "Operations")
  {
    var params = new Object;
    params.wo_id = _wo.id();
    params.username = _user.username();
    params.employee = _employee.number;
    var qry = toolbox.executeQuery("SELECT wooper_id,"
                                  +" (wooper_seqnumber || ' - ' || wooper_descrip1 || ' - ' || wooper_descrip2),"
                                  +" wooper_seqnumber "
                                  +"  FROM xtmfg.wooper "
                                  +" WHERE((wooper_wo_id=<? value('wo_id') ?>) "
                                  +"   AND (NOT wooper_rncomplete)) "
                                  +" ORDER BY wooper_seqnumber;", params);
    _wooper.populate(qry);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return;
    }

    if(empl)
      qry = toolbox.executeQuery("SELECT wotc_wooper_id "
                              +"  FROM xtmfg.wotc "
                              +" WHERE((wotc_emp_code=<? value('employee') ?>)"
                              +"  AND  (wotc_wo_id=<? value('wo_id') ?>)"
                              +"  AND  (wotc_timeout IS NULL));", params);

    else
      qry = toolbox.executeQuery("SELECT wotc_wooper_id "
                              +"  FROM xtmfg.wotc "
                              +" WHERE((wotc_username=<? value('username') ?>)"
                              +"  AND  (wotc_wo_id=<? value('wo_id') ?>)"
                              +"  AND  (wotc_timeout IS NULL));", params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return;
    }
    else
      _wooper.setId(-1);
  }
}

function clear()
{
  _user.setUsername("");
  _employee.setId(-1);
  _wo.setId(-1);
  _wooper.clear();
  _wooperList.clear();
  if(empl)
    _employee.setFocus();
  else
    _user.setFocus();
}

function sSetTimer()
{
  if(_lastEvent.text.length > 0)
    _timer.start(10 * 1000);
}

function setOverheadAccnt(accnt)
{
  _overhead_accnt = accnt;
}

function sWooperScanned(pWooperid)
{
  _wooper.setId(pWooperid);
  var params = new Object;
  params.wooper_id = pWooperid;
  var qry = toolbox.executeQuery("SELECT wooper_wo_id"
                                +"  FROM xtmfg.wooper"
                                +" WHERE(wooper_id=<? value('wooper_id') ?>);", params);
  if(qry.first())
  {
    _wo.setId(qry.value("wooper_wo_id"));
    _wooper.setId(pWooperid);
    if(_wooper.id() == -1)
      _lastEvent.text = qsTr("Scanned Work Order Operation is not valid. It may have been marked Complete.");
    else
      _lastEvent.text = qsTr("Scanned Work Order Operation %1 (%2).").arg(_wooper.currentText).arg(pWooperid);
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
  else if(qry.size() <= 0 || qry.value("wooper_wo_id") == null)
    _lastEvent.text = qsTr("Scanned Work Order Operation does not exist.\nThe Work Order may be closed");
}

_clockIn.clicked.connect(sClockIn);
_clockOut.clicked.connect(sClockOut);
_lastEvent.textChanged.connect(sSetTimer);
_user.valid.connect(sCheckValid);
_employee.valid.connect(sCheckValid);
_wo.valid.connect(sCheckValid);
_wo.newId.connect(sPopulateWooper);
_wooper.newID.connect(sCheckValid);
_wooperList.valid.connect(sHandleButtons);
_timer.timeout.connect(_lastEvent, "clear");
_wooperhndl["valueChanged(int)"].connect(sWooperScanned);

_close.clicked.connect(mywindow, "close");

InputManager.notify(InputManager.cBCWorkOrder, mywindow, _wo, InputManager.slotName("setId(int)"));
InputManager.notify(InputManager.cBCWorkOrderOperation, mywindow, _wooperhndl, InputManager.slotName("setValue(int)"));
// Barcode function for Employee (Does not exist yet) 
//InputManager.notify(InputManager.cBCEmployee, mywindow, _employee, InputManager.slotName("setId(int)"));
InputManager.notify(InputManager.cBCUser, mywindow, _user, InputManager.slotName("setId(int)"));

_user.setExtraClause(" (usr_active) ");

_wooperLit.visible = (metrics.value("WOTCPostStyle") == "Operations");
_wooper.visible = (metrics.value("WOTCPostStyle") == "Operations");

if (! (metrics.value("WOTCPostStyle") == "Operations"))
  _wooperList.hideColumn(1);

_wo.type = 12; //cWoReleased(8) | cWoIssued(4)
_wooper.allowNull = true;

sCheckValid();

if (empl) 
  _employee.setFocus();
else
  _user.setFocus();
