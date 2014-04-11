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
var _new          = mywindow.findChild("_new");
var _edit         = mywindow.findChild("_edit");
var _moveDown     = mywindow.findChild("_moveDown");
var _moveUp       = mywindow.findChild("_moveUp");
var _item         = mywindow.findChild("_item");
var _revision     = mywindow.findChild("_revision");
var _print        = mywindow.findChild("_print");
var _view         = mywindow.findChild("_view");
var _showExpired  = mywindow.findChild("_showExpired");
var _showFuture   = mywindow.findChild("_showFuture");
var _booitem      = mywindow.findChild("_booitem");
var _save         = mywindow.findChild("_save");
var _expire       = mywindow.findChild("_expire");
var _close        = mywindow.findChild("_close");
var _activate     = mywindow.findChild("_activate");
var _deactivate   = mywindow.findChild("_deactivate");
var _closeWO      = mywindow.findChild("_closeWO");
var _finalLocation= mywindow.findChild("_finalLocation");
var _revisionDate = mywindow.findChild("_revisionDate");
var _documentNum  = mywindow.findChild("_documentNum");
var _productionLeadTime = mywindow.findChild("_productionLeadTime");

_booitem.addColumn(qsTr("#"),           -1, Qt.AlignCenter, true, "booitem_seqnumber");
_booitem.addColumn(qsTr("Std. Oper."),  -1, Qt.AlignLeft,   true, "f_stdopnnumber");
_booitem.addColumn(qsTr("Work Cntr."),  -1, Qt.AlignLeft,   true, "wrkcnt_code");
_booitem.addColumn(qsTr("Description"), -1, Qt.AlignLeft,   true, "description");
_booitem.addColumn(qsTr("Effective"),   -1, Qt.AlignCenter, true, "booitem_effective");
_booitem.addColumn(qsTr("Expires"),     -1, Qt.AlignCenter, true, "booitem_expires");
_booitem.addColumn(qsTr("Exec. Day"),   -1, Qt.AlignCenter, true, "booitem_execday");

function set(params)
{
  if("mode" in params)
  {
    if(params.mode == "new" || params.mode == "edit")
    { 
      _item.valid.connect(_new, "setEnabled");
      _booitem.valid.connect(_edit, "setEnabled");
      _booitem.valid.connect(_expire, "setEnabled");
      _booitem.valid.connect(_moveUp, "setEnabled");
      _booitem.valid.connect(_moveDown, "setEnabled");
      _booitem.itemSelected.connect(_edit, "animateClick");
    }

    if(params.mode == "new")
    {
      _mode = "new";
      if (_item.isValid())
        _new.enabled = true;
      _item.setFocus();
    }
    else if(params.mode == "edit")
    {
      _mode = "edit";
      _item.setReadOnly(true);
      _new.enabled = true;

      _save.setFocus();
    }
    else if(params.mode == "view")
    {
      _mode = "view";

      _item.setReadOnly(true);

      _documentNum.enabled = false;
      _revision.enabled = false;
      _revisionDate.enabled = false;
      _finalLocation.enabled = false;
      _closeWO.enabled = false;
      _new.enabled = false;
      _edit.enabled = false;
      _expire.enabled = false;
      _moveUp.enabled = false;
      _moveDown.enabled = false;
      _save.enabled = false;

      _booitem.itemSelected.connect(_view, "animateClick");

      _close.setFocus();
    }
  }

  if("item_id" in params)
    _item.setId(params.item_id);

  if("revision_id" in params)
    _revision.setId(params.revision_id);

  return mainwindow.NoError;
}

function populateMenu(pMenu, pItem, pCol)
{
  if(pMenu == null)
    pMenu = _booitem.findChild("_menu");

  if(pMenu != null)
  {
    var tmpact = pMenu.addAction(qsTr("View..."));
    tmpact.enabled = true;
    tmpact.triggered.connect(sView);

    if((_mode == "new") || (_mode == "edit"))
    {
      tmpact = pMenu.addAction(qsTr("Edit..."));
      tmpact.enabled = privileges.check("MaintainBOOs");
      tmpact.triggered.connect(sEdit);

      tmpact = pMenu.addAction(qsTr("Expire"));
      tmpact.enabled = privileges.check("MaintainBOOs");
      tmpact.triggered.connect(sExpire);

      pMenu.addSeparator();

      tmpact = pMenu.addAction(qsTr("Move Up"));
      tmpact.enabled = privileges.check("MaintainBOOs");
      tmpact.triggered.connect(sMoveUp);

      tmpact = pMenu.addAction(qsTr("Move Down"));
      tmpact.enabled = privileges.check("MaintainBOOs");
      tmpact.triggered.connect(sMoveDown);
    }
  }
}

function setParams(params)
{
  params.item_id = _item.id();
  params.revision_id = _revision.id();
  params.none = qsTr("None");

  if(_showExpired.checked)
    params.showExpired = true;
  if(_showFuture.checked)
    params.showFuture = true;

  return true;
}

function sPrint()
{
  var params = new Object;
  if(!setParams(params))
    return;

  toolbox.printReport("BillOfOperations", params);
}

function sSave()
{
  if (save(false))
    mywindow.close();
}

function save(partial)
{
  if (!partial)
  {
    if (_booitem.topLevelItemCount == 0)
    {
      QMessageBox.critical(mywindow, qsTr("Empty Routing"),
               qsTr("The operations list is empty, add at least one operation.")  );
      return false;
    }
  }

try {
  var childhasblankloc = false;
  var params = new Object;
  params.item_id = _item.id();
  params.rev_id = _revision.id();
  var qry = toolbox.executeQuery("SELECT BOOL_OR(COALESCE(booitem_wip_location_id, -1) = -1) AS blankloc "
                                +"  FROM xtmfg.booitem "
                                +" WHERE((booitem_item_id=<? value('item_id') ?>)"
                                +"   AND (booitem_rev_id=<? value('rev_id') ?>));", params);
  if(qry.first())
    childhasblankloc = qry.value("blankloc");
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return false;
  }
  if(_finalLocation.id() <= -1 || childhasblankloc)
  {
    qry = toolbox.executeQuery("SELECT EXISTS(SELECT itemsite_id"
                              +"              FROM itemsite"
                              +"              WHERE (itemsite_loccntrl"
                              +"                 AND itemsite_disallowblankwip"
                              +"                 AND itemsite_active"
                              +"                 AND (itemsite_item_id=<? value('item_id') ?>))"
                              +"       ) AS disallowblankwip;", params);
    if(qry.first())
    {
      if(qry.value("disallowblankwip"))
      {
        var message = "";
        if(childhasblankloc)
          message = qsTr("<p>At least one Routing Item has no WIP Location.");
        else
          message = qsTr("<p>This Routing has no Final Location.");
        message = message + qsTr(" However, at least one Item Site for this Item requires WIP Locations. Are you sure you want to save this Routing?<p>If you say 'Yes' then you should fix the Item Site.");
        if (QMessageBox.question(mywindow, qsTr("Save anyway?"), message,
                                 QMessageBox.Yes | QMessageBox.No,
                                 QMessageBox.No) == QMessageBox.No)
          return false;
      }
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return false;
    }
  }

  var q_str = "";
  if (_mode == "edit" && _booheadid > -1)
  {
    q_str = "UPDATE xtmfg.boohead "
           +"   SET boohead_docnum=<? value('boohead_docnum') ?>,"
           +"       boohead_leadtime=<? value('boohead_leadtime') ?>,"
           +"       boohead_revision=<? value('boohead_revision') ?>,"
           +"       boohead_revisiondate=<? value('boohead_revisiondate') ?>,"
           +"       boohead_final_location_id=<? value('boohead_final_location_id') ?>,"
           +"       boohead_closewo=<? value('boohead_closewo') ?> "
           +" WHERE((boohead_item_id=<? value('item_id') ?>) "
           +"   AND (boohead_rev_id=<? value('rev_id') ?>));";
  }
  else
  {
    q_str = "INSERT INTO xtmfg.boohead "
          + " (boohead_item_id, boohead_docnum, boohead_leadtime, boohead_closewo,"
          + "  boohead_revision, boohead_revisiondate, boohead_final_location_id) "
          + "VALUES "
          + " (<? value('item_id') ?>, <? value('boohead_docnum') ?>, <? value('boohead_leadtime') ?>, <? value('boohead_closewo') ?>,"
          + "  <? value('boohead_revision') ?>, <? value('boohead_revisiondate') ?>, <? value('boohead_final_location_id') ?> );";
  }

  params.boohead_docnum = _documentNum.text;
  params.boohead_leadtime = _productionLeadTime.text;
  params.boohead_revision = _revision.number;
  params.boohead_revisiondate = _revisionDate.date;
  params.boohead_final_location_id = _finalLocation.id();
  params.boohead_closewo = _closeWO.checked;

  toolbox.executeQuery(q_str, params);

  mainwindow.sBOOsUpdated(_item.id(), true);
  if (_mode == "new")
    _mode = "edit";
  return true;

} catch (e) {
  print(e.lineNumber + ": " + e);
}
}

function openBooItem(params)
{
  try {
    var wnd = toolbox.openWindow("booItem", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    wnd.exec();
  } catch(e) {
    print("boo open booItem exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  if (_mode == "new")
  {
    if (!save(true))
      return
  }

  var params = new Object;
  params.mode = "new";
  params.item_id = _item.id();
  params.revision_id = _revision.id();

  openBooItem(params);
}

function sEdit()
{
  if(!checkSitePrivs(_booheadid))
    return;

  var params = new Object;
  params.mode = "edit";
  params.booitem_id = _booitem.id();

  openBooItem(params);
}

function sView()
{
  if(!checkSitePrivs(_booheadid))
    return;

  var params = new Object;
  params.mode = "view";
  params.booitem_id = _booitem.id();

  openBooItem(params);
}

function sExpire()
{
  if(!checkSitePrivs(_booheadid))
    return;

  var params = new Object;
  params.booitem_id = _booitem.id();
  toolbox.executeQuery("UPDATE xtmfg.booitem "
                      +"   SET booitem_expires=CURRENT_DATE "
                      +" WHERE(booitem_id=<? value('booitem_id') ?>);", params);
  mainwindow.sBOOsUpdated(_item.id(), true);
}

function sMoveUp()
{
  if(!checkSitePrivs(_booheadid))
    return;

  var params = new Object;
  params.booitem_id = _booitem.id();
  toolbox.executeQuery("SELECT xtmfg.moveBooitemUp(<? value('booitem_id') ?>) AS result;", params);
  mainwindow.sBOOsUpdated(_item.id(), true);
}

function sMoveDown()
{
  if(!checkSitePrivs(_booheadid))
    return;

  var params = new Object;
  params.booitem_id = _booitem.id();
  toolbox.executeQuery("SELECT xtmfg.moveBooitemDown(<? value('booitem_id') ?>) AS result;", params);
  mainwindow.sBOOsUpdated(_item.id(), true);
}

function sFillList()
{
try {
  if(_item.itemType() == "J")
  {
    _closeWO.enabled = false;
    _closeWO.checked = false;
  }

  var params = new Object;
  params.item_id = _item.id();
  params.revision_id = _revision.id();

  var locid = _finalLocation.id();
  var qry = toolbox.executeDbQuery("boo", "locations", params);
  _finalLocation.populate(qry, locid);

  qry = toolbox.executeDbQuery("boo", "detail", params);
  if(qry.first())
  {
    _booheadid = qry.value("boohead_id");
    if (_mode == "new")
      _mode = "edit";
    _documentNum.text = qry.value("boohead_docnum");
    var num = qry.value("boohead_revision");
    if(num == null)
      num = "";
    else
      num = String(num);
    _revision.setNumber(num);
    _revisionDate.date = qry.value("boohead_revisiondate");
    _finalLocation.setId(qry.value("boohead_final_location_id"));
    _closeWO.checked = qry.value("boohead_closewo");
  }

  if(_revision.description() == "Inactive")
  {
    _save.enabled = false;
    _new.enabled = false;
    _documentNum.enabled = false;
    _revisionDate.enabled = false;
    _closeWO.enabled = false;
    _finalLocation.enabled = false;
    _booitem.enabled = false;
  }

  if(_revision.description() == "Pending" ||
     _revision.description() == "Substitute" ||
     _revision.description() == "Active")
  {
    _save.enabled = true;
    _new.enabled = true;
    _documentNum.enabled = true;
    _revisionDate.enabled = true;
    _closeWO.enabled = true;
    _finalLocation.enabled = true;
    _booitem.enabled = true;
  }

  qry = toolbox.executeQuery("SELECT MAX(booitem_execday) AS leadtime "
                            +"  FROM xtmfg.booitem(<? value('item_id'),<? value('revision_id') ?>);", params);
  if(qry.first())
    _productionLeadTime.text = qry.value("leadtime");

  params = new Object;
  if(!setParams(params))
    return;
  qry = toolbox.executeDbQuery("boo", "items", params);
  _booitem.populate(qry, true);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
} catch(e) {
  print(e.lineNumber + ": " + e);
}
}

function checkSitePrivs(booid)
{
  if (preferences.boolean("selectedSites"))
  {
    var params = new Object;
    params.boohead_id = booid;
    var qry = toolbox.executeQuery("SELECT xtmfg.checkBOOSitePrivs(<? value('boohead_id') ?>) AS result;", params);
    if(qry.first())
    {
      if(!qry.value("result"))
      {
        QMessageBox.critical(mywindow, qsTr("Access Denied"),
                             qsTr("<p>You may not view or edit this Routing Item as "
                                + "it references a Site for which you have not "
                                + "been granted privileges."));
        return false;
      }
    }
  }
  return true;
}

_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_moveDown.clicked.connect(sMoveDown);
_moveUp.clicked.connect(sMoveUp);
_print.clicked.connect(sPrint);
_view.clicked.connect(sView);
_save.clicked.connect(sSave);
_expire.clicked.connect(sExpire);
_booitem["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu)

_item.newId.connect(sFillList);
_revision.newId.connect(sFillList);
_showExpired.toggled.connect(sFillList);
_showFuture.toggled.connect(sFillList);
mainwindow.boosUpdated.connect(sFillList);

_close.clicked.connect(mywindow, "close");

_item.setType(ItemLineEdit.cGeneralManufactured + ItemLineEdit.cGeneralPurchased + ItemLineEdit.cPlanning + ItemLineEdit.cJob);

_activate.visible = false;
_deactivate.visible = false;
_revision.setMode("Maintain");
_revision.setType("BOO");
