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
  var _scheduledDate = mywindow.findChild("_scheduledDate");
  var _warehouse     = mywindow.findChild("_warehouse");

  if (metrics.boolean("UseSiteCalendar"))
    _warehouse["newID(int)"].connect(setCal);
}
catch(e)
{
  QMessageBox.critical(mywindow, "returnAuthorizationItem",
                       qsTr("returnAuthorizationItem exception: ") + e);
}

function setCal()
{
  try
  {
    _scheduledDate.setCalendarSiteId(_warehouse.id());
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "returnAuthorizationItem",
                         qsTr("setCal exception: ") + e);
  }
}
