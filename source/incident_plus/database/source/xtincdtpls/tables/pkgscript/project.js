// Since this is local, we can assume T&E and project accounting scripts are here too

var xtincdtpls = new Object;
xtincdtpls.project = new Object;

var _versions = toolbox.loadUi("versions", mywindow);
var _listVer = _versions.findChild("_list");
var _newVer = _versions.findChild("_new");
var _editVer = _versions.findChild("_edit");
var _delVer = _versions.findChild("_delete");
var _prjidVer = -1;

_tab.insertTab(_tab.count, _versions, qsTr("Versions"));
_newVer.enabled = false;

_listVer.addColumn(qsTr("Version"), -1, Qt.AlignLeft, true, "prjver_version");

xtincdtpls.project.populate = function(id)
{  
  var sql = "SELECT * FROM xtincdtpls.prjver "
          + "WHERE prjver_prj_id=<? value(\"prj_id\") ?>"
          + "ORDER BY prjver_version DESC;";
  var params = new Object;
  params.prj_id = id;
  _listVer.populate(toolbox.executeQuery(sql, params));
  _prjidVer = id;
  _newVer.enabled = true;
}


xtincdtpls.project.newVer = function()
{
  var params   = new Object;
  params.prj_id = _prjidVer;
  params.mode = "new"

  var wnd = toolbox.openWindow("version", mywindow);
  toolbox.lastWindow().set(params);
  wnd.exec();

  xtincdtpls.project.populate(_prjidVer);
}

xtincdtpls.project.editVer = function()
{
  var params   = new Object;
  params.prjver_id = _listVer.id();
  params.mode = "edit"

  var wnd = toolbox.openWindow("version", mywindow);
  toolbox.lastWindow().set(params);
  wnd.exec();

  xtincdtpls.project.populate(_prjidVer);
}

xtincdtpls.project.delVer = function()
{
 if (QMessageBox.question(mywindow,
                     qsTr("Really?"),
                     qsTr("Are you sure you want to delete this version?"),
                     QMessageBox.Ok, QMessageBox.Cancel) == QMessageBox.Cancel)
    return;

  var sql = "DELETE FROM xtincdtpls.prjver WHERE prjver_id=<? value(\"prjver_id\" ?>; ";
  var params = new Object;
  params.prjver_id = _listVer.id();
  var q = toolbox.executeQuery(sql, params);
  if (q.lastError().type != QSqlError.NoError)
  {
    toolbox.messageBox("critical", mywindow,
                        qsTr("Database Error"), q.lastError().text);
  }

  xtincdtpls.project.populate(_prjidVer);
}

mywindow["populated(int)"].connect(xtincdtpls.project.populate);
_newVer.clicked.connect(xtincdtpls.project.newVer);
_editVer.clicked.connect(xtincdtpls.project.editVer);
_delVer.clicked.connect(xtincdtpls.project.delVer);
_listVer.itemSelected.connect(xtincdtpls.project.editVer);



