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
  var _rsnCode = mywindow.findChild("_rsnCode");

  var _layout  = toolbox.widgetGetLayout(_warehouse);

  var _search = toolbox.createWidget("QPushButton", mywindow, "_search");
  _search.text = qsTr("&Item/Alias Search");
  _layout.addWidget(_search, 0, 2);

  _search.clicked.connect(sItemAliasSearch);
}
catch (e)
{
  QMessageBox.critical(mywindow, "creditMemoItem",
                       qsTr("creditMemoItem.js exception: ") + e);
}

function sItemAliasSearch()
{
  try
  {
    var params = new Object();
    params.captive = true;
    var newdlg = toolbox.openWindow("itemAliasList", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = newdlg.exec();
//    QMessageBox.critical(mywindow, "creditMemoItem",
//                         qsTr("result=") + result);
    if (result != 0)
    {
      if (result > 0)
        _item.setId(result);
      else
      {
        params.itemalias_id = (result * -1);
        var qry = "SELECT * FROM itemalias WHERE itemalias_id=<? value('itemalias_id') ?>;"
        var data = toolbox.executeQuery(qry, params);
        if (data.first())
        {
          _item.setId(data.value("itemalias_item_id"));
        }
        else if (data.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
          return;
        }
      }
      _rsnCode.setFocus();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "creditMemoItem",
                         qsTr("sProductCatalog exception: ") + e);
  }
}
