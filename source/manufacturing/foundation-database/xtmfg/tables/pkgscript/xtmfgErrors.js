/* This file is part of the xtmfg Package for xTuple ERP, and is
 * Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

var xtmfgErrors = new Object;

xtmfgErrors.deleteWooper = new Object;
xtmfgErrors.deleteWooper[-1] = qsTr("The selected W/O Operation cannot be deleted because there has been Setup Time posted against it.");
xtmfgErrors.deleteWooper[-2] = qsTr("The selected W/O Operation cannot be deleted because there has been Run Time posted against it.");
xtmfgErrors.deleteWooper[-3] = qsTr("The selected W/O Operation cannot be deleted because there has been Quantity posted against it.");
xtmfgErrors.deleteWooper[-4] = qsTr("The selected W/O Operation cannot be deleted because there are Shop Floor Clock-in's posted against it.");
xtmfgErrors.deleteWorkCenter = new Object;
xtmfgErrors.deleteWorkCenter[-1] = qsTr("The selected Work Center cannot be deleted because there has been history posted against it.");
xtmfgErrors.deleteWorkCenter[-2] = qsTr("The selected Work Center cannot be deleted because Standard Operations exist that use it. You must reassign all Standard Operations that use the selected Work Center to a different Work Center before you may delete it.");
xtmfgErrors.deleteWorkCenter[-3] = qsTr("The selected Work Center cannot be deleted because Routing Items exist that use it. You must reassign all Routing Items that use the selected Work Center to a different Work Center before you may delete it.");
xtmfgErrors.deleteWorkCenter[-4] = qsTr("The selected Work Center cannot be deleted because Work Orders exist that use it. You must complete or close all Work Orders that use the selected Work Center before you may delete it.");
xtmfgErrors.deleteItem = new Object;
xtmfgErrors.deleteItem[-1] = qsTr("This Item cannot be deleted as it is used in one or more Bills of Materials.");
xtmfgErrors.deleteItem[-2] = qsTr("This Item cannot be deleted as there are Item Site records associated with it.");
xtmfgErrors.deleteItem[-3] = qsTr("This Item cannot be deleted as there are Substitute records associated with it.");
xtmfgErrors.deleteItem[-4] = qsTr("This Item cannot be deleted as there are Breeder BOM records associated with it.");
xtmfgErrors.deleteItem[-5] = qsTr("This Item cannot be deleted as there are assignement records associated with it.");
xtmfgErrors.deleteItem[-6] = qsTr("This Item cannot be deleted as there are Revision Control records associated with it.");
xtmfgErrors.woClockIn = new Object;
xtmfgErrors.woClockIn[-12] = qsTr("ClockIn failed.  The selected Work Order is closed.");
xtmfgErrors.woClockIn[-13] = qsTr("ClockIn failed.  This user is already clocked into this Work Order.");

xtmfgErrors.errorCheck = function (q)
{
  if (q.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                        qsTr("Database Error"), q.lastError().text);
    return false;
  }

  return true;
}

xtmfgErrors.xtattendCheck = function () {
// Checks for presence of xtattend entension package as there are some conflicting scripts that need to be
// turned on/off depending if this is installed.
  var attend = toolbox.executeQuery("SELECT pkghead_id FROM public.pkghead WHERE pkghead_name = 'xtattend';", new Object);
  if (attend.first())
    return true;
  else
    return false;
}