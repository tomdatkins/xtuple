/**
 * This file is part of the xDruple for xTuple ERP, and is
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

//debugger;

if (metrics.boolean("EnableBatchManager"))
{
  modeVal = mywindow.mode("MaintainEDIProfiles");
  mywindow.insert( qsTr("EDI Profiles"), "ediProfiles", setup.MasterInformation, Xt.SystemModule, modeVal, modeVal);
}

modeVal = mywindow.mode("ConfigDatabaseInfo");
mywindow.insert(qsTr("xDruple Integration"), "xdrupleSiteList", setup.Configure, Xt.SystemModule, modeVal, modeVal, "xtConnect.setup.save");
