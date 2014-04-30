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

// create a script var for each child of mywindow with an objectname starting _
var _close  = mywindow.findChild("_close");
var _create = mywindow.findChild("_create");
var _submit = mywindow.findChild("_submit");
var _cutOffDate = mywindow.findChild("_cutOffDate");
var _warehouse = mywindow.findChild("_warehouse");
var _plannerCode = mywindow.findChild("_plannerCode");

function setParams(params)
{
  if(!_cutOffDate.isValid())
  {
    QMessageBox.warning(mywindow,
                       qsTr("Enter Cut Off Date"),
                       qsTr("<p>You must enter a valid Cut Off Date before creating Planned Orders."));
    _cutOffDate.setFocus();
    return false;
  }

  params.action_name = "RunMPS";

  params.MPS = true;
  params.planningType = "S";
  if(_warehouse.isSelected())
    params.warehous_id = _warehouse.id();
  if(_plannerCode.isSelected())
    params.plancode_id = _plannerCode.id();
  else if(_plannerCode.isPattern())
    params.plancode_pattern = _plannerCode.pattern;
  

  params.cutOffDate = _cutOffDate.date;
  var now = new Date();
  params.cutoff_offset = Math.ceil((_cutOffDate.date.getTime() - now.getTime()) / (1000*60*60*24));

  params.deleteFirmed = true;

  return true;
}

function sCreate()
{
  var params = new Object;
  if(!setParams(params))
    return;

  var qryload = toolbox.executeDbQuery("schedule", "load", params);
  if (qryload.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qryload.lastError().text);
    return;
  }
  while (qryload.next())
  {
    params.itemsite_id = qryload.value("itemsite_id");
    var qrycreate = toolbox.executeDbQuery("schedule", "create", params);
    if (qrycreate.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qrycreate.lastError().text);
      return;
    }
  }

  mywindow.close();
}

function sSubmit()
{
  var params = new Object;
  if(!setParams(params))
    return;

  var wnd = toolbox.openWindow("submitAction", mywindow, Qt.Modal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  var result = wnd.exec();
  if(result == 1)
    mywindow.close();
}

_create.clicked.connect(sCreate);
_submit.clicked.connect(sSubmit);

_close.clicked.connect(mywindow, "close");

_submit.visible = metrics.boolean("EnableBatchManager");

