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

include("xcheckbox.h");

try
{
  var _item = mywindow.findChild("_item");
  var _warehouse = mywindow.findChild("_warehouse");
  var _cutOffDate = mywindow.findChild("_cutOffDate");
  var _explodeChildren = mywindow.findChild("_explodeChildren");
  var _deleteFirmed = mywindow.findChild("_deleteFirmed");
  var _create   = mywindow.findChild("_create");
  var _close = mywindow.findChild("_close");

  var _captive = false;

  toolbox.coreDisconnect(_create, "clicked()", mywindow, "sCreate()");
  _create.clicked.connect(create);

  var layout = toolbox.widgetGetLayout(_deleteFirmed);
  var _createExcp = toolbox.createWidget("XCheckBox", mywindow, "_createExcp");
  _createExcp.text = qsTr("&Create MRP Exceptions");
  layout.insertWidget(4, _createExcp, 0, 0);
}
catch (e)
{
  QMessageBox.critical(mywindow, "createPlannedOrdersByItem",
                       qsTr("createPlannedOrdersByItem exception: ") + e);
}

function setParams(params)
{
  try
  {
    if (_cutOffDate.isValid())
      params.cutOffDate = _cutOffDate.date;
    else
    {
      QMessageBox.warning(mywindow, qsTr("Enter Cut Off Date"),
                          qsTr("<p>You must enter a valid Cut Off Date before "
                              +"creating Planned Orders."));
      _cutOffDate.setFocus();
      return false;
    }

    if (_deleteFirmed.checked)
      params.deleteFirmed = true;

    params.item_id = _item.id();
    params.warehous_id = _warehouse.id();
    params.byItem = true;

    if (_createExcp.checked)
      params.createExcp = true;

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "createPlannedOrdersByItem",
                         qsTr("setParams() exception: ") + e);
  }
}

function create()
{
  try
  {
    var params = new Object;
    if (!(setParams(params)))
      return;

    if (!_explodeChildren.checked)
    {
      var qry = "SELECT createPlannedOrders(itemsite_id,"
              + "         <? value('cutOffDate') ?>, <? value('deleteFirmed') ?>,"
              + "         false, <? value('createExcp') ?>) AS result "
              + "FROM itemsite "
              + "WHERE ((itemsite_item_id=<? value('item_id') ?>)"
              + "   AND (itemsite_active)"
              + "   AND (itemsite_warehous_id=<? value('warehous_id') ?>));";
      var data = toolbox.executeQuery(qry, params);
    }
    else
    {
      var qry = "SELECT createAndExplodePlannedOrders(itemsite_id,"
              + "         <? value('cutOffDate') ?>, <? value('deleteFirmed') ?>,"
              + "         false, <? value('createExcp') ?>) AS result "
              + "FROM itemsite "
              + "WHERE ((itemsite_item_id=<? value('item_id') ?>)"
              + "   AND (itemsite_active)"
              + "   AND (itemsite_warehous_id=<? value('warehous_id') ?>));";
      var data = toolbox.executeQuery(qry, params);
    }

    if (_captive)
      accept();
    else
    {
      _close.text = qsTr("&Close") ;
      _item.setId(-1);
      _item.setFocus();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "createPlannedOrdersByItem",
                         qsTr("create() exception: ") + e);
  }
}
