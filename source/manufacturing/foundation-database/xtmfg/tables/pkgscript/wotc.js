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


var _mode = "new";
var _wotcid = -1;
var _prevtime = 0;
var _clockedOut = false;

// Determine WOTC Basis (Employee or User)
var empl = false;
if (metrics.value("TimeAttendanceMethod") == "Employee")
  empl = true;

// create a script var for each child of mywindow with an objectname starting _
var _save    = mywindow.findChild("_save");
var _close   = mywindow.findChild("_close");
var _user    = mywindow.findChild("_user");
var _emp     = mywindow.findChild("_emp");
var _wo      = mywindow.findChild("_wo");
var _wooper  = mywindow.findChild("_wooper");
var _wooperLit = mywindow.findChild("_wooperLit");
var _timeIn  = mywindow.findChild("_timeIn");
var _timeOut = mywindow.findChild("_timeOut");
var _dateIn  = mywindow.findChild("_dateIn");
var _dateOut = mywindow.findChild("_dateOut");

// Display the correct widget
_user.setVisible(!empl);
_emp.setVisible(empl);

function set(params)
{
  if("mode" in params)
  {
    if (params.mode == "new")
    {
      _mode = "new";
      _wo.setFocus();
    }
    else if (params.mode == "edit")
    {
      _mode = "edit";
      _save.setFocus();
    }
    else if (params.mode == "view")
    {
      _mode = "view";

      _user.enabled = false;
      _emp.enabled = false;
      _wo.enabled = false;
      _close.text = qsTr("&Close");
      _save.hide();

      _close.setFocus();
    }
  }

  if("wotc_id" in params)
    _wotcid = params.wotc_id;

  if("wo_id" in params)
    _wo.setId(params.wo_id);

  if("usr_id" in params)
    _user.setId(params.usr_id);

  if("emp_id" in params)
    _emp.setId(params.emp_id);
 
  populate();

  return mainwindow.NoError;
}

function sHandleButtons()
{
  var bEnabled = (_wo.isValid() && ((!empl && _user.isValid()) || (empl && _emp.isValid())) && (_mode == "new" || _mode == "edit"))

  _dateIn.enabled = bEnabled;
  _dateOut.enabled = bEnabled;
  _timeIn.enabled = bEnabled;
  _timeOut.enabled = bEnabled;
  _save.enabled = bEnabled;
}

function sSave()
{
 try {
  var invalidWidget = 0;
  var msg = "";

  var dtIn;
  if (_dateIn.isValid())
  {
    dtIn = new Date(_dateIn.date);
    var tmIn = new Date(_timeIn.dateTime);
        dtIn.setHours(tmIn.getHours(), tmIn.getMinutes(), tmIn.getSeconds());
  }
  var dtOut;
  if (_dateOut.isValid())
  {
    dtOut = _dateOut.date;
    var tmOut = new Date(_timeOut.dateTime);
        dtOut.setHours(tmOut.getHours(), tmOut.getMinutes(), tmOut.getSeconds());
  }

  if (!_wo.isValid())
  {
    msg = qsTr("Please specify a work order before saving this time clock entry.");
    invalidWidget = _wo;
  }
  else if(!empl && !_user.isValid())
  {
    msg = qsTr("Please specify a valid user before saving this time clock entry.");
    invalidWidget = _user;
  }
  else if(empl && !_emp.isValid())
  {
    msg = qsTr("Please specify a valid Employee before saving this time clock entry.");
    invalidWidget = _emp;
  }
  else if(!_dateIn.isValid()) // see mantis bug 4341
  {
    msg = qsTr("Please specify a valid clock in date/time.");
    invalidWidget = _dateIn;
  }
  else if(_dateOut.isValid() && dtIn > dtOut) // see mantis bug 4341
  {
    msg = qsTr("Please specify a clock in date/time earlier than the clock out date/time.");
    invalidWidget = _dateIn;
  }
  else if(!_dateOut.isValid() && _clockedOut)
  {
    msg = qsTr("This record has been previously clocked out.  You must provide a new clock out date/time.");
    invalidWidget = _dateOut;
  }
  else if(_dateOut.isValid() && 
          _wooper.id() == -1 && 
          metrics.value("WOTCPostStyle") == "Operations")
  {
    msg = qsTr("Please specify a work order operation.");
    invalidWidget = _wooper;
  }
  else if(!_dateOut.isValid())
    dtOut = null; // see mantis bug 4341

  if(invalidWidget)
  {
    QMessageBox.critical(mywindow, qsTr("Invalid Work Order Time Clock Entry"), msg);
    invalidWidget.setFocus();
    return;
  }

  var q_str = "";
  toolbox.executeBegin();

  if (_mode == "new")
    q_str = "INSERT INTO xtmfg.wotc (wotc_wo_id, wotc_username, wotc_emp_code,"
           +"                        wotc_timein, wotc_timeout, wotc_wooper_id)"
           +"    VALUES (<? value('wotc_wo_id') ?>, <? value('wotc_username') ?>,<? value('wotc_employee') ?>, "
           +"            <? value('wotc_timein') ?>, <? value('wotc_timeout') ?>, <? value('wotc_wooper_id') ?>)"
           +"RETURNING wotc_id;";
  else if (_mode == "edit")
    q_str = "UPDATE xtmfg.wotc"
           +"   SET wotc_wo_id=<? value('wotc_wo_id') ?>,"
           +"       wotc_username=<? value('wotc_username') ?>,"
           +"       wotc_emp_code=<? value('wotc_employee') ?>,"
           +"       wotc_timein=<? value('wotc_timein') ?>,"
           +"       wotc_timeout=<? value('wotc_timeout') ?>,"
           +"       wotc_wooper_id=<? value('wotc_wooper_id') ?> "
           +" WHERE(wotc_id=<? value('wotc_id') ?>);";

  var params = new Object;
  params.wotc_id = _wotcid;	
  params.wotc_wo_id = _wo.id();
  if (empl)
    params.wotc_employee = _emp.number;
  else
    params.wotc_username = _user.username();
  params.wotc_timein = dtIn;
  if (dtOut)
    params.wotc_timeout = dtOut; // bug 6655
  if (_wooper.id() != -1)
    params.wotc_wooper_id = _wooper.id();

  qry = toolbox.executeQuery(q_str, params);
  if (qry.first() && _mode == "new")
    _wotcid = qry.value("wotc_id");
  else if (qry.lastError().type != QSqlError.NoError)
    throw new Error(qry.lastError().text);

  if(dtOut)
  {
    params = new Object;
    params.wotc_id = _wotcid;
    params.wotc_timeout = dtOut;
    params.wotc_wooper_id = _wooper.id();
    if (empl)
      params.wotc_username = _emp.number;
    else
      params.wotc_username = _user.username();
    q_str = "SELECT intervalToMinutes(xtmfg.wotcTime(<? value('wotc_id') ?>)) AS currtime;";
    qry = toolbox.executeQuery(q_str, params);
    var currtime = 0;
    if(qry.first())
      currtime = qry.value("currtime");
    var deltatime = currtime - _prevtime;
    params.deltatime = deltatime;
    if(deltatime != 0)
    {
      q_str = "SELECT xtmfg.postRntime(<? value('wotc_wooper_id') ?>, <? value('deltatime') ?>, false, 0, <? value('wotc_timeout') ?>) as result;"
            + "INSERT INTO xtmfg.wooperpost "
            + "(wooperpost_wo_id, wooperpost_seqnumber, "
            + " wooperpost_username, wooperpost_timestamp, "
            + " wooperpost_qty, wooperpost_su_username, wooperpost_sutime, "
            + " wooperpost_rn_username, wooperpost_rntime, wooperpost_wotc_id, "
            + " wooperpost_sucost,wooperpost_rncost,wooperpost_wooper_id) "
            + "SELECT  wooper_wo_id, wooper_seqnumber, "
            + "CURRENT_USER, now(), "
            + "0, '', 0, <? value('wotc_username') ?>, <? value('deltatime') ?>, <? value('wotc_id') ?>, 0, "
            + "COALESCE(xtmfg.workCenterRunCost(wooper_wrkcnt_id, <? value('deltatime') ?>, 0),0), "
            + "<? value('wotc_wooper_id') ?> "
            + "FROM xtmfg.wooper "
            + "WHERE (wooper_id=<? value('wotc_wooper_id') ?>);	"
      qry = toolbox.executeQuery(q_str, params);
    }
  }

  toolbox.executeCommit();
  mydialog.accept();
 }
 catch (e)
 {
   toolbox.executeRollback();
   QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message());
 }
}

function sPopulateWooper()
{
  var woStatus = "";
  var params = new Object;
  params.wo_id = _wo.id();
  var qry = toolbox.executeQuery("SELECT wo_status FROM wo WHERE (wo_id=<? value('wo_id') ?>);", params);
  if (qry.first())
    woStatus = qry.value("wo_status");
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  if(woStatus == "C")
  {
    _wooper.enabled = false;
    _wooper.clear();
  }
  else if(metrics.value("WOTCPostStyle") == "Operations")
  {
    _wooper.enabled = (_mode == "new" || _mode == "edit");
    qry = toolbox.executeQuery("SELECT wooper_id, (wooper_seqnumber || ' - ' || wooper_descrip1 || ' - ' || wooper_descrip2) "
                              +"  FROM xtmfg.wooper "
                              +" WHERE((wooper_wo_id=<? value('wo_id') ?>)) "
                              +" ORDER BY wooper_seqnumber;", params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
    _wooper.populate(qry);

    if(_wotcid != -1)
    {
      if (empl)
      {
        params.employee = _emp.number;
        qry = toolbox.executeQuery("SELECT wotc_wooper_id "
                                +"  FROM xtmfg.wotc "
                                +" WHERE((wotc_emp_code=<? value('employee') ?>)"
                                +"   AND (wotc_wo_id=<? value('wo_id') ?>)"
                                +"   AND (wotc_timeout IS NULL));", params);
      } else {
        params.username = _user.username();
        qry = toolbox.executeQuery("SELECT wotc_wooper_id "
                                +"  FROM xtmfg.wotc "
                                +" WHERE((wotc_username=<? value('username') ?>)"
                                +"   AND (wotc_wo_id=<? value('wo_id') ?>)"
                                +"   AND (wotc_timeout IS NULL));", params);
      }
      if(qry.first())
        _wooper.setId(qry.value("wtoc_wooper_id"));
      else if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return;
      }
      else
        _wooper.setId(_wooper.id(1));
    }
  }
}

function populate()
{
  if(_wotcid != -1)
  {
    var params = new Object;
    params.wotc_id = _wotcid;

    var qry = toolbox.executeQuery("SELECT wotc_wo_id, wotc_username,wotc_emp_code,"
                                  +"       wotc_timein, wotc_timeout,"
                                  +"       wotc_wooper_id,"
                                  +"       intervalToMinutes(xtmfg.wotcTime(wotc_id)) AS prevtime "
                                  +"  FROM xtmfg.wotc "
                                  +" WHERE (wotc_id=<? value('wotc_id') ?>);", params);
    if(qry.first())
    {
      _wo.setId(qry.value("wotc_wo_id"));
      _user.setUsername(qry.value("wotc_username"));
      _emp.setNumber(qry.value("wotc_emp_code"));
      _dateIn.date = qry.value("wotc_timein");
      _dateOut.date = qry.value("wotc_timeout");
      _timeIn.dateTime = qry.value("wotc_timein");
      _timeOut.dateTime = qry.value("wotc_timeout");
      if(qry.value("wotc_wooper_id") != null)
        _wooper.setId(qry.value("wotc_wooper_id"));
      _prevtime = qry.value("prevtime");
      _clockedOut = _dateOut.isValid();
      _wo.enabled = !_clockedOut;
      _wooper.enabled = !_clockedOut;
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  }
}

_save.clicked.connect(sSave);
_user.valid.connect(sHandleButtons);
_emp.valid.connect(sHandleButtons);
_wo.newId.connect(sPopulateWooper);
_wo.valid.connect(sHandleButtons);

_close.clicked.connect(mywindow, "close");

_wooper.allowNull = true;
_wooper.visible = (metrics.value("WOTCPostStyle") == "Operations");
_wooperLit.visible = (metrics.value("WOTCPostStyle") == "Operations");

