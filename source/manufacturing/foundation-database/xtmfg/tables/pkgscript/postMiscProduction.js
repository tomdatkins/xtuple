/*
This file is part of the xtmfg Package for xTuple ERP,
and is Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.  It
is licensed to you under the xTuple End-User License Agreement ("the
EULA"), the full text of which is available at www.xtuple.com/EULA.
While the EULA gives you access to source code and encourages your
involvement in the development process, this Package is not free
software.  By using this software, you agree to be bound by the
terms of the EULA.
*/
debugger;

// Determine WOTC Basis (Employee or User)
var empl = false;
if (metrics.value("TimeAttendanceMethod") == "Employee")
  empl = true;

var _backflush         = mywindow.findChild("_backflush");
var _close             = mywindow.findChild("_close");
var _immediateTransfer = mywindow.findChild("_immediateTransfer");
var _nonPickItems      = mywindow.findChild("_nonPickItems");
var _post              = mywindow.findChild("_post");
var _comments          = mywindow.findChild("_comments");
var _qtyToPost         = mywindow.findChild("_qtyToPost");
var _transferWarehouse = mywindow.findChild("_transferWarehouse");
var _item              = mywindow.findChild("_item");
var _warehouse         = mywindow.findChild("_warehouse");
var _assembly          = mywindow.findChild("_assembly");
var _disassembly       = mywindow.findChild("_disassembly");
var _documentNum       = mywindow.findChild("_documentNum");

var _backflushOperations = new XCheckBox(qsTr("Backflush &Operations"),
                                         mywindow);
if(empl)
{
  var _setupUser           = new EmpCluster(mywindow, "_setupEmp");
  var _runUser             = new EmpCluster(mywindow, "_runEmp");
} else {
  var _setupUser           = new UsernameCluster(mywindow, "_setupUser");
  var _runUser             = new UsernameCluster(mywindow, "_runUser");
}

var _debug = false;

function fixLayout()
{
  if (_debug)
    print("entering xtmfg.postProduction.fixLayout()");

  var cblayout   = toolbox.widgetGetLayout(_backflush);
  var userlayout = new QGridLayout();

  var userspacer = new QSpacerItem(30, 0, QSizePolicy.Fixed);
  userlayout.addItem(userspacer, 0, 0);
  userlayout.addWidget(_setupUser, 0, 1);
  userlayout.addWidget(_runUser,   1, 1);

  cblayout.insertWidget(2, _backflushOperations);
  cblayout.insertLayout(3, userlayout);

  _runUser.label   = qsTr("Run By:");
  _setupUser.label = qsTr("Setup By:");

  QWidget.setTabOrder(_item,                     _warehouse);
  QWidget.setTabOrder(_warehouse,                _qtyToPost);
  QWidget.setTabOrder(_qtyToPost,                _backflush);
  QWidget.setTabOrder(_backflush,             _nonPickItems);
  QWidget.setTabOrder(_nonPickItems,   _backflushOperations);
  QWidget.setTabOrder(_backflushOperations,      _setupUser);
  QWidget.setTabOrder(_setupUser,                  _runUser);
  QWidget.setTabOrder(_runUser,                _documentNum);
  QWidget.setTabOrder(_documentNum,               _comments);
  QWidget.setTabOrder(_comments,         _immediateTransfer);
  QWidget.setTabOrder(_immediateTransfer,_transferWarehouse);
  QWidget.setTabOrder(_transferWarehouse,             _post);
  QWidget.setTabOrder(_post,                         _close);
}

fixLayout();

//_backflushOperations.forgetful = true;
if (preferences.boolean("XCheckBox/forgetful"))
  _backflushOperations.checked = true;
sBackflushOperationsToggled(_backflushOperations.checked);

function set(params)
{
  if ("usr_id" in params)
  {
    _setupUser.setId(params.usr_id);
    _runUser.setId(params.usr_id);
  }

  if ("emp_id" in params)
  {
    _setupUser.setId(params.emp_id);
    _runUser.setId(params.emp_id);
  }
}

function okToPost()
{
  return mywindow.okToPost();
}

function sPost()
{
  if (! okToPost())
    return;

  var itemlocSeries = 0 - 0;

  try
  {
    toolbox.executeBegin(); // handle cancel of lot, serial, or loc distributions

    var result = mywindow.createwo();
    if (_debug) print("createwo() returned " + result);
    if (!result)
      throw new Error("createwo failed");

    var params = new Object;
    params.wo_id               = mywindow.getwoid();
    params.backflushMaterials  = _backflush.checked;
    params.backflushOperations = _backflushOperations.checked;
    if(empl)
    {
      params.suUser              = _setupUser.number;
      params.rnUser              = _runUser.number;
    } else {
      params.suUser              = _setupUser.username();
      params.rnUser              = _runUser.username();
    }

    if (_assembly.checked)
      params.qty = _qtyToPost.toDouble();
    else
      params.qty = _qtyToPost.toDouble() * -1;

    var postq = toolbox.executeQuery('SELECT xtmfg.postProduction(<? value("wo_id") ?>,'
                                   + '         <? value("qty") ?>, '
                                   + '         <? value("backflushMaterials") ?>, '
                                   + '         <? value("backflushOperations") ?>, '
                                   + '         0, <? value("suUser") ?>, '
                                   + '         <? value("rnUser") ?>, '
                                   + '         CURRENT_DATE, '
                                   + '         NULL) AS result;',
                                   params);
    if (postq.first())
    {
      itemlocSeries = postq.value("result");

      if (itemlocSeries < 0)
        throw new Error(storedProcErrorLookup("postProduction", itemlocSeries));

      if (DistributeInventory.SeriesAdjust(itemlocSeries, mywindow) == QDialog.Rejected)
        throw new Error(qsTr("Transaction Canceled"));

      var closeq = toolbox.executeQuery('SELECT xtmfg.closeWo(<? value("wo_id") ?>,'
                                      + '                     TRUE,'
                                      + '                     TRUE,'
                                      + '                     CURRENT_DATE)'
                                      + '       AS result;',
                                      params);
      if (closeq.first())
      {
        var result = closeq.value("result");
        if (result < 0)
        {
          QMessageBox.critical(mywindow,
                             qsTr("Could not close Work Order"),
                             storedProcErrorLookup("closewo", result));
          throw new Error("Close WO failed");
        }
      }
      else if (closeq.lastError().type != QSqlError.NoError)
        throw new Error(closeq.lastError().text);

      if (_immediateTransfer.checked)
      {
        params.item_id = _item.id();
        params.from_warehous_id = _warehouse.id();
        params.to_warehous_id = _transferWarehouse.id();
        params.documentNumber = _documentNum.text;
        var posttransfer = toolbox.executeQuery('SELECT interWarehouseTransfer( <? value("item_id") ?>,'
                                              + '                                  <? value("from_warehous_id") ?>,'
                                              + '                                  <? value("to_warehous_id") ?>,'
                                              + '                                  <? value("qty") ?>,'
                                              + "                                  'W',"
                                              + '                                  <? value("documentNumber") ?>,'
                                              + "                                  'Transfer from Misc. Production Posting' )"
                                              + '          AS result;',
                                              params);
        if (posttransfer.first())
        {
          itemlocSeries = posttransfer.value("result");

          if (itemlocSeries < 0)
            throw new Error(storedProcErrorLookup("postProduction", itemlocSeries));

          if (DistributeInventory.SeriesAdjust(itemlocSeries, mywindow) == QDialog.Rejected)
            throw new Error(qsTr("Transaction Canceled"));
        }
      }

      toolbox.executeCommit();
    }
    else if (postq.lastError().type != QSqlError.NoError)
      throw new Error(postq.lastError().text);
  }
  catch (e)
  {
    toolbox.executeRollback();
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
    return;
  }

  if (mywindow.captive())
  {
    mydialog.done(itemlocSeries);
  }
  else
    mywindow.clear();
}

function sBackflushOperationsToggled(newvalue)
{
  _runUser.setReadOnly(!newvalue);
  _setupUser.setReadOnly(!newvalue);
}

toolbox.coreDisconnect(_post, "clicked()", mywindow, "sPost()");
_backflushOperations["toggled(bool)"].connect(sBackflushOperationsToggled);
_post["clicked()"].connect(sPost);

include("storedProcErrorLookup");
