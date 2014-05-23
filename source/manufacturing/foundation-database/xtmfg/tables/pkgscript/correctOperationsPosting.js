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

include("storedProcErrorLookup");
include("xtmfgErrors");

try {
  var _captive = false;
  var _runqtyper = 0.0;
  var _invProdUOMRatio = 0.0;
  var _suconsumed = 0.0;
  var _rnconsumed = 0.0;

  var _debug = false;

  // create a script var for each child of mywindow with an objectname starting _
  var _post                  = mywindow.findChild("_post");
  var _close                 = mywindow.findChild("_close");
  var _wo                    = mywindow.findChild("_wo");
  var _wooper                = mywindow.findChild("_wooper");
  var _qty                   = mywindow.findChild("_qty");
  var _productionUOM         = mywindow.findChild("_productionUOM");
  var _qtyOrdered            = mywindow.findChild("_qtyOrdered");
  var _qtyReceived           = mywindow.findChild("_qtyReceived");
  var _qtyBalance            = mywindow.findChild("_qtyBalance");
  var _standardRntime        = mywindow.findChild("_standardRntime");
  var _standardSutime        = mywindow.findChild("_standardSutime");
  var _specifiedSutime       = mywindow.findChild("_specifiedSutime");
  var _specifiedRntime       = mywindow.findChild("_specifiedRntime");
  var _womatl                = mywindow.findChild("_womatl");
  var _more                  = mywindow.findChild("_more");
  var _inventoryUOM          = mywindow.findChild("_inventoryUOM");
  var _correctSutime         = mywindow.findChild("_correctSutime");
  var _correctRntime         = mywindow.findChild("_correctRntime");
  var _clearRntime           = mywindow.findChild("_clearRntime");
  var _clearSutime           = mywindow.findChild("_clearSutime");
  var _correctInventory      = mywindow.findChild("_correctInventory");
  var _returnComponents      = mywindow.findChild("_returnComponents");
  var _clearSuComplete       = mywindow.findChild("_clearSuComplete");
  var _clearRnComplete       = mywindow.findChild("_clearRnComplete");
  var _correctStandardSutime = mywindow.findChild("_correctStandardSutime");
  var _correctStandardRntime = mywindow.findChild("_correctStandardRntime");
  var _transDate             = mywindow.findChild("_transDate");

  _womatl.addColumn(qsTr("Item Number"), -1, Qt.AlignLeft,  true, "item_number");
  _womatl.addColumn(qsTr("Description"), -1, Qt.AlignLeft,  true, "descrip");
  _womatl.addColumn(qsTr("Iss. UOM"),    -1, Qt.AlignLeft,  true, "uom_name");
  _womatl.addColumn(qsTr("Qty. per"),    -1, Qt.AlignRight, true, "womatl_qtyper");

} catch (e) {
  QMessageBox.critical(mywindow, "correctOperationsPosting", "correctOperationsPosting.js exception: " + e);
}

function set(params)
{
  try {
    if (_debug)
      print("entering xtmfg.correctOperationsPosting.set()");

    if("wo_id" in params)
    {
      _captive = true;

      _wo.setId(params.wo_id);
      _wo.setReadOnly(true);

      _qty.setFocus();
    }

    if("wooper_id" in params)
    {
      _captive = true;
      var oparams = new Object;
      oparams.wooper_id = params.wooper_id;
      var qry = toolbox.executeQuery("SELECT wooper_wo_id"
                                    +"  FROM xtmfg.wooper"
                                    +" WHERE (wooper_id=<? value('wooper_id') ?>);", oparams);
      if(qry.first())
      {
        _wo.setId(qry.value("wooper_wo_id"));
        _wo.enabled = false;
        _wooper.setId(params.wooper_id);
        _wooper.enabled = false;
        _qty.setFocus();
      }
      else if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      }
    }

    return mainwindow.NoError;

  } catch (e) {
    QMessageBox.critical(mywindow, "correctOperationsPosting", "set exception: " + e);
  }
}

function sPost()
{
  try {
    if (_debug)
      print("entering xtmfg.correctOperationsPosting.sPost()");

    var result = -1;

    if (!_transDate.isValid())
    {
      QMessageBox.critical( mywindow, qsTr("Invalid date"),
                            qsTr("You must enter a valid transaction date.") );
      _transDate.setFocus();
      return false;
    }

    if (_wooper.id() == -1)
    {
      QMessageBox.critical( mywindow, qsTr("Select W/O Operation to Post"),
                             qsTr("<p>Please select to W/O Operation you wish to post.") );

      _wooper.setFocus();
      return;
    }

/*   Commented out by Larry Cartee. When testing time only corrections everything seems to work OK. There doesn't seem to be any reason to not allow   labor only corrections without correcting a qty received
    if (_qty.toDouble() == 0.0)
    {
      QMessageBox.critical( mywindow, qsTr("Enter Quantity to Post"),
                            qsTr("Please enter the Quantity of Production, in Inventory or Production UOM, that you wish to post."));
      _qty.setFocus();
      return;
    }
*/

    if (_qty.toDouble() > _qtyReceived.toDouble())
    {
      QMessageBox.critical( mywindow, qsTr("Invalid Quantity"),
                            qsTr("Please enter a quantity less than or equal to the received quantity."));
      _qty.setFocus();
      return;
    }

    if (_correctSutime.checked)
    {
      if (_correctStandardSutime.checked && _standardSutime.toDouble() > _suconsumed)
      {
        QMessageBox.critical( mywindow, qsTr("Invalid Setup Time"),
                              qsTr("Please enter a Setup Time less than or equal to the consumed Setup Time."));
        _standardSutime.setFocus();
        return;
      }
      if (!_correctStandardSutime.checked && _specifiedSutime.toDouble() > _suconsumed)
      {
        QMessageBox.critical( mywindow, qsTr("Invalid Setup Time"),
                              qsTr("Please enter a Setup Time less than or equal to the consumed Setup Time."));
        _specifiedSutime.setFocus();
        return;
      }
    }

    if (_correctRntime.checked)
    {
      if (_correctStandardRntime.checked && _standardRntime.toDouble() > _rnconsumed)
      {
        QMessageBox.critical( mywindow, qsTr("Invalid Run Time"),
                              qsTr("Please enter a Run Time less than or equal to the consumed Run Time."));
        _standardRntime.setFocus();
        return;
      }
      if (!_correctStandardRntime.checked && _specifiedRntime.toDouble() > _rnconsumed)
      {
        QMessageBox.critical( mywindow, qsTr("Invalid Run Time"),
                              qsTr("Please enter a Run Time less than or equal to the consumed Run Time."));
        _specifiedRntime.setFocus();
        return;
      }
    }

    var qty = 0.0;

    if(_productionUOM.checked)
      qty = (_qty.toDouble() / _invProdUOMRatio);
    else
      qty = _qty.toDouble();

    toolbox.executeBegin(); // because of possible lot, serial, or location distribution cancelations
    params = new Object;
    params.wooper_id = _wooper.id();
    params.qty = qty;
    params.returnComponents = _returnComponents.checked;
    params.correctInventory = _correctInventory.checked;
    params.correctSutime = _correctSutime.checked;
    params.transDate = _transDate.date;
    if(_correctSutime.checked)
    {
      var sutime = _specifiedSutime.toDouble();
      if(_correctStandardSutime.checked)
        sutime = _standardSutime.toDouble();
      params.setupTime = sutime * -1;
      params.clearSetupComplete = _clearSuComplete.checked;
    }
    params.correctRnTime = _correctRntime.checked;
    if(_correctRntime.checked)
    {
      var rntime = _specifiedRntime.toDouble();
      if(_correctStandardRntime.checked)
        rntime = _standardRntime.toDouble();
      params.runTime = rntime * -1;
      params.clearRunComplete = _clearRnComplete.checked;
    }

    qry = toolbox.executeQuery("SELECT xtmfg.correctOperationsPosting( <? value('wooper_id') ?>,"
                             + "                                       <? value('qty') ?>,"
                             + "                                       <? value('returnComponents') ?>,"
                             + "                                       <? value('correctInventory') ?>,"
                             + "                                       <? value('correctSutime') ?>,"
                             + "                                       <? value('setupTime') ?>,"
                             + "                                       <? value('clearSetupComplete') ?>,"
                             + "                                       <? value('correctRnTime') ?>,"
                             + "                                       <? value('runTime') ?>,"
                             + "                                       <? value('clearRunComplete') ?>,"
                             + "                                       <? value('transDate') ?>) AS result;", params);
    if (qry.first())
    {
      result = qry.value("result");
      if (result < 0)
      {
        toolbox.executeRollback();
        QMessageBox.critical( mywindow, qsTr("Error"), storedProcErrorLookup("correctOperationsPosting", result));
        return;
      }
    }
    else if(qry.lastError.type != QSqlError.NoError)
    {
      toolbox.executeRollback();
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
    else
    {
      toolbox.executeRollback();
      QMessageBox.critical(mywindow, qsTr("Error"), qsTr("There was an error processing this transaction"));
      return;
    }

    if(!_correctSutime.checked && _clearSuComplete.checked)
    {
      params = new Object;
      params.wooper_id = _wooper.id();
      var qry = toolbox.executeQuery("UPDATE xtmfg.wooper"
                                    +"   SET wooper_sucomplete=false"
                                    +" WHERE(wooper_id=<? value('wooper_id') ?>);", params);
      if (qry.lastError().type != QSqlError.NoError)
      {
        toolbox.executeRollback();
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return;
      }
    }

    if(!_correctRntime.checked && _clearRnComplete.checked)
    {
      params = new Object;
      params.wooper_id = _wooper.id();
      var qry = toolbox.executeQuery("UPDATE xtmfg.wooper"
                                    +"   SET wooper_rncomplete=false"
                                    +" WHERE(wooper_id=<? value('wooper_id') ?>);", params);
      if (qry.lastError().type != QSqlError.NoError)
      {
        toolbox.executeRollback();
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return;
      }
    }

    if (DistributeInventory.SeriesAdjust(result, mywindow) == QDialog.Rejected)
    {
      toolbox.executeRollback();
      QMessageBox.information( mywindow, qsTr("Correct Operation Posting"), qsTr("Transaction Canceled") );
      return;
    }

    toolbox.executeCommit();
  
    mainwindow.sWorkOrdersUpdated(_wo.id(), true);

    if (_captive)
      mydialog.accept();
    else
    {
      _close.text = qsTr("&Close");

      _wooper.setId(-1);
      _wooper.setFocus();
    }

  } catch (e) {
    QMessageBox.critical(mywindow, "correctOperationsPosting", "sPost exception: " + e);
  }
}

function sHandleQty()
{
  try {
    if (_debug)
      print("entering xtmfg.correctOperationsPosting.sHandleQty()");

    if (_wooper.id() == -1)
    {
      _standardRntime.clear();
      _clearRnComplete.checked = false;
      return;
    }
    else
    {
      var qty = _qty.toDouble();

      if (_productionUOM.checked)
        _standardRntime.setDouble(_rnqtyper * qty);
      else
        _standardRntime.setDouble(_rnqtyper / _invProdUOMRatio * qty);

      if(qty < _qtyOrdered.toDouble())
        _clearRnComplete.checked = true;
      else
        _clearRnComplete.checked = false;
    }

  } catch (e) {
    QMessageBox.critical(mywindow, "correctOperationsPosting", "sHandleQty exception: " + e);
  }
}

function sHandleWooperid(pWooperid)
{
  try {
    if (_debug)
      print("entering xtmfg.correctOperationsPosting.sHandleWooperid()");

    if(_wooper.id() != -1)
    {
      var wooperSuConsumed = 0.0;

      var params = new Object;
      params.wooper_id = _wooper.id();
      var qry = toolbox.executeQuery("SELECT wo_qtyord,"
                                    +"       COALESCE(wooper_qtyrcv, 0) AS received,"
                                    +"       noNeg(wo_qtyord - COALESCE(wooper_qtyrcv, 0)) AS balance,"
                                    +"       wooper_issuecomp, wooper_rcvinv, wooper_produom,"
                                    +"       wooper_sucomplete, wooper_rncomplete,"
                                    +"       wooper_suconsumed, wooper_rnconsumed,"
                                    +"       wooper_rnqtyper, wooper_invproduomratio "
                                    +"  FROM xtmfg.wooper JOIN wo ON (wo_id=wooper_wo_id) "
                                    +" WHERE (wooper_id=<? value('wooper_id') ?>);", params);
      if(qry.first())
      {
        _rnqtyper = qry.value("wooper_rnqtyper");
        _invProdUOMRatio = qry.value("wooper_invproduomratio");

        _qtyOrdered.setDouble(qry.value("wo_qtyord"));
        _qtyReceived.setDouble(qry.value("received"));
        _qtyBalance.setDouble(qry.value("balance"));
        _productionUOM.text = qsTr("Production UOMs (%1)")
                               .arg(qry.value("wooper_produom"));

        _suconsumed = qry.value("wooper_suconsumed");
        _rnconsumed = qry.value("wooper_rnconsumed");

        _standardSutime.setDouble(qry.value("wooper_suconsumed"));
        _correctSutime.enabled = (qry.value("wooper_suconsumed") > 0.0);
        _correctSutime.checked = (qry.value("wooper_suconsumed") > 0.0);
        _standardRntime.setDouble(qry.value("wooper_rnconsumed"));
        _correctRntime.enabled = (qry.value("wooper_rnconsumed") > 0.0);
        _correctRntime.checked = (qry.value("wooper_rnconsumed") > 0.0);

        _clearSuComplete.enabled = qry.value("wooper_sucomplete");
        _clearSuComplete.checked = qry.value("wooper_sucomplete");
        _clearRnComplete.enabled = qry.value("wooper_rncomplete");
        _clearRnComplete.checked = qry.value("wooper_rncomplete");

        _correctInventory.enabled = qry.value("wooper_rcvinv");
        _correctInventory.checked = qry.value("wooper_rcvinv");

        if (qry.value("wooper_issuecomp"))
        {
          params.wooper_id = _wooper.id();
          qry = toolbox.executeQuery("SELECT womatl_id, item_number, (item_descrip1 || ' ' || item_descrip2) AS descrip,"
                                    +"       uom_name, womatl_qtyper, 'qtyper' AS womatl_qtyper_xtnumericrole "
                                    +"  FROM womatl JOIN itemsite ON (itemsite_id=womatl_itemsite_id)"
                                    +"              JOIN item ON (item_id=itemsite_item_id)"
                                    +"              JOIN uom ON (uom_id=womatl_uom_id) "
                                    +" WHERE((womatl_issuemethod IN ('L', 'M'))"
                                    +"   AND (womatl_wooper_id=<? value('wooper_id') ?>) ) "
                                    +"ORDER BY item_number;", params);
          _womatl.populate(qry);
          if (qry.lastError().type != QSqlError.NoError)
          {
            QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
            return;
          }

          if (qry.first())
          {
            _returnComponents.enabled = true;
            _returnComponents.checked = true;
          }
          else
          {
            _returnComponents.enabled = false;
            _returnComponents.checked = false;
          }
        }
        else
        {
          _womatl.clear();
          _returnComponents.enabled = false;
          _returnComponents.checked = false;
        }

        sHandleQty();
      }
      else if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return;
      }
    }
    else
    {
      _qtyOrdered.clear();
      _qtyReceived.clear();
      _qtyBalance.clear();
      _productionUOM.text = qsTr("Production UOMs");

      _qty.clear();

      _returnComponents.checked = false;
      _correctInventory.checked = false;
      _womatl.clear();

      _correctSutime.enabled = false;
      _correctSutime.checked = false;
      _clearSuComplete.checked = false;
      _standardSutime.clear();
      _specifiedSutime.clear();

      _correctRntime.enabled = false;
      _correctRntime.checked = false;
      _clearRnComplete.checked = false;
      _standardRntime.clear();
      _specifiedRntime.clear();
    }
    _wooper.setFocus();

  } catch (e) {
    QMessageBox.critical(mywindow, "correctOperationsPosting", "sHandleWooperid exception: " + e);
  }
}

function sHandleWoid(pWoid)
{
  try {
    if (_debug)
      print("entering xtmfg.correctOperationsPosting.sHandleWoid()");

    if(pWoid != -1 && _wo.method() == "D")
    {
      QMessageBox.critical(mywindow, mywindow.windowTitle,
                           qsTr("Posting of Operations against disassembly work orders is not supported."));
      if (_captive)
        mydialog.reject();
      _wo.setId(-1);
      _wo.setFocus();
      return;
    }

    var params = new Object;
    params.wo_id = pWoid;

    var qry = toolbox.executeQuery("SELECT wooper_id, (wooper_seqnumber || ' - ' || wooper_descrip1 || ' ' || wooper_descrip2) "
                                  +"  FROM xtmfg.wooper "
                                  +" WHERE (wooper_wo_id=<? value('wo_id') ?>) "
                                  +" ORDER BY wooper_seqnumber;", params);
    _wooper.populate(qry);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }

    qry = toolbox.executeQuery("SELECT uom_name "
                              +"  FROM wo, itemsite, item, uom "
                              +" WHERE((wo_itemsite_id=itemsite_id)"
                              +"   AND (itemsite_item_id=item_id)"
                              +"   AND (item_inv_uom_id=uom_id)"
                              +"   AND (wo_id=<? value('wo_id') ?>) );", params);
    if(qry.first())
      _inventoryUOM.text = qsTr("Inventory UOMs (%1)").arg(qry.value("uom_name"));
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  
  } catch (e) {
    QMessageBox.critical(mywindow, "correctOperationsPosting", "sHandleWoid exception: " + e);
  }
}

function closeEvent()
{
  try {
    if (_debug)
      print("entering xtmfg.correctOperationsPosting.closeEvent()");

    preferences.set("PostOpsShowAll", _more.checked);
  
  } catch (e) {
    QMessageBox.critical(mywindow, "correctOperationsPosting", "closeEvent exception: " + e);
  }
}

try {
  _post.clicked.connect(sPost);
  _wo.newId.connect(sHandleWoid);
  _wooper.newID.connect(sHandleWooperid);
  _qty.textChanged.connect(sHandleQty);
  _productionUOM.toggled.connect(sHandleQty);

  _close.clicked.connect(mydialog, "reject");

  _transDate.date = mainwindow.dbDate();
  InputManager.notify(InputManager.cBCWorkOrder, mywindow, _wo, InputManager.slotName("setId(int)"));

  _wo.type = 4; // cWoIssued(4)
  _wooper.allowNull = true;
  _wooper.setFocus();

  _qty.setValidator(mainwindow.qtyVal());
  _qtyOrdered.setPrecision(mainwindow.qtyVal());
  _qtyReceived.setPrecision(mainwindow.qtyVal());
  _qtyBalance.setPrecision(mainwindow.qtyVal());

  _standardRntime.setPrecision(mainwindow.runTimeVal());
  _standardSutime.setPrecision(mainwindow.runTimeVal());
  _specifiedSutime.setValidator(mainwindow.runTimeVal());
  _specifiedRntime.setValidator(mainwindow.runTimeVal());

  var layout = toolbox.widgetGetLayout(mydialog);
  layout.sizeConstraint = QLayout.SetFixedSize;

  if(!preferences.boolean("PostOpsShowAll"))
    _more.click();

  } catch (e) {
    QMessageBox.critical(mywindow, "correctOperationsPosting", "correctOperationsPosting.js exception: " + e);
  }
