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

function populateMenu(pMenu, pItem, pCol)
{
try {
  if(pMenu == null)
    pMenu = _list.findChild("_menu");

  if(pMenu != null)
  {
    if (metrics.boolean("Routings"))
    {
      var tmpact = pMenu.addAction(qsTr("Edit Routing..."));
      tmpact.enabled = privileges.check("MaintainBOOs");
      tmpact.triggered.connect(sEditBOO);
    }
  }
} catch(e) {
  print(e.lineNumber + ": " + e);
}
}

function sEditBOO()
{
  var params = new Object;
  params.mode = "edit";
  params.item_id = _list.id();

  var wnd = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
  toolbox.lastWindow().set(params);
}

_list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu)
