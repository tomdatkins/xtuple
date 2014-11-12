var version = new Object;

var _buttonBox = mywindow.findChild("_buttonBox");
var _version = mywindow.findChild("_version");
var _mode;
var _prjverid = -1;
var _prjid = -1;

set = function(input)
{
  if("mode" in input)
    _mode = input.mode;

  if ("prj_id" in input)
    _prjid = input.prj_id;
  
  if("prjver_id" in input)
  {
    _prjverid = input.prjver_id;
    version.populate();
  }
}

version.populate = function()
{
  var sql = "SELECT * FROM xtincdtpls.prjver "
          + "WHERE prjver_id=<? value(\"prjver_id\") ?>;";
  params = new Object;
  params.prjver_id = _prjverid;
  data = toolbox.executeQuery(sql, params);
  if (data.first())
    _version.text = data.value("prjver_version");
}

version.accept = function()
{
  var sql;
  var params = new Object;
  params.prj_id = _prjid;
  params.prjver_id = _prjverid;
  params.version = _version.text;

  if (_mode == "new")
  {
    sql = "INSERT INTO xtincdtpls.prjver(prjver_prj_id, prjver_version) "
        + "VALUES (<? value(\"prj_id\") ?>, <? value(\"version\") ?>); "
  }
  else
  {
    sql = "UPDATE xtincdtpls.prjver SET prjver_version=<? value(\"version\") ?> "
        + "WHERE prjver_id=<? value(\"prjver_id\") ?>;";
  }
  
  var data = toolbox.executeQuery(sql, params);
  if (data.lastError().type != QSqlError.NoError)
  {
    toolbox.messageBox("critical", mywindow,
                        qsTr("Database Error"), data.lastError().text);
  }
  mydialog.accept();
}

_buttonBox.accepted.connect(version.accept);
_buttonBox.rejected.connect(mydialog, "close()");

