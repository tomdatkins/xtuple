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

var _dirty = false;
var _warehousid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _save      = mywindow.findChild("_save");
var _close     = mywindow.findChild("_close");
var _warehouse = mywindow.findChild("_warehouse");
var _sunday    = mywindow.findChild("_sunday");
var _monday    = mywindow.findChild("_monday");
var _tuesday   = mywindow.findChild("_tuesday");
var _wednesday = mywindow.findChild("_wednesday");
var _thursday  = mywindow.findChild("_thursday");
var _friday    = mywindow.findChild("_friday");
var _saturday  = mywindow.findChild("_saturday");

function sSave()
{
  return save(_warehouse.id())
}

function save(whsid)
{
  var params = new Object;
  params.whsid = whsid;
  params.sunday = _sunday.checked;
  params.monday = _monday.checked;
  params.tuesday = _tuesday.checked;
  params.wednesday = _wednesday.checked;
  params.thursday = _thursday.checked;
  params.friday = _friday.checked;
  params.saturday = _saturday.checked;

  var qry = toolbox.executeQuery("SELECT xtmfg.setWhseWkday(<? value('whsid') ?>, 0, <? value('sunday') ?>),"
                                +"       xtmfg.setWhseWkday(<? value('whsid') ?>, 1, <? value('monday') ?>),"
                                +"       xtmfg.setWhseWkday(<? value('whsid') ?>, 2, <? value('tuesday') ?>),"
                                +"       xtmfg.setWhseWkday(<? value('whsid') ?>, 3, <? value('wednesday') ?>),"
                                +"       xtmfg.setWhseWkday(<? value('whsid') ?>, 4, <? value('thursday') ?>),"
                                +"       xtmfg.setWhseWkday(<? value('whsid') ?>, 5, <? value('friday') ?>),"
                                +"       xtmfg.setWhseWkday(<? value('whsid') ?>, 6, <? value('saturday') ?>);", params);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return false;
  }

  _dirty = false
  return true;
}

function closeEvent(closeEvent)
{
  if(checkAndSave())
    closeEvent.accept();
  else
    closeEvent.ignore();
}

function checkAndSave()
{
  if(_dirty)
  {
    var answer = QMessageBox.question(mywindow, qsTr("Unsaved Changes"),
                       qsTr("There are unsaved changes. Would you like to save before continuing?"),
                       QMessageBox.Yes | QMessageBox.No | QMessageBox.Cancel,
                       QMessageBox.Yes);
    if(answer == QMessageBox.Cancel)
      return false;
    else if(answer == QMessageBox.Yes)
      return save(_warehousid);
    
  }

  return true;
}

function sChange()
{
  _dirty = true;
}

function populate()
{
  if(!checkAndSave())
  {
    _warehouse.setId(_warehousid);
    return;
  }

  _warehousid = _warehouse.id();

  var params = new Object;
  params.warehous_id = _warehousid;


  var qstr = "SELECT true AS result"
            +"  FROM xtmfg.whsewk"
            +" WHERE((whsewk_warehous_id = <? value('warehous_id') ?>)"
            +"   AND (whsewk_weekday=<? value('wkday') ?>));";

  params.wkday = 0;
  var qry = toolbox.executeQuery(qstr, params);
  var result = false;
  if(qry.first())
    result = qry.value("result");
  _sunday.checked = result;

  params.wkday = 1;
  qry = toolbox.executeQuery(qstr, params);
  result = false;
  if(qry.first())
    result = qry.value("result");
  _monday.checked = result;

  params.wkday = 2;
  qry = toolbox.executeQuery(qstr, params);
  result = false;
  if(qry.first())
    result = qry.value("result");
  _tuesday.checked = result;

  params.wkday = 3;
  qry = toolbox.executeQuery(qstr, params);
  result = false;
  if(qry.first())
    result = qry.value("result");
  _wednesday.checked = result;

  params.wkday = 4;
  qry = toolbox.executeQuery(qstr, params);
  result = false;
  if(qry.first())
    result = qry.value("result");
  _thursday.checked = result;

  params.wkday = 5;
  qry = toolbox.executeQuery(qstr, params);
  result = false;
  if(qry.first())
    result = qry.value("result");
  _friday.checked = result;

  params.wkday = 6;
  qry = toolbox.executeQuery(qstr, params);
  result = false;
  if(qry.first())
    result = qry.value("result");
  _saturday.checked = result;

  _dirty = false;
}

_warehouse.newID.connect(populate);
_sunday.toggled.connect(sChange);
_monday.toggled.connect(sChange);
_tuesday.toggled.connect(sChange);
_wednesday.toggled.connect(sChange);
_thursday.toggled.connect(sChange);
_friday.toggled.connect(sChange);
_saturday.toggled.connect(sChange);

populate();

