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

try
{
  var _orderLit             = mywindow.findChild("_orderLit");
  var _order                = mywindow.findChild("_order");
  var _margin               = mywindow.findChild("_margin");

  var _buttonBox  = mywindow.findChild("_buttonBox");

  _buttonBox.accepted.connect(save);
  _buttonBox.rejected.connect(mywindow, "close");
}
catch (e)
{
  QMessageBox.critical(mywindow, "smoothMargin",
                       "smoothMargin.js exception: " + e);
}

function set(params)
{
  try
  {
    if("order_type" in params)
    {
      if (params.order_type == 1)
        _orderLit.text = "Quote #:";
      else
        _orderLit.text = "Sales Order #:";
    }

    if("order_number" in params)
      _order.text = params.order_number;

    return mainwindow.NoError;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "smoothMargin",
                         "set exception: " + e);
  }
}

function save()
{
  try
  {
    mydialog.done(_margin.toDouble());
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "smoothMargin",
                         "save exception: " + e);
  }
}
