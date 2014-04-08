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

var _captive = false;

// create a script var for each child of mywindow with an objectname starting _
var _print  = mywindow.findChild("_print");
var _close  = mywindow.findChild("_close");
var _wo     = mywindow.findChild("_wo");
var _copies = mywindow.findChild("_copies");

function set(params)
{
  _captive = true;

  if("wo_id" in params)
  {
    _wo.setId(params.wo_id);
    _wo.setReadOnly(true);
    _copies.setFocus();
  }

  if("mode" in params)
  {
    sPrint();
    return mainwindow.NoError_Print; // NoError_Print
  }

  return mainwindow.NoError; // NoError
}

function sPrint()
{
  var params = new Object;
  params.wo_id = _wo.id();

  toolbox.printReportCopies("Routing", params, _copies.value);

  if(_captive)
  {
    mydialog.accept();
  }
  else
  {
    _close.text = qsTr("&Close");
    _wo.setId(-1);
    _wo.setFocus();
  }
}

_print.clicked.connect(sPrint);
_wo.valid.connect(_print, "setEnabled");

_close.clicked.connect(mydialog, "reject");

_wo.type = 6; // cWoExploded | cWoIssued

