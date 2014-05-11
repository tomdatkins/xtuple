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

include("ParameterGroupUtils", "storedProcErrorLookup", "xtmfgErrors");

try
{
  var _plannerCode      = mywindow.findChild("_plannerCode");
  var _item             = mywindow.findChild("_item");
  var _warehouse        = mywindow.findChild("_warehouse");
  var _cutoffDate       = mywindow.findChild("_cutoffDate");
  var _ok               = mywindow.findChild("_ok");
  var _filterhead       = mywindow.findChild("_filterhead");
  var _cutOffDate       = mywindow.findChild("_cutOffDate");

  var byItem = false;
  var byPlannerCode = false;

  _ok.clicked.connect(runMRP);
}
catch(e)
{
  QMessageBox.critical(mywindow, "runMRPException",
                       qsTr("runMRPException exception: ") + e);
}

function runMRP() 
{
  try
  {
    var params = new Object();
    if (! setParams(params))
      return;
    var data = toolbox.executeDbQuery("MRPExceptions", "run", params);
    if (data.first())
    {
      mydialog.accept();
    }
    else
    {
      mydialog.reject();
    }
  } 
  catch(e)
  {
    QMessageBox.critical(mywindow, "runMRPException",
                         qsTr("runMRP exception: ") + e);
  }
}

function set(params)
{
  try
  {
    if ("byPlannerCode" in params)
    {
      _plannerCode.show();
      _item.hide();
      byPlannerCode = true;
    }
    else
    {
      _item.show();
      _plannerCode.hide();
      byItem = true;
    }

    if ("plancode_id" in params)
      _plannerCode.setId(params.plancode_id);
    if ("item_id" in params)
      _item.setId(params.item_id);
    if ("warehous_id" in params)
      _warehouse.setId(params.warehous_id);
    else
      _warehouse.setAll();
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "runMRPException",
                         qsTr("set exception: ") + e);
  }
}

function setParams(params)
{
  try
  {  
    if (byPlannerCode)
      ParameterGroup.appendValue(_plannerCode, params); 

    if (_item.isValid() && byItem)
    {
      params.item_id = _item.id();
      params.byItem  = true;
    }
    else if (byItem)
    {
      QMessageBox.warning(mywindow, qsTr("Enter Item Number"),
                          qsTr("<p>You must enter a valid Item Number before "
                             + "creating Allocations."));
      _item.setFocus();
      return false;
    }
    if (_warehouse.isSelected && _warehouse.id() != -1)
      params.warehous_id = _warehouse.id();

    if (_cutOffDate.isValid())
      params.cutOffDate = _cutOffDate.date;
    else
    {
      QMessageBox.warning(mywindow, qsTr("Enter Cut Off Date"),
                        qsTr("<p>You must enter a valid Cut Off Date "
                           + "before creating Allocations."));
      _cutOffDate.setFocus();
      return false;
    }

    return true;
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "runMRPException",
                           qsTr("setParams exception: ") + e);
  }
}
