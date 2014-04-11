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

  var _cost  = mywindow.list();
  var _previewAct = mywindow.previewAction();
  var _printAct = mywindow.printAction();
  var _queryAct = mywindow.queryAction();
  var _wo    = mywindow.findChild("_wo");

  _cost.headerItem().setData(_cost.column("code"), Qt.DisplayRole,
                             qsTr("Work Center/Item"));

  var _showsu    = toolbox.createWidget("XCheckBox",   mywindow, "_showsu");
  var _showrt    = toolbox.createWidget("XCheckBox",   mywindow, "_showrt");
  var _showmatl  = toolbox.createWidget("XCheckBox",   mywindow, "_showmatl");
  var _printdetail  = toolbox.createWidget("XCheckBox",   mywindow, "_printdetail");
  var _cblayout  = new QBoxLayout(QBoxLayout.TopToBottom);
  var _toplayout = toolbox.widgetGetLayout(_wo);

  _toplayout.insertLayout(1, _cblayout);
  _cblayout.addWidget(_showsu);
  _cblayout.addWidget(_showrt);
  _cblayout.addWidget(_showmatl);
  _cblayout.addWidget(_printdetail);
  _cblayout.addStretch(1);

  _showsu.text   = qsTr("Show Set Up");
  _showrt.text   = qsTr("Show Run Time");
  _showmatl.text = qsTr("Show Materials");
  _printdetail.text = qsTr("Print Work Order Detail report");

  if (!metrics.boolean("Routings"))
  {
    _showsu.hide();
    _showrt.hide();
    _showsu.checked = false;
    _showrt.checked = false;
  }

  function setParams(params)
  {
    if (! _wo.isValid())
    {
      QMessageBox.warning(mywindow, qsTr("Select Options"),
                         qsTr("<p>Please select a Work Order."));
      _wo.setFocus();
      return false;
    }

    if (! _showsu.checked && ! _showrt.checked && ! _showmatl.checked)
    {
      QMessageBox.warning(mywindow, qsTr("SelectOptions"),
                         qsTr("<p>Please select one or more of the options to "
                            + "show Set Up Time, Run Time, and/or Materials."));
      _showsu.setFocus();
      return false;
    }

    params.wo_id    = _wo.id();
    params.setup    = qsTr("Setup");
    params.runtime  = qsTr("Run Time");
    params.material = qsTr("Material");
    params.timeuom  = qsTr("Hours");

    if (_showsu.checked)
      params.showsu = true;

    if (_showrt.checked)
      params.showrt = true;

    if (_showmatl.checked)
      params.showmatl = true;

    if (_printdetail.checked)
      params.report_name = "WorkOrderDetail";
    else
      params.report_name = "JobCosting";

    return true;
  }

  function sPreview()
  {
    var params = new Object;
    if (! setParams(params))
      return;

    mywindow.sPreview(params);
  }

  function sPrint()
  {
    var params = new Object;
    if (! setParams(params))
      return;

    toolbox.printReport(params.report_name, params);
  }

  function sFillList()
  {
    var params = new Object;
    if (! setParams(params))
      return;

    var qry = toolbox.executeDbQuery("manufacture", "jobcosting", params);
    _cost.populate(qry, true);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         qry.lastError().text);
      return;
    }
  }

  toolbox.coreDisconnect(_previewAct, "triggered()", mywindow, "sPreview()");
  toolbox.coreDisconnect(_printAct, "triggered()", mywindow, "sPrint()");
  toolbox.coreDisconnect(_queryAct, "triggered()", mywindow, "sFillList()");
  _previewAct.triggered.connect(sPreview);
  _printAct.triggered.connect(sPrint);
  _queryAct.triggered.connect(sFillList);
