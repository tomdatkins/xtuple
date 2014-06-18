debugger;

try
{
  mywindow.setMetaSQLOptions("openpurchaseorders", "freightallowed");
  mywindow.list().addColumn(qsTr("Total Amount"),          XTreeWidget.itemColumn, Qt.AlignRight,    true, "totalamount");
  mywindow.list().addColumn(qsTr("Total Weight"),          XTreeWidget.itemColumn, Qt.AlignRight,    true, "totalweight");
  mywindow.list().addColumn(qsTr("Freight Allowed"),       XTreeWidget.itemColumn, Qt.AlignRight,    true, "freightallowed");
}
catch (e)
{
  QMessageBox.critical(mywindow, "unpostedPurchaseOrders",
                       "unpostedPurchaseOrders.js exception: " + e);
}
