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

var _woIndentedList = mywindow.findChild("_woIndentedList");

var _mode       = "new";
var _dueDate    = mywindow.findChild("_dueDate");
var _startDate  = mywindow.findChild("_startDate");
var _warehouse  = mywindow.findChild("_warehouse");

function showEvent()
{
  if (metrics.boolean("UseSiteCalendar"))
  {
    _warehouse["newID(int)"].connect(setCal);
    setCal();
  }
}

function set(params)
{
  if("mode" in params)
    _mode = params.mode;
}

function populateMenu(pMenu, pItem, pCol)
{
  if(pMenu == null)
    pMenu = _woIndentedList.findChild("_menu");

  var wostatus = pItem.rawValue("wodata_status");

  if(pMenu != null)
  {
    if(_woIndentedList.altId() == 1 &&
       _woIndentedList.id() > -1 &&
       metrics.boolean("Routings") &&
       _mode != "view")
    {
      pMenu.addSeparator();


      var tmpact = pMenu.addAction(qsTr("New Operation..."));
      tmpact.enabled = (privileges.check("MaintainWoOperations"));
      tmpact.triggered.connect(sNewOperation);

      var tmpact = pMenu.addAction(qsTr("Post Operations..."));
      tmpact.enabled = (privileges.check("PostWoOperations"));
      tmpact.triggered.connect(sPostOperations);

      if(wostatus == "I")
      {
        tmpact = pMenu.addAction(qsTr("Correct Operations Posting..."));
        tmpact.enabled = (privileges.check("PostWoOperations"));
        tmpact.triggered.connect(sCorrectOperationsPosting);
      }
    }
  
    if(_woIndentedList.altId() == 3 &&
       _woIndentedList.id() > -1 &&
       metrics.boolean("Routings"))
    {
      pMenu.addSeparator();

      if(wostatus != "C" && _mode != "view")
      {
        var tmpact = pMenu.addAction(qsTr("Edit..."));
        tmpact.enabled = (privileges.check("MaintainWoOperations"));
        tmpact.triggered.connect(sEditWooper);
      }

      var tmpact = pMenu.addAction(qsTr("View..."));
      tmpact.enabled = (true);
      tmpact.triggered.connect(sViewWooper);

      if(_mode != "view")
      {
        if(wostatus == "O" || wostatus == "E")
        {
          tmpact = pMenu.addAction(qsTr("Delete..."));
          tmpact.enabled = (privileges.check("MaintainWoOperations"));
          tmpact.triggered.connect(sDeleteWooper);
        }

        pMenu.addSeparator();

        tmpact = pMenu.addAction(qsTr("Post Operation..."));
        tmpact.enabled = (privileges.check("PostWoOperations"));
        tmpact.triggered.connect(sPostOperations);

        if(wostatus == "I")
        {
          tmpact = pMenu.addAction(qsTr("Correct Operation Posting..."));
          tmpact.enabled = (privileges.check("PostWoOperations"));
          tmpact.triggered.connect(sCorrectOperationPosting);
        }
      }
    }
  }
}

function sEditWooper()
{
  var params = new Object;
  params.mode = "edit";
  params.wooper_id = _woIndentedList.id();

  var wnd = toolbox.openWindow("woOperation", mywindow, Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  wnd.exec();
  var currentId = _woIndentedList.id();
  var currentAltId = _woIndentedList.altId();
  mainwindow.sWorkOrdersUpdated(currentId, true);
  _woIndentedList.setId(currentId, currentAltId);
}

function sViewWooper()
{
  var params = new Object;
  params.mode = "view";
  params.wooper_id = _woIndentedList.id();

  var wnd = toolbox.openWindow("woOperation", mywindow, Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  wnd.exec();
}

function sDeleteWooper()
{
  if (QMessageBox.question(mywindow, qsTr("Delete Operation"),
                             qsTr("<p>Are you sure that you want to delete the "
                              + "selected Work Order Operation?"),
                              QMessageBox.Yes | QMessageBox.No,
                              QMessageBox.No) == QMessageBox.No)
  {
    return;
  }

  var params = new Object;
  params.wooper_id = _woIndentedList.id();
  var qry = toolbox.executeQuery("DELETE FROM xtmfg.wooper"
                                +" WHERE(wooper_id=<? value('wooper_id') ?>);", params);
  var currentId = _woIndentedList.id();
  var currentAltId = _woIndentedList.altId();
  mainwindow.sWorkOrdersUpdated(currentId, true);
  mywindow.populate();
  _woIndentedList.setId(currentId, currentAltId);
}

function sNewOperation()
{
  var params = new Object;
  params.mode = "new";
  params.wo_id = _woIndentedList.id();

  var wnd = toolbox.openWindow("woOperation", mywindow, Qt.ApplicationModal, Qt.Dialog);
  if(toolbox.lastWindow().set(params) != mainwindow.UndefinedError)
  {
    wnd.exec();
    var currentId = _woIndentedList.id();
    var currentAltId = _woIndentedList.altId();
    mainwindow.sWorkOrdersUpdated(currentId, true);
    mywindow.populate();
    _woIndentedList.setId(currentId, currentAltId);
  }
}

function sPostOperations()
{
  var params = new Object;
  if (_woIndentedList.altId() == 3)
    params.wooper_id = _woIndentedList.id();
  else
    params.wo_id = _woIndentedList.id();

  var wnd = toolbox.openWindow("postOperations", mywindow, Qt.ApplicationModal, Qt.Dialog);
  if(toolbox.lastWindow().set(params) != mainwindow.UndefinedError)
  {
    wnd.exec();
    var currentId = _woIndentedList.id();
    var currentAltId = _woIndentedList.altId();
    mainwindow.sWorkOrdersUpdated(currentId, true);
    mywindow.populate();
    _woIndentedList.setId(currentId, currentAltId);
  }
}

function sCorrectOperationPosting()
{
  var params = new Object;
  params.wooper_id = _woIndentedList.id();

  var wnd = toolbox.openWindow("correctOperationsPosting", mywindow, Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  wnd.exec();
  var currentId = _woIndentedList.id();
  var currentAltId = _woIndentedList.altId();
  mainwindow.sWorkOrdersUpdated(currentId, true);
  mywindow.populate();
  _woIndentedList.setId(currentId, currentAltId);
}

function sCorrectOperationsPosting()
{
  var params = new Object;
  params.wo_id = _woIndentedList.id();

  var wnd = toolbox.openWindow("correctOperationsPosting", mywindow, Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  wnd.exec();
  var currentId = _woIndentedList.id();
  var currentAltId = _woIndentedList.altId();
  mainwindow.sWorkOrdersUpdated(currentId, true);
  mywindow.populate();
  _woIndentedList.setId(currentId, currentAltId);
}

function setCal()
{
  try
  {
    _dueDate.setCalendarSiteId(_warehouse.id());
    _startDate.setCalendarSiteId(_warehouse.id());
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "workOrder",
                         qsTr("setCal exception: ") + e);
  }
}

_woIndentedList["populateMenu(QMenu *, QTreeWidgetItem *, int)"].connect(populateMenu);
