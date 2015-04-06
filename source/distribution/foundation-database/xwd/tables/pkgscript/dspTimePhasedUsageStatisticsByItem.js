/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

debugger;
try
{
  var _item = mywindow.findChild("_item");
  var _warehouse = mywindow.findChild("_warehouse");
  var _calendar = mywindow.findChild("_calendar");
}
catch (e)
{
  QMessageBox.critical(mywindow, "dspTimePhasedUsageStatisticsByItem",
                       qsTr("dspTimePhasedUsageStatisticsByItem.js exception: ") + e);
}

function set(params)
{
  try
  {
    if("warehous_id" in params)
    {
      _warehouse.setId(params.warehous_id);
    }

    if("item_id" in params)
    {
      _item.setId(params.item_id);

      var qry = "SELECT calhead_id "
              + "FROM calhead "
              + "WHERE (calhead_name='12MONTHBACK');";

      var data = toolbox.executeQuery(qry);
      if (data.first())
      {
        _calendar.setId(data.value("calhead_id"));
        mywindow.sFillList();
      }
      else if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        return;
      }

    }

    return mainwindow.NoError;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspTimePhasedUsageStatisticsByItem",
                         qsTr("set exception: ") + e);
  }
}
