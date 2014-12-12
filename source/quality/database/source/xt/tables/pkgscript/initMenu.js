// Quality and Testing Menu
var manuMenu = mainwindow.findChild("menu.manu");
var transMenu	= mainwindow.findChild("menu.manu.transactions");

// Quality menu
var qualityMenu = new QMenu(qsTr("Quality"),mainwindow);
manuMenu.insertMenu(transMenu.menuAction(), qualityMenu);

// Separator
toolbox.menuInsertSeparator(manuMenu, transMenu);

// Add Quality actions
var qSpecAction = qualityMenu.addAction(qsTr("Test Specifications..."), mainwindow);
var qPlanAction = qualityMenu.addAction(qsTr("Test Plans..."), mainwindow);
var qTestAction = qualityMenu.addAction(qsTr("Quality Tests..."), mainwindow);

qSpecAction.objectName = "qu.quality_specs";
qSpecAction.setData("ViewQualitySpecs");
qSpecAction.enabled = privileges.value("ViewQualitySpecs");

qPlanAction.objectName = "qu.quality_plans";
qPlanAction.setData("ViewQualityPlans");
qPlanAction.enabled = privileges.value("ViewQualityPlans");

qTestAction.objectName = "qu.quality_tests";
qTestAction.setData("ViewQualityTests");
qTestAction.enabled = privileges.value("ViewQualityTests");

// Define function(s)
function sQualitySpec()
{
  var _db = toolbox.executeQuery("select current_database()");
  if (_db.first()) {
    var _url = "https://" + metrics.value("WebappHostname") + ":" + metrics.value("WebappPort") +"/" + _db.value("current_database") + "/app#list/quality-specs-list/";
    if (_url)
      toolbox.openUrl(_url);
  }
}

function sQualityPlan()
{
  var _db = toolbox.executeQuery("select current_database()");
  if (_db.first()) {
    var _url = "https://" + metrics.value("WebappHostname") + ":" + metrics.value("WebappPort") +"/" + _db.value("current_database") + "/app#list/quality-plans-list/";
    if (_url)
      toolbox.openUrl(_url);
  }    
}

function sQualityTest()
{
  var disp = toolbox.newDisplay("qualityTests");
}

// Connect Action(s)
qSpecAction.triggered.connect(sQualitySpec);
qPlanAction.triggered.connect(sQualityPlan);
qTestAction.triggered.connect(sQualityTest);
