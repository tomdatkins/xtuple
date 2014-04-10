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

// create a script var for each child of mywindow with an objectname starting _
var _close = mywindow.findChild("_close");
var _print = mywindow.findChild("_print");
var _form  = mywindow.findChild("_form");
var _warehouse = mywindow.findChild("_warehouse");
var _dates     = mywindow.findChild("_dates");

function sPrint()
{
  var params = new Object;
  params.form_id = _form.id();
  var qry = toolbox.executeQuery("SELECT form_report_name AS report_name "
                                +"  FROM form "
                                +" WHERE((form_id=<? value('form_id') ?>) );", params);
  if (qry.first())
  {
    var params2 = new Object;
    if(_warehouse.isSelected())
      params2.warehous_id = _warehouse.id();
    params2.startDate = _dates.startDate;
    params2.endDate = _dates.endDate;

    toolbox.printReport(qry.value("report_name"), params2);
  }
  else
  {
    QMessageBox.critical(mywindow, qsTr("Cannot Print Production Entry Sheet"),
                       qsTr("Could not locate the report definition the form '%1'.").arg(_form.currentText));
  }
}

_print.clicked.connect(sPrint);

_close.clicked.connect(mydialog, "reject");

_form.populate("SELECT form_id, form_name "
              +"  FROM form "
              +" WHERE(form_key='PES') "
              +" ORDER BY form_name;");

