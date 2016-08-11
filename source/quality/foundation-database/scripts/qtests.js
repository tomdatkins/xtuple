/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
 
//debugger;

mywindow.setMetaSQLOptions('qualityTests','detail');
mywindow.setSearchVisible(true);
mywindow.setQueryOnStartEnabled(true);
mywindow.setWindowTitle(qsTr("Quality Tests"));
mywindow.setReportName("QualityTestSummary");

var _list   = mywindow.findChild("_list");

_list.addColumn(qsTr("Order Type"),       50, Qt.AlignLeft, true, "qthead_ordtype"); 
_list.addColumn(qsTr("Order Number"),    100, Qt.AlignLeft, true, "qthead_ordnumber");
_list.addColumn(qsTr("Test Code"),       100, Qt.AlignLeft, true, "qthead_number");
_list.addColumn(qsTr("Quality Plan"),     -1, Qt.AlignLeft, true, "quality_plan");
_list.addColumn(qsTr("Item"),             -1, Qt.AlignLeft, true, "item");
_list.addColumn(qsTr("Status"),          100, Qt.AlignLeft, true, "status");
_list.addColumn(qsTr("Start Date"),      100, Qt.AlignLeft, true, "start_date");
_list.addColumn(qsTr("Completed Date"),  100, Qt.AlignRight, true, "completed_date");
_list.addColumn(qsTr("Disposition"),      -1, Qt.AlignLeft, true, "disposition");
_list.addColumn(qsTr("Reason Code"),      -1, Qt.AlignLeft, false, "qtrsncode_code");
_list.addColumn(qsTr("Release Code"),     -1, Qt.AlignLeft, false, "qtrlscode_code");
_list.addColumn(qsTr("Test UUID"),        -1, Qt.AlignLeft, false, "uuid");

// Add filter criteria
// This says we want to use the parameter widget to filter results
mywindow.setParameterWidgetVisible(true);
mywindow.setNewVisible(true);
var _newAction = mywindow.newAction();

 
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

function sNew()
{
  var params          = new Object;
  params.mode         = "new";
  var newdlg          = toolbox.openWindow("qtest", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
   mywindow.sFillList();
}

function sEdit()
{
  var params          = new Object;
  params.qthead_id    = _list.id();
  params.mode         = "edit";
  var newdlg          = toolbox.openWindow("qtest", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
   mywindow.sFillList();
}

function sDelete()
{
   if(QMessageBox.question(mywindow, qsTr("WARNING"), 
    qsTr("Deleting this Quality Specification will delete any associated Quality Plan Items and Quality Test items. Do you wish to continue?"), 
    QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;
   try
   {      
     var params = new Object;
     params.qphead_id = _list.id();
     // Wrap the transaction
     toolbox.executeBegin();
     // DELETE FROM qtitem
     var qrytxt = "DELETE FROM xt.qtitem WHERE qtitem_qpitem_id IN "
                + "(SELECT qpitem_id FROM xt.qpitem "
                + " WHERE qpitem_qphead_id = <? value('qphead_id') ?>)";
     var qry = toolbox.executeQuery(qry, params);
     if (qry.lastError().type != QSqlError.NoError)
       throw new Error(qry.lastError().text);  
     // DELETE FROM qpitem
     var qrytxt = "DELETE FROM xt.qpitem WHERE qpitem_qphead_id = "
                + "<? value('qphead_id') ?>";
     var qry = toolbox.executeQuery(qrytxt, params);
     if (qry.lastError().type != QSqlError.NoError)
       throw new Error(qry.lastError().text);  
     // DELETE FROM qspec
     var qrytxt = "DELETE FROM xt.qphead WHERE qphead_id = <? value('qphead_id') ?>";
     var qry = toolbox.executeQuery(qrytxt, params);
     if (qry.lastError().type != QSqlError.NoError)
       throw new Error(qry.lastError().text);   
     // COMMIT the transaction
     toolbox.executeCommit(); 
     mywindow.sFillList();
  } 
  catch(e) {
    // If failed, ROLLBACK the transaction
    toolbox.executeRollback();
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " 
                         + e.lineNumber + ": " + e);
  }
}

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
      mCode.triggered.connect(sEdit);

      mCode = pMenu.addAction(qsTr("Print Test..."));
      mCode.enabled = privileges.check("MaintainQualityTests");
      mCode.triggered.connect(openQualityTest);
      
      mCode = pMenu.addAction(qsTr("Delete Test..."));
      mCode.enabled = privileges.check("MaintainQualityTests");
      mCode.triggered.connect(sDelete);

      if (pItem.rawValue("qthead_ordtype").toString() == "WO") {
        mCode = pMenu.addAction(qsTr("Work Order Summary..."));
        mCode.enabled = privileges.check("MaintainQualityTests");
        mCode.triggered.connect(openWOReport);
      }
    }
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

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(populateMenu);
_list["itemSelected(int)"].connect(sEdit);
_newAction.triggered.connect(sNew);
