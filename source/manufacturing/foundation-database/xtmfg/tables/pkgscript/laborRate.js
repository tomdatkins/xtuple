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
var _lbrrateid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _buttonBox  = mywindow.findChild("_buttonBox");
var _code  = mywindow.findChild("_code");
var _rate  = mywindow.findChild("_rate");
var _description = mywindow.findChild("_description");

function set(params)
{
  if("lbrrate_id" in params)
  {
    _lbrrateid = params.lbrrate_id;
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
      _code.setFocus();
    }
    else if (params.mode == "view")
    {
      _mode = "view";

      _code.enabled = false;
      _description.enabled = false;
      _rate.enabled = false;
      _buttonBox.clear();
      _buttonBox.addButton(QDialogButtonBox.Close);
      _buttonBox.setFocus();
    }
  }

  return mainwindow.NoError;
}

function sSave()
{
  if (_code.text.length == 0)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Add Labor Rate"),
                       qsTr("You must enter a Code for the new Labor Rate."));
    _code.setFocus();
    return;
  }

  if (_rate.toDouble() == 0)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Add Labor Rate"),
                       qsTr("You must enter a Rate for the new Labor Rate."));
    _rate.setFocus();
    return;
  }

  var q_str = "";
  if (_mode == "new")
  {
    var qid = toolbox.executeQuery("SELECT NEXTVAL('xtmfg.lbrrate_lbrrate_id_seq') AS lbrrate_id;");
    if (qid.first())
      _lbrrateid = qid.value("lbrrate_id");

    q_str = "INSERT INTO xtmfg.lbrrate "
           +"(lbrrate_id, lbrrate_code, lbrrate_descrip, lbrrate_rate) "
           +"VALUES "
           +"(<? value('lbrrate_id') ?>, <? value('lbrrate_code') ?>, <? value('lbrrate_descrip') ?>, <? value('lbrrate_rate') ?>);";
  }
  else if (_mode == "edit")
  {
    q_str = "UPDATE xtmfg.lbrrate "
           +"   SET lbrrate_code=<? value('lbrrate_code') ?>,"
           +"       lbrrate_descrip=<? value('lbrrate_descrip') ?>,"
           +"       lbrrate_rate=<? value('lbrrate_rate') ?> "
           +" WHERE(lbrrate_id=<? value('lbrrate_id') ?>);";
  }

  var params = new Object;
  params.lbrrate_id = _lbrrateid;
  params.lbrrate_code = _code.text;
  params.lbrrate_descrip = _description.text;
  params.lbrrate_rate = _rate.toDouble();

  toolbox.executeQuery(q_str, params);

  mydialog.done(_lbrrateid);
}

function sCheck()
{
  var params = new Object;
  params.lbrrate_code = _code.text;

  if ((_mode == "new") && (_code.text.length > 0))
  {
    var qry = toolbox.executeQuery( "SELECT lbrrate_id "
                                   +"  FROM xtmfg.lbrrate "
                                   +" WHERE(UPPER(lbrrate_code)=UPPER(<? value('lbrrate_code') ?>));", params );
    if (qry.first())
    {
      _lbrrateid = qry.value("lbrrate_id");
      _mode = "edit";
      populate();

      _code.enabled = false;
    }
  }
}

function populate()
{
  var params = new Object;
  params.lbrrate_id = _lbrrateid;

  var qry = toolbox.executeQuery("SELECT lbrrate_code, lbrrate_descrip, lbrrate_rate"
                                +"  FROM xtmfg.lbrrate"
                                +" WHERE(lbrrate_id=<? value('lbrrate_id') ?>)", params);
  if(qry.first())
  {
    _code.text = qry.value("lbrrate_code");
    _description.text = qry.value("lbrrate_descrip");
    _rate.setDouble(qry.value("lbrrate_rate"));
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_buttonBox.accepted.connect(sSave);
_code.editingFinished.connect(sCheck);

_buttonBox.rejected.connect(mydialog, "reject");

_rate.setValidator(mainwindow.moneyVal());

