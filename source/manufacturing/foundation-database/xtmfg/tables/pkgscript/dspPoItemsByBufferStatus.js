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

var widgets = toolbox.loadUi("dspPoItemsByBufferStatus", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Purchase Order Items by Buffer Status"));
mywindow.setListLabel(qsTr("Purchase Order Items"));
mywindow.setReportName("POLineItemsByBufferStatus");
mywindow.setMetaSQLOptions("poitemsbybufferstatus", "detail");

var _agent      = mywindow.findChild("_agent");
var _selectedPurchasingAgent = mywindow.findChild("_selectedPurchasingAgent");
var _warehouse  = mywindow.findChild("_warehouse");
var _poitem     = mywindow.list();

_agent.setText(mainwindow.username());

_poitem.addColumn(qsTr("P/O #"),        -1, Qt.AlignRight, true, "pohead_number");
_poitem.addColumn(qsTr("Site"),         -1, Qt.AlignCenter,true, "warehousecode");
_poitem.addColumn(qsTr("Status"),       -1, Qt.AlignCenter,true, "poitem_status");
_poitem.addColumn(qsTr("Vendor"),       -1, Qt.AlignLeft,  true, "vend_name");
_poitem.addColumn(qsTr("Buffer Status"),-1, Qt.AlignRight, true, "bufrsts_status");
_poitem.addColumn(qsTr("Buffer Type"),  -1, Qt.AlignCenter,true, "bufrststype");
_poitem.addColumn(qsTr("Item Number"),  -1, Qt.AlignLeft,  true, "item_number");
_poitem.addColumn(qsTr("Description"),  -1, Qt.AlignLeft,  true, "item_descrip1");
_poitem.addColumn(qsTr("UOM"),          -1, Qt.AlignCenter,true, "uom_name");
_poitem.addColumn(qsTr("Ordered"),      -1, Qt.AlignRight, true, "poitem_qty_ordered");
_poitem.addColumn(qsTr("Received"),     -1, Qt.AlignRight, true, "poitem_qty_received");
_poitem.addColumn(qsTr("Returned"),     -1, Qt.AlignRight, true, "poitem_qty_returned");
_poitem.addColumn(qsTr("Due Date"),     -1, Qt.AlignCenter,true, "poitem_duedate");

function setParams(params)
{
  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  if (_selectedPurchasingAgent.checked)
    params.agentUsername = _agent.text;
  
  params.stock       = qsTr("Stock");
  params.time        = qsTr("Time");
  params.closed      = qsTr("Closed");
  params.unposted    = qsTr("Unposted");
  params.partial     = qsTr("Partial");
  params.received    = qsTr("Received");
  params.open        = qsTr("Open");
  params.report_name = "POLineItemsByBufferStatus";

  return true;
}

function sPopulateMenu(pMenu, pSelected)
{
  var menuItem;

  if (pSelected.rawValue("poitem_status") == "U")
  {
    menuItem = pMenu.addAction(qsTr("Edit Order..."));
    menuItem.enabled = (privileges.check("MaintainPurchaseOrders"));
    menuItem.triggered.connect(sEditOrder);
  }

  menuItem = pMenu.addAction(qsTr("View Order..."));
  menuItem.enabled = (privileges.check("MaintainPurchaseOrders") && privileges.check("ViewPurchaseOrders"));
  menuItem.triggered.connect(sViewOrder);

  menuItem = pMenu.addAction(qsTr("Running Availability..."));
  menuItem.enabled = (privileges.check("ViewInventoryAvailability"));
  menuItem.triggered.connect(sRunningAvailability);

  pMenu.addSeparator();

  if (pSelected.rawValue("poitem_status") == "U")
  {
    menuItem = pMenu.addAction(qsTr("Edit Item..."));
    menuItem.enabled = (privileges.check("MaintainPurchaseOrders"));
    menuItem.triggered.connect(sEditItem);
  }

  menuItem = pMenu.addAction(qsTr("View Item..."));
  menuItem.enabled = (privileges.check("MaintainPurchaseOrders")
                                   && privileges.check("ViewPurchaseOrders"));
  menuItem.triggered.connect(sViewItem);

  if (pSelected.rawValue("poitem_status") != "C")
  {
    menuItem = pMenu.addAction(qsTr("Reschedule..."));
    menuItem.enabled = (privileges.check("ReschedulePurchaseOrders"));
    menuItem.triggered.connect(sReschedule);

    menuItem = pMenu.addAction(qsTr("Change Qty..."));
    menuItem.enabled = (privileges.check("ChangePurchaseOrderQty"));
    menuItem.triggered.connect(sChangeQty);

    pMenu.addSeparator();
  }

  if (pSelected.rawValue("poitem_status") == "O")
  {
    menuItem = pMenu.addAction(qsTr("Close Item..."));
    menuItem.enabled = (privileges.check("MaintainPurchaseOrders"));
    menuItem.triggered.connect(sCloseItem);
  }
  else if (pSelected.rawValue("poitem_status") == "C")
  {
    menuItem = pMenu.addAction(qsTr("Open Item..."));
    menuItem.enabled = (privileges.check("MaintainPurchaseOrders"));
    menuItem.triggered.connect(sOpenItem);
  }
}

function sRunningAvailability()
{
  var params = new Object;
  params.poitemid = _poitem.altId();
  var qry = toolbox.executeQuery("SELECT poitem_itemsite_id "
                               + "FROM poitem "
                               + 'WHERE (poitem_id=<? value("poitemid") ?>);',
                                params);
  if (qry.first())
  {
    var params = new Object;
    params.itemsite_id = qry.value("poitem_itemsite_id");
    params.run = true;

    var newdlg = toolbox.openWindow("dspRunningAvailability", 0,
                                    Qt.NonModal, Qt.Window);
    newdlg.set(params);
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError());
    return;
  }
}

function sEditOrder()
{
  var params = new Object;
  params.mode = "edit";
  params.pohead_id = _poitem.id();

  var newdlg = toolbox.openWindow("purchaseOrder", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sViewOrder()
{
  var params = new Object;
  params.mode = "view";
  params.pohead_id = _poitem.id();

  var newdlg = toolbox.openWindow("purchaseOrder", 0,
                                  Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sEditItem()
{
  var params = new Object;
  params.mode = "edit";
  params.poitem_id = _poitem.altId();

  var newdlg = toolbox.openWindow("purchaseOrderItem", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sViewItem()
{
  var params = new Object;
  params.mode = "view";
  params.poitem_id = _poitem.altId();

  var newdlg = toolbox.openWindow("purchaseOrderItem", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  newdlg.exec();
}

function sReschedule()
{
  var params = new Object;
  params.poitem_id = _poitem.altId();

  var newdlg = toolbox.openWindow("reschedulePoitem", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  if (newdlg.set(params) == 0 && newdlg.exec() != QDialog.Rejected)
    mywindow.sFillList();
}

function sChangeQty()
{
  var params = new Object;
  params.poitem_id = _poitem.altId();

  var newdlg = toolbox.openWindow("changePoitemQty", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);
  if (newdlg.exec() != QDialog.Rejected)
    mywindow.sFillList();
}

function sCloseItem()
{
  var params = new Object;
  params.poitem_id = _poitem.altId();
  var qry = toolbox.executeQuery("UPDATE poitem "
                               + "SET poitem_status='C' "
                               + 'WHERE (poitem_id=<? value("poitem_id") ?>);',
                                params);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }
  mywindow.sFillList();
}

_poitem["populateMenu(QMenu*,XTreeWidgetItem*)"].connect(sPopulateMenu);
mywindow.setUseAltId(true);
