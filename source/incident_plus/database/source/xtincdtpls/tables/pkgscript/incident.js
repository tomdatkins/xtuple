// Add Found In and Fixed In fields below Item cluster
// Add Task field below Project cluster

debugger;

var xtincdtpls = new Object;
xtincdtpls.incident = new Object;

// Add Task field to the Project area
var _buttonBox = mywindow.findChild("_buttonBox");
var _project = mywindow.findChild("_project");
var _vlayout = toolbox.widgetGetLayout(_project);
var _hlayout = QBoxLayout(QBoxLayout.LeftToRight);

var _taskLit = toolbox.createWidget("QLabel", this, "_taskLit");
var _task = toolbox.createWidget("XComboBox", this, "_task");

_project.orientation = Qt.Horizontal;
_task.allowNull = true;
_task.nullStr = "None";
_task.enabled = false;

_taskLit.text = "Task:";
_hlayout.addWidget(_taskLit, 0, 0);
_hlayout.addWidget(_task, 0, 1);
_hlayout.addStretch();
_vlayout.addLayout(_hlayout);

var _incdtprjtaskid = -1;

xtincdtpls.incident.populateTask = function()
{
  var sql = "SELECT * FROM xtincdtpls.incdtprjtask "
    + "WHERE incdtprjtask_incdt_id=<? value('incdt_id') ?>;";
  var params = new Object;
  params.incdt_id = mywindow.id();
  data = toolbox.executeQuery(sql, params);
  if (data.first())
  {
    QMessageBox.information(mywindow, '','prjtask_id is ' + data.value("incdtprjtask_prjtask_id"));

    _task.setId(data.value("incdtprjtask_prjtask_id"));
    _incdtprjtaskid = data.value("incdtprjtask_id");
  }
  else
  {
    _task.setId(-1);
  }
}

xtincdtpls.incident.populateTasks = function()
{
  _task.clear();
  _task.enabled = _project.isValid();
  if (!_project.isValid())
    return;
  var sql = "SELECT prjtask_id, prjtask_name "
    + "FROM prjtask "
    + "WHERE prjtask_prj_id = <? value('prj_id') ?> "
    + "ORDER BY prjtask_name DESC;";
  var params = new Object;
  params.prj_id = _project.id();
    
  data = toolbox.executeQuery(sql, params);
  _task.populate(data);
}

mywindow.populated.connect(xtincdtpls.incident.populateTask);
_project.newId.connect(xtincdtpls.incident.populateTasks);

// Add Found In and Fixed In fields below the Item cluster

var _incdtbomverid = -1;
var _item = mywindow.findChild("_item");
var _layout_item = toolbox.widgetGetLayout(_item); // returns QObject

var _gbox = mywindow.findChild("groupBox");
var _glayout = _gbox.layout();

var _hlayout_item = QBoxLayout(QBoxLayout.LeftToRight);
var _foundLit_item = toolbox.createWidget("QLabel", this, "_foundLit_item");
var _found_item = toolbox.createWidget("XComboBox", this, "_found_item");
var _fixedLit_item = toolbox.createWidget("QLabel", this, "_fixedLit_item");
var _fixed_item = toolbox.createWidget("XComboBox", this, "_fixed_item");

_item.orientation = Qt.Horizontal;
_found_item.allowNull = true;
_found_item.nullStr = "None";
_found_item.enabled = false;

_fixed_item.allowNull = true;
_fixed_item.nullStr = "None";
_fixed_item.enabled = false;

_foundLit_item.text = "Found In:"
_hlayout_item.addWidget(_foundLit_item);
_hlayout_item.addWidget(_found_item);

_fixedLit_item.text = "Fixed In:";
_hlayout_item.addWidget(_fixedLit_item, 0, 0);
_hlayout_item.addWidget(_fixed_item, 0, 1);
_hlayout_item.addStretch();

_glayout.addLayout(_hlayout_item, 1, 0);

_spacer = new QSpacerItem(0,150);
_glayout.addItem(_spacer, 2, 0);

xtincdtpls.incident.populate_bomver = function()
{
  var sql = "SELECT * FROM xtincdtpls.incdtbomver "
    + "WHERE incdtbomver_incdt_id=<? value(\"incdt_id\") ?>;";
  var params = new Object;
  params.incdt_id = mywindow.id();
  data = toolbox.executeQuery(sql, params);
  if (data.first())
  {
    _found_item.setId(data.value("incdtbomver_found_rev_id"));
    _fixed_item.setId(data.value("incdtbomver_fixed_rev_id"));
    _incdtbomverid = data.value("incdtbomver_id");
  }
  else
  {
    _found_item.setId(-1);
    _fixed_item.setId(-1);
    _incdtbomverid = -1;
  }
}

xtincdtpls.incident.populateBomVersions = function()
{
  _found_item.clear();
  _found_item.enabled = _item.isValid();
  _fixed_item.clear();
  _fixed_item.enabled = _item.isValid();
  if (!_item.isValid())
    return;

  var sql = "SELECT rev_id, rev_number "
    + " FROM rev "
    + " WHERE rev_target_type = 'BOM' "
    + " AND rev_target_id = <? value('item_id') ?> "
    + " ORDER BY rev_number "
  var params = new Object;
  params.item_id = _item.id();
  data = toolbox.executeQuery(sql, params);
  _found_item.populate(data);
  _fixed_item.populate(data);
}

// Save Task and Found In and Fixed In

xtincdtpls.incident.save_item = function()
{
  var sql;
  var tasksql;
  var params = new Object;
  params.incdt_id = mywindow.id();
  if (_found_item.isValid())
    params.found_id = _found_item.id();
  if (_fixed_item.isValid())
    params.fixed_id = _fixed_item.id();
  params.incdtbomver_id = _incdtbomverid;
  
  // new section for prjtask
  if (_task.isValid())
    params.task_id = _task.id();
  if(_incdtprjtaskid == -1)
  {
    tasksql = "INSERT INTO xtincdtpls.incdtprjtask ( "
      + " incdtprjtask_incdt_id, incdtprjtask_prjtask_id) "
      + " VALUES ( <? value('incdt_id') ?>, "
      + " <? value('task_id') ?> );";
  }
  else
  {
    tasksql = "UPDATE xtincdtpls.incdtprjtask SET "
      + " incdtprjtask_prjtask_id = <? value ('task_id') ?> "
      + " WHERE incdtprjtask_incdt_id = <? value ('incdt_id') ?>;";
  }
  // add execute BEGIN
  toolbox.executeQuery(tasksql, params);      
        
  // end prjtask section

  if (_incdtbomverid == -1)
  {

    sql = "INSERT INTO xtincdtpls.incdtbomver ( "
      + " incdtbomver_incdt_id, incdtbomver_found_rev_id, "
      + " incdtbomver_fixed_rev_id ) VALUES ( "
      + "<? value(\"incdt_id\") ?>, <? value(\"found_id\") ?>, <? value(\"fixed_id\") ?>);";
  }
  else
  {
    
    sql = "UPDATE xtincdtpls.incdtbomver SET "
      + " incdtbomver_found_rev_id=<? value(\"found_id\") ?>, "
      + " incdtbomver_fixed_rev_id=<? value(\"fixed_id\") ?> "
      + "WHERE incdtbomver_id=<? value(\"incdtbomver_id\") ?>;";
  }
  toolbox.executeQuery(sql, params);
  // add error check, rollback/commit
}

mywindow.populated.connect(xtincdtpls.incident.populate_bomver);
_item.newId.connect(xtincdtpls.incident.populateBomVersions);
_buttonBox.accepted.connect(xtincdtpls.incident.save_item);