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
include("xtmfgErrors");

var modeVal;

modeVal = mywindow.mode("MaintainWarehouseWorkWeek");
mywindow.insert( qsTr("Site Week"), "whseWeek", setup.MasterInformation, Xt.ScheduleModule, modeVal, 0, "sSave()");

modeVal = mywindow.mode("MaintainWarehouseCalendarExceptions", "ViewWarehouseCalendarExceptions");
mywindow.insert( qsTr("Site Calendar Exceptions"), "whseCalendars", setup.MasterInformation, Xt.ScheduleModule, modeVal, modeVal);

if(metrics.boolean("Routings"))
{
  modeVal = mywindow.mode("MaintainWorkCenters", "ViewWorkCenters");
  mywindow.insert( qsTr("Work Centers"), "workCenters", setup.MasterInformation, Xt.ScheduleModule | Xt.ProductsModule, modeVal, modeVal);                                  

  modeVal = mywindow.mode("MaintainLaborRates", "ViewLaborRates");
  mywindow.insert( qsTr("Standard Labor Rates"), "laborRates", setup.MasterInformation, Xt.ProductsModule, modeVal, modeVal);

  modeVal = mywindow.mode("MaintainStandardOperations", "ViewStandardOperations");
  mywindow.insert( qsTr("Standard Operations"), "standardOperations", setup.MasterInformation, Xt.ProductsModule, modeVal, modeVal);

  modeVal = mywindow.mode("MaintainStandardOperations", "ViewStandardOperations");
  mywindow.insert( qsTr("Operation Types"), "operationTypes", setup.MasterInformation, Xt.ProductsModule, modeVal, modeVal);

  if (!xtmfgErrors.xtattendCheck()){
    modeVal = mywindow.mode("MaintainShifts", "ViewShifts");
    mywindow.insert( qsTr("Shifts"), "shifts", setup.MasterInformation, Xt.ProductsModule, modeVal, modeVal);
  }

}
