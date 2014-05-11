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
debugger;

var _mode = "new";
var _pschheadid = -1;
var _presaved = false;

// create a script var for each child of mywindow with an objectname starting _
var _save         = mywindow.findChild("_save");
var _cancel       = mywindow.findChild("_cancel");
var _new          = mywindow.findChild("_new");
var _edit         = mywindow.findChild("_edit");
var _copy         = mywindow.findChild("_copy");
var _delete       = mywindow.findChild("_delete");
var _actinact     = mywindow.findChild("_actinact");
var _list         = mywindow.findChild("_list");
var _warehouseLit = mywindow.findChild("_warehouseLit");
var _warehouse    = mywindow.findChild("_warehouse");
var _number       = mywindow.findChild("_number");
var _descrip      = mywindow.findChild("_descrip");
var _dates        = mywindow.findChild("_dates");
var _schedtype    = mywindow.findChild("_schedtype");
var _status       = mywindow.findChild("_status");

var _debug = false;

_list.addColumn(qsTr("#"),            -1, Qt.AlignRight,  true, "pschitem_linenumber");
_list.addColumn(qsTr("Planned Date"), -1, Qt.AlignCenter, true, "pschitem_scheddate");
_list.addColumn(qsTr("Item Number"),  -1, Qt.AlignLeft,   true, "item_number");
_list.addColumn(qsTr("Qty"),          -1, Qt.AlignRight,  true, "pschitem_qty");
_list.addColumn(qsTr("Status"),       -1, Qt.AlignCenter, true, "pschitem_status");

function set(params)
{
  if (_debug) print("plannedSchedule set called");
  try {
    if("pschhead_id" in params)
    {
      _pschheadid = params.pschhead_id;
      populate();
    }

    if("mode" in params)
    {
      if (params.mode == "new")
      {
        _mode = "new";
        var qry = toolbox.executeQuery("SELECT nextval('xtmfg.pschhead_pschhead_id_seq') AS pschhead_id;");
        if(qry.first())
          _pschheadid = qry.value("pschhead_id");
        else
        {
          QMessageBox.critical(mywindow,
                               qsTr("A System Error Occurred"),
                               qsTr("Was unable to acquire a new id for the the planned schedule. Please contact your System's Administrator."));
          return mainwindow.UndefinedError;
        }
        _new.enabled = false;
        _number.setFocus();
      }
      else if (params.mode == "edit")
      {
        _mode = "edit";
        _number.enabled = false;
        _warehouse.enabled = false;
        _descrip.setFocus();
      }
      else if (params.mode == "view")
      {
        _mode = "view";
        _number.enabled = false;
        _descrip.enabled = false;
        _dates.enabled = false;
        _warehouse.enabled = false;
        _schedtype.enabled = false;
        _save.visible = false;
        _cancel.setFocus();
      }
    }
    return mainwindow.NoError;
  } catch(e) {
    print("plannedSchedule set exception @ " + e.lineNumber + ": " + e);
  }
}

function sSave()
{
  if (_debug) print("plannedSchedule sSave called");
  try {
    var params = new Object;
    params.pschhead_id = _pschheadid;
    params.startDate = _dates.startDate;
    params.endDate = _dates.endDate;
    var qry = toolbox.executeQuery("SELECT pschitem_id "
                                  +"  FROM xtmfg.pschitem "
                                  +" WHERE ((pschitem_scheddate NOT BETWEEN <? value('startDate') ?> AND <? value('endDate') ?>) "
                                  +"   AND  (pschitem_pschhead_id=<? value('pschhead_id') ?>)); ", params);
    if(qry.first())
    {
      QMessageBox.warning(mywindow, qsTr("Scheduled Items Out of Date Range"),
                          qsTr("<p>One or more of the Scheduled Items is outside "
                             + "the specified date range for this Planned "
                             + "Schedule. Please fix this before continuing."));
      return;
    }

    if (_schedtype.currentIndex == -1)
    {
      QMessageBox.warning(mywindow, qsTr("Cannot Save Schedule"),
                          qsTr("You must select a schedule type for this Schedule before creating it."));
      _schedtype.setFocus();
      return;
    }

    if(!_dates.allValid())
    {
      QMessageBox.critical( mywindow,
                            qsTr("Cannot Save Schedule"),
                            qsTr("You must enter a valid Start and End Date for this Schedule before creating it."));
      _dates.setFocus();
      return;
    }

    if(_dates.endDate < _dates.startDate)
    {
      QMessageBox.critical( mywindow,
                            qsTr("Cannot Save Schedule"),
                            qsTr("The End Date cannot be earlier than the Start Date."));
      _dates.setFocus();
      return;
    }

    if(_number.text.length == 0)
    {
      QMessageBox.critical( mywindow,
                            qsTr("Cannot Save Schedule"),
                            qsTr("You must enter a Schedule Number for this Schedule before creating it."));
      _number.setFocus();
      return;
    }

    var q_str = "";
    if (_mode == "new" && _presaved != true)
    {
      q_str = "INSERT INTO xtmfg.pschhead "
             +"      (pschhead_id, pschhead_number, pschhead_warehous_id,"
             +"       pschhead_descrip,"
             +"       pschhead_start_date, pschhead_end_date, pschhead_type) "
             +"VALUES(<? value('pschhead_id') ?>, <? value('number') ?>, <? value('warehous_id') ?>,"
             +"       <? value('descrip') ?>,"
             +"       <? value('startDate') ?>, <? value('endDate') ?>, <? value('schedtype') ?>);";
    }
    else
    {
      q_str = "UPDATE xtmfg.pschhead "
             +"   SET pschhead_descrip=<? value('descrip') ?>,"
             +"       pschhead_start_date=<? value('startDate') ?>,"
             +"       pschhead_end_date=<? value('endDate') ?>,"
             +"       pschhead_type=<? value('schedtype') ?> "
             +" WHERE (pschhead_id=<? value('pschhead_id') ?>);";
    }

    var params = new Object;
    params.pschhead_id = _pschheadid;
    params.number = _number.text;
    params.descrip = _descrip.text;
    params.warehous_id = _warehouse.id();
    params.startDate = _dates.startDate;
    params.endDate = _dates.endDate;
    if(_schedtype.currentIndex == 0)
      params.schedtype = "F";
    else if(_schedtype.currentIndex == 1)
      params.schedtype = "N";
    else if(_schedtype.currentIndex == 2)
      params.schedtype = "P";

    toolbox.executeQuery(q_str, params);

    mydialog.accept();
  } catch(e) {
    print("plannedSchedule sSave exception @ " + e.lineNumber + ": " + e);
  }
}

function rejected()
{
  if (_debug) print("plannedSchedule rejected called");
  try {
    if(_mode == "new")
    {
      var params = new Object;
      params.pschhead_id = _pschheadid;
      toolbox.executeQuery("DELETE FROM xtmfg.pschitem WHERE pschitem_pschhead_id=<? value('pschhead_id') ?>;", params);
      toolbox.executeQuery("DELETE FROM xtmfg.pschhead WHERE pschhead_id=<? value('pschhead_id') ?>;", params);
    }
  } catch(e) {
    print("plannedSchedule rejected exception @ " + e.lineNumber + ": " + e);
  }
}

function sNumberChanged()
{
  if (_debug) print("plannedSchedule sNumberChanged called");
  try {
    if(_mode != "new")
      return;

    _number.text = _number.text.toUpperCase();

    if(_number.text.length == 0)
      return;

    var params = new Object;
    params.pschhead_id = _pschheadid;
    params.pschhead_number = _number.text;
    var qry = toolbox.executeQuery("SELECT pschhead_id "
                                  +"  FROM xtmfg.pschhead "
                                  +" WHERE((pschhead_id <> <? value('pschhead_id') ?>)"
                                  +"   AND (pschhead_number=<? value('pschhead_number') ?>));", params);

    if(qry.first())
    {
      QMessageBox.critical(mywindow, qsTr("Invalid Number"),
                           qsTr("The Number you specified for this Planned Schedule already exists."));
      _number.text = "";
      _number.setFocus();
      return;
    }

    _new.enabled = true;
  } catch(e) {
    print("plannedSchedule sNumberChanged exception @ " + e.lineNumber + ": " + e);
  }
}

function openScheduleItem(params)
{
  if (_debug) print("plannedSchedule openScheduleItem called");
  try {
    var schedule = toolbox.openWindow("plannedScheduleItem", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = schedule.exec();
    if(result != 0)
      sFillList();
  } catch(e) {
    print("plannedSchedule openScheduleItem exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  if (_debug) print("plannedSchedule sNew called");
  try {
    if("new" == _mode && _presaved != true)
    {
      var params2 = new Object;
      params2.pschhead_id = _pschheadid;
      params2.number = _number.text.toUpperCase();
      params2.warehous_id = _warehouse.id();
      var qry = toolbox.executeQuery("INSERT INTO xtmfg.pschhead "
                                    +"      (pschhead_id, pschhead_number, pschhead_warehous_id,"
                                    +"       pschhead_start_date, pschhead_end_date) "
                                    +"VALUES(<? value('pschhead_id') ?>, <? value('number') ?>, <? value('warehous_id') ?>,"
                                    +"       startOfTime(), startOfTime());", params2);
      if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return;
      }

      _number.enabled = false;
      _warehouse.enabled =false;
      _presaved = true;
    }

    var params = new Object;
    params.mode = "new";
    params.pschhead_id = _pschheadid;
    params.warehous_id = _warehouse.id();

    openScheduleItem(params);
  } catch(e) {
    print("plannedSchedule sNew exception @ " + e.lineNumber + ": " + e);
  }
}

function sEdit()
{
  if (_debug) print("plannedSchedule sEdit called");
  try {
    var params = new Object;
    if("view" == _mode)
      params.mode = "view";
    else
      params.mode = "edit";
    params.pschitem_id = _list.id();

    openScheduleItem(params);
  } catch(e) {
    print("plannedSchedule sEdit exception @ " + e.lineNumber + ": " + e);
  }
}

function sCopy()
{
  if (_debug) print("plannedSchedule sCopy called");
  try {
    if("view" == _mode)
      return;

    var params = new Object;
    params.mode = "copy";
    params.pschitem_id = _list.id();

    openScheduleItem(params);
  } catch(e) {
    print("plannedSchedule sCopy exception @ " + e.lineNumber + ": " + e);
  }
}

function sDelete()
{
  if (_debug) print("plannedSchedule sDelete called");
  try {
    if (QMessageBox.question(mywindow, qsTr("Delete Selected Planned Item?"),
                             qsTr("<p>Are you sure that you want to delete the selected\nPlanned Item?"),
                             QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;

    var params = new Object;
    params.pschitem_id = _list.id();
    toolbox.executeQuery("DELETE FROM xtmfg.pschitem WHERE (pschitem_id=<? value('pschitem_id') ?>);", params);
    sFillList();
  } catch(e) {
    print("plannedSchedule sDelete exception @ " + e.lineNumber + ": " + e);
  }
}

function sActInact()
{
  if (_debug) print("plannedSchedule sActInact called");
  try {
    var params = new Object;
    params.pschitem_id = _list.id();
    if (_list.rawValue("pschitem_status") == "O")
      params.status = "X";
    else
      params.status = "O";
    toolbox.executeQuery("UPDATE xtmfg.pschitem SET pschitem_status = <? value('status') ?> "
                        +" WHERE (pschitem_id=<? value('pschitem_id') ?>);", params);
    sFillList();
  } catch(e) {
    print("plannedSchedule sActInact exception @ " + e.lineNumber + ": " + e);
  }
}

function populate()
{
  if (_debug) print("plannedSchedule populate called");
  try {
    var params = new Object;
    params.pschhead_id = _pschheadid;
    var qry = toolbox.executeQuery("SELECT * "
                                  +"  FROM xtmfg.pschhead "
                                  +" WHERE(pschhead_id=<? value('pschhead_id') ?>);", params);
    if(qry.first())
    {
      _number.text = qry.value("pschhead_number");
      _descrip.text = qry.value("pschhead_descrip");
      _warehouse.setId(qry.value("pschhead_warehous_id"));
      _dates.startDate = qry.value("pschhead_start_date");
      _dates.endDate = qry.value("pschhead_end_date");
      if (qry.value("pschhead_status") == "U")
        _status.text = qsTr("Unreleased");
      else if (qry.value("pschhead_status") == "R")
        _status.text = qsTr("Released");
      else
        _status.text = qry.value("pschhead_status");
      if (qry.value("pschhead_type") == "F")
        _schedtype.currentIndex = 0;
      else if (qry.value("pschhead_type") == "N")
        _schedtype.currentIndex = 1;
      else if (qry.value("pschhead_type") == "P")
        _schedtype.currentIndex = 2;
      else
        _schedtype.currentIndex = -1;

      _number.enabled = false;
      _warehouse.enabled = false;
      _new.enabled = true;

      sFillList();
    }
  } catch(e) {
    print("plannedSchedule populate exception @ " + e.lineNumber + ": " + e);
  }
}

function sFillList()
{
  if (_debug) print("plannedSchedule sFillList called");
  try {
    var params = new Object;
    params.pschhead_id = _pschheadid;
    params.active = "Active";
    params.inactive = "Inactive";
    var qry = toolbox.executeDbQuery("plannedSchedule", "detail", params);
    _list.populate(qry);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  } catch(e) {
    print("plannedSchedule sFillList exception @ " + e.lineNumber + ": " + e);
  }
}

_save.clicked.connect(sSave);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_copy.clicked.connect(sCopy);
_delete.clicked.connect(sDelete);
_actinact.clicked.connect(sActInact);
_number.editingFinished.connect(sNumberChanged);

_cancel.clicked.connect(mydialog, "reject");
mydialog.rejected.connect(rejected);

if(!metrics.boolean("MultiWhs"))
{
  _warehouseLit.visible = false;
  _warehouse.visible = false;
}
