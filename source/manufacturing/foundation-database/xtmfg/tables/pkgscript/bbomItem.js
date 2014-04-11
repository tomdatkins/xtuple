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
var _bbomitemid = -1;
var _itemid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _item   = mywindow.findChild("_item");
var _save   = mywindow.findChild("_save");
var _close  = mywindow.findChild("_close");
var _dates  = mywindow.findChild("_dates");
var _qtyPer = mywindow.findChild("_qtyPer");
var _unique = mywindow.findChild("_unique");
var _comments = mywindow.findChild("_comments");
var _costAbsorption = mywindow.findChild("_costAbsorption");

function set(params)
{
  if("bbomitem_id" in params)
  {
    _bbomitemid = params.bbomitem_id;
    populate();
  }

  if("item_id" in params)
    _itemid = params.item_id;

  if("mode" in params)
  {
    if (params.mode == "new")
    {
      _mode = "new";

      var qry = toolbox.executeQuery("SELECT nextval('xtmfg.bbomitem_bbomitem_id_seq') AS _bbomitem_id;");
      if(qry.first())
        _bbomitemid = qry.value("_bbomitem_id");

      _item.setFocus();
    }
    else if (params.mode == "edit")
    {
      _mode = "edit";
      _item.setReadOnly(true);
      _qtyPer.setFocus();
    }
    else if (params.mode == "view")
    {
      _mode = "view";

      _item.setReadOnly(true);
      _qtyPer.enabled = false;
      _costAbsorption.enabled = false;
      _unique.enabled = false;
      _dates.enabled = false;
      _comments.enabled = false;
      _close.text = qsTr("&Close");
      _save.hide();

      _close.setFocus();
    }
  }

  return mainwindow.NoError;
}

function sSave()
{
  if (_dates.endDate < _dates.startDate)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Save BBOM Item"),
                       qsTr("The expiration date cannot be earlier than the effective date."));
    _dates.setFocus();
    return;
  }

  if (_unique.checked)
  {
    var pc = new Object;
    pc.item_id = _item.id();
    pc.bbomitem_id = _bbomitemid;
    var qc = toolbox.executeQuery("SELECT bbomitem_id "
                                 +"  FROM xtmfg.bbomitem "
                                 +" WHERE((bbomitem_item_id=<? value('item_id') ?>) "
                                 +"   AND (bbomitem_expires>=CURRENT_DATE)"
                                 +"   AND (bbomitem_id <> <? value('bbomitem_id') ?>)) "
                                 +" LIMIT 1;", pc);
    if(qc.first())
    {
      QMessageBox.warning(mywindow,
                         qsTr("Cannot Save Breeder BOM Item"),
                         qsTr("<p>There are other Breeder BOM Items that define the production of the selected Co/By-Product. Because of this, you may not indicate that this Breeder BOM Item defines a unique manufacturing path for the selected Co/By-Product without first expiring the other Breeder BOM Items."));
      _unique.setFocus();
      return;
    }
  }

  var q_str = "";
  if (_mode == "new")
  {
    q_str = "INSERT INTO xtmfg.bbomitem "
           +"( bbomitem_id, bbomitem_parent_item_id, bbomitem_item_id,"
           +"  bbomitem_seqnumber, bbomitem_uniquemfg,"
           +"  bbomitem_qtyper, bbomitem_effective, bbomitem_expires,"
           +"  bbomitem_costabsorb, bbomitem_comments ) "
           +"VALUES "
           +"( <? value('bbomitem_id') ?>, <? value('bbomitem_parent_item_id') ?>, <? value('bbomitem_item_id') ?>,"
           +"  <? value('bbomitem_seqnumber') ?>, <? value('bbomitem_uniquemfg') ?>,"
           +"  <? value('bbomitem_qtyper') ?>, <? value('bbomitem_effective') ?>, <? value('bbomitem_expires') ?>,"
           +"  <? value('bbomitem_costabsorb') ?>, <? value('bbomitem_comments') ?> );";
  }
  else if (_mode == "edit")
  {
    q_str = "UPDATE xtmfg.bbomitem "
           +"   SET bbomitem_qtyper=<? value('bbomitem_qtyper') ?>,"
           +"       bbomitem_uniquemfg=<? value('bbomitem_uniquemfg') ?>,"
           +"       bbomitem_effective=<? value('bbomitem_effective') ?>,"
           +"       bbomitem_expires=<? value('bbomitem_expires') ?>,"
           +"       bbomitem_costabsorb=<? value('bbomitem_costabsorb') ?>,"
           +"       bbomitem_comments=<? value('bbomitem_comments') ?> "
           +" WHERE(bbomitem_id=<? value('bbomitem_id') ?>);";
  }

  var params = new Object;
  params.bbomitem_id = _bbomitemid;
  params.bbomitem_parent_item_id = _itemid;
  params.bbomitem_item_id = _item.id();
  params.bbomitem_qtyper = _qtyPer.toDouble();
  params.bbomitem_uniquemfg = _unique.checked;
  params.bbomitem_effective = _dates.startDate;
  params.bbomitem_expires = _dates.endDate;
  params.bbomitem_costabsorb = (_costAbsorption.toDouble() / 100.0);
  params.bbomitem_comments = _comments.plainText;

  toolbox.executeQuery(q_str, params);

  mainwindow.sBBOMsUpdated(_itemid, true);
  mydialog.done(_bbomitemid);
}

function sHandleItemType(pItemType)
{
  _costAbsorption.enabled = (pItemType == "C");
}

function populate()
{
  var params = new Object;
  params.bbomitem_id = _bbomitemid;

  var qry = toolbox.executeQuery("SELECT bbomitem_item_id, bbomitem_parent_item_id,"
                                +"       item_type, bbomitem_uniquemfg,"
                                +"       bbomitem_qtyper,"
                                +"       bbomitem_effective, bbomitem_expires,"
                                +"       bbomitem_costabsorb,"
                                +"       bbomitem_comments "
                                +"  FROM xtmfg.bbomitem, item "
                                +" WHERE((bbomitem_item_id=item_id)"
                                +"   AND (bbomitem_id=<? value('bbomitem_id') ?>) );", params);
  if(qry.first())
  {
    _itemid = qry.value("bbomitem_parent_item_id");
    _item.setId(qry.value("bbomitem_item_id"));
    _qtyPer.setDouble(qry.value("bbomitem_qtyper"));
    _unique.checked = qry.value("bbomitem_uniquemfg");
    _dates.startDate = qry.value("bbomitem_effective");
    _dates.endDate = qry.value("bbomitem_expires");

    if(qry.value("item_type") == "C")
      _costAbsorption.setDouble(qry.value("bbomitem_costabsorb") * 100.0);

    _comments.plainText = qry.value("bbomitem_comments");
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_save.clicked.connect(sSave);
_item.valid.connect(_save, "setEnabled");
_item.typeChanged.connect(sHandleItemType);

_close.clicked.connect(mydialog, "reject");

_item.setType(ItemLineEdit.cCoProduct + ItemLineEdit.cByProduct);
_dates.setStartNull(qsTr("Always"), mainwindow.startOfTime(), true);
_dates.setStartCaption(qsTr("Effective"));
_dates.setEndNull(qsTr("Never"), mainwindow.endOfTime(), true);
_dates.setEndCaption(qsTr("Expires"));
_qtyPer.setValidator(mainwindow.qtyPerVal());
_costAbsorption.setValidator(mainwindow.percentVal());

