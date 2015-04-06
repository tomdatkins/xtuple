debugger;

try
{
  if(privileges.check("MaintainItemSites"))
  {
    var _item = mywindow.findChild("_item");
    var _warehouse = mywindow.findChild("_warehouse");
    var _reorderLevel = mywindow.findChild("_reorderLevel");
    var _orderMultiple = mywindow.findChild("_orderMultiple");
    var _orderToQty = mywindow.findChild("_orderToQty");

    _reorderLevel.enabled = true;
    _orderMultiple.enabled = true;
    _orderToQty.enabled = true;

    _reorderLevel.editingFinished.connect(sReorderLevel);
    _orderMultiple.editingFinished.connect(sOrderMultiple);
    _orderToQty.editingFinished.connect(sOrderToQty);
  }
}
catch (e)
{
  QMessageBox.critical(mywindow, "dspRunningAvailability",
                       "dspRunningAvailability.js exception: " + e);
}

function sReorderLevel()
{
  try
  {
    var params = new Object;
    params.item_id = _item.id();
    params.warehous_id = _warehouse.id();
    params.reorderlevel = _reorderLevel.toDouble();
    var qry = "UPDATE itemsite SET itemsite_reorderlevel=<? value('reorderlevel') ?> "
            + "WHERE (itemsite_item_id=<? value('item_id') ?>)"
            + "  AND (itemsite_warehous_id=<? value('warehous_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspRunningAvailability",
                         "sReorderLevel exception: " + e);
  }
}

function sOrderMultiple()
{
  try
  {
    var params = new Object;
    params.item_id = _item.id();
    params.warehous_id = _warehouse.id();
    params.multordqty = _orderMultiple.toDouble();
    var qry = "UPDATE itemsite SET itemsite_multordqty=<? value('multordqty') ?> "
            + "WHERE (itemsite_item_id=<? value('item_id') ?>)"
            + "  AND (itemsite_warehous_id=<? value('warehous_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspRunningAvailability",
                         "sOrderMultiple exception: " + e);
  }
}

function sOrderToQty()
{
  try
  {
    var params = new Object;
    params.item_id = _item.id();
    params.warehous_id = _warehouse.id();
    params.ordertoqty = _orderToQty.toDouble();
    var qry = "UPDATE itemsite SET itemsite_ordertoqty=<? value('ordertoqty') ?> "
            + "WHERE (itemsite_item_id=<? value('item_id') ?>)"
            + "  AND (itemsite_warehous_id=<? value('warehous_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspRunningAvailability",
                         "sOrderToQty exception: " + e);
  }
}
