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

try
{
  var _mode = "new";
  var _catcommid = -1;

  var _provider             = mywindow.findChild("_provider");
  var _code                 = mywindow.findChild("_code");
  var _desc                 = mywindow.findChild("_desc");
  var _parent               = mywindow.findChild("_parent");
  var _level                = mywindow.findChild("_level");

  _parent.newID.connect(getLevel);

  var _buttonBox  = mywindow.findChild("_buttonBox");

  _buttonBox.accepted.connect(save);
  _buttonBox.rejected.connect(mywindow, "close");
}
catch (e)
{
  QMessageBox.critical(mywindow, "catcomm",
                       "catcomm.js exception: " + e);
}

function set(params)
{
  try
  {
    if("catcomm_id" in params)
    {
      _catcommid = params.catcomm_id;
      populate();
    }

    if("mode" in params)
    {
      if (params.mode == "new")
      {
        _mode = "new";
        _provider.currentIndex = 2;

        var qry = "SELECT 0 , 'ALL' "
                + "UNION "
                + "SELECT catcomm_pik, (catcomm_comm_code || '-' || catcomm_comm_desc) "
                + "FROM xwd.catcomm "
                + "WHERE (catcomm_provider='INT');";
        var data = toolbox.executeQuery(qry);
        _parent.populate(data);
        _parent.enabled = true;
        _level.text = "1";
        _code.enabled = true;
        _code.setFocus();
      }
      else if (params.mode == "edit")
      {
        _mode = "edit";
      }
      else if (params.mode == "view")
      {
        _mode = "view";

        _provider.enabled = false;
        _code.enabled = false;
        _desc.enabled = false;
        _parent.enabled = false;
        _level.enabled = false;

        _buttonBox.clear();
        _buttonBox.addButton(QDialogButtonBox.Close);
        _buttonBox.setFocus();
      }
    }

    return mainwindow.NoError;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catcomm",
                         "set exception: " + e);
  }
}

function populate()
{
  try
  {
    var params = new Object;
    params.catcomm_id = _catcommid;

    var qry = "SELECT catcomm_pik, (catcomm_comm_code || '-' || catcomm_comm_desc) "
            + "FROM xwd.catcomm "
            + "WHERE(catcomm_id != <? value('catcomm_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    _parent.populate(data);

    var qry = "SELECT * "
            + "FROM xwd.catcomm "
            + "WHERE(catcomm_id=<? value('catcomm_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _catcommid = data.value("catcomm_id");
      var provider = data.value("catcomm_provider");
      if (provider == "TSE")
        _provider.currentIndex = 0;
      if (provider == "TSP")
        _provider.currentIndex = 1;
      if (provider == "INT")
        _provider.currentIndex = 2;
      if (provider == "XOE")
        _provider.currentIndex = 3;
      _parent.setId(data.value("catcomm_parent_pik"));
      _code.setText(data.value("catcomm_comm_code"));
      _desc.setText(data.value("catcomm_comm_desc"));
      _level.setText(data.value("catcomm_level"));
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catcomm",
                         "populate exception: " + e);
  }
}

function save()
{
  try
  {
    var q_str = "";
    if (_mode == "new")
    {
      var qid = toolbox.executeQuery("SELECT NEXTVAL('xwd.catcomm_catcomm_id_seq') AS _catcomm_id;");
      if (qid.first())
        _catcommid = qid.value("_catcomm_id");

      q_str = "INSERT INTO xwd.catcomm "
             +"( catcomm_id, catcomm_provider, catcomm_pik,"
             +"  catcomm_parent_pik, catcomm_comm_code,"
             +"  catcomm_comm_desc, catcomm_seq,"
             +"  catcomm_level) "
             +"VALUES "
             +"( <? value('catcomm_id') ?>, <? value('provider') ?>, <? value('pik') ?>,"
             +"  <? value('parent_pik') ?>, <? value('comm_code') ?>,"
             +"  <? value('comm_desc') ?>, <? value('seq') ?>,"
             +"  <? value('level') ?> );";
    }
    else if (_mode == "edit")
    {
      q_str = "UPDATE xwd.catcomm "
            + "SET catcomm_comm_desc=<? value('comm_desc') ?> "
            + "WHERE (catcomm_id = <? value('catcomm_id') ?>);";
    }
 
    var params = new Object();

    if (setParams(params))
    {
      var data = toolbox.executeQuery(q_str, params);

      if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
      }
      mydialog.accept();
    }
    else
      return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catcomm",
                         "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.catcomm_id = _catcommid;
    params.comm_code = _code.text;
    params.comm_desc = _desc.text;
    params.level = _level.text;
    params.pik = _catcommid;
    params.parent_pik = _parent.id();
    if (_provider.currentIndex == 0)
      params.provider ="TSE";
    if (_provider.currentIndex == 1)
      params.provider ="TSP";
    if (_provider.currentIndex == 2)
      params.provider ="INT";
    if (_provider.currentIndex == 3)
      params.provider ="XOE";

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catcomm",
                         "setParams(params) exception: " + e);
  }
}

function getLevel()
{
  try
  {
    var params = new Object;
    params.parent_pik = _parent.id();

    var qry = "SELECT catcomm_level "
            + "FROM xwd.catcomm "
            + "WHERE(catcomm_pik=<? value('parent_pik') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _level.setText(data.value("catcomm_level") + 1);
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catcomm",
                         "getLevel() exception: " + e);
  }
}
