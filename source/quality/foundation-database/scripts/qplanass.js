/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
 
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
_freqtype.append(4, 'Lot',        'O');
_freqtype.append(5, 'Serial',     'E');

function set(input)
{
  var params = new Object;
  if('qphead_id' in input)
    _qphead_id = input.qphead_id;  
  if('mode' in input)
    _mode = input.mode;
  if('qpheadass_id' in input)
  {
    _qpheadass_id = input.qpheadass_id;
    params.qpheadass_id = _qpheadass_id;
    
    var qry = toolbox.executeDbQuery('qpheadass', 'detail', params)
    if(qry.first()) {
      _item.setId(qry.value('item_id'));
      _site.setId(qry.value('site_id'));
      _checkBox_oper.checked = qry.value('qpheadass_oper');
      _checkBox_prod.checked = qry.value('qpheadass_prod');
      _checkBox_recv.checked = qry.value('qpheadass_recv');
      _checkBox_ship.checked = qry.value('qpheadass_ship');
      _freqtype.text = qry.value('freqtype');
      _freq.text = qry.value('qpheadass_testfreq');
    }
  }
}

function save()
{
  try {
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
    params.freq         = _freq.text;

    if(_mode == 'edit') 
    {
      var qry = toolbox.executeQuery("UPDATE xt.qpheadass SET "
           + "  qpheadass_item_id      = <? value('item_id') ?> "
           + ", qpheadass_warehous_id  = <? value('site_id') ?> "
           + ", qpheadass_oper         = <? value('oper') ?> "
           + ", qpheadass_prod         = <? value('prod') ?> "
           + ", qpheadass_recv         = <? value('recv') ?> "
           + ", qpheadass_ship         = <? value('ship') ?> "
           + ", qpheadass_testfreq     = <? value('freq') ?> "
           + ", qpheadass_freqtype     = <? value('freqtype') ?> "
           + " WHERE qpheadass_id = <? value('qpheadass_id') ?>", params);  
      if (qry.lastError().type != QSqlError.NoError)
        throw new Error(qry.lastError().text);
    }
    else 
    {
      var qry = toolbox.executeQuery("INSERT INTO xt.qpheadass ("
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
           + ",   <? value('freq') ?> ) ", params);  
        if (qry.lastError().type != QSqlError.NoError)
          throw new Error(qry.lastError().text);
      }
    mywindow.close();
  } 
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

_close.clicked.connect(mywindow.close);
_save.clicked.connect(save);