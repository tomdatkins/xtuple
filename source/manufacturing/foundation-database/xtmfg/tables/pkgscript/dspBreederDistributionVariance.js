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

var widgets = toolbox.loadUi("dspBreederDistributionVariance", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Breeder Distribution Variance"));
mywindow.setListLabel(qsTr("Breeder Distribution Variance"));
mywindow.setReportName("BreederDistributionVarianceByWarehouse");
mywindow.setMetaSQLOptions("breederDistributionVariance", "detail");

var _dates     = widgets.findChild("_dates");
var _item      = widgets.findChild("_item");
var _itemGroup = widgets.findChild("_itemGroup");
var _warehouse = widgets.findChild("_warehouse");

_item.setType(ItemLineEdit.cBreeder);

_dates.setStartNull(qsTr("Earliest"), startOfTime, true);
_dates.setEndNull(qsTr("Latest"),     endOfTime,   true);

mywindow.list().addColumn(qsTr("Post Date"),     -1, Qt.AlignCenter,true, "brdvar_postdate");
mywindow.list().addColumn(qsTr("Parent Item"),   -1, Qt.AlignLeft,  true, "pitem_number");
mywindow.list().addColumn(qsTr("Component Item"),-1, Qt.AlignLeft,  true, "citem_number");
mywindow.list().addColumn(qsTr("Std. Qty. per"), -1, Qt.AlignRight, true, "brdvar_stdqtyper");
mywindow.list().addColumn(qsTr("Std. Qty."),     -1, Qt.AlignRight, true, "stdqty");
mywindow.list().addColumn(qsTr("Act. Qty. per"), -1, Qt.AlignRight, true, "brdvar_actqtyper");
mywindow.list().addColumn(qsTr("Act. Qty."),     -1, Qt.AlignRight, true, "actqty");
mywindow.list().addColumn(qsTr("Qty per Var."),  -1, Qt.AlignRight, true, "qtypervariance");
mywindow.list().addColumn(qsTr("% Var."),        -1, Qt.AlignRight, true, "percentvariance");

function setParams(params)
{
  params.startDate = _dates.startDate;
  params.endDate   = _dates.endDate;

  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  if (_itemGroup.checked && _item.isValid())
    params.item_id = _item.id();

  return true;
}

function sCheckItem()
{
  if (_itemGroup.checked && _item.isValid())
    mywindow.setReportName("BreederDistributionVarianceByItem");
  else
    mywindow.setReportName("BreederDistributionVarianceByWarehouse");
}

_item.valid.connect(sCheckItem);
_itemGroup.toggled.connect(sCheckItem);

