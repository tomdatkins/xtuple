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

if (metrics.boolean("Routings"))
{
  _packingList= mywindow.findChild("_packingList");
  _pickList = mywindow.findChild("_pickList");
  _print    = mywindow.findChild("_print");
  _wo       = mywindow.findChild("_wo");
  _woLabel  = mywindow.findChild("_woLabel");

  var _routing = new XCheckBox(qsTr("Print Routing"), mywindow);
  _routing.objectName = "_routing";

  function fixLayout()
  {
    var cblayout = toolbox.widgetGetLayout(_pickList);
    cblayout.insertWidget(1, _routing);
  }

  fixLayout();

  function sHandleOptions(pWoid)
  {
    if (pWoid >= 0)
    {
      var params = new Object;
      params.wo_id = pWoid;

      var q = toolbox.executeQuery("SELECT wooper_id "
                                 + "  FROM xtmfg.wooper"
                                 + ' WHERE (wooper_wo_id=<? value("wo_id") ?>)'
                                 + ' LIMIT 1;',
                                 params);
      var foundwooper = q.first();
      if (q.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), q.lastError().text);
        return;
      }

      _routing.enabled   = foundwooper;
      _routing.forgetful = !foundwooper;

      // use memory if it's there's something to print
      if (! foundwooper)
        _routing.checked = false;
      }
  }

  function sPrintRouting(printer)
  {
    if (_routing.checked && ! mywindow.errorPrinting())
    {
      var params = new Object;
      params.wo_id = _wo.id();

      var report = new orReport("Routing", params);
      if (! report.isValid() ||
          ! report.print(printer,
                         !(_pickList.checked || _woLabel.checked || _packingList.checked)))
      {
        report.reportError(mywindow);
        mywindow.setErrorPrinting(true);
      }
    }
  }

  function sHandlePrintButton()
  {
    mywindow.sHandlePrintButton();
    _print.enabled = _wo.isValid() && (_print.enabled || _routing.checked);
  }

  toolbox.coreDisconnect(_packingList,"toggled(bool)", mywindow, "sHandlePrintButton()");
  toolbox.coreDisconnect(_pickList,   "toggled(bool)", mywindow, "sHandlePrintButton()");
  toolbox.coreDisconnect(_woLabel,    "toggled(bool)", mywindow, "sHandlePrintButton()");
  toolbox.coreDisconnect(_wo,         "valid(bool)",   mywindow, "sHandlePrintButton()");

  _packingList["toggled(bool)"].connect(sHandlePrintButton);
  _pickList["toggled(bool)"].connect(sHandlePrintButton);
  _routing["toggled(bool)"].connect(sHandlePrintButton);
  _wo["newId(int)"].connect(sHandleOptions);
  _wo["valid(bool)"].connect(sHandlePrintButton);
  _woLabel["toggled(bool)"].connect(sHandlePrintButton);
  mywindow["finishedPrinting(QPrinter*)"].connect(sPrintRouting);
}
