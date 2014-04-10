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

var widgets = toolbox.loadUi("dspSequencedBOM", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Sequenced Bill of Materials"));
mywindow.setListLabel(qsTr("Bill of Materials"));
mywindow.setReportName("SequencedBOM");
mywindow.setMetaSQLOptions("sequencedbom", "detail");

var _bomitem     = mywindow.list();
var _item        = mywindow.findChild("_item");
var _revision    = mywindow.findChild("_revision");
var _showExpired = mywindow.findChild("_showExpired");
var _showFuture  = mywindow.findChild("_showFuture");

_item.setType(ItemLineEdit.cGeneralManufactured | ItemLineEdit.cGeneralPurchased | ItemLineEdit.cKit);

_bomitem.addColumn(qsTr("Routing Seq. #"),  XTreeWidget.qtyColumn, Qt.AlignCenter, true, "booseqnumber");
_bomitem.addColumn(qsTr("BOM Seq. #"),  XTreeWidget.qtyColumn, Qt.AlignCenter, true, "bomitem_seqnumber");
_bomitem.addColumn(qsTr("Item Number"),XTreeWidget.itemColumn, Qt.AlignLeft,   true, "item_number");
_bomitem.addColumn(qsTr("Description"),                    -1, Qt.AlignLeft,   true, "item_descrip1");
_bomitem.addColumn(qsTr("Description"),                    -1, Qt.AlignLeft,   true, "item_descrip2");
_bomitem.addColumn(qsTr("Inv. UOM"),    XTreeWidget.uomColumn, Qt.AlignCenter, true, "item_invuom");
_bomitem.addColumn(qsTr("Create W/O"),   XTreeWidget.ynColumn, Qt.AlignCenter, false,"bomitem_createwo");
_bomitem.addColumn(qsTr("Fxd. Qty."),   XTreeWidget.qtyColumn, Qt.AlignRight,  true, "qtyfxd");
_bomitem.addColumn(qsTr("Qty. Per"),    XTreeWidget.qtyColumn, Qt.AlignRight,  true, "qtyper");
_bomitem.addColumn(qsTr("Scrap"),     XTreeWidget.prcntColumn, Qt.AlignRight,  false,"bomitem_scrap");
_bomitem.addColumn(qsTr("Qty. Req."),   XTreeWidget.qtyColumn, Qt.AlignRight,  false,"qtyreq");
_bomitem.addColumn(qsTr("Scrap %"),   XTreeWidget.prcntColumn, Qt.AlignRight,  true, "bomitem_scrap");
_bomitem.addColumn(qsTr("Effective"),  XTreeWidget.dateColumn, Qt.AlignCenter, true, "bomitem_effective");
_bomitem.addColumn(qsTr("Expires"),    XTreeWidget.dateColumn, Qt.AlignCenter, true, "bomitem_expires");

_revision.setEnabled(false);
_revision.setMode("View");
_revision.setType("BOM");

//If not Revision Control, hide control
_revision.setVisible(metrics.boolean("RevControl"));

function set(pParams)
{
  if ("item_id" in pParams)
    _item.setId(pParams.item_id);

  if ("run" in pParams)
  {
    mywindow.sFillList();
    return mainwindow.NoError_Run;
  }

  return mainwindow.NoError;
}

function setParams(params)
{
  if (! _item.isValid())
  {
    QMessageBox.warning(mywindow, qsTr("Select an Item"),
                       qsTr("<p>Please select an Item."));
    _item.setFocus();
    return false;
  }

  params.item_id = _item.id();
  params.revision_id = _revision.id();

  if (_showExpired.checked)
    params.showExpired = true;

  if (_showFuture.checked)
    params.showFuture = true;
  
  params.push   = qsTr("Push");
  params.pull   = qsTr("Pull");
  params.mixed  = qsTr("Mixed");
  params.special= qsTr("Special");
  params.always = qsTr("Always");
  params.never  = qsTr("Never");
  params.report_name = "SequencedBOM";

  return true;
}

function sFillList(pitemid, plocal)
{
  // if triggered by mainwindow.bo{mo}sUpdated signal for a different item
  if (pitemid != null && pitemid != _item.id() && typeof pitemid != "boolean")
    return;

  mywindow.sFillList();
}

mainwindow["bomsUpdated(int, bool)"].connect(sFillList);
mainwindow["boosUpdated(int, bool)"].connect(sFillList);
