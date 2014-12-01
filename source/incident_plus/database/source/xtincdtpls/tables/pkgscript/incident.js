var xtincdtpls = new Object;
xtincdtpls.incident = new Object;

var _buttonBox = mywindow.findChild("_buttonBox");
var _project = mywindow.findChild("_project");
var _vlayout = toolbox.widgetGetLayout(_project);
var _hlayout = QBoxLayout(QBoxLayout.LeftToRight);
var _foundLit = toolbox.createWidget("QLabel", this, "_label");
var _found = toolbox.createWidget("XComboBox", this, "_found");
var _fixedLit = toolbox.createWidget("QLabel", this, "_fixedLit");
var _fixed = toolbox.createWidget("XComboBox", this, "_fixed");
var _incdtverid = -1;

_project.orientation = Qt.Horizontal;
_found.allowNull = true;
_found.nullStr = "None";
_found.enabled = false;

_fixed.allowNull = true;
_fixed.nullStr = "None";
_fixed.enabled = false;

_foundLit.text = "Found In:"
_hlayout.addWidget(_foundLit);
_hlayout.addWidget(_found);

_fixedLit.text = "Fixed In:";
_hlayout.addWidget(_fixedLit, 0, 0);
_hlayout.addWidget(_fixed, 0, 1);
_hlayout.addStretch();

_vlayout.addLayout(_hlayout);

xtincdtpls.incident.populate = function()
{
  var sql = "SELECT * FROM xtincdtpls.incdtver "
          + "WHERE incdtver_incdt_id=<? value(\"incdt_id\") ?>;";
  var params = new Object;
  params.incdt_id = mywindow.id();
  
  data = toolbox.executeQuery(sql, params);
  if (data.first())
  {
    _found.setId(data.value("incdtver_found_prjver_id"));
    _fixed.setId(data.value("incdtver_fixed_prjver_id")); 
    _incdtverid = data.value("incdtver_id");   
  }
  else
  {
    _found.setId(-1);
    _fixed.setId(-1);
    _incdtverid = -1;
  }
}

xtincdtpls.incident.populateVersions = function()
{
  _found.clear();
  _found.enabled = _project.isValid();
  _fixed.clear();
  _fixed.enabled = _project.isValid();
  if (!_project.isValid())
    return;

  var sql = "SELECT prjver_id, prjver_version "
          + "FROM xtincdtpls.prjver "
          + "WHERE prjver_prj_id=<? value(\"prj_id\") ?> "
          + "ORDER BY prjver_version DESC;";
  var params = new Object;
  params.prj_id = _project.id();
  data = toolbox.executeQuery(sql, params);
  _found.populate(data);
  _fixed.populate(data);
}

xtincdtpls.incident.save = function()
{
  var sql;
  var params = new Object;
  params.incdt_id = mywindow.id();
  if (_found.isValid())
    params.found_id = _found.id();
  if (_fixed.isValid())
    params.fixed_id = _fixed.id();
  params.incdtver_id = _incdtverid;

  if (_incdtverid == -1)
  {
    sql = "INSERT INTO xtincdtpls.incdtver ( "
        + "  incdtver_incdt_id, incdtver_found_prjver_id, "
        + "  incdtver_fixed_prjver_id ) VALUES ( "
        + "<? value(\"incdt_id\") ?>, <? value(\"found_id\") ?>, <? value(\"fixed_id\") ?>);";
  }
  else
  {
    sql = "UPDATE xtincdtpls.incdtver SET "
        + " incdtver_found_prjver_id=<? value(\"found_id\") ?>, "
        + " incdtver_fixed_prjver_id=<? value(\"fixed_id\") ?> "
        + "WHERE incdtver_id=<? value(\"incdtver_id\") ?>;";
  }
  toolbox.executeQuery(sql, params);
}

mywindow.populated.connect(xtincdtpls.incident.populate);
_project.newId.connect(xtincdtpls.incident.populateVersions);
_buttonBox.accepted.connect(xtincdtpls.incident.save);

