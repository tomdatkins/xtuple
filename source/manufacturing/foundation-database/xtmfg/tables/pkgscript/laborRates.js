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
var _print   = mywindow.findChild("_print");
var _new     = mywindow.findChild("_new");
var _edit    = mywindow.findChild("_edit");
var _delete  = mywindow.findChild("_delete");
var _close   = mywindow.findChild("_close");
var _view    = mywindow.findChild("_view");
var _lbrrate = mywindow.findChild("_lbrrate");

_lbrrate.addColumn(qsTr("Labor Rate"),  -1, Qt.AlignLeft,  true, "lbrrate_code");
_lbrrate.addColumn(qsTr("Description"), -1, Qt.AlignLeft,  true, "lbrrate_descrip");
_lbrrate.addColumn(qsTr("Rate"),        -1, Qt.AlignRight, true, "lbrrate_rate");

function sPrint()
{
  var params = new Object;
  toolbox.printReport("StdLaborRatesMasterList", params);
}

function openLaborRate(params)
{
//print("openLaborRate called");
  try {
    var laborRate = toolbox.openWindow("laborRate", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);

    if(laborRate.exec() != 0)
      sFillList();
  } catch(e) {
    print("laborRates open laborRate exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
//print("sNew called");
  var params = new Object;
  params.mode = "new";

  openLaborRate(params);
}

function sEdit()
{
//print("sEdit called");
  var params = new Object;
  params.mode = "edit";
  params.lbrrate_id = _lbrrate.id();

  openLaborRate(params);
}

function sView()
{
//print("sView called");
  var params = new Object;
  params.mode = "view";
  params.lbrrate_id = _lbrrate.id();

  openLaborRate(params);
}

function sDelete()
{
  var params = new Object;
  params.lbrrate_id = _lbrrate.id();

  var qry = toolbox.executeQuery("SELECT wrkcnt_id"
                                +"  FROM xtmfg.wrkcnt"
                                +" WHERE((wrkcnt_run_lbrrate_id=<? value('lbrrate_id') ?>)"
                                +"    OR (wrkcnt_setup_lbrrate_id=<? value('lbrrate_id') ?>))"
                                +" LIMIT 1;", params );
  if(qry.first())
  {
    QMessageBox.information(mywindow, qsTr("Cannot Delete Standard Labor Rate"),
                              qsTr("<p>The selected Standard Labor Rate cannot be deleted as it is in use at one or more Work Centers. You must first remove all references of the selected Standard Labor Rate before you may delete it." ));
    return;
  }

  qry = toolbox.executeQuery("DELETE FROM xtmfg.lbrrate "
                            +" WHERE (lbrrate_id=<? value('lbrrate_id') ?>);", params );

  sFillList();
}

function sFillList()
{
  var params = new Object;
  var qry = toolbox.executeDbQuery("laborRates", "detail", params);
  _lbrrate.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_print.clicked.connect(sPrint);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_delete.clicked.connect(sDelete);
_view.clicked.connect(sView);

_close.clicked.connect(mywindow, "close");

_lbrrate.valid.connect(_view, "setEnabled");

if(privileges.check("MaintainLaborRates"))
{
  _lbrrate.valid.connect(_edit, "setEnabled");
  _lbrrate.valid.connect(_delete, "setEnabled");
  _lbrrate.itemSelected.connect(_edit, "animateClick");
}
else
{
  _lbrrate.itemSelected.connect(_view, "animateClick");
  _new.enabled=false;
}

sFillList();
