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

var _itemid = -1;
var _booitemseqid = -1;
var _booitemeffective = null;
var _booitemexpires = null;

var _dates = mywindow.findChild("_dates");
var _issueMethodLit = mywindow.findChild("_issueMethodLit");
var _issueMethod = mywindow.findChild("_issueMethod");
var layout = toolbox.widgetGetLayout(_issueMethodLit);

var _usedAtLit = toolbox.createWidget("QLabel", mywindow, "_usedAtLit");
_usedAtLit.text = qsTr("Used At:");
_usedAtLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
layout.addWidget(_usedAtLit, 5, 0);

var _bomItemAddend = toolbox.loadUi("bomItemAddend", mywindow);
layout.addWidget(_bomItemAddend, 5, 1);

var _booitemList = _bomItemAddend.findChild("_booitemList");
var _usedAt = _bomItemAddend.findChild("_usedAt");
var _scheduleAtWooper = _bomItemAddend.findChild("_scheduleAtWooper");

function set(params)
{
  try {
    if("item_id" in params)
      _itemid = params.item_id;

    if("bomitem_id" in params)
      populate(params.bomitem_id);

    if("booitem_seq_id" in params)
      setBooitem(params.booitem_seq_id);

    if("mode" in params)
    {
      if(params.mode == "new")
      {
        _scheduleAtWooper.toggled.connect(sHandleDates);
      }
      if(params.mode == "view")
      {
        _booitemList.enabled = false;
        _scheduleAtWooper.enabled = false;
      }
    }

    var parlist = new Object;
    parlist.item_id = _itemid;
    var qry = toolbox.executeQuery("SELECT item_type "
                                  +"  FROM item "
                                  +" WHERE (item_id=<? value('item_id') ?>);", parlist);
    if(qry.first() && qry.value("item_type") == "K")
    {
      _usedAtLit.enabled = false;
      _usedAt.enabled = false;
      _booitemList.enabled = false;
      _scheduleAtWooper.enabled = false;
    }
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }

  return mainwindow.NoError;
}

function setBooitem(booitemseqid)
{
  if (booitemseqid != -1)
  {
    var sql = "SELECT (TEXT(booitem_seqnumber) || '-' || booitem_descrip1 || ' ' || booitem_descrip2) AS description, "
        +  "          booitem_effective, booitem_expires "
	+  "FROM xtmfg.booitem(<? value('item_id') ?>) "
    + "WHERE (booitem_seq_id=<? value('booitem_seq_id') ?>);" ;

    bparams = new Object;
    bparams.item_id=_itemid;
    bparams.booitem_seq_id=booitemseqid;
    q=toolbox.executeQuery(sql,bparams);
    if (q.first()) {
      _usedAt.text=q.value("description");
      _scheduleAtWooper.setEnabled(true);
      _booitemseqid=booitemseqid;
      _booitemeffective=q.value("booitem_effective");
      _booitemexpires=q.value("booitem_expires");
    }
    else {
      _scheduleAtWooper.setEnabled(false);
      _scheduleAtWooper.setChecked(false);
      _booitemseqid=-1;
      _booitemeffective=null;
      _booitemexpires=null;
    }
  }
  else {
    _usedAt.clear();
    _scheduleAtWooper.setEnabled(false);
    _scheduleAtWooper.setChecked(false);
  }
}

function sHandleDates()
{
  if(_scheduleAtWooper.checked)
  {
    _dates.setEnabled(false);
    _dates.setStartDate(_booitemeffective);
    _dates.setEndDate(_booitemexpires);
  }
  else
  {
    _dates.setEnabled(true);
  }
}

function sHandleIssueMethod(pItem)
{
  if(pItem == 1 || pItem == 2)
    _booitemList.enabled = true;
  else
    _booitemList.enabled = false;
}

function sBooitemList()
{
  try {
    var params = new Object;
    params.item_id = _itemid;
    params.booitem_seq_id = _booitemseqid;
  
    var wnd = toolbox.openWindow("booItemList", 0, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = wnd.exec();
    if(result != 0) // QDialog::Rejected
      _booitemseqid = result;

    if(_booitemseqid != -1)
    {
      params.booitem_seq_id = _booitemseqid;
      var qry = toolbox.executeQuery("SELECT (TEXT(booitem_seqnumber) || '-' || booitem_descrip1 || ' ' || booitem_descrip2) AS description, "
                                    +"       booitem_effective, booitem_expires "
                                    +"  FROM xtmfg.booitem(<? value('item_id') ?>) "
                                    +" WHERE(booitem_seq_id=<? value('booitem_seq_id') ?>);", params);
      if(qry.first())
      {
        _usedAt.text = qry.value("description");
        _scheduleAtWooper.enabled = true;
        _booitemeffective=qry.value("booitem_effective");
        _booitemexpires=qry.value("booitem_expires");
      }
      else
      {
        _scheduleAtWooper.enabled = false;
        _scheduleAtWooper.checked = false;
        _booitemeffective=null;
        _booitemexpires=null;
      }
    }
    else
    {
      _usedAt.clear();
      _scheduleAtWooper.enabled = false;
      _scheduleAtWooper.checked = false;
    }
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

function sSave(bomitemid)
{
  try {
    var params = new Object;
    params.bomitem_id = bomitemid;
    params.booitem_seq_id = _booitemseqid;
    params.scheduledWithBooItem = _scheduleAtWooper.checked;
  
    var qry = toolbox.executeQuery("UPDATE bomitem"
                                  +"   SET bomitem_booitem_seq_id=<? value('booitem_seq_id') ?>,"
                                  +"       bomitem_schedatwooper=<? value('scheduledWithBooItem') ?>"
                                  +" WHERE(bomitem_id=<? value('bomitem_id') ?>);", params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return false;
    }
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

function populate(bomitemid)
{
  try {
    var params = new Object;
    params.bomitem_id=bomitemid;
  
    var qry = toolbox.executeQuery("SELECT bomitem_parent_item_id,"
                                  +"       bomitem_booitem_seq_id,"
                                  +"       bomitem_schedatwooper"
                                  +"  FROM bomitem"
                                  +" WHERE(bomitem_id=<? value('bomitem_id') ?>);", params);
    if(qry.first())
    {
      _itemid = qry.value("bomitem_parent_item_id");
      _booitemseqid = qry.value("bomitem_booitem_seq_id");
      var scheduledAtWooper = qry.value("bomitem_schedatwooper");
  
      if(_booitemseqid != -1)
      {
        params = new Object;
        params.item_id = _itemid;
        params.booitem_seq_id = _booitemseqid;
  
        qry = toolbox.executeQuery("SELECT (TEXT(booitem_seqnumber) || '-' || booitem_descrip1 || ' ' || booitem_descrip2) AS description, "
                                  +"       booitem_effective, booitem_expires "
                                  +"  FROM xtmfg.booitem(<? value('item_id') ?>) "
                                  +" WHERE(booitem_seq_id=<? value('booitem_seq_id') ?>);", params);
        if(qry.first())
        {
          _booitemeffective=qry.value("booitem_effective");
          _booitemexpires=qry.value("booitem_expires");
          _usedAt.text = qry.value("description");
          _scheduleAtWooper.enabled = true;
          _scheduleAtWooper.checked = scheduledAtWooper;
        }
        else
        {
          _booitemeffective=null;
          _booitemexpires=null;
          _booitemseqid = -1;
          _scheduleAtWooper.enabled = false;
        }
      }
      else
        _scheduleAtWooper.enabled = false;
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return false;
    }
    _scheduleAtWooper.toggled.connect(sHandleDates);
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

_issueMethod['currentIndexChanged(int)'].connect(sHandleIssueMethod);
_booitemList.clicked.connect(sBooitemList);
mywindow.saved.connect(sSave);

if(!metrics.boolean("Routings"))
{
  _usedAtLit.visible = false;
  _usedAt.visible = false;
  _booitemList.visible = false;
  _scheduleAtWooper.visible = false;
}

