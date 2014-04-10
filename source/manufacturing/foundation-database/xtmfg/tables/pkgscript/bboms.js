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

// create a script var for each child of mywindow with an objectname starting _
var _new          = mywindow.findChild("_new");
var _edit         = mywindow.findChild("_edit");
var _delete       = mywindow.findChild("_delete");
var _view         = mywindow.findChild("_view");
var _searchFor    = mywindow.findChild("_searchFor");
var _close        = mywindow.findChild("_close");
var _bbom         = mywindow.findChild("_bbom");

_bbom.addColumn(qsTr("Item Number"), -1, Qt.AlignLeft,    true, "item_number");
_bbom.addColumn(qsTr("Description"), -1, Qt.AlignLeft,    true, "item_descrip1");
_bbom.addColumn(qsTr("Descrip 2"),   -1, Qt.AlignLeft,    true, "item_descrip2");

function openBbom(params)
{
  try {
    var wnd = toolbox.openWindow("bbom", 0, Qt.NonModal, Qt.Window);
    wnd.set(params);
  } catch(e) {
    print("bboms open bbom exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  var params = new Object;
  params.mode = "new";

  openBbom(params);
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.item_id = _bbom.id();

  openBbom(params);
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.item_id = _bbom.id();

  openBbom(params);
}

function sDelete()
{
  var params = new Object;
  params.item_id = _bbom.id();

  var answer = QMessageBox.question(mywindow,
                       qsTr("Delete Selected Breeder BOM?"),
                       qsTr("<p>Are you sure that you want to delete the selected Breeder Bill of Materials?"),
                       QMessageBox.Yes | QMessageBox.No,
                       QMessageBox.No);
  if(answer == QMessageBox.Yes)
  {
    qry = toolbox.executeQuery("DELETE FROM xtmfg.bbomitem "
                              +" WHERE(bbomitem_parent_item_id=<? value('item_id') ?>);", params );
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
    sQuery();
  }
}

function sQuery()
{
  sFillList(-1, true);
}

function sFillList(pItemid, pLocal)
{
  var params = new Object;
  var qry = toolbox.executeDbQuery("bboms", "detail", params);
  if((pItemid != -1) && pLocal)
    _bbom.populate(qry, pItemid);
  else
    _bbom.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_delete.clicked.connect(sDelete);
_view.clicked.connect(sView);
_searchFor.textChanged.connect(_bbom, "sSearch");

_close.clicked.connect(mywindow, "close");

if(privileges.check("MaintainBBOMs"))
{
  _bbom.valid.connect(_edit, "setEnabled");
  _bbom.valid.connect(_delete, "setEnabled");
  _bbom.itemSelected.connect(_edit, "animateClick");
}
else
{
  _bbom.itemSelected.connect(_view, "animateClick");
  _new.enabled=false;
}

mainwindow.bbomsUpdated.connect(sFillList);

sQuery();
_searchFor.setFocus();

