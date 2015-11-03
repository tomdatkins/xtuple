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

try
{
  var _newStartDate  = mywindow.findChild("_newStartDate");
  var _newDueDate    = mywindow.findChild("_newDueDate");
  var _wo            = mywindow.findChild("_wo");

  if (metrics.boolean("UseSiteCalendar"))
    _wo["newId(int)"].connect(setCal);
}
catch(e)
{
  QMessageBox.critical(mywindow, "rescheduleWo",
                       qsTr("rescheduleWo exception: ") + e);
}

function setCal()
{
  try
  {
    _newStartDate.setCalendarSiteId(_wo.currentWarehouse());
    _newDueDate.setCalendarSiteId(_wo.currentWarehouse());
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "rescheduleWo",
                         qsTr("setCal exception: ") + e);
  }
}