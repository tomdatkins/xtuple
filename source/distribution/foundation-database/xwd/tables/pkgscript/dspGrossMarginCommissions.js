/*
This file is part of the xwd Package for xTuple ERP,
and is Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.  It
is licensed to you under the xTuple End-User License Agreement ("the
EULA"), the full text of which is available at www.xtuple.com/EULA.
While the EULA gives you access to source code and encourages your
involvement in the development process, this Package is not free
software.  By using this software, you agree to be bound by the
terms of the EULA.
*/
debugger;

include("storedProcErrorLookup");
include("xwdErrors");

try
{
  var widgets = toolbox.loadUi("dspGrossMarginCommissions", mywindow);
  var layout = toolbox.createLayout("QVBoxLayout", mywindow);
  layout.addWidget(widgets);
  mywindow.optionsWidget().setLayout(layout);

  mywindow.setWindowTitle(qsTr("Gross Margin Commissions"));
  mywindow.setListLabel(qsTr("Commissions"));
  mywindow.setReportName("GrossMarginCommissions");
  mywindow.setMetaSQLOptions("salesHistory", "commissions");

  var _dates              = mywindow.findChild("_dates");
  var _selectedOutsideRep = mywindow.findChild("_selectedOutsideRep");
  var _outsideSalesrep    = mywindow.findChild("_outsideSalesrep");
  var _selectedInsideRep  = mywindow.findChild("_selectedInsideRep");
  var _insideSalesrep     = mywindow.findChild("_insideSalesrep");
  var _includeMisc        = mywindow.findChild("_includeMisc");
  var _list               = mywindow.list();

  _dates.setStartNull(qsTr("Earliest"), mainwindow.startOfTime(), true);
  _dates.setEndNull(qsTr("Latest"),     mainwindow.endOfTime(),   true);

  _list.addColumn(qsTr("Outside Rep."),    100,                        Qt.AlignLeft,   true,  "outside_salesrep"   );
  _list.addColumn(qsTr("Inside Rep."),     100,                        Qt.AlignLeft,   true,  "inside_salesrep"   );
  _list.addColumn(qsTr("S/O #"),           XTreeWidget.orderColumn,    Qt.AlignLeft,   true,  "cohist_ordernumber"   );
  _list.addColumn(qsTr("Cust. #"),         XTreeWidget.orderColumn,    Qt.AlignLeft,   true,  "cust_number"   );
  _list.addColumn(qsTr("Ship-To"),         -1,                         Qt.AlignLeft,   true,  "cohist_shiptoname"   );
  _list.addColumn(qsTr("Invc. Date"),      XTreeWidget.dateColumn,     Qt.AlignCenter, true,  "cohist_invcdate" );
  _list.addColumn(qsTr("Item Number"),     XTreeWidget.itemColumn,     Qt.AlignLeft,   true,  "item_number"   );
  _list.addColumn(qsTr("Qty."),            XTreeWidget.qtyColumn,      Qt.AlignRight,  true,  "cohist_qtyshipped"  );
  _list.addColumn(qsTr("Ext. Price"),      XTreeWidget.moneyColumn,    Qt.AlignRight,  true,  "extprice"  );
  _list.addColumn(qsTr("Ext. Cost"),       XTreeWidget.moneyColumn,    Qt.AlignRight,  true,  "extcost"  );
  _list.addColumn(qsTr("Gross Margin"),    XTreeWidget.moneyColumn,    Qt.AlignRight,  true,  "grossmargin"  );
  _list.addColumn(qsTr("Outside Comm."),   XTreeWidget.moneyColumn,    Qt.AlignRight,  true,  "outside_commission"  );
  _list.addColumn(qsTr("Inside Comm."),    XTreeWidget.moneyColumn,    Qt.AlignRight,  true,  "inside_commission"  );

  mywindow.setUseAltId(true);
}
catch (e)
{
  QMessageBox.critical(mywindow, "dspGrossMarginCommissions",
                       "dspGrossMarginCommissions.js exception: " + e);
}

function setParams(params)
{
  try
  {
    if (! _dates.allValid())
    {
      QMessageBox.warning( mywindow, qsTr("Incomplete query request"),
                         qsTr("<p>Please enter start and end dates."));
      _dates.setFocus();
      return false;
    }

    if (_selectedOutsideRep.checked)
      params.outsiderep_id = _outsideSalesrep.id();
    if (_selectedInsideRep.checked)
      params.insiderep_id = _insideSalesrep.id();
    params.startDate = _dates.startDate;
    params.endDate   = _dates.endDate;
    if (_includeMisc.checked)
      params.includeMisc = true;

    return true;
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "dspGrossMarginCommissions",
                         "setParams exception: " + e);
  }
}
