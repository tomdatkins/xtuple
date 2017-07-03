/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
include("xtQuality"); 
 //debugger;

var _close         = mywindow.findChild("_close");
var _save          = mywindow.findChild("_save");
var _item          = mywindow.findChild("_item");
var _site          = mywindow.findChild("_site");
var _checkBox_oper = mywindow.findChild("checkBox_oper");
var _checkBox_prod = mywindow.findChild("checkBox_prod");
var _checkBox_recv = mywindow.findChild("checkBox_recv");
var _checkBox_ship = mywindow.findChild("checkBox_ship");
var _freqtype      = mywindow.findChild("_freqtype");
var _freq          = mywindow.findChild("_freq");
var _qphead_id     = 0;
var _qpheadass_id  = 0;
var _mode          = 'new';

_freqtype.append(0, 'All',        'A');
_freqtype.append(1, 'First Item', 'F');
_freqtype.append(2, 'Last Item',  'L');
_freqtype.append(3, 'Sample',     'S');
_freqtype.append(4, 'Lot',        'LOT');
_freqtype.append(5, 'Serial',     'SER');

_freq.setValidator(mainwindow.orderVal());

function set(input)
{
  if('qphead_id' in input)
    _qphead_id = input.qphead_id;  
  if('mode' in input)
    _mode = input.mode;
  if('qpheadass_id' in input)
    _qpheadass_id = input.qpheadass_id;
  
  if (_mode == "edit")
    populate();
}

function populate()
{
  var params = {qphead_id:    _qphead_id,
                qpheadass_id: _qpheadass_id}; 
  var qry = toolbox.executeDbQuery('qpheadass', 'detail', params)
  
  if(qry.first() && xtquality.errorCheck(qry)) {
    _item.setId(qry.value('item_id'));
    _site.setId(qry.value('site_id'));
    _checkBox_oper.checked = qry.value('qpheadass_oper');
    _checkBox_prod.checked = qry.value('qpheadass_prod');
    _checkBox_recv.checked = qry.value('qpheadass_recv');
    _checkBox_ship.checked = qry.value('qpheadass_ship');
    _freqtype.text = qry.value('freqtype');
    _freq.setDouble(qry.value('qpheadass_testfreq'));
  }
}

function save()
{
  if (!validate())
    return;

  var params = new Object();
  params.qpheadass_id = _qpheadass_id;
  params.qphead_id    = _qphead_id;
  params.item_id      = _item.id();
  params.site_id      = _site.id();
  params.oper         = _checkBox_oper.checked;
  params.prod         = _checkBox_prod.checked;
  params.recv         = _checkBox_recv.checked;
  params.ship         = _checkBox_ship.checked;
  params.freqtype     = _freqtype.code;
  if (_freq.toDouble() > 0)
    params.freq         = _freq.toDouble();

  if(_mode == 'edit') 
    var _sql = "UPDATE xt.qpheadass SET "
           + "  qpheadass_item_id      = <? value('item_id') ?> "
           + ", qpheadass_warehous_id  = <? value('site_id') ?> "
           + ", qpheadass_oper         = <? value('oper') ?> "
           + ", qpheadass_prod         = <? value('prod') ?> "
           + ", qpheadass_recv         = <? value('recv') ?> "
           + ", qpheadass_ship         = <? value('ship') ?> "
           + ", qpheadass_testfreq     = <? value('freq') ?> "
           + ", qpheadass_freqtype     = <? value('freqtype') ?> "
           + " WHERE qpheadass_id = <? value('qpheadass_id') ?>"; 
  else 
    var _sql = "INSERT INTO xt.qpheadass ("
           + "    qpheadass_qphead_id, qpheadass_item_id, qpheadass_warehous_id, "
           + "    qpheadass_oper, qpheadass_prod, qpheadass_recv, qpheadass_ship, "
           + "    qpheadass_freqtype, qpheadass_testfreq ) "
           + " VALUES (<? value('qphead_id') ?> "
           + ",   <? value('item_id') ?> "
           + ",   <? value('site_id') ?> "
           + ",   <? value('oper') ?> "
           + ",   <? value('prod') ?> "
           + ",   <? value('recv') ?> "
           + ",   <? value('ship') ?> "
           + ",   <? value('freqtype') ?> "
           + ",   <? value('freq') ?> ) ";  

  var qry = toolbox.executeQuery(_sql, params);
  if (xtquality.errorCheck(qry))
    mydialog.done(1);
  else
    mydialog.done(-1);
}

function validate()
{
  // Check Item and Site exists
  if (!_item.isValid() || !_site.isValid())
  {
    QMessageBox.warning(mywindow, qsTr("Missing Information"), qsTr("Please enter both an Item and a Site"));
    return false;
  }

// Check Item Site and Control Method
  var _sql = "SELECT itemsite_controlmethod FROM itemsite "
           + " WHERE ((itemsite_warehous_id=<? value('site') ?>) "
           + "   AND  (itemsite_item_id=<? value('item') ?>));";
  var chk = toolbox.executeQuery(_sql, {site: _site.id(), item: _item.id()});
  xtquality.errorCheck(chk);
  if (chk.first())
    var controlMethod = chk.value("itemsite_controlmethod");
  else
  {
    QMessageBox.warning(mywindow, qsTr("Incorrect Selection"), qsTr("An Item Site does not exists for this Item/Site combination"));
    return false;
  }

// Lot
  if (_freqtype.code == 'LOT' && !(controlMethod == 'L'))
  {
    QMessageBox.warning(mywindow, qsTr("Incorrect Selection"), qsTr("You cannot select Lot sample frequency for non-Lot controlled Items"));
    _freqtype.code ="A";
    return false;
  }
// Serial
  if (_freqtype.code == 'SER' && !(controlMethod == 'S'))
  {
    QMessageBox.warning(mywindow, qsTr("Incorrect Selection"), qsTr("You cannot select Serial sample frequency for non-serialized Items"));
    _freqtype.code ="A";
    return false;
  }

// Check Transaction trigger
  if (!_checkBox_oper.checked && !_checkBox_prod.checked && !_checkBox_recv.checked && !_checkBox_ship.checked)
  {
    QMessageBox.warning(mywindow, qsTr("Incorrect Selection"), qsTr("Please select at least one Transaction Assignment"));
    return false;
  }

// Check frequency
  if (_freqtype.code == 'S' && _freq.toDouble() <= 0)
  {
    QMessageBox.warning(mywindow, qsTr("Missing Information"), qsTr("For Sample frequency type, please select a frequency."));
    return false;
  }

  return true;
}

function sampleFrequency()
{
  _freq.setEnabled(_freqtype.code == "S");
}

_close.clicked.connect(mywindow.close);
_save.clicked.connect(save);
_freqtype["newID(int)"].connect(sampleFrequency);
