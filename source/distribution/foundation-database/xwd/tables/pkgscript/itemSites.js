debugger;

try
{
  mywindow.setMetaSQLOptions("itemSites", "detailxwd");
}
catch (e)
{
  QMessageBox.critical(mywindow, "itemSites",
                       "itemSites.js exception: " + e);
}
