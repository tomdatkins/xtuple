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

var _close = mywindow.findChild("_close");
var _new = mywindow.findChild("_new");
var _edit = mywindow.findChild("_edit");
var _delete = mywindow.findChild("_delete");
var _list = mywindow.findChild("_list");

_close.clicked.connect(closeForm);
_new.clicked.connect(overheadNew);
_edit.clicked.connect(overheadEdit);
_delete.clicked.connect(overheadDelete);

_new.setEnabled(privileges.check("MaintainOverheadAssignment"));
_edit.setEnabled(privileges.check("MaintainOverheadAssignment"));
_delete.setEnabled(privileges.check("MaintainOverheadAssignment"));

// Update list after insert/edit
mainwindow["salesOrdersUpdated(int, bool)"].connect(fillList);

// Add columns to the list
with (_list)
{
  addColumn("Code",  -1, 1, true, "ovrhead_code");
  addColumn("Description",  -1, 1, true, "ovrhead_descrip");
  addColumn("Account",  50, 1, true, "accnt_name");
  addColumn("Default",  50, 1, true, "ovrhead_default");
}

fillList();

// Populate the list with current Sale Types
function fillList()
{
  try
  {
    sql = "SELECT o.*, a.accnt_name FROM xtmfg.ovrhead o "
	+ "JOIN accnt a ON (a.accnt_id=o.ovrhead_accnt_id) "
	+ "ORDER BY ovrhead_code ";
    data = toolbox.executeQuery(sql);
    _list.populate(data);
  }
  catch(e)
  {
    print(e);
    QMessageBox.critical(mywindow, "Error", e);
  }
}

_list["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(populateMenu);

// context menu
function populateMenu(pMenu, pItem, pCol)
{
var mCode
if(pMenu == null)
  pMenu = _results.findChild("_menu");

if(pMenu != null)
 {
  var _addsep = false;
  var currentItem = _list.currentItem();
  if(currentItem != null && privileges.check("MaintainOverheadAssignment"))
  {
   mCode = pMenu.addAction(qsTr("Edit..."));
   mCode.triggered.connect(overheadEdit);

   mCode = pMenu.addAction(qsTr("Delete..."));
   mCode.triggered.connect(overheadDelete);
  }
 }
}

function closeForm()
{
  mywindow.close();
}

function overheadNew()
{
  overheadOpen(0,0);
}

function overheadEdit()
{ 
  if (_list.id() == -1)
  {
    QMessageBox.warning(mywindow, "Warning", qsTr("You must select an Overhead item first"));
    return 0;
  }
  overheadOpen(1,_list.id());
}

function overheadDelete()
{
  if (_list.id() == -1)
  {
    QMessageBox.warning(mywindow, "Warning", qsTr("You must select an Overhead item first"));
    return 0;
  }
  if (isUsed())
  {
     return false;
  } else {
  var dparam = new Object();
  dparam.id = _list.id();
  var data = toolbox.executeQuery('DELETE FROM xtmfg.ovrhead WHERE ovrhead_id = <? value("id") ?>', dparam);
  fillList();
  }
}

function overheadOpen(mode, number)
{
  try
  {
    var childwnd = toolbox.openWindow("overhead",mywindow, 0, 1);
    var wparams = new Object;
    wparams.mode = mode;
    if (mode)
    {
      wparams.overheadid = number;
    }
    var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
    print(e);
    QMessageBox.critical(mywindow, "Error", e);
  }
}

function isUsed()
{
  var dparam = new Object();
  dparam.id = _list.id();
// Check whether overhead is on a Time Entry sheet
  var sql="SELECT 1";

  var d = toolbox.executeQuery(sql, dparam);
  if (d.first())
  { 
    if (d.value("cnt") >= 1)
      {
        QMessageBox.warning(mywindow,qsTr("Overhead Assignment Deletion"),qsTr("You cannot delete an Overhead Assignment that has been used"));
 
	return true;
      }
  }
  return false;
}
