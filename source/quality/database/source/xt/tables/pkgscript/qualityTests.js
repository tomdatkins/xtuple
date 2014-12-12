// Specifiy which query to use
mywindow.setMetaSQLOptions('qualityTests','detail');
 
// Make the search visible
mywindow.setSearchVisible(true);

// Set automatic query on start
mywindow.setQueryOnStartEnabled(true);

// Window title
mywindow.setWindowTitle(qsTr("Quality Tests"));

// Set the Report
mywindow.setReportName("QualityTestSummary");
 
// Add in the columns
var _list = mywindow.list();
 
_list.addColumn(qsTr("Test Code"), 100, Qt.AlignLeft, true, "qthead_number");
_list.addColumn(qsTr("Quality Plan"), -1, Qt.AlignLeft, true, "quality_plan");
_list.addColumn(qsTr("Item"), -1, Qt.AlignLeft, true, "item");
_list.addColumn(qsTr("Status"), 100, Qt.AlignLeft, true, "status");
_list.addColumn(qsTr("Start Date"), 100, Qt.AlignLeft, true, "start_date");
_list.addColumn(qsTr("Completed Date"), 100, Qt.AlignRight, true, "completed_date");
_list.addColumn(qsTr("Disposition"), -1, Qt.AlignLeft, true, "disposition");
_list.addColumn(qsTr("Reason Code"), -1, Qt.AlignLeft, true, "qtrsncode_code");
 
// Add filter criteria
// This says we want to use the parameter widget to filter results
mywindow.setParameterWidgetVisible(true);
 
// Parameters
var _statusSQL = "SELECT 1 as id, 'Open' as descr UNION SELECT 2, 'Pass' UNION SELECT 3, 'Fail'";
var _classCodeSQL = "SELECT classcode_id, classcode_code FROM classcode";

mywindow.parameterWidget().append(qsTr("Test Number"), "number", ParameterWidget.Text,null,false, null);
mywindow.parameterWidget().append(qsTr("Start Date"), "startDate", ParameterWidget.Date,new Date(),false, null);
mywindow.parameterWidget().append(qsTr("End Date"), "endDate", ParameterWidget.Date,null,false, null);
mywindow.parameterWidget().append(qsTr("Test Assignment"), "assignment", ParameterWidget.User,null,false, null);
mywindow.parameterWidget().appendComboBox(qsTr("Status"), "status", _statusSQL,null,false, null);
mywindow.parameterWidget().append(qsTr("Order Number"), "orderNumber", ParameterWidget.Text,null,false, null);
mywindow.parameterWidget().append(qsTr("Item"), "item", ParameterWidget.Item,null,false, null);
mywindow.parameterWidget().appendComboBox(qsTr("Class Code"), "classCode", _classCodeSQL,null,false, null);

// Context menus
_list["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(populateMenu);

// context menu
function populateMenu(pMenu, pItem, pCol){
  var mCode;
  if(pMenu === null)
    pMenu = _list.findChild("_menu");

// Item Master
  if(pMenu !== null)
  {
    var _addsep = false;
    var currentItem = _list.currentItem();
    if(currentItem !== null)
    {
      mCode = pMenu.addAction(qsTr("Open Test..."));
      mCode.enabled = privileges.check("MaintainQualityTests");
      mCode.triggered.connect(openUrl);
    }
  }
}

function openUrl() {
  if (!metrics.value("WebappHostname") || !metrics.value("WebappPort")) {
    QMessageBox.critical(mywindow, qsTr("Cannot Open Quality Test"), qsTr("Metrics for the Mobile Web Client have not been maintained.  Please contact your System Administrator."));
    return false;
  }

  var _db = toolbox.executeQuery("select current_database()");
  if (_db.first()) {
    var _url = "https://" + metrics.value("WebappHostname") + ":" + metrics.value("WebappPort") +"/"+_db.value("current_database")+"/app#workspace/quality-test/" + _list.rawValue("uuid");
    toolbox.openUrl(_url);
  }
}

_list.doubleClicked.connect(openUrl);
