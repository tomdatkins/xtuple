// Specifiy which query to use
mywindow.setMetaSQLOptions('qualityTests','detail');
 
// Make the search visible
mywindow.setSearchVisible(true);

// Set automatic query on start
mywindow.setQueryOnStartEnabled(true);

// Window title
mywindow.setWindowTitle(qsTr("Quality Tests"));

// Set the Report
mywindow.setReportName("ListQualityTests");
 
// Add in the columns
var _list = mywindow.list();
 
_list.addColumn(qsTr("Test Code"), 100, Qt.AlignLeft, true, "qthead_number");
_list.addColumn(qsTr("Quality Plan"), -1, Qt.AlignLeft, true, "quality_plan");
_list.addColumn(qsTr("Item"), -1, Qt.AlignLeft, true, "item");
_list.addColumn(qsTr("Status"), 100, Qt.AlignLeft, true, "status");
_list.addColumn(qsTr("Start Date"), -1, Qt.AlignLeft, true, "start_date");
_list.addColumn(qsTr("Due Date"), 0, Qt.AlignRight, false, "uuid");
 
// Add filter criteria
// This says we want to use the parameter widget to filter results
mywindow.setParameterWidgetVisible(true);
 
// Parameters
var _statusSQL = "SELECT 1 as id, 'Open' as descr UNION SELECT 2, 'Pass' UNION SELECT 3, 'Fail'";

mywindow.parameterWidget().append(qsTr("Date From"), "dateFrom", ParameterWidget.Date,new Date(),false, null);
mywindow.parameterWidget().append(qsTr("Date To"), "dateTo", ParameterWidget.Date,new Date(),false, null);
mywindow.parameterWidget().append(qsTr("Test Assignment"), "assignment", ParameterWidget.User,null,false, null);
mywindow.parameterWidget().appendComboBox(qsTr("Status"), "status", _statusSQL,null,false, null);

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
