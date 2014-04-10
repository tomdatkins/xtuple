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

var _mode = "new";
var _booheadid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _print        = mywindow.findChild("_print");
var _new          = mywindow.findChild("_new");
var _edit         = mywindow.findChild("_edit");
var _delete       = mywindow.findChild("_delete");
var _item         = mywindow.findChild("_item");
var _showExpired  = mywindow.findChild("_showExpired");
var _showFuture   = mywindow.findChild("_showFuture");
var _bbomitem     = mywindow.findChild("_bbomitem");
var _view         = mywindow.findChild("_view");
var _costsAbsorbed= mywindow.findChild("_costsAbsorbed");
var _close        = mywindow.findChild("_close");

_bbomitem.addColumn(qsTr("Item Number"), -1, Qt.AlignLeft,   true, "item_number");
_bbomitem.addColumn(qsTr("Description"), -1, Qt.AlignLeft,   true, "descrip");
_bbomitem.addColumn(qsTr("Type"),        -1, Qt.AlignLeft,   true, "type");
_bbomitem.addColumn(qsTr("UOM"),         -1, Qt.AlignCenter, true, "uom_name");
_bbomitem.addColumn(qsTr("Qty."),        -1, Qt.AlignRight,  true, "bbomitem_qtyper");
_bbomitem.addColumn(qsTr("Effective"),   -1, Qt.AlignCenter, true, "bbomitem_effective");
_bbomitem.addColumn(qsTr("Expires"),     -1, Qt.AlignCenter, true, "bbomitem_expires");
_bbomitem.addColumn(qsTr("Cost %"),      -1, Qt.AlignRight,  true, "bbomitem_costabsorb");

function set(params)
{
  if("item_id" in params)
    _item.setId(params.item_id);

  if("mode" in params)
  {
    if(params.mode == "new" || params.mode == "edit")
    { 
      _bbomitem.valid.connect(_edit, "setEnabled");
      _bbomitem.valid.connect(_delete, "setEnabled");
      _bbomitem.itemSelected.connect(_edit, "animateClick");
    }

    if(params.mode == "new")
    {
      _mode = "new";

      _new.enabled = false;
      _item.setFocus();
    }
    else if(params.mode == "edit")
    {
      _mode = "edit";
      _item.setReadOnly(true);

      _bbomitem.setFocus();
    }
    else if(params.mode == "view")
    {
      _mode = "view";

      _item.setReadOnly(true);
      _new.enabled = false;
      _edit.enabled = false;
      _delete.enabled = false;
      _close.text = qsTr("&Close");

      _booitem.itemSelected.connect(_view, "animateClick");

      _close.setFocus();
    }
  }

  return mainwindow.NoError;
}

function sPrint()
{
  if(!_item.isValid())
  {
    QMessageBox.critical(mywindow,
                       qsTr("Enter a Valid Item Number"),
                       qsTr("You must enter a valid Item Number for this report."));
    _item.setFocus();
    return;
  }

  var params = new Object;
  params.item_id = _item.id();
  if(_showExpired.checked)
    params.showExpired = true;
  if(_showFuture.checked)
    params.showFuture = true;

  toolbox.printReport("BreederBOM", params);
}

function openBbomItem(params)
{
  try {
    var wnd = toolbox.openWindow("bbomItem", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    wnd.exec();
  } catch(e) {
    print("bbom open bbomItem exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  var params = new Object;
  params.mode = "new";
  params.item_id = _item.id();

  openBbomItem(params);
}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.bbomitem_id = _bbomitem.id();

  openBbomItem(params);
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.bbomitem_id = _bbomitem.id();

  openBbomItem(params);
}

function sDelete()
{
  var answer = QMessageBox.question(mywindow,
                       qsTr("Delete Breeder BOM Item"),
                       qsTr("Are you sure you want to delete this Breeder BOM Item?"),
                       QMessageBox.Yes | QMessageBox.No,
                       QMessageBox.No);
  if(answer == QMessageBox.Yes)
  {
    var params = new Object;
    params.bbomitem_id = _bbomitem.id();
    qry = toolbox.executeQuery("DELETE FROM xtmfg.bbomitem "
                              +" WHERE(bbomitem_id=<? value('bbomitem_id') ?>);", params );
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return;
    }

    mainwindow.sBBOMsUpdated(_item.id(), true);
  }
}

function sQuery()
{
  sFillList(_item.id(), false);
  if (_mode != "view")
    _new.enabled = true;

}

function sFillList(pItemid, pLocal)
{
  try {
    if(_item.isValid() && (_item.id() == pItemid))
    {
      var params = new Object;
      if(!_showExpired.checked)
        params.ignoreExpired = true;
      if(!_showFuture.checked)
        params.ignoreFuture = true;
      params.item_id = _item.id();
      params.coProduct = qsTr("Co-Product");
      params.byProduct = qsTr("By-Product");
      params.always = qsTr("Always");
      params.never = qsTr("Never");
      params.error = qsTr("Error");
      params.na = qsTr("N/A");
      qry = toolbox.executeDbQuery("bbom", "detail", params);
      _bbomitem.populate(qry);
      if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow,
                           qsTr("Database Error"), qry.lastError().text);
        return;
      }

      qry = toolbox.executeQuery("SELECT SUM(bbomitem_costabsorb) * 100 AS absorb "
                                +"  FROM xtmfg.bbomitem "
                                +" WHERE(bbomitem_parent_item_id=<? value('item_id') ?>) "
                                +"<? if exists('ignoreExpired') ?> "
                                +"   AND (bbomitem_expires > CURRENT_DATE) "
                                +"<? endif ?> "
                                +"<? if exists('ignoreFuture') ?> "
                                +"   AND (bbomitem_effective <= CURRENT_DATE) "
                                +"<? endif ?> "
                                +";", params);
      if(qry.first())
      {
        _costsAbsorbed.setDouble(qry.value("absorb"));

        if(qry.value("absorb") == 100.0)
          _costsAbsorbed.setTextColor("black");
        else
          _costsAbsorbed.setTextColor("error");
      }
      else if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow,
                           qsTr("Database Error"), qry.lastError().text);
        return;
      }
    }
    else if(!_item.isValid())
      _bbomitem.clear();
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

_print.clicked.connect(sPrint);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_delete.clicked.connect(sDelete);
_view.clicked.connect(sView);

_item.newId.connect(sQuery);
_showExpired.toggled.connect(sQuery);
_showFuture.toggled.connect(sQuery);
mainwindow.bbomsUpdated.connect(sFillList);

_close.clicked.connect(mywindow, "close");

_costsAbsorbed.setPrecision(mainwindow.percentVal());
_item.setType(ItemLineEdit.cBreeder);

