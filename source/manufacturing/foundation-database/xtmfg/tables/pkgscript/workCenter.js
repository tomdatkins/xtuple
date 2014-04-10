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
var _wrkcntid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _buttonBox  = mywindow.findChild("_buttonBox");
var _code  = mywindow.findChild("_code");
var _description = mywindow.findChild("_description");
var _department = mywindow.findChild("_department");
var _warehouse = mywindow.findChild("_warehouse");
var _warehouseLit = mywindow.findChild("_warehouseLit");
var _wipLocation = mywindow.findChild("_wipLocation");
var _numOfMachines = mywindow.findChild("_numOfMachines");
var _numOfPeople = mywindow.findChild("_numOfPeople");
var _setupSpecifyRate = mywindow.findChild("_setupSpecifyRate");
var _setupUseSelectedRate = mywindow.findChild("_setupUseSelectedRate");
var _setupRate = mywindow.findChild("_setupRate");
var _stdSetupRate = mywindow.findChild("_stdSetupRate");
var _setupType = mywindow.findChild("_setupType");
var _runSpecifyRate = mywindow.findChild("_runSpecifyRate");
var _runUseSelectedRate = mywindow.findChild("_runUseSelectedRate");
var _runRate = mywindow.findChild("_runRate");
var _stdRunRate = mywindow.findChild("_stdRunRate");
var _overheadPrcntOfLabor = mywindow.findChild("_overheadPrcntOfLabor");
var _overheadPerLaborHour = mywindow.findChild("_overheadPerLaborHour");
var _overheadPerMachHour = mywindow.findChild("_overheadPerMachHour");
var _overheadPerUnit = mywindow.findChild("_overheadPerUnit");
var _overheadRate = mywindow.findChild("_overheadRate");
var _avgQueueDays = mywindow.findChild("_avgQueueDays");
var _avgSetup = mywindow.findChild("_avgSetup");
var _dailyCapacity = mywindow.findChild("_dailyCapacity");
var _efficiencyFactor = mywindow.findChild("_efficiencyFactor");
var _comments = mywindow.findChild("_comments");

var _lbrrate = toolbox.executeQuery("SELECT lbrrate_id, lbrrate_code, lbrrate_rate "
                                   +"  FROM xtmfg.lbrrate "
                                   +" ORDER BY lbrrate_code;");

function set(params)
{
  if("wrkcnt_id" in params)
  {
    _wrkcntid = params.wrkcnt_id;
    populate();
  }

  if("mode" in params)
  {
    if (params.mode == "new")
    {
      _mode = "new";
      _code.setFocus();
    }
    else if (params.mode == "edit")
    {
      _mode = "edit";
      _description.setFocus();
    }
    else if (params.mode == "copy")
    {
      _mode = "new";
      _code.clear();
      _code.setFocus();
    }
    else if (params.mode == "view")
    {
      _mode = "view";

      _code.enabled = false;
      _description.enabled = false;
      _department.enabled = false;
      _warehouse.enabled = false;
      _wipLocation.enabled = false;
      _numOfMachines.enabled = false;
      _numOfPeople.enabled = false;
      _setupSpecifyRate.enabled = false;
      _setupUseSelectedRate.enabled = false;
      _setupRate.enabled = false;
      _stdSetupRate.enabled = false;
      _setupType.enabled = false;
      _runSpecifyRate.enabled = false;
      _runUseSelectedRate.enabled = false;
      _runRate.enabled = false;
      _stdRunRate.enabled = false;
      _overheadPrcntOfLabor.enabled = false;
      _overheadPerLaborHour.enabled = false;
      _overheadPerMachHour.enabled = false;
      _overheadPerUnit.enabled = false;
      _avgQueueDays.enabled = false;
      _avgSetup.enabled = false;
      _dailyCapacity.enabled = false;
      _efficiencyFactor.enabled = false;
      _comments.enabled = false;

      _buttonBox.clear();
      _buttonBox.addButton(QDialogButtonBox.Close);
      _buttonBox.setFocus();
    }
  }

  return mainwindow.NoError;
}

function sSave()
{
try {
  if (_code.text.length == 0)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Save Work Center"),
                       qsTr("You must enter a Code for this Work Center before you may save it."));
    _warehouse.setFocus();
    return;
  }

  if (_warehouse.id() == -1)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Save Work Center"),
                       qsTr("You must select a Site for this Work Center before you may save it."));
    _warehouse.setFocus();
    return;
  }

  var params = new Object;
  params.wrkcnt_code = _code.text;

  if (_mode == "new")
  {
    var qchk = toolbox.executeQuery("SELECT wrkcnt_id FROM xtmfg.wrkcnt WHERE (wrkcnt_code=<? value('wrkcnt_code') ?>);", params);
    if (qchk.first())
    {
      QMessageBox.critical(mywindow,
                         qsTr("Cannot Save Work Center"),
                         qsTr("A Work Center has already been defined with the selected Number.\n"
                            + "You may not create duplicate Work Centers."));
      _code.setFocus();
      return;
    }
  }

  var q_str = "";
  if (_mode == "new")
  {
    var qid = toolbox.executeQuery("SELECT NEXTVAL('xtmfg.wrkcnt_wrkcnt_id_seq') AS _wrkcnt_id;");
    if (qid.first())
      _wrkcntid = qid.value("_wrkcnt_id");

    q_str = "INSERT INTO xtmfg.wrkcnt "
           +"( wrkcnt_id, wrkcnt_code, wrkcnt_descrip,"
           +"  wrkcnt_dept_id, wrkcnt_warehous_id,"
           +"  wrkcnt_nummachs, wrkcnt_numpeople,"
           +"  wrkcnt_setup_lbrrate_id, wrkcnt_setuprate,"
           +"  wrkcnt_run_lbrrate_id, wrkcnt_runrate,"
           +"  wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr,"
           +"  wrkcnt_brd_ratepermachhr, wrkcnt_brd_rateperunitprod,"
           +"  wrkcnt_avgqueuedays, wrkcnt_avgsutime,"
           +"  wrkcnt_dailycap, wrkcnt_caploaduom, wrkcnt_efficfactor,"
           +"  wrkcnt_comments, wrkcnt_wip_location_id) "
           +"VALUES "
           +"( <? value('wrkcnt_id') ?>, <? value('wrkcnt_code') ?>, <? value('wrkcnt_descrip') ?>,"
           +"  <? value('wrkcnt_dept_id') ?>, <? value('wrkcnt_warehous_id') ?>,"
           +"  <? value('wrkcnt_nummachs') ?>, <? value('wrkcnt_numpeople') ?>,"
           +"  <? value('wrkcnt_setup_lbrrate_id') ?>, <? value('wrkcnt_setuprate') ?>,"
           +"  <? value('wrkcnt_run_lbrrate_id') ?>, <? value('wrkcnt_runrate') ?>,"
           +"  <? value('wrkcnt_brd_prcntlbr') ?>, <? value('wrkcnt_brd_rateperlbrhr') ?>,"
           +"  <? value('wrkcnt_brd_ratepermachhr') ?>, <? value('wrkcnt_brd_rateperunitprod') ?>,"
           +"  <? value('wrkcnt_avgqueuedays') ?>, <? value('wrkcnt_avgsutime') ?>,"
           +"  <? value('wrkcnt_dailycap') ?>, <? value('wrkcnt_caploaduom') ?>, <? value('wrkcnt_efficfactor') ?>,"
           +"  <? value('wrkcnt_comments') ?>, <? value('wrkcnt_wip_location_id') ?> );";
  }
  else if (_mode == "edit")
  {
    q_str = "UPDATE xtmfg.wrkcnt "
           +"   SET wrkcnt_code=<? value('wrkcnt_code') ?>,"
           +"       wrkcnt_descrip=<? value('wrkcnt_descrip') ?>,"
           +"       wrkcnt_dept_id=<? value('wrkcnt_dept_id') ?>,"
           +"       wrkcnt_warehous_id=<? value('wrkcnt_warehous_id') ?>,"
           +"       wrkcnt_nummachs=<? value('wrkcnt_nummachs') ?>,"
           +"       wrkcnt_numpeople=<? value('wrkcnt_numpeople') ?>,"
           +"       wrkcnt_setup_lbrrate_id=<? value('wrkcnt_setup_lbrrate_id') ?>,"
           +"       wrkcnt_setuprate=<? value('wrkcnt_setuprate') ?>,"
           +"       wrkcnt_run_lbrrate_id=<? value('wrkcnt_run_lbrrate_id') ?>,"
           +"       wrkcnt_runrate=<? value('wrkcnt_runrate') ?>,"
           +"       wrkcnt_brd_prcntlbr=<? value('wrkcnt_brd_prcntlbr') ?>,"
           +"       wrkcnt_brd_rateperlbrhr=<? value('wrkcnt_brd_rateperlbrhr') ?>,"
           +"       wrkcnt_brd_ratepermachhr=<? value('wrkcnt_brd_ratepermachhr') ?>,"
           +"       wrkcnt_brd_rateperunitprod=<? value('wrkcnt_brd_rateperunitprod') ?>,"
           +"       wrkcnt_avgqueuedays=<? value('wrkcnt_avgqueuedays') ?>,"
           +"       wrkcnt_avgsutime=<? value('wrkcnt_avgsutime') ?>,"
           +"       wrkcnt_dailycap=<? value('wrkcnt_dailycap') ?>,"
           +"       wrkcnt_caploaduom=<? value('wrkcnt_caploaduom') ?>,"
           +"       wrkcnt_efficfactor=<? value('wrkcnt_efficfactor') ?>,"
           +"       wrkcnt_comments=<? value('wrkcnt_comments') ?>,"
           +"       wrkcnt_wip_location_id=<? value('wrkcnt_wip_location_id') ?> "
           +" WHERE(wrkcnt_id=<? value('wrkcnt_id') ?>);";
  }

  params.wrkcnt_id = _wrkcntid;
  params.wrkcnt_descrip = _description.text;
  if(_department.id() != -1)
    params.wrkcnt_dept_id = _department.id();
  params.wrkcnt_warehous_id = _warehouse.id();
  params.wrkcnt_wip_location_id = _wipLocation.id();
  params.wrkcnt_nummachs = _numOfMachines.value;
  params.wrkcnt_numpeople = _numOfPeople.value;
  params.wrkcnt_setup_lbrrate_id = (_setupUseSelectedRate.checked ? _stdSetupRate.id() : -1);
  params.wrkcnt_setuprate = _setupRate.toDouble();
  params.wrkcnt_run_lbrrate_id = (_runUseSelectedRate.checked ? _stdRunRate.id() : -1);
  params.wrkcnt_runrate = _runRate.toDouble();
  params.wrkcnt_brd_prcntlbr = (_overheadPrcntOfLabor.toDouble() / 100.0);
  params.wrkcnt_brd_rateperlbrhr = _overheadPerLaborHour.toDouble();
  params.wrkcnt_brd_ratepermachhr = _overheadPerMachHour.toDouble();
  params.wrkcnt_brd_rateperunitprod = _overheadPerUnit.toDouble();
  params.wrkcnt_avgqueuedays = _avgQueueDays.value;
  params.wrkcnt_avgsutime = _avgSetup.toDouble();
  params.wrkcnt_dailycap = _dailyCapacity.toDouble();
  params.wrkcnt_efficfactor = (_efficiencyFactor.toDouble() / 100.0);
  params.wrkcnt_comments = _comments.plainText;

  if (_setupType.currentIndex == 0)
    params.wrkcnt_caploaduom = "M";
  else
    params.wrkcnt_caploaduom = "L";

  toolbox.executeQuery(q_str, params);

  mainwindow.sWorkCentersUpdated();
  mywindow.close();
} catch(e) {
  print(e.lineNumber + ": " + e);
}
}

function sCheck()
{
  var params = new Object;
  params.wrkcnt_id = _code.text;

  if ((_mode == "new") && (_code.text.length > 0))
  {
    var qry = toolbox.executeQuery( "SELECT wrkcnt_id "
                                   +"  FROM xtmfg.wrkcnt "
                                   +" WHERE(UPPER(wrkcnt_code)=UPPER(<? value('wrkcnt_code') ?>));", params );
    if (qry.first())
    {
      _wrkcntid = qry.value("wrkcnt_id");
      _mode = "edit";
      populate();

      _code.enabled = false;
    }
  }
}

function sPopulateSetupRate()
{
  var params = new Object;
  params.lbrrate_id = _stdSetupRate.id();
  var qry = toolbox.executeQuery("SELECT lbrrate_rate AS rate "
                                +"  FROM xtmfg.lbrrate "
                                +" WHERE(lbrrate_id=<? value('lbrrate_id') ?>);", params);
  if(qry.first())
    _setupRate.setDouble(qry.value("rate"));
}

function sPopulateRunRate()
{
  var params = new Object;
  params.lbrrate_id = _stdRunRate.id();
  var qry = toolbox.executeQuery("SELECT lbrrate_rate AS rate "
                                +"  FROM xtmfg.lbrrate "
                                +" WHERE(lbrrate_id=<? value('lbrrate_id') ?>);", params);
  if(qry.first())
    _runRate.setDouble(qry.value("rate"));
}

function sPopulateLocations()
{
  var params = new Object;
  params.warehous_id = _warehouse.id();
  var qry = toolbox.executeQuery("SELECT location_id, formatLocationName(location_id) AS locationname"
                                +"  FROM location"
                                +" WHERE ( (NOT location_restrict)"
                                +"   AND   (location_warehous_id=<? value('warehous_id') ?>) ) "
                                +" ORDER BY locationname;", params)
  _wipLocation.populate(qry, _warehouse.id());
}

function sPopulateOverheadRate()
{
  var runRate = 0.0;
  if(_runUseSelectedRate.checked)
  {
    _lbrrate.findFirst("lbrrate_id", _stdRunRate.id());
    runRate = _lbrrate.value("lbrrate_rate");
  }
  else
    runRate = _runRate.toDouble();

  _overheadRate.text = toolbox.formatCost(
      ((_numOfPeople.value * runRate) * _overheadPrcntOfLabor.toDouble() / 100) +
      (_numOfPeople.value * _overheadPerLaborHour.toDouble()) +
      (_numOfMachines.value * _overheadPerMachHour.toDouble()) );
}

function populate()
{
  var params = new Object;
  params.wrkcnt_id = _wrkcntid;

  var qry = toolbox.executeQuery("SELECT wrkcnt_code, wrkcnt_descrip, COALESCE(wrkcnt_dept_id, -1) AS wrkcnt_dept_id,"
                                +"       wrkcnt_warehous_id, wrkcnt_caploaduom, wrkcnt_comments,"
                                +"       wrkcnt_nummachs, wrkcnt_numpeople,"
                                +"       wrkcnt_brd_prcntlbr * 100 AS f_brd_prcntlbr,"
                                +"       wrkcnt_brd_rateperlbrhr,"
                                +"       wrkcnt_brd_ratepermachhr,"
                                +"       wrkcnt_brd_rateperunitprod,"
                                +"       wrkcnt_avgqueuedays,"
                                +"       wrkcnt_avgsutime,"
                                +"       wrkcnt_dailycap,"
                                +"       wrkcnt_efficfactor * 100 AS f_efficfactor,"
                                +"       wrkcnt_setuprate,"
                                +"       wrkcnt_runrate,"
                                +"       wrkcnt_setup_lbrrate_id, wrkcnt_run_lbrrate_id,"
                                +"       wrkcnt_wip_location_id "
                                +"  FROM xtmfg.wrkcnt "
                                +" WHERE(wrkcnt_id=<? value('wrkcnt_id') ?>);", params);
  if(qry.first())
  {
    _code.text = qry.value("wrkcnt_code");
    _description.text = qry.value("wrkcnt_descrip");
    _department.setId(qry.value("wrkcnt_dept_id"));
    _numOfMachines.value = qry.value("wrkcnt_nummachs");
    _numOfPeople.value = qry.value("wrkcnt_numpeople");
    _overheadPrcntOfLabor.setDouble(qry.value("f_brd_prcntlbr"));
    _overheadPerLaborHour.setDouble(qry.value("wrkcnt_brd_rateperlbrhr"));
    _overheadPerMachHour.setDouble(qry.value("wrkcnt_brd_ratepermachhr"));
    _overheadPerUnit.setDouble(qry.value("wrkcnt_brd_rateperunitprod"));
    _avgQueueDays.value = qry.value("wrkcnt_avgqueuedays");
    _avgSetup.setDouble(qry.value("wrkcnt_avgsutime"));
    _dailyCapacity.setDouble(qry.value("wrkcnt_dailycap"));
    _efficiencyFactor.setDouble(qry.value("f_efficfactor"));
    _warehouse.setId(qry.value("wrkcnt_warehous_id"));
    _wipLocation.setId(qry.value("wrkcnt_wip_location_id"));

    if (qry.value("wrkcnt_setup_lbrrate_id") != -1)
    {
      _setupUseSelectedRate.checked = true;
      _stdSetupRate.setId(qry.value("wrkcnt_setup_lbrrate_id"));
    }
    else
      _setupSpecifyRate.checked = true;

    _setupRate.setDouble(qry.value("wrkcnt_setuprate"));
    sPopulateOverheadRate();

    if (qry.value("wrkcnt_run_lbrrate_id") != -1)
    {
      _runUseSelectedRate.checked = true;
      _stdRunRate.setId(qry.value("wrkcnt_run_lbrrate_id"));
    }
    else
      _runSpecifyRate.checked = true;

    _runRate.setDouble(qry.value("wrkcnt_runrate"));
    sPopulateOverheadRate();

    if (qry.value("wrkcnt_caploaduom") == "M")
      _setupType.currentIndex = 0;
    else if (qry.value("wrkcnt_caploaduom") == "L")
      _setupType.currentIndex = 1;
    else
      _setupType.currentIndex = -1;

    _comments.plainText = qry.value("wrkcnt_comments");
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

try
{
  _buttonBox.accepted.connect(sSave);
  _code.editingFinished.connect(sCheck);
  _numOfMachines['valueChanged(int)'].connect(sPopulateOverheadRate);
  _numOfPeople['valueChanged(int)'].connect(sPopulateOverheadRate);
  _overheadPerLaborHour.textChanged.connect(sPopulateOverheadRate);
  _overheadPerMachHour.textChanged.connect(sPopulateOverheadRate);
  _overheadPrcntOfLabor.textChanged.connect(sPopulateOverheadRate);
  _runRate.textChanged.connect(sPopulateOverheadRate);
  _runSpecifyRate.toggled.connect(_runRate, "setEnabled");
  _runUseSelectedRate.toggled.connect(_stdRunRate, "setEnabled");
  _runUseSelectedRate.clicked.connect(sPopulateRunRate);
  _setupRate.textChanged.connect(sPopulateOverheadRate);
  _setupSpecifyRate.toggled.connect(_stdSetupRate, "setEnabled");
  _setupSpecifyRate.toggled.connect(_setupRate, "setEnabled");
  _setupUseSelectedRate.toggled.connect(_stdSetupRate, "setEnabled");
  _setupUseSelectedRate.clicked.connect(sPopulateSetupRate);
  _stdRunRate.newID.connect(sPopulateRunRate);
  _stdSetupRate.newID.connect(sPopulateSetupRate);
  _warehouse.newID.connect(sPopulateLocations);

  _buttonBox.rejected.connect(mywindow, "close");

  _runRate.setValidator(mainwindow.moneyVal());
  _setupRate.setValidator(mainwindow.moneyVal());
  _overheadPrcntOfLabor.setValidator(mainwindow.percentVal());
  _overheadPerLaborHour.setValidator(mainwindow.moneyVal());
  _overheadPerMachHour.setValidator(mainwindow.moneyVal());
  _overheadRate.setValidator(mainwindow.costVal());
  _overheadPerUnit.setValidator(mainwindow.moneyVal());
  _avgSetup.setValidator(mainwindow.runTimeVal());
  _dailyCapacity.setValidator(mainwindow.runTimeVal());
  _efficiencyFactor.setValidator(mainwindow.percentVal());

  _stdSetupRate.populate(_lbrrate);
  if (_stdSetupRate.count == 0)
    _setupUseSelectedRate.enabled = false;

  _stdRunRate.populate(_lbrrate);
  if (_stdRunRate.count == 0)
    _runUseSelectedRate.enabled = false;

  _setupType.currentIndex = -1;

  //If not multi-warehouse hide whs control
  if (!metrics.boolean("MultiWhs"))
  {
    _warehouseLit.visible = false;
    _warehouse.visible = false;
  }
  sPopulateLocations();
} catch(e) {
  print(e.lineNumber + ": " + e);
}
