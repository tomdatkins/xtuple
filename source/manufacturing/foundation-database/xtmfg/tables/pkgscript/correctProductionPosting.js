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

try {
  var _backFlush    = mywindow.findChild("_backFlush");
  var _close        = mywindow.findChild("_close");
  var _correct      = mywindow.findChild("_correct");
  var _nonPickItems = mywindow.findChild("_nonPickItems");
  var _qty          = mywindow.findChild("_qty");
  var _wo           = mywindow.findChild("_wo");
  var _transDate    = mywindow.findChild("_transDate");

  var _debug = false;

  var _backflushOperations = new XCheckBox(qsTr("Backflush &Operations"),
                                           mywindow);


  toolbox.coreDisconnect(_correct, "clicked()", mywindow, "sCorrect()");
  _correct["clicked()"].connect(sCorrect);
  _wo["newId(int)"].connect(sHandleWoid);

  fixLayout();

  if (preferences.boolean("XCheckBox/forgetful"))
    _backflushOperations.checked = true;

} catch (e) {
  QMessageBox.critical(mywindow, "correctProductionPosting",
                       "correctProductionPosting.js exception: " + e);
}

function fixLayout()
{
  try {
    if (_debug)
      print("entering xtmfg.correctProductionPosting.fixLayout()");

    var cblayout   = toolbox.widgetGetLayout(_backFlush);

    cblayout.insertWidget(2, _backflushOperations);

    QWidget.setTabOrder(_wo,                           _qty);
    QWidget.setTabOrder(_qty,                    _backFlush);
    QWidget.setTabOrder(_backFlush,           _nonPickItems);
    QWidget.setTabOrder(_nonPickItems, _backflushOperations);
    QWidget.setTabOrder(_backflushOperations,      _correct);
    QWidget.setTabOrder(_correct,                    _close);

  } catch (e) {
    QMessageBox.critical(mywindow, "correctProductionPosting",
                         "fixLayout exception: " + e);
  }
}

function sHandleWoid(pwoid)
{
  try {
    if (_debug)
      print("entering xtmfg.correctProductionPosting.sHandleWoid()");

    if (_wo.id() == -1)
      return;

    if (_wo.method() == "D")
    {
      _backflushOperations.enabled = false;
      _backflushOperations.checked = false;
    }
    else
      _backflushOperations.enabled = true;

  } catch (e) {
    QMessageBox.critical(mywindow, "correctProductionPosting",
                         "sHandleWoid exception: " + e);
  }
}

function okToPost()
{
  try {
    if (_debug)
      print("entering xtmfg.correctProductionPosting.okToPost()");

    var params = new Object;
    params.wo_id = _wo.id();

    if (!_transDate.isValid())
    {
      QMessageBox.warning(mywindow, qsTr("Invalid Date"),
                          qsTr("You must enter a valid transaction date."));
      _transDate.setFocus();
      return false;
    }

    var itemtypeq = toolbox.executeQuery("SELECT item_type "
                                       + "FROM wo, itemsite, item "
                                       + "WHERE ((wo_itemsite_id=itemsite_id)"
                                       + "   AND (itemsite_item_id=item_id)"
                                       + '   AND (wo_id=<? value("wo_id") ?>));',
                                         params);
    if (itemtypeq.first() && itemtypeq.value("item_type") == "B")
    {
      QMessageBox.warning(mywindow, qsTr("Cannot Post Correction"),
                          qsTr("You may not post a correction to a W/O that "
                             + "manufactures a Breeder Item. You must, "
                             + "instead, adjust the Breeder's, Co-Product's "
                             + "and By-Product's QOH."));
      return false;
    }
    else if (itemtypeq.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           itemtypeq.lastError().text);
      return false;
    }

    return mywindow.okToPost();

  } catch (e) {
    QMessageBox.critical(mywindow, "correctProductionPosting",
                         "okToPost exception: " + e);
  }
}

function sCorrect()
{
  try {
    if (_debug)
      print("entering xtmfg.correctProductionPosting.sCorrect()");

    if (! okToPost())
      return;

    toolbox.executeBegin(); // handle cancel of lot, serial, or loc distributions

    var params = new Object;
    params.wo_id               = _wo.id();
    params.backflushMaterials  = _backFlush.checked;
    params.backflushOperations = _backflushOperations.checked;
    if (_wo.method() == "A")
      params.qty = _qty.toDouble();
    else
      params.qty = _qty.toDouble() * -1;
    params.date = _transDate.date;

    var q = toolbox.executeQuery('SELECT xtmfg.correctProduction(<? value("wo_id") ?>,'
                               + '         <? value("qty") ?>, '
                               + '         <? value("backflushMaterials") ?>, '
                               + '         <? value("backflushOperations") ?>, 0, '
                               + '         <? value("date") ?>) '
                               + '         AS result;',
                               params);
    if (q.first())
    {
      var itemlocSeries = q.value("result");

      if (itemlocSeries < 0)
        throw new Error(storedProcErrorLookup("postProduction", result));

      if (DistributeInventory.SeriesAdjust(itemlocSeries,
                                           mywindow) == QDialog.Rejected)
        throw new Error(qsTr("Transaction Canceled"));

      toolbox.executeCommit();

      mainwindow.sWorkOrdersUpdated(_wo.id(), true);
    }
    else if (q.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           q.lastError().text);
      return;
    }

    if (mywindow.captive())
      mydialog.accept();
    else
      mywindow.clear();

  } catch (e) {
    toolbox.executeRollback();
    QMessageBox.critical(mywindow, "correctProductionPosting",
                         "sCorrect exception: " + e);
  }
}
