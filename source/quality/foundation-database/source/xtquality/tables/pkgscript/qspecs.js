/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
include("xtQuality");

//debugger;
mywindow.setMetaSQLOptions('qspec','detail');
mywindow.setSearchVisible(true);
mywindow.setQueryOnStartEnabled(true);
mywindow.setReportName("QualitySpecs");
mywindow.setWindowTitle(qsTr("Quality Specifications"));

var _list   = mywindow.findChild("_list");

_list.addColumn(qsTr("Code"),        100,    Qt.AlignLeft,   true,  "qspec_code"   );
_list.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true, "qspec_descrip"   );
_list.addColumn(qsTr("Spec Type"),   100,    Qt.AlignLeft,   true,  "qspectype_code"   );
_list.addColumn(qsTr("Test Type"),   100,    Qt.AlignLeft,   true,  "testtype"   );
_list.addColumn(qsTr("Target"),       50,    Qt.AlignLeft,   true,  "qspec_target"   );
_list.addColumn(qsTr("Upper Limit"),  50,    Qt.AlignLeft,   true,  "qspec_upper"   );
_list.addColumn(qsTr("Lower Limit"),  50,    Qt.AlignLeft,   true,  "qspec_lower"   );
_list.addColumn(qsTr("UoM"),          50,    Qt.AlignLeft,   true,  "qspec_uom"   );
_list.addColumn(qsTr("Equipment"),   100,    Qt.AlignLeft,   true,  "qspec_equipment" );
_list.addColumn(qsTr("Active"),      100,    Qt.AlignLeft,   true,  "qspec_active" );

mywindow.setParameterWidgetVisible(true);
mywindow.setNewVisible(true);
var _newAction = mywindow.newAction();

// Parameters
mywindow.parameterWidget().append(qsTr("Show Inactive"), "showInactive", ParameterWidget.Exists);

var _sql = "SELECT qspectype_id, qspectype_code ||' - '|| qspectype_descrip "
         + "FROM xt.qspectype "
         + "ORDER BY qspectype_code;";
mywindow.parameterWidget().appendComboBox(qsTr("Spec. Type"), "qspectype_id", _sql, null, false);


// Functions
function sNew()
{
//  var params          = new Object;
//  params.mode         = "new";
  var newdlg          = toolbox.openWindow("qspec", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set({mode: "new"});
  newdlg.exec()
  mywindow.sFillList();
}

function sEdit()
{
  var params          = new Object;
  params.qspec_id  = _list.id();
  params.mode         = "edit";
  var newdlg          = toolbox.openWindow("qspec", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec()
  mywindow.sFillList();
}

function sDelete()
{
  if(QMessageBox.question(mywindow, qsTr("Confirmation"),
    qsTr("Are you sure you wish to mark this Specification inactive?"),
    QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;

  var _sql = "SELECT 1 FROM xt.qpitem WHERE (qpitem_qspec_id=<? value('spec') ?>); "
  var qry = toolbox.executeQuery(_sql, {spec: _list.id()});
  xtquality.errorCheck(qry);
  if (qry.first())
  {
    QMessageBox.information(mywindow, qsTr("Confirmation"),
    qsTr("This Specification has been assigned to Quality Plans (and possibly tests). \n"
         + "Marking this Specification as inactive does not affect or remove this specification from any Plans or Tests."));
  }

  qry = toolbox.executeQuery("UPDATE xt.qspec SET qspec_active=FALSE WHERE qspec_id=<? value('spec') ?>;", {spec: _list.id()});
  xtquality.errorCheck(qry);
  mywindow.sFillList();
}

function sPopulateMenu(pMenu, selected)
{
  var item   = selected.text(1);
  var menuItem;

  menuItem = pMenu.addAction(qsTr("Edit"));
  menuItem.triggered.connect(sEdit);

  menuItem = pMenu.addAction(qsTr("Mark Inactive"));
  menuItem.triggered.connect(sDelete);
  menuItem.enabled = selected.rawValue("qspec_active");
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["itemSelected(int)"].connect(sEdit);
_newAction.triggered.connect(sNew);
