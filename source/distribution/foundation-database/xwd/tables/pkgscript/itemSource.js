debugger;

try
{
  var _invVendorUOMRatio = mywindow.findChild("_invVendorUOMRatio");
  var _minOrderQty = mywindow.findChild("_minOrderQty");
  var _multOrderQty = mywindow.findChild("_multOrderQty");
  var _vendorUOM = mywindow.findChild("_vendorUOM");

  _invVendorUOMRatio.setDouble(1.0);
  _minOrderQty.setDouble(1.0);
  _multOrderQty.setDouble(1.0);

  var qry = "SELECT uom_id "
          + "FROM uom "
          + "WHERE (uom_name='EA');";
  var data = toolbox.executeQuery(qry);
  if (data.first())
    _vendorUOM.setId(data.value("uom_id"));
  else if (data.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                         data.lastError().text);
  }
}
catch (e)
{
  QMessageBox.critical(mywindow, "itemSource",
                       "itemSource.js exception: " + e);
}
