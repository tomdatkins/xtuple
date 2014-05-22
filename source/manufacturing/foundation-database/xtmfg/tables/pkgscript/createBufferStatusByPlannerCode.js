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

var _close      = mywindow.findChild("_close");
var _create     = mywindow.findChild("_create");
var _plannerCode= mywindow.findChild("_plannerCode");
var _submit     = mywindow.findChild("_submit");
var _warehouse  = mywindow.findChild("_warehouse");

if (! metrics.boolean("EnableBatchManager"))
  _submit.hide();

_plannerCode.type = ParameterGroup.PlannerCode;

function setParams(params)
{
  ParameterGroup.appendValue(_plannerCode, params);

  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  params.action_name = "CreateBufferStatus";

  return true;
}

function sSubmit()
{
  var params = new Object;
  if (! setParams(params))
    return;

  var newdlg = toolbox.openWindow("submitAction", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);

  if (newdlg.exec() == QDialog.Accepted)
    mywindow.close();
}

function sCreate()
{
print("sCreate entered");
  var params = new Object;
  if (! setParams(params))
    return;

  var qry = toolbox.executeQuery(
               "SELECT xtmfg.createBufferStatus(itemsite_id) AS result "
             + "FROM (SELECT itemsite_id "
             + "        FROM itemsite, item, plancode "
             + "       WHERE ( (itemsite_plancode_id=plancode_id)"
             + "         AND (itemsite_active)"
             + "         AND (item_active)"
             + "         AND (itemsite_item_id=item_id)"
             + '<? if exists("plancode_id") ?>'
             + '         AND (plancode_id=<? value("plancode_id") ?>)'
             + '<? elseif exists("plancode_pattern") ?>'
             + '         AND (plancode_code ~ <? value("plancode_pattern") ?>)'
             + '<? endif ?>'
             + '<? if exists("warehous_id") ?>'
             + '         AND (itemsite_warehous_id=<? value("warehous_id") ?>)'
             + '<? endif ?>'
             + ")) AS data;",
             params);
  if (qry.first())
  {
    var result = qry.value("result");
    if (result < 0)
    {
      QMessageBox.critical(mywindow, qsTr("Application Error"),
                         storedProcErrorLookup("createBufferStatus", result));
      return;
    }
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError.text);
    return;
  }

  mywindow.close();
}

_close.clicked.connect(mywindow, "close");
_create.clicked.connect(sCreate);
_submit.clicked.connect(sSubmit);

include("ParameterGroupUtils");
