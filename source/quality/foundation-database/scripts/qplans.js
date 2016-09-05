/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
include("xtQuality"); 
 //debugger;

mywindow.setMetaSQLOptions('qplan','detail');
mywindow.setSearchVisible(true);
mywindow.setQueryOnStartEnabled(true);
mywindow.setWindowTitle(qsTr("Quality Plans"));
mywindow.setReportName("");

var _list   = mywindow.findChild("_list");
with (_list)
{
  addColumn(qsTr("Code"),        100,    Qt.AlignLeft,   true,  "code"   );
  addColumn(qsTr("Revision #"),  50,    Qt.AlignLeft,   true, "revnum"   );
  addColumn(qsTr("Revision Status"),   100,    Qt.AlignLeft,   true,  "revstat"   );
  addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true,  "desc"   );
}

// Add filter criteria
// This says we want to use the parameter widget to filter results
mywindow.setParameterWidgetVisible(true);
mywindow.setNewVisible(true);
var _newAction = mywindow.newAction();

// Parameters
mywindow.parameterWidget().append(qsTr("Active Only"), "activeOnly", ParameterWidget.Exists);
var _revSql = "SELECT 1 AS id, '" + xtquality.revisionStatus["P"] + "' AS code "
            + "UNION SELECT 2, '" + xtquality.revisionStatus["A"] + "' "
            + "UNION SELECT 3, '" + xtquality.revisionStatus["I"] + "'; ";
mywindow.parameterWidget().appendComboBox(qsTr("Revision Status"),"revStatus", _revSql);

// Functions
function setParams(params)
{
  newParams = xtquality.extraParams(params);
  return newParams;
}  
  
function sNew()
{
  var params          = new Object;
  params.mode         = "new";
  var newdlg          = toolbox.openWindow("qplan", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  mywindow.sFillList();
}

function sEdit()
{
  var newdlg          = toolbox.openWindow("qplan", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set({qphead_id: _list.id(), mode: "edit"});
  if (newdlg.exec() == QDialog.Accepted);
    mywindow.sFillList();
}

function sDelete()
{
  if(QMessageBox.question(mywindow, qsTr("WARNING"), 
    qsTr("Are you sure you wish to delete this Quality Plan?"), 
    QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;

  var _sql = "SELECT 1 FROM xt.qthead WHERE (qthead_qphead_id=<? value('plan') ?>);";
  var qry = toolbox.executeQuery(_sql, {plan: _list.id()});
  if (qry.first())
  {
    QMessageBox.information(mywindow, qsTr("Warning"), qsTr("This Quality Plan has already been assigned to a Test.  It cannot be deleted."));
    return;
  } 
  else
  {
    qry = toolbox.executeQuery("DELETE FROM xt.qphead WHERE (qphead_id=<? value('plan') ?>);", {plan: _list.id()});
    xtquality.errorCheck(qry);
    mywindow.sFillList();
  }
}

function sCreateTest()
{
  var _test = toolbox.executeQuery("SELECT xt.createQualityTestFromPlan(<? value('plan') ?>);", {plan: _list.id()});
  if(xtquality.errorCheck(_test))
     QMessageBox.information(mywindow, qsTr("Confirmation"), qsTr("Quality Test successfully created."));
}

function sPopulateMenu(pMenu, selected)
{
  var item = selected.text(1);
  var menuItem;
      menuItem = pMenu.addAction(qsTr("Edit..."));
      menuItem.triggered.connect(sEdit);
      menuItem = pMenu.addAction(qsTr("Delete..."));
      menuItem.triggered.connect(sDelete);
      pMenu.addSeparator();
      menuItem = pMenu.addAction(qsTr("Create Quality Test..."));
      menuItem.triggered.connect(sCreateTest);
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["itemSelected(int)"].connect(sEdit);
_newAction.triggered.connect(sNew);