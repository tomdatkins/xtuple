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

debugger;

var _list = mywindow.findChild("_list");
var _query = mywindow.queryAction();
var _showInactive = mywindow.findChild("_showInactive");
var _bom = mywindow.findChild("_bom");
var layout = toolbox.widgetGetLayout(_bom);

var _boo = toolbox.createWidget("XCheckBox", mywindow, "_boo");
_boo.text = qsTr("Show Manufactured Items without valid &Routing");
layout.insertWidget( 0, _boo);

function populateMenu(pMenu, pItem, pCol)
{
try {
  if(pMenu == null)
    pMenu = _list.findChild("_menu");

  if(pMenu != null)
  {
    if (metrics.boolean("Routings") && pItem.altId() == 1)
    {
      var tmpact = pMenu.addAction(qsTr("Create Routing..."));
      tmpact.enabled = privileges.check("MaintainBOOs");
      tmpact.triggered.connect(sCreateBOO);
    }
  }
} catch(e) {
  print(e.lineNumber + ": " + e);
}
}

function sCreateBOO()
{
  var params = new Object;
  params.mode = "new";
  params.item_id = _list.id();

  var wnd = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
  toolbox.lastWindow().set(params);
}

function sQuery()
{
  sFillList();
}

function sFillList(pItemid, pLocal)
{
try {
  mywindow.sFillList();
  var sql = "";
  if(_boo.checked)
  {
    var params = new Object;
    params.noBoo = qsTr("No Routing");
    if(!_showInactive.checked)
      params.showActiveOnly = true;

    var qry = toolbox.executeDbQuery("undefinedManufacturedItemsxtmfg", "detail", params);

    if((pItemid != -1) && pLocal)
      _list.populateAppend(qry, pItemid, true, XTreeWidget.Append);
    else
      _list.populate(qry, true, XTreeWidget.Append);
  }
} catch(e) {
  print(e.lineNumber + ": " + e);
}
}

_list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu)
_query.triggered.connect(sQuery);
mainwindow.itemsUpdated.connect(sFillList);
mainwindow.bomsUpdated.connect(sFillList);
mainwindow.boosUpdated.connect(sFillList);

toolbox.coreDisconnect(_query, "triggered()", mywindow, "sFillList()");
toolbox.coreDisconnect(mainwindow, "itemsUpdated(int, bool)", mywindow, "sFillList()");
toolbox.coreDisconnect(mainwindow, "bomsUpdated(int, bool)", mywindow, "sFillList()");
toolbox.coreDisconnect(mainwindow, "boosUpdated(int, bool)", mywindow, "sFillList()");

if(preferences.boolean("XCheckBox/forgetful"))
  _boo.checked = true;

if(!privileges.check("ViewBOOs"))
{
  _boo.checked = false;
  _boo.enabled = false;
}

