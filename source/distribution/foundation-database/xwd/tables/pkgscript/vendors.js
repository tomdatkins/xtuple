debugger;

try
{
  mywindow.setMetaSQLOptions("vendors", "detailxwd");
  mywindow._parameterWidget.append(qsTr("Create Date"), "created", ParameterWidget.Date);
}
catch (e)
{
  QMessageBox.critical(mywindow, "vendors",
                       "vendors.js exception: " + e);
}
