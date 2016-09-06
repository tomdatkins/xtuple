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

mywindow.setWindowTitle(qsTr("Quality Tests"));
mywindow.setListLabel(qsTr("Quality Tests"));
mywindow.setReportName("QualityTests");
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
}
populateList();

// Parameters
var _statusSql = "SELECT 1 AS id, '" + xtquality.status["O"] + "' AS code "
            + "UNION SELECT 2, '" + xtquality.status["P"] + "' "
            + "UNION SELECT 3, '" + xtquality.status["F"] + "' ";
mywindow.parameterWidget().appendComboBox(qsTr("Test Status"),"testStatus", _statusSql);
mywindow.parameterWidget().append(qsTr("Show Completed"), "showComplete", ParameterWidget.Exists);

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
  populateList();
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
  populateList();
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
     populateList();
}

function sPopulateMenu(pMenu, selected)
{
  var item = selected.text(1);
  var menuItem;
      menuItem = pMenu.addAction(qsTr("Edit..."));
      menuItem.triggered.connect(sEdit);
      
      if (item.rawValue("status").toString() == xtquality.status["O"])
      {
        menuItem = pMenu.addAction(qsTr("Delete..."));
        menuItem.enabled = privileges.value("DeleteQualityTests");
        menuItem.triggered.connect(sDelete);
      }
}

function populateList()
{
  var params = xtquality.extraParams();
  var qry = toolbox.executeDbQuery("qtest", "detail", params);
  if (xtquality.errorCheck(qry))
    _list.populate(qry);
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["doubleClicked(QModelIndex)"].connect(sEdit);
_new.triggered.connect(sNew);