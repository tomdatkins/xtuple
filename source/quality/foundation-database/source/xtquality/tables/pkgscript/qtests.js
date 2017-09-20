/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
//debugger;
include("xtQuality");

mywindow.setWindowTitle(qsTr("Quality Tests"));
mywindow.setListLabel(qsTr("Quality Tests"));
mywindow.setReportName("QualityTestSummary");
mywindow.setParameterWidgetVisible(true);
mywindow.setAutoUpdateEnabled(false);
mywindow.setSearchVisible(true);
mywindow.setMetaSQLOptions('qtest','detail');

var _list   = mywindow.findChild("_list");
var _new = mywindow.newAction();
var _edit   = mywindow.findChild("_edit");
var _delete = mywindow.findChild("_delete");

_new.setVisible(true);

with(_list)
{
  addColumn(qsTr("Test Number"),      75,  Qt.AlignLeft,  true,  "qthead_number" );
  addColumn(qsTr("Start Date"),       75,  Qt.AlignLeft,  true,  "qthead_start_date" );
  addColumn(qsTr("Order Type"),       50,  Qt.AlignLeft,  true,  "qthead_ordtype" );
  addColumn(qsTr("Order #"),          75,  Qt.AlignLeft,  true,  "qthead_ordnumber" );
  addColumn(qsTr("Completion Date"),  75,  Qt.AlignLeft,  true,  "qthead_completed_date"   );
  addColumn(qsTr("Test Status"),      50,  Qt.AlignLeft,  true,  "status"   );
  addColumn(qsTr("Quality Plan"),    100,  Qt.AlignLeft,  true,  "qphead_code"   );
  addColumn(qsTr("Item #"),           -1,  Qt.AlignLeft,  true,  "item_number"   );
  addColumn(qsTr("Reason Code"),      -1,  Qt.AlignLeft,  false, "qtrsncode_code"   );
  addColumn(qsTr("Release Code"),     -1,  Qt.AlignLeft,  false, "qtrlscode_code"   );
  addColumn(qsTr("Rev Date"),         -1,  Qt.AlignLeft,  false, "qthead_start_date"   );
}
mywindow.sFillList();

// Parameters
var _statusSql = "SELECT 1 AS id, '" + xtquality.status["O"] + "' AS code "
            + "UNION SELECT 2, '" + xtquality.status["P"] + "' "
            + "UNION SELECT 3, '" + xtquality.status["F"] + "' "
            + "UNION SELECT 4, '" + xtquality.status["C"] + "' ";
var _qtrlsSql = "SELECT qtrlscode_id, (qtrlscode_code) AS qtrlscode FROM xt.qtrlscode ORDER BY qtrlscode_code ";
var _qtrsSql = "SELECT qtrsncode_id, (qtrsncode_code) AS qtrsncode FROM xt.qtrsncode ORDER BY qtrsncode_code  ";
         
mywindow.parameterWidget().appendComboBox(qsTr("Test Status"),"testStatus", _statusSql);
mywindow.parameterWidget().append(qsTr("Show Completed"), "showComplete", ParameterWidget.Exists);
mywindow.parameterWidget().append(qsTr("Item"), "itemid", ParameterWidget.Item);
mywindow.parameterWidget().append(qsTr("Sart Date"), "startDate", ParameterWidget.Date);
mywindow.parameterWidget().append(qsTr("End Date"), "endDate", ParameterWidget.Date);
mywindow.parameterWidget().appendComboBox(qsTr("Release Code"),"qtrlscode", _qtrlsSql);
mywindow.parameterWidget().appendComboBox(qsTr("Reason Code"),"qtrsncode", _qtrsSql);


function setParams(params)
{
  newParams = xtquality.extraParams(params);

  return newParams;
}  

function sNew()
{
  var newdlg = toolbox.openWindow("qtest", mywindow,
                       Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set({mode: "new"});
  newdlg.exec()
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
  newdlg.exec()
  mywindow.sFillList();
}

function sCancel()
{
   if(QMessageBox.question(mywindow, qsTr("Cancel Quality Test"), 
    qsTr("Are you sure you sure you want to cancel this Quality Test?"), 
    QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;

   var _sql = "UPDATE xt.qthead SET qthead_status = 'C' WHERE qthead_id=<? value('qthead_id') ?>";
   var qry = toolbox.executeQuery(_sql, {qthead_id: _list.id()});
   if (xtquality.errorCheck(qry))
       mywindow.sFillList();
}

function sDelete()
{
   if(QMessageBox.question(mywindow, qsTr("Delete Quality Test"), 
    qsTr("Are you sure you sure you want to delete this Quality Test?"), 
    QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;

   var _sql = "DELETE FROM xt.qthead WHERE qthead_id=<? value('qthead_id') ?>";
   var qry = toolbox.executeQuery(_sql, {qthead_id: _list.id()});
   if (xtquality.errorCheck(qry))
       mywindow.sFillList();
}

function sQualityTest() 
{
  toolbox.printReport("QualityTest", {id: xtquality.getUuid(_list.id())}, true);
}

function sQualityCert() 
{
  toolbox.printReport("QualityCertificate", {id: xtquality.getUuid(_list.id())}, true);
}

function sQualityNonConf() 
{
  toolbox.printReport("QualityNonConformance", {id: xtquality.getUuid(_list.id())}, true);
}

function sWOReport() {
  var param = {orderNumber: _list.rawValue("qthead_ordnumber").toString()};
  toolbox.printReport("WorkOrderQualityCertificate", param, true);
}

function sPopulateMenu(pMenu, selected)
{
  var menuItem;
  menuItem = pMenu.addAction(qsTr("Edit"));
  menuItem.triggered.connect(sEdit);

  if (selected.rawValue("status").toString() == xtquality.status["O"])
  {
     menuItem = pMenu.addAction(qsTr("Cancel"));
     menuItem.enabled = privileges.value("CancelQualityTest");
     menuItem.triggered.connect(sCancel);
  }
      
  if (selected.rawValue("status").toString() == xtquality.status["O"])
  {
     menuItem = pMenu.addAction(qsTr("Delete"));
     menuItem.enabled = privileges.value("DeleteQualityTests");
     menuItem.triggered.connect(sDelete);
  }
  pMenu.addSeparator();

  menuItem = pMenu.addAction(qsTr("Print Test"));
  menuItem.enabled = (privileges.check("ViewQualityTests") || privileges.check("ViewQualityTests"));
  menuItem.triggered.connect(sQualityTest);

  if (selected.rawValue("qthead_ordtype").toString() == "WO") 
  {
     menuItem = pMenu.addAction(qsTr("Work Order Summary"));
     menuItem.enabled = privileges.check("MaintainQualityTests");
     menuItem.triggered.connect(sWOReport);
  }

  if (selected.rawValue("status").toString() == xtquality.status["P"])
  {
     menuItem = pMenu.addAction(qsTr("Quality Certificate"));
     menuItem.enabled = (privileges.check("ViewQualityTests") || privileges.check("ViewQualityTests"));
     menuItem.triggered.connect(sQualityCert);
  }
  if (selected.rawValue("status").toString() == xtquality.status["F"])
  {
     menuItem = pMenu.addAction(qsTr("Non-Conformance Certificate"));
     menuItem.enabled = (privileges.check("ViewQualityTests") || privileges.check("ViewQualityTests"));
     menuItem.triggered.connect(sQualityNonConf);
  }
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["doubleClicked(QModelIndex)"].connect(sEdit);
_new.triggered.connect(sNew);
