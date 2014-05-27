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
  var widgets = toolbox.loadUi("dspLostSales", mywindow);
  var layout = toolbox.createLayout("QVBoxLayout", mywindow);
  layout.addWidget(widgets);
  mywindow.optionsWidget().setLayout(layout);

  mywindow.setWindowTitle(qsTr("Lost Sales"));
  mywindow.setListLabel(qsTr("Lost Sales"));
  mywindow.setReportName("LostSales");
  mywindow.setMetaSQLOptions("lostSales", "detail");

  var _dates            = mywindow.findChild("_dates");
  var _list             = mywindow.list();

  _dates.setStartNull(qsTr("Earliest"), mainwindow.startOfTime(), true);
  _dates.setEndNull(qsTr("Latest"),     mainwindow.endOfTime(),   true);

  _list.addColumn(qsTr("S/O #"),           XTreeWidget.orderColumn,    Qt.AlignLeft,   true,  "cohead_number"   );
  _list.addColumn(qsTr("Cust. #"),         XTreeWidget.orderColumn,    Qt.AlignLeft,   true,  "cust_number"   );
  _list.addColumn(qsTr("Ship-To"),         -1,                         Qt.AlignLeft,   true,  "cohead_shiptoname"   );
  _list.addColumn(qsTr("Order Date"),      XTreeWidget.dateColumn,     Qt.AlignCenter, true,  "cohead_orderdate" );
  _list.addColumn(qsTr("Item Number"),     XTreeWidget.itemColumn,     Qt.AlignLeft,   true,  "item_number"   );
  _list.addColumn(qsTr("Qty. Ordered"),    XTreeWidget.qtyColumn,      Qt.AlignRight,  true,  "coitem_qtyord"  );
  _list.addColumn(qsTr("Qty. Cancelled"),  XTreeWidget.qtyColumn,      Qt.AlignRight,  true,  "qtycancelled"  );
  _list.addColumn(qsTr("Unit Price"),      XTreeWidget.moneyColumn,    Qt.AlignRight,  true,  "coitem_price"  );
  _list.addColumn(qsTr("Ext. Price"),      XTreeWidget.moneyColumn,    Qt.AlignRight,  true,  "extcancelled"  );
  _list.addColumn(qsTr("Reason"),          XTreeWidget.orderColumn,    Qt.AlignLeft,   true,  "charass_value"  );

//  mywindow.setUseAltId(true);
}
catch (e)
{
  QMessageBox.critical(mywindow, "dspLostSales",
                       "dspLostSales.js exception: " + e);
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

    return true;
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "dspLostSales",
                         "setParams exception: " + e);
  }
}
