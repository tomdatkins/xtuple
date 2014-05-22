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

var widgets = toolbox.loadUi("dspOperationsByWorkCenter", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Operations by Work Center"));
mywindow.setListLabel(qsTr("Operations"));
mywindow.setReportName("OperationsByWorkCenter");
mywindow.setMetaSQLOptions("operationsByWorkCenter", "detail");

// create a script var for each child of mywindow with an objectname starting _
var _wrkcnt         = mywindow.findChild("_wrkcnt");
var _description    = mywindow.findChild("_description");
var _warehouse      = mywindow.findChild("_warehouse");
var _showInactive   = mywindow.findChild("_showInactive");
var _booitem        = mywindow.list();

_booitem.addColumn(qsTr("Item Number"), 150, Qt.AlignLeft,   true, "item_number");
_booitem.addColumn(qsTr("Seq #"),        50, Qt.AlignCenter, true, "booitem_seqnumber");
_booitem.addColumn(qsTr("Std. Oper."),  150, Qt.AlignLeft,   true, "stdopn_number");
_booitem.addColumn(qsTr("Descriptions"), -1, Qt.AlignLeft,   true, "boodescrip");

function populateMenu(pMenu, pItem, pCol)
{
  if(pMenu == null)
    pMenu = _booitem.findChild("_menu");

  if(pMenu != null)
  {
    var viewAct = pMenu.addAction(qsTr("View Operation..."));
    viewAct.enabled = privileges.check("ViewBOOs");
    viewAct.triggered.connect(sViewOperation);

    viewAct = pMenu.addAction(qsTr("View Routing..."));
    viewAct.enabled = privileges.check("ViewBOOs");
    viewAct.triggered.connect(sViewBOO);

    pMenu.addSeparator();

    var editAct = pMenu.addAction(qsTr("Edit Operation..."));
    viewAct.enabled = privileges.check("MaintainBOOs");
    editAct.triggered.connect(sEditOperation);

    editAct = pMenu.addAction(qsTr("Edit Routing..."));
    viewAct.enabled = privileges.check("MaintainBOOs");
    editAct.triggered.connect(sEditBOO);
  }
}

function setParams(params)
{
  params.wrkcnt_id = _wrkcnt.id();
  if(!_showInactive.checked)
    params.showActiveOnly = true;
  return true;
}

function sFillWC()
{
  var params = new Object;
  setParams(params);

  var qry = toolbox.executeDbQuery("operationsByWorkCenter", "header", params);
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

function sEditOperation()
{
  var params = new Object;
  params.mode = "edit";
  params.booitem_id = _booitem.id();

  try {
    var stdOper = toolbox.openWindow("booItem", mywindow, 0, 1);
    toolbox.lastWindow().set(params);

    if(stdOper.exec() != 0)
      mywindow.sFillList();
  } catch(e) {
    print("dspOperationsByWorkCenter open booItem exception @ " + e.lineNumber + ": " + e);
  }
}

function sViewOperation()
{
  var params = new Object;
  params.mode = "view";
  params.booitem_id = _booitem.id();

  try {
    var stdOper = toolbox.openWindow("booItem", mywindow, 0, 1);
    toolbox.lastWindow().set(params);

    stdOper.exec();
  } catch(e) {
    print("dspOperationsByWorkCenter open booItem exception @ " + e.lineNumber + ": " + e);
  }
}

function sEditBOO()
{
  var params = new Object;
  params.mode = "edit";
  params.item_id = _booitem.altId();

  try {
    var stdOper = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
    toolbox.lastWindow().set(params);
  } catch(e) {
    print("dspOperationsByWorkCenter open boo exception @ " + e.lineNumber + ": " + e);
  }
}

function sViewBOO()
{
  var params = new Object;
  params.mode = "view";
  params.item_id = _booitem.altId();

  try {
    var stdOper = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
    toolbox.lastWindow().set(params);
  } catch(e) {
    print("dspOperationsByWorkCenter open boo exception @ " + e.lineNumber + ": " + e);
  }
}

_wrkcnt.newID.connect(sFillWC);
_booitem["populateMenu(QMenu *, QTreeWidgetItem *, int)"].connect(populateMenu)

mainwindow.boosUpdated.connect(mywindow, "sFillList");
mywindow.setUseAltId(true);

