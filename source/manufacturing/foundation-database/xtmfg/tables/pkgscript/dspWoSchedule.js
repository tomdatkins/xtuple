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

var _list = mywindow.findChild("_list");

if (metrics.boolean("Routings"))
{
  mywindow.parameterWidget().appendComboBox(qsTr("Work Center"), "wrkcnt_id", XComboBox.WorkCenters);
  mywindow.parameterWidget().append(qsTr("Work Center Pattern"), "wrkcnt_pattern", ParameterWidget.Text);
  mywindow.parameterWidget().applyDefaultFilterSet();
}

function populateMenu(pMenu, pItem, pCol)
{
  try {
    if(pMenu == null)
      pMenu = _list.findChild("_menu");
  
    var wostatus = pItem.rawValue("wo_status");

    if(pMenu != null)
    {
      if (metrics.boolean("Routings"))
      {
        pMenu.addSeparator();
  
        var tmpact = pMenu.addAction(qsTr("View Routing..."));
        tmpact.enabled = (privileges.check("MaintainBOOs") || privileges.check("ViewBOOs"));
        tmpact.triggered.connect(sViewBOO);
        if(wostatus == "E" || wostatus == "R" || wostatus == "I")
        {

          tmpact = pMenu.addAction(qsTr("View Operations..."));
          tmpact.enabled = privileges.check("ViewWoOperations");
          tmpact.triggered.connect(sViewWooper);
        }
  
        tmpact = pMenu.addAction(qsTr("Production Time Clock..."));
        tmpact.enabled = (privileges.check("MaintainWoTimeClock") || privileges.check("ViewWoTimeClock"));
        tmpact.triggered.connect(sDspWoEffortByWorkOrder);

        if(wostatus == "E" || wostatus == "R" || wostatus == "I")
        {
          pMenu.addSeparator();

          var tmpact = pMenu.addAction(qsTr("Post Operations..."));
          tmpact.enabled = privileges.check("PostWoOperations");
          tmpact.triggered.connect(sPostOperations);

          if(wostatus != "E")
          {
            tmpact = pMenu.addAction(qsTr("Correct Operations Posting..."));
            tmpact.enabled = privileges.check("PostWoOperations");
            tmpact.triggered.connect(sCorrectOperationsPosting);
          }
        }
      }
    }
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

function sViewBOO()
{
  var params = new Object;
  params.wo_id = _list.id();

  var qry = toolbox.executeQuery("SELECT itemsite_item_id "
                                +"  FROM wo, itemsite "
                                +" WHERE((wo_itemsite_id=itemsite_id)"
                                +"   AND (wo_id=<? value('wo_id') ?>));", params);
  if(qry.first())
  {
    params.item_id = qry.value("itemsite_item_id");
    params.mode = "view";

    var wnd = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
    toolbox.lastWindow().set(params);
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return false;
  }
}

function sDspWoEffortByWorkOrder()
{
  var params = new Object;
  params.wo_id = _list.id();
  params.run = true;

  var wnd = toolbox.newDisplay("dspWoEffortByWorkOrder", 0, Qt.NonModal, Qt.Window);
  toolbox.lastWindow().set(params);
}

function sPostOperations()
{
  try {
    var params = new Object;
    params.wo_id = _list.id();

    var wnd = toolbox.openWindow("postOperations", 0, Qt.NonModal, Qt.Dialog);
    var result = toolbox.lastWindow().set(params);
    if(result != mainwindow.UndefinedError)
      wnd.exec();
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

function sCorrectOperationsPosting()
{
  try {
    var params = new Object;
    params.wo_id = _list.id();

    var wnd = toolbox.openWindow("correctOperationsPosting", 0, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    wnd.exec();
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

function sViewWooper()
{
  try {
    var params = new Object;
    params.run = true;
    params.wo_id = _list.id();

    var wnd = toolbox.newDisplay("dspWoOperationsByWorkOrder", 0, Qt.NonModal, Qt.Window);
    toolbox.lastWindow().set(params);
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

_list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu)

