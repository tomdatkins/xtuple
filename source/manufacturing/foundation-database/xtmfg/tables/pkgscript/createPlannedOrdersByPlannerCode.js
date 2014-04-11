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

include("ParameterGroupUtils", "storedProcErrorLookup", "xtmfgErrors");

try
{
  var _plannerCode = mywindow.findChild("_plannerCode");
  var _warehouse = mywindow.findChild("_warehouse");
  var _cutOffDate = mywindow.findChild("_cutOffDate");
  var _deleteFirmed = mywindow.findChild("_deleteFirmed");
  var _buttonBox   = mywindow.findChild("_buttonBox");

  toolbox.coreDisconnect(_buttonBox, "accepted()", mywindow, "sCreate()");
  _buttonBox.accepted.connect(create);

  var layout = toolbox.widgetGetLayout(_warehouse);
  var _createExcp = toolbox.createWidget("XCheckBox", mywindow, "_createExcp");
  _createExcp.text = qsTr("&Create MRP Exceptions");
  layout.insertWidget(4, _createExcp, 0, 0);

}
catch (e)
{
  QMessageBox.critical(mywindow, "createPlannedOrdersByPlannerCode",
                       qsTr("createPlannedOrdersByPlannerCode exception: ") + e);
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

    params.action_name = "RunMRP";
    params.MPS = false;
    params.planningType = "M";
    ParameterGroup.appendValue(_plannerCode, params);
    if (_warehouse.isSelected())
      params.warehous_id = _warehouse.id();
    var now = new Date();
    params.cutoff_offset = Math.ceil((_cutOffDate.date.getTime() - now.getTime()) / (1000*60*60*24));
    if (_deleteFirmed.checked)
      params.deleteFirmed = true;
    if (_createExcp.checked)
      params.createExcp = true;

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "createPlannedOrdersByPlannerCode",
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

    mywindow.sCreate(params);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "createPlannedOrdersByPlannerCode",
                        qsTr("create() exception: ") + e);
  }
}
