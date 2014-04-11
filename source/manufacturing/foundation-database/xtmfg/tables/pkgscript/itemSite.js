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

try {
debugger;

var _mpsTimeFence        = mywindow.findChild("_mpsTimeFence");
var _mpsTimeFenceDaysLit = mywindow.findChild("_mpsTimeFenceDaysLit");
var _mpsTimeFenceLit     = mywindow.findChild("_mpsTimeFenceLit");
var _planningType        = mywindow.findChild("_planningType");

_mpsTimeFence.show();
_mpsTimeFenceDaysLit.show();
_mpsTimeFenceLit.show();

_planningType.append(2, "MPS", "S");

// Define Variables
var _tab = mywindow.findChild("_tab");
var _expirationTab = mywindow.findChild("_expirationTab");
var _item = mywindow.findChild("_item");
var _save = mywindow.findChild("_save");
var _warehouse = mywindow.findChild("_warehouse");
var _planningType = mywindow.findChild("_planningType");

// Add new tab and set up contents
var _schdPage = toolbox.loadUi("itemsiteSched", mywindow); 
var index = _tab.indexOf(_expirationTab) + 1;
_tab.insertTab(index ,_schdPage, qsTr("Schedule"));
_tab.setTabEnabled(index, false);

var _avgSetup = _schdPage.findChild("_avgSetup");
var _dailyCapacity = _schdPage.findChild("_dailyCapacity");
var _efficiencyFactor = _schdPage.findChild("_efficiencyFactor");
var _avgQueueDays = _schdPage.findChild("_avgQueueDays");
var _dept = _schdPage.findChild("_dept");

var _populated = false;
var _itemsiteid = -1;
var _itemsitecapid = -1;

_avgSetup.setValidator(mainwindow.runTimeVal());
_dailyCapacity.setValidator(mainwindow.runTimeVal());
_efficiencyFactor.setValidator(mainwindow.percentVal());

function handleItem()
{
  var index = _tab.indexOf(_schdPage);
  var type = _item.itemType();
  var enabled = false

  if (_item.isValid() && _warehouse.isValid())
    enabled = (type == "T");

  _tab.setTabEnabled(index, enabled);

  if (_item.itemType() == "T")
    _planningType.enabled = true;
}

function sSave()
{ 
  var sql;
  var q;
  var itemid = _item.id();
  var whsid = _warehouse.id();
  if (!mywindow.sSave())
    return;
  
  if (_item.itemType() == "T") {
    if (_itemsiteid == -1) {
      sql = "SELECT itemsite_id "
  	+ "FROM itemsite "
  	+ "WHERE ((itemsite_warehous_id=<? value('warehouse_id') ?>) "
	+ " AND (itemsite_item_id=<? value('item_id') ?>)); ";
      var iparams = new Object();
      iparams.warehouse_id=whsid;
      iparams.item_id=itemid;
      q=toolbox.executeQuery(sql,iparams);
      if (q.first())
        _itemsiteid = q.value("itemsite_id");
    }

    if (_itemsitecapid == -1) {
      sql = "INSERT INTO xtmfg.itemsitecap "
	+ "SELECT "
	+ "nextval('xtmfg.itemsitecap_itemsitecap_id_seq'), "
	+ "<? value('itemsite_id') ?>, "
	+ "<? value('avgsutime') ?>, "
	+ "<? value('dailycap') ?>, "
	+ "<? value('efficfactor') ?>, "
	+ "<? value('avgqueuedays') ?>, "
	+ "<? value('dept_id') ?>; "
    }
    else {
      sql = "UPDATE xtmfg.itemsitecap SET "
	+ "itemsitecap_avgsutime=<? value('avgsutime') ?>, "
	+ "itemsitecap_dailycap=<? value('dailycap') ?>, "
	+ "itemsitecap_efficfactor=<? value('efficfactor') ?>, "
	+ "itemsitecap_avgqueuedays=<? value('avgqueuedays') ?>, "
	+ "itemsitecap_dept_id=<? value('dept_id') ?> "
	+ "FROM itemsite "
	+ "WHERE (itemsitecap_id=<? value('itemsitecap_id') ?>); "
    }

    var params = new Object();
    params.itemsite_id = _itemsiteid;
    params.itemsitecap_id = _itemsitecapid;
    params.avgsutime = _avgSetup.toDouble();
    params.dailycap = _dailyCapacity.toDouble();
    params.efficfactor = (_efficiencyFactor.toDouble() / 100.0);
    params.avgqueuedays = _avgQueueDays.value;
    params.dept_id = _dept.id();
    toolbox.executeQuery(sql, params);
  }
}

function populate()
{
try {
  handleItem();

  if (_item.isValid() && _warehouse.isValid() && _item.itemType() == "T") {

    var sql = "SELECT COALESCE(itemsite_id,-1) AS itemsite_id, "
	+ "COALESCE(itemsitecap_id,-1) AS itemsitecap_id, "
	+ "formatTime(itemsitecap_avgsutime) AS avgsutime, "
	+ "formatTime(itemsitecap_dailycap) AS dailycap, "
	+ "formatPrcnt(itemsitecap_efficfactor) AS efficfactor, "
	+ "itemsitecap_avgqueuedays, "
	+ "COALESCE(itemsitecap_dept_id,-1) AS dept_id "
	+ "FROM itemsite "
	+ " LEFT OUTER JOIN xtmfg.itemsitecap ON (itemsitecap_itemsite_id=itemsite_id) "
	+ "WHERE ((itemsite_item_id=<? value('item_id') ?>)"
	+ " AND (itemsite_warehous_id=<? value('warehouse_id') ?>)) ";

    var params = new Object();
    params.item_id=_item.id();
    params.warehouse_id=_warehouse.id();
    var q = toolbox.executeQuery(sql, params);
    if (q.first()) {
      _itemsiteid=q.value("itemsite_id");
      _itemsitecapid=q.value("itemsitecap_id");
      if (_itemsitecapid > -1) {
        _avgSetup.text=q.value("avgsutime");
        _dailyCapacity.text=q.value("dailycap");
        _efficiencyFactor.text=q.value("efficfactor");
        _avgQueueDays.value=q.value("itemsitecap_avgqueuedays");
        _dept.setId(q.value("dept_id"));
      }
    }
  }
} catch (e) {print(e)}
}

// Disconnect core
toolbox.coreDisconnect(_save, "clicked()", mywindow, "sSave()");

// Connect new
_item.newId.connect(populate);
_warehouse.newID.connect(populate);
_save.clicked.connect(sSave);
populate();
} catch (e) { print(e) }
