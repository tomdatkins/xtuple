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

// Determine WOTC Basis (Employee or User)
var empl = false;
if (metrics.value("TimeAttendanceMethod") == "Employee")
  empl = true;

var _backflush         = mywindow.findChild("_backflush");
var _close             = mywindow.findChild("_close");
var _closeWo           = mywindow.findChild("_closeWo");
var _immediateTransfer = mywindow.findChild("_immediateTransfer");
var _nonPickItems      = mywindow.findChild("_nonPickItems");
var _post              = mywindow.findChild("_post");
var _productionNotes   = mywindow.findChild("_productionNotes");
var _qty               = mywindow.findChild("_qty");
var _scrap             = mywindow.findChild("_scrap");
var _transferWarehouse = mywindow.findChild("_transferWarehouse");
var _wo                = mywindow.findChild("_wo");
var _transDate         = mywindow.findChild("_transDate");

var _backflushOperations = new XCheckBox(qsTr("Backflush &Operations"),
                                         mywindow);
var _fromWOTC            = false;
var _wotc_id             = -1;
if (empl)
{
  var _setupUser           = new EmpCluster(mywindow, "_setupUser");
  var _runUser             = new EmpCluster(mywindow, "_runUser");
} else {
  var _setupUser           = new UsernameCluster(mywindow, "_setupUser");
  var _runUser             = new UsernameCluster(mywindow, "_runUser");
}

var _debug = true;

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

  QWidget.setTabOrder(_wo,                             _qty);
  QWidget.setTabOrder(_qty,                      _backflush);
  QWidget.setTabOrder(_backflush,             _nonPickItems);
  QWidget.setTabOrder(_nonPickItems,   _backflushOperations);
  QWidget.setTabOrder(_backflushOperations,      _setupUser);
  QWidget.setTabOrder(_setupUser,                  _runUser);
  QWidget.setTabOrder(_runUser,                    _closeWo);
  QWidget.setTabOrder(_closeWo,            _productionNotes);
  QWidget.setTabOrder(_productionNotes,  _immediateTransfer);
  QWidget.setTabOrder(_immediateTransfer,_transferWarehouse);
  QWidget.setTabOrder(_transferWarehouse,            _scrap);
  QWidget.setTabOrder(_scrap,                         _post);
  QWidget.setTabOrder(_post,                         _close);
}

fixLayout();

_backflushOperations.forgetful = true;
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

  if ("fromWOTC" in params)
  {
    _scrap.hidden = params.fromWOTC;
    _fromWOTC = true;
    _wotc_id = params.wotc_id;
  }
}

function sHandleWoid(pwoid)
{
  if (_wo.method() == "D")
  {
    _backflushOperations.enabled = false;
    _backflushOperations.checked = false;
  }
  else
  {
    var params = new Object;
    params.wo_id = pwoid;
    var q = toolbox.executeQuery("SELECT wooper_id"
                               + "  FROM xtmfg.wooper"
                               + ' WHERE (wooper_wo_id=<? value("wo_id") ?>);',
                               params);
    _backflushOperations.enabled = q.first();
    _backflushOperations.checked = q.first();
  }
}

function okToPost()
{
  if (!_transDate.isValid())
  {
    QMessageBox.warning(mywindow, qsTr("Invalid Date"),
                        qsTr("You must enter a valid transaction date."));
    _transDate.setFocus();
    return false;
  }
  else if (_qty.toDouble() == 0.0 && _fromWOTC)
  {
    if (QMessageBox.question(mywindow, qsTr("Zero Quantity To Post"),
                             qsTr("<p>Is the Quantity of Production really 0? "
                                + "If so you will be clocked out but nothing "
                                + "else will be posted."),
                             QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
    {
      _qty.setFocus();
      return false;
    }
  }
  else if (_qty.toDouble() == 0.0)
  {
    QMessageBox.warning(mywindow, qsTr("Enter Quantity to Post"),
                        qsTr("You must enter a quantity of production to Post."));
    _qty.setFocus();
    return false;
  }

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

    var params = new Object;
    params.wotc_id             = _wotc_id;
    params.wo_id               = _wo.id();
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
    params.date                = _transDate.date;
    if (_wo.method() == "A")
      params.qty = _qty.toDouble();
    else
      params.qty = _qty.toDouble() * -1;

    var q = toolbox.executeQuery('SELECT xtmfg.postProduction(<? value("wo_id") ?>,'
                               + '         <? value("qty") ?>, '
                               + '         <? value("backflushMaterials") ?>, '
                               + '         <? value("backflushOperations") ?>, '
                               + '         0, <? value("suUser") ?>, '
                               + '         <? value("rnUser") ?>, '
                               + '         <? value("date") ?>, '
                               + '         <? value("wotc_id") ?>) AS result;',
                               params);
    if (q.first())
    {
      itemlocSeries = q.value("result");

      if (itemlocSeries < 0)
        throw new Error(storedProcErrorLookup("postProduction", itemlocSeries));

      var errmsg = mywindow.updateWoAfterPost();
      if (_debug) print("updateWoAfterPost() returned " + errmsg);
      if (errmsg.length > 0)
        throw new Error(errmsg);

      if (DistributeInventory.SeriesAdjust(itemlocSeries, mywindow) == QDialog.Rejected)
        throw new Error(qsTr("Transaction Canceled"));

      errmsg = mywindow.handleIssueToParentAfterPost(itemlocSeries);
      if (_debug) print("handleIssueToParentAfterPost() returned " + errmsg);
      if (errmsg.length > 0)
        throw new Error(errmsg);

      errmsg = mywindow.handleTransferAfterPost();
      if (_debug) print("handleTransferAfterPost() returned " + errmsg);
      if (errmsg.length > 0)
        throw new Error(errmsg);

      var typeq = toolbox.executeQuery("SELECT item_type"
                                     + "  FROM item"
                                     + "  JOIN itemsite ON (itemsite_item_id=item_id)"
                                     + "  JOIN wo ON (wo_itemsite_id=itemsite_id)"
                                     + ' WHERE (wo_id=<? value("wo_id") ?>);',
                                     params);
      if (typeq.first() && typeq.value("item_type") == "B")
      {
        params.mode  = "new";
        params.transDate = _transDate.date;
        var newdlg = toolbox.openWindow("distributeBreederProduction", mywindow,
                                        Qt.WindowModal, Qt.Dialog);
        var tmp = toolbox.lastWindow();
        tmp.set(params);
        if (newdlg.exec() == QDialog.Rejected)
          throw new Error(qsTr("Transaction Canceled"));
      }
      else if (typeq.lastError().type != QSqlError.NoError)
        throw new Error(typeq.lastError().text);

      toolbox.executeCommit();

      mainwindow.sWorkOrdersUpdated(_wo.id(), true);

      if (_closeWo.checked)
      {
        params.transDate = _transDate.date;
        var newdlg = toolbox.openWindow("closeWo", mywindow,
                                        Qt.WindowModal, Qt.Dialog);
        newdlg.set(params);
        newdlg.setAttribute(55, true); // Qt.WA_DeleteOnClose
        toolbox.lastWindow().setAttribute(55, true);
        newdlg.exec();
      }
    }
    else if (q.lastError().type != QSqlError.NoError)
      throw new Error(q.lastError().text);
  }
  catch (e)
  {
    toolbox.executeRollback();
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
    return;
  }

  if (_scrap.checked)
    mywindow.sScrap();

  if (mywindow.captive())
  {
    // if itemlocSeries = zero then zero qty posted
    // return a valid status for woTimeClock
    if (itemlocSeries == 0 && _fromWOTC)
      itemlocSeries = 1;
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
_wo["newId(int)"].connect(sHandleWoid);

include("storedProcErrorLookup");
