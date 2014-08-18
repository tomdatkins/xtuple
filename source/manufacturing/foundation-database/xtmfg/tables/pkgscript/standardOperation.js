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

var _mode = "new";
var _stdopnid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _buttonBox       = mywindow.findChild("_buttonBox");
var _wrkcnt   = mywindow.findChild("_wrkcnt");
var _optype   = mywindow.findChild("_optype");
var _number   = mywindow.findChild("_number");
var _stdTimes = mywindow.findChild("_stdTimes");
var _invProdUOMRatio = mywindow.findChild("_invProdUOMRatio");
var _setupTime       = mywindow.findChild("_setupTime");
var _runTime         = mywindow.findChild("_runTime");
var _runQtyPer       = mywindow.findChild("_runQtyPer");
var _prodUOM         = mywindow.findChild("_prodUOM");
var _setupReport     = mywindow.findChild("_setupReport");
var _runReport       = mywindow.findChild("_runReport");
var _reportSetup     = mywindow.findChild("_reportSetup");
var _reportRun       = mywindow.findChild("_reportRun");
var _toolReference   = mywindow.findChild("_toolReference");
var _instructions    = mywindow.findChild("_instructions");
var _description1    = mywindow.findChild("_description1");
var _description2    = mywindow.findChild("_description2");

// Populate Operation Type combo
_optype.populate("SELECT opntype_id, opntype_descrip FROM xtmfg.opntype");

function set(params)
{
try {
  if("stdopn_id" in params)
  {
    _stdopnid = params.stdopn_id;
    populate();
  }

  if("mode" in params)
  {
    if (params.mode == "new")
    {
      _mode = "new";
      _number.setFocus();
    }
    else if (params.mode == "edit")
    {
      _mode = "edit";
      _number.setFocus();
    }
    else if (params.mode == "view")
    {
      _mode = "view";

      _number.enabled = false;
      _description1.enabled = false;
      _description2.enabled = false;
      _wrkcnt.enabled = false;
      _optype.enabled = false;
      _prodUOM.enabled = false;
      _invProdUOMRatio.enabled = false;
      _toolReference.enabled = false;
      _stdTimes.enabled = false;
      _setupTime.enabled = false;
      _setupReport.enabled = false;
      _reportSetup.enabled = false;
      _runTime.enabled = false;
      _runReport.enabled = false;
      _reportRun.enabled = false;
      _runQtyPer.enabled = false;
      _instructions.enabled = false;
      _buttonBox.clear();
      _buttonBox.addButton(QDialogButtonBox.Close);
      _buttonBox.setFocus();
    }
  }
} catch(e) {
  print(e);
}

  return 0;
}

function sSave()
{
try {
  if (_number.text.length == 0)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Save Standard Operation"),
                       qsTr("You must supply a Std. Oper. #."));
    _number.setFocus();
    return;
  }

  if (_stdTimes.checked && _setupTime.toDouble() <= 0 && _runTime.toDouble() <= 0)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Save Standard Operation"),
                       qsTr("If you select Use Standard Times then please enter at least a Setup or a Run Time."));
    _setupTime.setFocus();
    return;
  }

  var q_str = "";
  if (_mode == "new")
  {
    var qid = toolbox.executeQuery("SELECT NEXTVAL('xtmfg.stdopn_stdopn_id_seq') AS stdopn_id;");
    if (qid.first())
      _stdopnid = qid.value("stdopn_id");

    q_str = "INSERT INTO xtmfg.stdopn "
           +"( stdopn_id, stdopn_number,"
           +"  stdopn_descrip1, stdopn_descrip2,"
           +"  stdopn_wrkcnt_id, stdopn_toolref, stdopn_stdtimes,"
           +"  stdopn_produom, stdopn_invproduomratio,"
           +"  stdopn_sutime, stdopn_sucosttype, stdopn_reportsetup,"
           +"  stdopn_rntime, stdopn_rncosttype, stdopn_reportrun,"
           +"  stdopn_rnqtyper, stdopn_instructions, stdopn_opntype_id ) "
           +"VALUES "
           +"( <? value('stdopn_id') ?>,"
           +"  <? value('stdopn_number') ?>,"
           +"  <? value('stdopn_descrip1') ?>,"
           +"  <? value('stdopn_descrip2') ?>,"
           +"  <? value('stdopn_wrkcnt_id') ?>,"
           +"  <? value('stdopn_toolref') ?>,"
           +"  <? value('stdopn_stdtimes') ?>,"
           +"  <? value('stdopn_produom') ?>,"
           +"  <? value('stdopn_invproduomratio') ?>,"
           +"  <? value('stdopn_sutime') ?>,"
           +"  <? value('stdopn_sucosttype') ?>,"
           +"  <? value('stdopn_reportsetup') ?>,"
           +"  <? value('stdopn_rntime') ?>,"
           +"  <? value('stdopn_rncosttype') ?>,"
           +"  <? value('stdopn_reportrun') ?>,"
           +"  <? value('stdopn_rnqtyper') ?>,"
           +"  <? value('stdopn_instructions') ?>,"
           +"  <? value('stdopn_opntype_id') ?> );";
  }
  else if (_mode == "edit")
  {
    q_str = "UPDATE xtmfg.stdopn"
           +"   SET stdopn_number=<? value('stdopn_number') ?>,"
           +"       stdopn_wrkcnt_id=<? value('stdopn_wrkcnt_id') ?>,"
           +"       stdopn_descrip1=<? value('stdopn_descrip1') ?>,"
           +"       stdopn_descrip2=<? value('stdopn_descrip2') ?>,"
           +"       stdopn_toolref=<? value('stdopn_toolref') ?>,"
           +"       stdopn_stdtimes=<? value('stdopn_stdtimes') ?>,"
           +"       stdopn_produom=<? value('stdopn_produom') ?>,"
           +"       stdopn_invproduomratio=<? value('stdopn_invproduomratio') ?>,"
           +"       stdopn_sutime=<? value('stdopn_sutime') ?>,"
           +"       stdopn_sucosttype=<? value('stdopn_sucosttype') ?>,"
           +"       stdopn_reportsetup=<? value('stdopn_reportsetup') ?>,"
           +"       stdopn_rntime=<? value('stdopn_rntime') ?>,"
           +"       stdopn_rncosttype=<? value('stdopn_rncosttype') ?>,"
           +"       stdopn_reportrun=<? value('stdopn_reportrun') ?>,"
           +"       stdopn_rnqtyper=<? value('stdopn_rnqtyper') ?>,"
           +"       stdopn_instructions=<? value('stdopn_instructions') ?>,"
           +"       stdopn_opntype_id=<? value('stdopn_opntype_id') ?>"
           +" WHERE(stdopn_id=<? value('stdopn_id') ?>);";
  }

  var params = new Object;
  params.stdopn_id = _stdopnid;
  params.stdopn_wrkcnt_id = _wrkcnt.id();
  params.stdopn_opntype_id = _optype.id();
  params.stdopn_number = _number.text;
  params.stdopn_descrip1 = _description1.text;
  params.stdopn_descrip2 = _description2.text;
  params.stdopn_toolref = _toolReference.text;
  params.stdopn_instructions = _instructions.plainText;
  params.stdopn_produom = _prodUOM.currentText.toUpperCase();
  params.stdopn_invproduomratio = _invProdUOMRatio.toDouble();
  params.stdopn_stdtimes = _stdTimes.checked;
  params.stdopn_sutime = _setupTime.toDouble();
  params.stdopn_reportsetup = _reportSetup.checked;

  if (_setupReport.currentIndex == 0)
    params.stdopn_sucosttype = "D";
  else if (_setupReport.currentIndex == 1)
    params.stdopn_sucosttype = "O";
  else if (_setupReport.currentIndex == 2)
    params.stdopn_sucosttype = "N";

  params.stdopn_rntime = _runTime.toDouble();
  params.stdopn_reportrun = _reportRun.checked;

  if (_runReport.currentIndex == 0)
    params.stdopn_rncosttype = "D";
  else if (_runReport.currentIndex == 1)
    params.stdopn_rncosttype = "O";
  else if (_runReport.currentIndex == 2)
    params.stdopn_rncosttype = "N";

  params.stdopn_rnqtyper = _runQtyPer.toDouble();

  toolbox.executeQuery(q_str, params);

  mydialog.done(_stdopnid);
} catch(e) {
  print(e);
}
}

function sCheck()
{
  var params = new Object;
  params.stdopn_number = _number.text;

  if ((_mode == "new") && (_number.text.length > 0))
  {
    var qry = toolbox.executeQuery( "SELECT stdopn_id "
                                   +"  FROM xtmfg.stdopn "
                                   +" WHERE(UPPER(stdopn_number)=UPPER(<? value('stdopn_number') ?>));", params );
    if (qry.first())
    {
      _stdopnid = qry.value("stdopn_id");
      _mode = "edit";
      populate();

      _number.enabled = false;
    }
  }
}

function populate()
{
  var params = new Object;
  params.stdopn_id = _stdopnid;

  var qry = toolbox.executeQuery("SELECT stdopn_number, stdopn_descrip1, stdopn_instructions,"
                                +"       stdopn_descrip2, stdopn_toolref, stdopn_opntype_id,"
                                +"       stdopn_wrkcnt_id, stdopn_stdtimes,"
                                +"       stdopn_produom, stdopn_sucosttype, stdopn_rncosttype,"
                                +"       formatQty(stdopn_sutime) AS sutime, stdopn_reportsetup,"
                                +"       formatQty(stdopn_rntime) AS rntime, stdopn_reportrun,"
                                +"       formatQty(stdopn_rnqtyper) AS rnqtyper,"
                                +"       formatUOMRatio(stdopn_invproduomratio) AS invproduomratio "
                                +"  FROM xtmfg.stdopn"
                                +" WHERE(stdopn_id=<? value('stdopn_id') ?>)", params);
  if(qry.first())
  {
    _number.text = qry.value("stdopn_number");
    _description1.text = qry.value("stdopn_descrip1");
    _description2.text = qry.value("stdopn_descrip2");
    _toolReference.text = qry.value("stdopn_toolref");
    _wrkcnt.setId(qry.value("stdopn_wrkcnt_id"));
    _optype.setId(qry.value("stdopn_opntype_id"));
    _prodUOM.text = qry.value("stdopn_produom");
    _setupTime.text = qry.value("sutime");
    _reportSetup.checked = qry.value("stdopn_reportsetup");
    _runTime.text = qry.value("rntime");
    _reportRun.checked = qry.value("stdopn_reportrun");
    _runQtyPer.text = qry.value("rnqtyper");
    _invProdUOMRatio.text = qry.value("invproduomratio");
    _instructions.plainText = qry.value("stdopn_instructions");

    var field = qry.value("stdopn_stdtimes");
    _stdTimes.checked = field;
    _setupTime.enabled = field;
    _setupReport.enabled = field;
    _runTime.enabled = field;
    _runReport.enabled = field;
    _runQtyPer.enabled = field;
    _reportSetup.enabled = field;
    _reportRun.enabled = field;

    if (qry.value("stdopn_sucosttype") == "D")
      _setupReport.setCurrentIndex(0);
    else if (qry.value("stdopn_sucosttype") == "O")
      _setupReport.setCurrentIndex(1);
    else if (qry.value("stdopn_sucosttype") == "N")
      _setupReport.setCurrentIndex(2);

    if (qry.value("stdopn_rncosttype") == "D")
      _runReport.setCurrentIndex(0);
    else if (qry.value("stdopn_rncosttype") == "O")
      _runReport.setCurrentIndex(1);
    else if (qry.value("stdopn_rncosttype") == "N")
      _runReport.setCurrentIndex(2);
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

function sHandleWorkCenter()
{
  if (_wrkcnt.id() != -1)
  {
    var params = new Object;
    params.wrkcnt_id = _wrkcnt.id();

    var qry = toolbox.executeQuery("SELECT formatTime(wrkcnt_avgsutime) AS setup"
                                  +"  FROM xtmfg.wrkcnt"
                                  +" WHERE(wrkcnt_id=<? value('wrkcnt_id') ?>);", params);
    if (qry.first())
    {
      _setupTime.text = qry.value("setup");
    }
  }
}

_buttonBox.rejected.connect(mydialog, "reject");

_buttonBox.accepted.connect(sSave);
_number.editingFinished.connect(sCheck);
_wrkcnt.newID.connect(sHandleWorkCenter);
_stdTimes.toggled.connect(_setupTime, "setEnabled");
_stdTimes.toggled.connect(_runTime, "setEnabled");
_stdTimes.toggled.connect(_runQtyPer, "setEnabled");
_stdTimes.toggled.connect(_setupReport, "setEnabled");
_stdTimes.toggled.connect(_runReport, "setEnabled");
_stdTimes.toggled.connect(_reportSetup, "setEnabled");
_stdTimes.toggled.connect(_reportRun, "setEnabled");

_invProdUOMRatio.setValidator(mainwindow.ratioVal());
_setupTime.setValidator(mainwindow.runTimeVal());
_runTime.setValidator(mainwindow.runTimeVal());
_runQtyPer.setValidator(mainwindow.qtyPerVal());

_prodUOM.type = XComboBox.UOMs; 

_wrkcnt.populate("SELECT -1 AS wrkcnt_id, 'Any' AS wrkcnt_code, 1 AS orderby"
                +" UNION "
                +"SELECT wrkcnt_id, wrkcnt_code, 2 AS orderby"
                +"  FROM xtmfg.wrkcnt"
                +" ORDER BY orderby, wrkcnt_code;");

