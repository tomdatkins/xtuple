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
  var _order = mywindow.findChild("_order");
  var _shipment = mywindow.findChild("_shipment");
  var _ship = mywindow.findChild("_ship");
  var _receive = mywindow.findChild("_receive");

  var _layout  = toolbox.widgetGetLayout(_receive);

  var _printShipping = toolbox.createWidget("XCheckBox", mywindow, "_printShipping");
  _printShipping.text = qsTr("Print Shipping");
  _printShipping.enabled = false;
  _layout.addWidget( _printShipping, 5, 0);

  var _printSO = toolbox.createWidget("XCheckBox", mywindow, "_printSO");
  _printSO.text = qsTr("Print S/O");
  _printSO.enabled = false;
  _layout.addWidget( _printSO, 6, 0);

  _order["newId(int,QString)"].connect(sHandleButtons);
  _ship.clicked.connect(sPrintSO);
 _ship.clicked.connect(sPrintShipping);
}
catch (e)
{
  QMessageBox.critical(mywindow, "shipOrder",
                       qsTr("shipOrder.js exception: ") + e);
}

function sHandleButtons()
{
  try
  {
    _printShipping.enabled = true;
    _printSO.enabled = true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "shipOrder",
                         qsTr("sHandleButtons exception: ") + e);
  }
}

function sPrintShipping()
{
  try
  {
    if (_printShipping.checked)
    {
      var params = new Object;
      params.shiphead_id = _shipment.id();

      var wnd = toolbox.openWindow("printShippingForm", mywindow, Qt.ApplicationModal, Qt.Dialog);
      toolbox.lastWindow().set(params);
      var result = wnd.exec();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "shipOrder",
                         qsTr("sPrintSO exception: ") + e);
  }
}

function sPrintSO()
{
  try
  {
    if (_printSO.checked)
    {
      var params = new Object;
      params.report_name = "SalesOrderAcknowledgement";
      params.sohead_id = _order.id();

      toolbox.printReport(params.report_name, params);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "shipOrder",
                         qsTr("sPrintSO exception: ") + e);
  }
}
