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
var _pschheadid = -1;
var _pschitemid = -1;
var _warehousid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _save         = mywindow.findChild("_save");
var _cancel       = mywindow.findChild("_cancel");
var _item         = mywindow.findChild("_item");
var _date         = mywindow.findChild("_date");
var _qty          = mywindow.findChild("_qty");

var _debug = false;

function set(params)
{
  if (_debug) print("plannedScheduleItem set called");
  try {
    if("pschhead_id" in params)
    {
      _pschheadid = params.pschhead_id;
    }

    if("warehous_id" in params)
    {
      _warehousid = params.warehous_id;
      _item.clearExtraClauseList();
      _item.addExtraClause("(itemsite_warehous_id=" + _warehousid + ")");
      _item.addExtraClause("(itemsite_planning_type='S')");
    }

    if("pschitem_id" in params)
    {
      _pschitemid = params.pschitem_id;
      populate();
    }

    if("mode" in params)
    {
      if (params.mode == "new")
        _mode = "new";
      else if (params.mode == "copy")
      {
        _mode = "new";
        _pschitemid = -1;
      }
      else if (params.mode == "edit")
      {
        _mode = "edit";
      }
      else if (params.mode == "view")
      {
        _mode = "view";
        _item.enabled = false;
        _date.enabled = false;
        _qty.enabled = false;
        _save.visible = false;
      }
    }

    return mainwindow.NoError;
  } catch(e) {
    print("plannedScheduleItem set exception @ " + e.lineNumber + ": " + e);
  }
}

function sSave()
{
  if (_debug) print("plannedScheduleItem sSave called");
  try {
    if (!_item.isValid())
    {
      QMessageBox.critical(mywindow,
                           qsTr("Invalid Item"),
                           qsTr("You must enter a valid Item for this Schedule."));
      _item.setFocus();
      return;
    }

    if(!_date.isValid())
    {
      QMessageBox.critical(mywindow,
                           qsTr("Invalid Date"),
                           qsTr("You must enter a valid Date for this Schedule."));
      _date.setFocus();
      return;
    }

    if(_qty.toDouble() == 0)
    {
      QMessageBox.critical(mywindow,
                           qsTr("Invalid Quantity"),
                           qsTr("You must enter a valid Quantity for this Schedule."));
      _qty.setFocus();
      return;
    }

    var q_str = "";
    if (_mode == "new")
    {
      q_str = "INSERT INTO xtmfg.pschitem"
             +"      (pschitem_pschhead_id,"
             +"       pschitem_linenumber,"
             +"       pschitem_itemsite_id,"
             +"       pschitem_scheddate, pschitem_qty) "
             +"VALUES(<? value('pschhead_id') ?>,"
             +"       COALESCE((SELECT MAX(pschitem_linenumber) FROM xtmfg.pschitem WHERE pschitem_pschhead_id=<? value('pschhead_id') ?>),0)+10,"
             +"       (SELECT itemsite_id FROM itemsite "
             +"        WHERE itemsite_item_id=<? value('item_id') ?> AND itemsite_warehous_id=<? value('warehous_id') ?>),"
             +"       <? value('scheddate') ?>, <? value('qty') ?>);";
    }
    else if (_mode == "edit")
    {
      q_str = "UPDATE xtmfg.pschitem"
             +"   SET pschitem_itemsite_id=(SELECT itemsite_id FROM itemsite "
             +"                             WHERE itemsite_item_id=<? value('item_id') ?> AND itemsite_warehous_id=<? value('warehous_id') ?>),"
             +"       pschitem_scheddate=<? value('scheddate') ?>,"
             +"       pschitem_qty=<? value('qty') ?> "
             +" WHERE (pschitem_id=<? value('pschitem_id') ?>);";
    }

    var params = new Object;
    params.pschhead_id = _pschheadid;
    params.pschitem_id = _pschitemid;
    params.item_id = _item.id();
    params.warehous_id = _warehousid;
    params.scheddate = _date.date;
    params.qty = _qty.toDouble();

    var qry = toolbox.executeQuery(q_str, params);

    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Error Saving"), qry.lastError().text);
      return;
    }

    mydialog.accept();
  } catch(e) {
    print("plannedScheduleItem sSave exception @ " + e.lineNumber + ": " + e);
  }
}

function populate()
{
  if (_debug) print("plannedScheduleItem populate called");
  try {
    var params = new Object;
    params.pschitem_id = _pschitemid;
    var qry = toolbox.executeQuery("SELECT *"
                                  +"  FROM xtmfg.pschhead JOIN xtmfg.pschitem ON (pschitem_pschhead_id=pschhead_id) "
                                  +" WHERE (pschitem_id=<? value('pschitem_id') ?>);", params);
    if(qry.first())
    {
      _pschheadid = qry.value("pschitem_pschhead_id");
      _warehousid = qry.value("pschhead_warehous_id");
      _item.clearExtraClauseList();
      _item.addExtraClause("(itemsite_warehous_id=" + _warehousid + ")");
      _item.addExtraClause("(itemsite_planning_type='S')");
      _item.setItemsiteid(qry.value("pschitem_itemsite_id"));
      _date.date = qry.value("pschitem_scheddate");
      _qty.setDouble(qry.value("pschitem_qty"));
    }
  } catch(e) {
    print("plannedScheduleItem populate exception @ " + e.lineNumber + ": " + e);
  }
}

_save.clicked.connect(sSave);

_cancel.clicked.connect(mydialog, "reject");

// _item.setType(2149580800); //ItemLineEdit::cActive | ItemLineEdit::cPlanningMPS
_item.setType(ItemLineEdit.cActive);
_qty.setValidator(mainwindow.qtyVal());

