/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

mywindow.setMetaSQLOptions('qualityTests','detail');
mywindow.setSearchVisible(true);
mywindow.setQueryOnStartEnabled(true);
mywindow.setWindowTitle(qsTr("Quality Tests"));
mywindow.setReportName("QualityTestSummary");
mywindow.setParameterWidgetVisible(true);
 
var _list = mywindow.list();
with (_list)
{
  addColumn(qsTr("Order Type"), 50, Qt.AlignLeft, true, "qthead_ordtype"); 
  addColumn(qsTr("Order Number"), 100, Qt.AlignLeft, true, "qthead_ordnumber");
  addColumn(qsTr("Test Code"), 100, Qt.AlignLeft, true, "qthead_number");
  addColumn(qsTr("Quality Plan"), -1, Qt.AlignLeft, true, "quality_plan");
  addColumn(qsTr("Item"), -1, Qt.AlignLeft, true, "item");
  addColumn(qsTr("Status"), 100, Qt.AlignLeft, true, "status");
  addColumn(qsTr("Start Date"), 100, Qt.AlignLeft, true, "start_date");
  addColumn(qsTr("Completed Date"), 100, Qt.AlignRight, true, "completed_date");
  addColumn(qsTr("Disposition"), -1, Qt.AlignLeft, true, "disposition");
  addColumn(qsTr("Reason Code"), -1, Qt.AlignLeft, false, "qtrsncode_code");
  addColumn(qsTr("Release Code"), -1, Qt.AlignLeft, false, "qtrlscode_code");
  addColumn(qsTr("Test UUID"), -1, Qt.AlignLeft, false, "uuid");
}

 
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

      mCode = pMenu.addAction(qsTr("Print Test..."));
      mCode.enabled = privileges.check("MaintainQualityTests");
      mCode.triggered.connect(openQualityTest);

      if (pItem.rawValue("qthead_ordtype").toString() == "WO") {
        mCode = pMenu.addAction(qsTr("Work Order Summary..."));
        mCode.enabled = privileges.check("MaintainQualityTests");
        mCode.triggered.connect(openWOReport);
      }
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

function openQualityTest() {
  var param = new Object;
  param.id = _list.rawValue("uuid");
  toolbox.printReport("QualityTest", param, true);
}

function openWOReport() {
  var param = new Object;
  param.orderNumber = _list.rawValue("qthead_ordnumber").toString();
  toolbox.printReport("WorkOrderQualityCertificate", param, true);
}

_list.doubleClicked.connect(openUrl);
