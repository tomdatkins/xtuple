//debugger;
// Quality and Testing Menu
var manuMenu = mainwindow.findChild("menu.manu");
var transMenu	= mainwindow.findChild("menu.manu.transactions");

// Quality menu
var qualityMenu = new QMenu(qsTr("Quality"),mainwindow);
manuMenu.insertMenu(transMenu.menuAction(), qualityMenu);

// Separator
toolbox.menuInsertSeparator(manuMenu, transMenu);

// Add Quality actions
var qSpecAction = qualityMenu.addAction(qsTr("Test Specifications"), mainwindow);
var qPlanAction = qualityMenu.addAction(qsTr("Test Plans"), mainwindow);
var qTestAction = qualityMenu.addAction(qsTr("Quality Tests"), mainwindow);

qSpecAction.objectName = "qu.quality_specs";
qSpecAction.setData("ViewQualitySpecs");
qSpecAction.enabled = privileges.value("ViewQualitySpecs");

qPlanAction.objectName = "qu.quality_plans";
qPlanAction.setData("ViewQualityPlans");
qPlanAction.enabled = privileges.value("ViewQualityPlans");

qTestAction.objectName = "qu.quality_tests";
qTestAction.setData("ViewQualityTests");
qTestAction.enabled = privileges.value("ViewQualityTests");

// Use new desktop screens instead of opening web client
function sQualityPlan()
{
  try {
    toolbox.newDisplay("qplans", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sQuality() exception @ " + e.lineNumber + ": " + e);
  }
}

function sQualitySpec()
{
  try {
    toolbox.newDisplay("qspecs", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sQuality() exception @ " + e.lineNumber + ": " + e);
  }
}

function sQualityTest()
{
  try {
    toolbox.newDisplay("qtests", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sQuality() exception @ " + e.lineNumber + ": " + e);
  }
}

// Connect Action(s)
qSpecAction.triggered.connect(sQualitySpec);
qPlanAction.triggered.connect(sQualityPlan);
qTestAction.triggered.connect(sQualityTest);
