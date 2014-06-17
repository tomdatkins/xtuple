debugger;

try
{
  mywindow.setMetaSQLOptions("inventoryAvailability", "generalxwd");
  mywindow._parameterWidget.append(qsTr("Available to Ship"), "availToShip", ParameterWidget.Exists);
}
catch (e)
{
  QMessageBox.critical(mywindow, "dspInventoryAvailability",
                       "dspInventoryAvailability.js exception: " + e);
}
