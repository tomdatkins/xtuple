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

var _pschheadid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _copy    = mywindow.findChild("_copy");
var _cancel  = mywindow.findChild("_cancel");
var _newDate = mywindow.findChild("_newDate");
var _oldDate = mywindow.findChild("_oldDate");
var _scheduleName = mywindow.findChild("_scheduleName");
var _offset  = mywindow.findChild("_offset");
var _number  = mywindow.findChild("_number");

function set(params)
{
  if("pschhead_id" in params)
  {
    _pschheadid = params.pschhead_id;

    var params = new Object;
    params.pschhead_id = _pschheadid;
    var qry = toolbox.executeQuery("SELECT pschhead_number, pschhead_start_date FROM xtmfg.pschhead WHERE(pschhead_id=<? value('pschhead_id') ?>);", params);
    if(qry.first())
    {
      _scheduleName.text = qry.value("pschhead_number");
      _oldDate.date = qry.value("pschhead_start_date");
    }
  }

  return 0;
}

function sCopy()
{
  var lNumber = _number.text.toUpperCase();

  if (lNumber.length == 0)
  {
    QMessageBox.critical(mywindow, qsTr("Incomplete Data"),
                       qsTr("You have not specified a Number for the new schedule."));
    _number.setFocus();
    return;
  }

  var params = new Object;
  params.pschhead_number = lNumber;
  var qry = toolbox.executeQuery("SELECT pschhead_id "
                                +"  FROM xtmfg.pschhead "
                                +" WHERE(pschhead_number=<? value('pschhead_number') ?>) "
                                +"LIMIT 1;", params);
  if (qry.first())
  {
    QMessageBox.critical(mywindow, qsTr("Invalid Number"),
                       qsTr("The Number you specified for this Planned Schedule already exists."));
    _number.text = "";
    _number.setFocus();
    return;
  }

  if (!_newDate.isValid())
  {
    QMessageBox.critical(mywindow,
                       qsTr("Incomplete data"),
                       qsTr("You must specify a new Start Date for the copied schedule."));
    _newDate.setFocus();
    return;
  }

  params.pschhead_id = _pschheadid;
  params.pschhead_number = lNumber;
  params.newdate = _newDate.date;

  toolbox.executeQuery("SELECT xtmfg.copyPlannedSchedule(<? value('pschhead_id') ?>, <? value('pschhead_number') ?>, <? value('newdate') ?>) AS result;", params);

  mydialog.accept();
}

function sHandleDates()
{
  var offset = Math.ceil((_newDate.date.getTime() - _oldDate.date.getTime()) / (1000*60*60*24));
  _offset.text = qsTr("%1 day(s)").arg(offset);
}

_copy.clicked.connect(sCopy);
_newDate.newDate.connect(sHandleDates);

_cancel.clicked.connect(mydialog, "reject");

