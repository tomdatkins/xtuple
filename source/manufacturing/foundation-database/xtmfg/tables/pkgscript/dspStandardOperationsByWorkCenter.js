/*
  This file is part of the xtmfg Package for xTuple ERP,
  and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

debugger;

var widgets = toolbox.loadUi("dspStandardOperationsByWorkCenter", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Standard Operations by Work Center"));
mywindow.setListLabel(qsTr("Standard Operations"));
mywindow.setReportName("StandardOperationsByWorkCenter");
mywindow.setMetaSQLOptions("standardOperationsByWorkCenter", "detail");

var _wrkcnt      = mywindow.findChild("_wrkcnt");
var _description = mywindow.findChild("_description");
var _warehouse   = mywindow.findChild("_warehouse");
var _stdopn      = mywindow.list();

_stdopn.addColumn(qsTr("Std. Oper. #"), 150, Qt.AlignLeft, true, "stdopn_number");
_stdopn.addColumn(qsTr("Descriptions"),  -1, Qt.AlignLeft, true, "stdopndescrip");

function populateMenu(pMenu, pItem, pCol)
{
  if(pMenu == null)
    pMenu = _stdopn.findChild("_menu");

  if(pMenu != null)
  {
    var viewAct = pMenu.addAction(qsTr("View Standard Operation..."));
    viewAct.triggered.connect(sView);

    var editAct = pMenu.addAction(qsTr("Edit Standard Operation..."));
    editAct.enabled = privileges.check("MaintainStandardOperations");
    editAct.triggered.connect(sEdit);
  }
}

function setParams(params)
{
  params.wrkcnt_id = _wrkcnt.id();
  return true;
}

function sFillWC()
{
  var params = new Object;
  setParams(params);

  var qry = toolbox.executeDbQuery("standardOperationsByWorkCenter", "header", params);
  if(qry.first())
  {
    _description.text = qry.value("wrkcnt_descrip");
    _warehouse.text = qry.value("warehous_code");
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.stdopn_id = _stdopn.id();

  try {
    var stdOper = toolbox.openWindow("standardOperation", mywindow, 0, 1);
    toolbox.lastWindow().set(params);

    if(stdOper.exec() != 0)
      mywindow.sFillList();
  } catch(e) {
    print("dspStandardOperationsByWorkCenter open standardOperations exception @ " + e.lineNumber + ": " + e);
  }
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.stdopn_id = _stdopn.id();

  try {
    var stdOper = toolbox.openWindow("standardOperation", mywindow, 0, 1);
    toolbox.lastWindow().set(params);

    stdOper.exec();
  } catch(e) {
    print("dspStandardOperationsByWorkCenter open standardOperations exception @ " + e.lineNumber + ": " + e);
  }
}

_wrkcnt.newID.connect(sFillWC);
_stdopn["populateMenu(QMenu *, QTreeWidgetItem *, int)"].connect(populateMenu)

