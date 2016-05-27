function sQuality()
{
  try {
    toolbox.newDisplay("QualityPlans", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sQuality() exception @ " + e.lineNumber + ": " + e);
  }
}
  var menuCRM = mainwindow.findChild("menu.crm");
  var tmpaction = menuCRM.addAction(qsTranslate("menuCRM", "Quality Plans..."));
  tmpaction.triggered.connect(sQuality);
  tmpaction.setData("MaintainQualityPlans");
  tmpaction.enabled = privileges.check("MaintainQualityPlans");



/* for testing
function saleTypes()
{
  try {
    toolbox.openWindow("saleTypes", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::saleTypes() exception @ " + e.lineNumber + ": " + e);
  }
}

  var menuCRM = mainwindow.findChild("menu.crm");
  var tmpactions = menuCRM.addAction(qsTranslate("menuCRM", "sale types..."));
  tmpactions.triggered.connect(saleTypes);
*/