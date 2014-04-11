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
var _item       = mywindow.findChild("_item");
var _submit     = mywindow.findChild("_submit");
var _warehouse  = mywindow.findChild("_warehouse");

if (! metrics.boolean("EnableBatchManager"))
  _submit.hide();
  
var _captive = false;

if (! metrics.boolean("MultiWhs"))
{
  _warehouseLit.hide();
  _warehouse.hide();
}

function set(pParams)
{
  if ("itemsite_id" in pParams)
  {
    _captive = true;

    _item.setItemsiteid(param);
    _create.setFocus();
  }

  return mainwindow.NoError;
}

function setParams(params)
{
  params.item_id     = _item.id();
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
  var params = new Object;
  if (! setParams(params))
    return;

  var qry = toolbox.executeQuery(
             "SELECT xtmfg.createBufferStatus(itemsite_id) AS result "
           + "FROM itemsite "
           + 'WHERE ( (itemsite_item_id=<? value("item_id") ?>)'
           + ' AND (itemsite_active)'
           + ' AND (itemsite_warehous_id=<? value("warehous_id") ?>) );',
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

  if (_captive)
    mywindow.close();
  else
  {
    QMessageBox.information(mywindow, qsTr("Finished"),
                       qsTr("Buffer Status for %1 has been updated").arg(_item.number),
                       QMessageBox.Ok);
    _close.text = qsTr("&Close");

    _item.setId(-1);
    _item.setFocus();
  }
}

_close.clicked.connect(mywindow, "close");
_create.clicked.connect(sCreate);
_submit.clicked.connect(sSubmit);
