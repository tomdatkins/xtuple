debugger;

try
{
  mywindow.setMetaSQLOptions("items", "detailxwd");

  mywindow.list().addColumn(qsTr("UPC"),             XTreeWidget.itemColumn, Qt.AlignLeft,    true, "item_upccode");
  mywindow.list().addColumn(qsTr("Tier 0"),          XTreeWidget.itemColumn, Qt.AlignLeft,    true, "tier0");
  mywindow.list().addColumn(qsTr("Tier 1"),          XTreeWidget.itemColumn, Qt.AlignLeft,    true, "tier1");
  mywindow.list().addColumn(qsTr("Tier 2"),          XTreeWidget.itemColumn, Qt.AlignLeft,    true, "tier2");
  mywindow.list().addColumn(qsTr("Tier 3"),          XTreeWidget.itemColumn, Qt.AlignLeft,    true, "tier3");
  mywindow.list().addColumn(qsTr("Tier 4"),          XTreeWidget.itemColumn, Qt.AlignLeft,    true, "tier4");
  mywindow.list().addColumn(qsTr("Tier 5"),          XTreeWidget.itemColumn, Qt.AlignLeft,    true, "tier5");

  mywindow._parameterWidget.append(qsTr("UPC"), "upc", ParameterWidget.Text);
  mywindow._parameterWidget.append(qsTr("Create Date"), "created", ParameterWidget.Date);
}
catch (e)
{
  QMessageBox.critical(mywindow, "items",
                       "items.js exception: " + e);
}
