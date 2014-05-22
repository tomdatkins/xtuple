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
  var _promisedDate  = mywindow.findChild("_promisedDate");
  var _warehouse     = mywindow.findChild("_warehouse");
  var _item          = mywindow.findChild("_item");

  if (metrics.boolean("UseSiteCalendar"))
    _item["newId(int)"].connect(setCal);
}
catch(e)
{
  QMessageBox.critical(mywindow, "transferOrderItem",
                       qsTr("transferOrderItem exception: ") + e);
}

function setCal()
{
  try
  {
    _scheduledDate.setCalendarSiteId(_warehouse.id());
    _promisedDate.setCalendarSiteId(_warehouse.id());
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "transferOrderItem",
                         qsTr("setCal exception: ") + e);
  }
}
