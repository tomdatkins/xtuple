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

var _mode = "new";
var _whsecalid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _buttonBox   = mywindow.findChild("_buttonBox");
var _warehouse   = mywindow.findChild("_warehouse");
var _dates       = mywindow.findChild("_dates");
var _description = mywindow.findChild("_description");
var _activeGroup = mywindow.findChild("_activeGroup");
var _active      = mywindow.findChild("_active");
var _inactive    = mywindow.findChild("_inactive");

function set(params)
{
  if("whsecal_id" in params)
  {
    _whsecalid = params.whsecal_id;
    populate();
  }

  if("mode" in params)
  {
    if (params.mode == "new")
    {
      _mode = "new";
    }
    else if (params.mode == "edit")
    {
      _mode = "edit";
      _buttonBox.setFocus();
    }
    else if (params.mode == "view")
    {
      _mode = "view";

      _warehouse.enabled = false;
      _description.enabled = false;
      _dates.enabled = false;
      _activeGroup.enabled = false;

      _buttonBox.clear();
      _buttonBox.addButton(QDialogButtonBox.Close);
      _buttonBox.setFocus();
    }
  }

  return mainwindow.NoError;
}

function sSave()
{
  if (!_dates.allValid())
  {
    QMessageBox.critical(mywindow,
                       qsTr("Enter Start/End Date"),
                       qsTr("You must enter a valid start/end date for this Site Calendar before saving it."));
    _dates.setFocus();
    return;
  }

  if (_dates.startDate > _dates.endDate)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Invalid Start/End Date"),
                       qsTr("The Start Date must be earlier than the End Date."));
    _dates.setFocus();
    return;
  }

  var params = new Object;
  if(_warehouse.isSelected())
    params.warehous_id = _warehouse.id();
  params.startDate = _dates.startDate;
  params.endDate = _dates.endDate;
  params.whsecal_id = _whsecalid;

  var qry = toolbox.executeQuery("SELECT whsecal_id"
                                +"  FROM xtmfg.whsecal"
                                +" WHERE((whsecal_id != <? value('whsecal_id') ?>)"
                                +"   AND (COALESCE(whsecal_warehous_id, -1)=COALESCE(<? value('warehous_id') ?>, -1))"
                                +"   AND (whsecal_effective=<? value('startDate') ?>)"
                                +"   AND (whsecal_expires=<? value('endDate') ?>));", params);
  if (qry.first())
  {
    QMessageBox.critical(mywindow,
                       qsTr("Date for Site Already Set"),
                       qsTr("The Dates specified for the Site is already in the system. Please edit that record or change you dates."));
    return;
  }

  var q_str = "";
  if (_mode == "new")
  {
    var qid = toolbox.executeQuery("SELECT NEXTVAL('xtmfg.whsecal_whsecal_id_seq') AS whsecal_id;");
    if (qid.first())
      _whsecalid = qid.value("whsecal_id");

    q_str = "INSERT INTO xtmfg.whsecal "
           +"( whsecal_id, whsecal_warehous_id, whsecal_descrip,"
           +"  whsecal_effective, whsecal_expires, whsecal_active ) "
           +"VALUES "
           +"( <? value('whsecal_id') ?>, <? value('warehous_id') ?>, <? value('whsecal_descrip') ?>,"
           +"  <? value('startDate') ?>, <? value('endDate') ?>, <? value('whsecal_active') ?> );";
  }
  else if (_mode == "edit")
  {
    q_str = "UPDATE xtmfg.whsecal "
           +"   SET whsecal_warehous_id=<? value('warehous_id') ?>,"
           +"       whsecal_descrip=<? value('whsecal_descrip') ?>,"
           +"       whsecal_effective=<? value('startDate') ?>,"
           +"       whsecal_expires=<? value('endDate') ?>,"
           +"       whsecal_active=<? value('whsecal_active') ?> "
           +" WHERE (whsecal_id=<? value('whsecal_id') ?>);";
  }

  params.whsecal_id = _whsecalid;
  params.whsecal_descrip = _description.text;
  params.whsecal_active = _active.checked;

  toolbox.executeQuery(q_str, params);

  mydialog.done(_whsecalid);
}

function populate()
{
  var params = new Object;
  params.whsecal_id = _whsecalid;

  var qry = toolbox.executeQuery("SELECT *"
                                +"  FROM xtmfg.whsecal"
                                +" WHERE(whsecal_id=<? value('whsecal_id') ?>)", params);
  if(qry.first())
  {
    var warehousid = qry.value("whsecal_warehous_id");
    if(warehousid < 1)
      _warehouse.setAll();
    else
      _warehouse.setId(warehousid);

    _description.text = qry.value("whsecal_descrip");
    _dates.startDate = qry.value("whsecal_effective");
    _dates.endDate = qry.value("whsecal_expires");

    if(qry.value("whsecal_active") == true)
      _active.checked = true;
    else
      _inactive.checked = true;
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_buttonBox.accepted.connect(sSave);

_buttonBox.rejected.connect(mywindow, "close");

_description.setFocus();

