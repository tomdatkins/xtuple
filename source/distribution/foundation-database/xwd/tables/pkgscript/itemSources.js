debugger;

try
{
  mywindow.setSearchVisible(true);
  mywindow.setMetaSQLOptions("itemSources", "detailxwd");
}
catch (e)
{
  QMessageBox.critical(mywindow, "itemSources",
                       "itemSources.js exception: " + e);
}
