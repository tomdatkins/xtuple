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

include("storedProcErrorLookup");
include("xwdErrors");

try
{
  var _orderNumber          = mywindow.findChild("_orderNumber");
  var _lineNumber           = mywindow.findChild("_lineNumber");
  var _reason               = mywindow.findChild("_reason");
  var _coitemid             = -1;

  var _buttonBox  = mywindow.findChild("_buttonBox");

  _buttonBox.accepted.connect(sSave);
  _buttonBox.rejected.connect(mywindow, "close");
}
catch (e)
{
  QMessageBox.critical(mywindow, "lostSale",
                       "lostSale.js exception: " + e);
}

function set(params)
{
  if ("coitem_id" in params)
    _coitemid = params.coitem_id;
  populate();
}

function populate()
{
  try
  {
    var params = new Object();
    params.coitem_id = _coitemid;
    params.char_name = "lostsale";

    var qry = "SELECT cohead_number, coitem_linenumber "
            + "FROM coitem JOIN cohead ON (cohead_id=coitem_cohead_id) "
            + "WHERE (coitem_id = <? value('coitem_id') ?>);";
    var data = toolbox.executeQuery(qry, params );
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
      return;
    }
    if (data.first())
    {
      _orderNumber.setText(data.value("cohead_number"));
      _lineNumber.setText(data.value("coitem_linenumber"));
    }

    var qry = "SELECT charopt_id, charopt_value "
            + "FROM char JOIN charopt ON (charopt_char_id=char_id) "
            + "WHERE (char_name ~* <? value('char_name') ?>);";
    var data = toolbox.executeQuery(qry, params);
    _reason.populate(data);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "lostSale",
                         "populate exception: " + e);
  }
}

function sSave()
{
  try
  {
    var params = new Object;
    params.coitem_id = _coitemid;
    params.charopt_id = _reason.id();
    var qry = "INSERT INTO charass(charass_target_type, charass_target_id,"
            + "                    charass_char_id, charass_value) "
            + "SELECT 'SI', <? value('coitem_id') ?>, "
            + "       charopt_char_id, charopt_value "
            + "FROM charopt "
            + "WHERE (charopt_id= <? value('charopt_id') ?>);"
    var data = toolbox.executeQuery(qry, params );
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
      return;
    }
    mydialog.done(0);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "lostSale",
                         "sSave exception: " + e);
  }
}

