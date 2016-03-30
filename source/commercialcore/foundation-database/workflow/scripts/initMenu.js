function sWorkflow()
{
  try {
    toolbox.newDisplay("WorkflowActivities", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sWorkflow() exception @ " + e.lineNumber + ": " + e);
  }
}
  var menuCRM = mainwindow.findChild("menu.crm");
  var tmpaction = menuCRM.addAction(qsTranslate("menuCRM", "Workflow Activities..."));
  tmpaction.triggered.connect(sWorkflow);
  tmpaction.setData("MaintainWorkflow");
  tmpaction.enabled = privileges.check("MaintainWorkflow");



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