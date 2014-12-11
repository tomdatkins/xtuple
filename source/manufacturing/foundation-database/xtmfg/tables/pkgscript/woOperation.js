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
var _wooperid = -1;
var _captive = false;
var _cachedQtyOrdered = 0.0;

// create a script var for each child of mywindow with an objectname starting _
var _save                  = mywindow.findChild("_save");
var _close                 = mywindow.findChild("_close");
var _stdopn                = mywindow.findChild("_stdopn");
var _optype                = mywindow.findChild("_optype");
var _fixedFont             = mywindow.findChild("_fixedFont");
var _runTime               = mywindow.findChild("_runTime");
var _setupTime             = mywindow.findChild("_setupTime");
var _invProdUOMRatio       = mywindow.findChild("_invProdUOMRatio");
var _wo                    = mywindow.findChild("_wo");
var _qtyOrdered            = mywindow.findChild("_qtyOrdered");
var _priceLit              = mywindow.findChild("_priceLit");
var _price                 = mywindow.findChild("_price");
var _invRunTime            = mywindow.findChild("_invRunTime");
var _invPerMinute          = mywindow.findChild("_invPerMinute");
var _setupTimeConsumed     = mywindow.findChild("_setupTimeConsumed");
var _runTimeConsumed       = mywindow.findChild("_runTimeConsumed");
var _setupTimeRemaining    = mywindow.findChild("_setupTimeRemaining");
var _runTimeRemaining      = mywindow.findChild("_runTimeRemaining");
var _prodUOM               = mywindow.findChild("_prodUOM");
var _wrkcnt                = mywindow.findChild("_wrkcnt");
var _setupTimeConsumedLit  = mywindow.findChild("_setupTimeConsumedLit");
var _setupTimeRemainingLit = mywindow.findChild("_setupTimeRemainingLit");
var _setupComplete         = mywindow.findChild("_setupComplete");
var _runTimeConsumedLit    = mywindow.findChild("_runTimeConsumedLit");
var _runTimeRemainingLit   = mywindow.findChild("_runTimeRemainingLit");
var _runComplete           = mywindow.findChild("_runComplete");
var _executionDay          = mywindow.findChild("_executionDay");
var _description1          = mywindow.findChild("_description1");
var _description2          = mywindow.findChild("_description2");
var _toolingReference      = mywindow.findChild("_toolingReference");
var _reportSetup           = mywindow.findChild("_reportSetup");
var _reportRun             = mywindow.findChild("_reportRun");
var _receiveStock          = mywindow.findChild("_receiveStock");
var _issueComp             = mywindow.findChild("_issueComp");
var _instructions          = mywindow.findChild("_instructions");
var _womatl                = mywindow.findChild("_womatl");
var _invUOM1               = mywindow.findChild("_invUOM1");
var _invUOM2               = mywindow.findChild("_invUOM2");
var _operSeqNum            = mywindow.findChild("_operSeqNum");

var _debug = false;

_womatl.addColumn(qsTr("Item Number"),        -1, Qt.AlignLeft,   true, "item_number");
_womatl.addColumn(qsTr("Description"),        -1, Qt.AlignLeft,   true, "item_descrip1");
_womatl.addColumn(qsTr("Qty. Required"),      -1, Qt.AlignRight,  true, "womatl_qtyreq");
_womatl.addColumn(qsTr("Qty. Issued"),        -1, Qt.AlignRight,  true, "womatl_qtyiss");
_womatl.addColumn(qsTr("Due Date"),           -1, Qt.AlignCenter, true, "womatl_duedate");

// Populate Operation Type combo
_optype.populate("SELECT opntype_id, opntype_descrip FROM xtmfg.opntype");

function set(params)
{
  if (_debug) print("woOperation set called");
  try {
    if("showPrice" in params)
    {
      _priceLit.show();
      _price.show();
    }
    else
    {
      _priceLit.hide();
      _price.hide();
    }

    if("wo_id" in params)
    {
      _captive = true;

      _wo.setId(params.wo_id);
      _wo.setReadOnly(true);
    }

    if("wooper_id" in params)
    {
      _wooperid = params.wooper_id;
      _wo.setReadOnly(true);

      populate();
    }

    if("mode" in params)
    {
      if (params.mode == "new")
      {
        _mode = "new";

        _setupTimeConsumedLit.enabled = false;
        _setupTimeRemainingLit.enabled = false;
        _setupComplete.enabled = false;
        _runTimeConsumedLit.enabled = false;
        _runTimeRemainingLit.enabled = false;
        _runComplete.enabled = false;
      }
      else if (params.mode == "edit")
      {
        _mode = "edit";
        _save.setFocus();
      }
      else if (params.mode == "view")
      {
        _mode = "view";

        _wo.setReadOnly(true);
        _executionDay.enabled = false;
        _stdopn.enabled = false;
        _description1.enabled = false;
        _description2.enabled = false;
        _wrkcnt.enabled = false;
        _optype.enabled = false;
        _prodUOM.enabled = false;
        _toolingReference.enabled = false;
        _invProdUOMRatio.enabled = false;
        _setupTime.enabled = false;
        _runTime.enabled = false;
        _reportSetup.enabled = false;
        _reportRun.enabled = false;
        _receiveStock.enabled = false;
        _issueComp.enabled = false;
        _setupComplete.enabled = false;
        _runComplete.enabled = false;
        _instructions.enabled = false;
        _fixedFont.enabled = false;
        _price.enabled = false;

        _close.text = qsTr("&Close");
        _save.hide();

        _close.setFocus();
      }
    }

    return mainwindow.NoError;
  } catch(e) {
    print("woOperation set exception @ " + e.lineNumber + ": " + e);
  }
}

function sSave()
{
  if (_debug) print("woOperation sSave called");
  try {
    if (_receiveStock.checked)
    {
      var params = new Object;
      params.wo_id = _wo.id();

      var qry = toolbox.executeQuery("UPDATE xtmfg.wooper"
                                    +"   SET wooper_rcvinv=false"
                                    +" WHERE(wooper_wo_id=<? value('wo_id') ?>);", params);
      if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return;
      }
    }

    var q_str = "";
    if (_mode == "new")
    {
      var qid = toolbox.executeQuery("SELECT NEXTVAL('xtmfg.wooper_wooper_id_seq') AS wooper_id;");
      if (qid.first())
        _wooperid = qid.value("wooper_id");
      else if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return;
      }

      q_str = "INSERT INTO xtmfg.wooper "
             +"          ( wooper_id, wooper_wo_id,"
             +"            wooper_seqnumber, wooper_opntype_id,"
             +"            wooper_wrkcnt_id, wooper_stdopn_id,"
             +"            wooper_descrip1, wooper_descrip2, wooper_toolref,"
             +"            wooper_produom, wooper_invproduomratio,"
             +"            wooper_sutime, wooper_surpt, wooper_sucomplete, wooper_suconsumed,"
             +"            wooper_rntime, wooper_rnqtyper,"
             +"            wooper_rnrpt, wooper_rncomplete, wooper_rnconsumed,"
             +"            wooper_rcvinv, wooper_issuecomp,"
             +"            wooper_scheduled,"
             +"            wooper_qtyrcv,"
             +"            wooper_instruc,"
             +"            wooper_price ) "
             +"SELECT <? value('wooper_id') ?>, <? value('wo_id') ?>,"
             +"       (COALESCE(MAX(wooper_seqnumber), 0) + 10), <? value('wooper_opntype_id') ?>,"
             +"       <? value('wooper_wrkcnt_id') ?>, <? value('wooper_stdopn_id') ?>,"
             +"       <? value('wooper_descrip1') ?>, <? value('wooper_descrip2') ?>, <? value('wooper_toolref') ?>,"
             +"       <? value('wooper_produom') ?>, <? value('wooper_invproduomratio') ?>,"
             +"       <? value('wooper_sutime') ?>, <? value('wooper_surpt') ?>, <? value('wooper_sucomplete') ?>, 0,"
             +"       <? value('wooper_rntime') ?>, <? value('wooper_rnqtyper') ?>,"
             +"       <? value('wooper_rnrpt') ?>, <? value('wooper_rncomplete') ?>, 0,"
             +"       <? value('wooper_rcvinv') ?>, <? value('wooper_issuecomp') ?>,"
             +"       (calculatenextworkingdate((SELECT itemsite_warehous_id FROM itemsite WHERE itemsite_id=wo_itemsite_id LIMIT 1),wo_startdate,<? value('executionDay') ?>-1)),"
             +"       0.0,"
             +"       <? value('wooper_instruc') ?>,"
             +"       <? value('wooper_price') ?> "
             +"  FROM wo LEFT OUTER JOIN xtmfg.wooper ON (wooper_wo_id=wo_id) "
             +" WHERE (wo_id=<? value('wo_id') ?>) "
             +" GROUP BY wo_itemsite_id, wo_startdate;";
    }
    else if (_mode == "edit")
    {
      q_str = "UPDATE xtmfg.wooper "
             +"   SET wooper_wrkcnt_id=<? value('wooper_wrkcnt_id') ?>,"
             +"       wooper_stdopn_id=<? value('wooper_stdopn_id') ?>,"
             +"       wooper_opntype_id=<? value('wooper_opntype_id') ?>,"
             +"       wooper_descrip1=<? value('wooper_descrip1') ?>,"
             +"       wooper_descrip2=<? value('wooper_descrip2') ?>,"
             +"       wooper_toolref=<? value('wooper_toolref') ?>,"
             +"       wooper_produom=<? value('wooper_produom') ?>,"
             +"       wooper_invproduomratio=<? value('wooper_invproduomratio') ?>,"
             +"       wooper_sutime=<? value('wooper_sutime') ?>,"
             +"       wooper_surpt=<? value('wooper_surpt') ?>,"
             +"       wooper_sucomplete=<? value('wooper_sucomplete') ?>,"
             +"       wooper_rntime=<? value('wooper_rntime') ?>,"
             +"       wooper_rnqtyper=<? value('wooper_rnqtyper') ?>,"
             +"       wooper_rnrpt=<? value('wooper_rnrpt') ?>,"
             +"       wooper_rncomplete=<? value('wooper_rncomplete') ?>,"
             +"       wooper_rcvinv=<? value('wooper_rcvinv') ?>,"
             +"       wooper_issuecomp=<? value('wooper_issuecomp') ?>,"
             +"       wooper_scheduled=calculatenextworkingdate(itemsite_warehous_id,wo_startdate,<? value('executionDay') ?>-1), "
             +"       wooper_instruc=<? value('wooper_instruc') ?>,"
             +"       wooper_price=<? value('wooper_price') ?> "
             +"  FROM wo "
             +"  Left Join itemsite on "
             +"    itemsite_id = wo_itemsite_id "
             +" WHERE((wooper_wo_id=wo_id)"
             +"   AND (wooper_id=<? value('wooper_id') ?>) );"
    }

    var params = new Object;
    params.wooper_id = _wooperid;

    params.wo_id = _wo.id();
    params.wooper_wrkcnt_id = _wrkcnt.id();
    params.wooper_stdopn_id = _stdopn.id();
    params.wooper_opntype_id = _optype.id();
    params.wooper_descrip1 = _description1.text;
    params.wooper_descrip2 = _description2.text;
    params.wooper_toolref = _toolingReference.text;
    params.wooper_produom = _prodUOM.currentText;
    params.wooper_invproduomratio = _invProdUOMRatio.toDouble();
    params.wooper_sutime = _setupTime.toDouble();
    params.wooper_rntime = _runTime.toDouble();
    params.wooper_rnqtyper = (_runTime.toDouble() / _cachedQtyOrdered);
    params.executionDay = _executionDay.value;
    params.wooper_instruc = _instructions.plainText;
    params.wooper_surpt = _reportSetup.checked;
    params.wooper_sucomplete = _setupComplete.checked;
    params.wooper_rnrpt = _reportRun.checked;
    params.wooper_rncomplete = _runComplete.checked;
    params.wooper_rcvinv = _receiveStock.checked;
    params.wooper_issuecomp = _issueComp.checked;
    params.wooper_price = _price.baseValue;

    var qry = toolbox.executeQuery(q_str, params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }

    mainwindow.sWorkOrderOperationsUpdated(_wo.id(), _wooperid, true);
    mydialog.done(_wooperid);
  } catch(e) {
    print("woOperation sSave exception @ " + e.lineNumber + ": " + e);
  }
}

function populate()
{
  if (_debug) print("woOperation populate called");
  try {
    var params = new Object;
    params.wooper_id = _wooperid;

    var qry = toolbox.executeQuery("SELECT wooper.*,"
                                  +"       noNeg(wooper_sutime - wooper_suconsumed) AS suremaining,"
                                  +"       noNeg(wooper_rntime - wooper_rnconsumed) AS rnremaining,"
                                  +"       wooper_rcvinv, wooper_issuecomp,"
                                  +"       calculateworkdays(itemsite_warehous_id, wo_startdate, date(wooper_scheduled))+1 AS executionday"
                                  +"  FROM xtmfg.wooper Inner Join wo ON wooper_wo_id=wo_id "
                                  +"    INNER JOIN itemsite on itemsite_id=wo_itemsite_id "
                                  +" WHERE (wooper_id=<? value('wooper_id') ?>);", params);
    if(qry.first())
    {
      _wo.setId(qry.value("wooper_wo_id"));
      _stdopn.setId(qry.value("wooper_stdopn_id"));
      _optype.setId(qry.value("wooper_opntype_id"));
      if(_stdopn.id() > 0)
        _optype.enabled = false;
      _operSeqNum.text = qry.value("wooper_seqnumber");
      _description1.text = qry.value("wooper_descrip1");
      _description2.text = qry.value("wooper_descrip2");
      _prodUOM.text = qry.value("wooper_produom");
      _invProdUOMRatio.setDouble(qry.value("wooper_invproduomratio"));
      _toolingReference.text = qry.value("wooper_toolref");
      _wrkcnt.setId(qry.value("wooper_wrkcnt_id"));

      _setupTime.text = qry.value("wooper_sutime");
      _setupTimeConsumed.text = qry.value("wooper_suconsumed");
      _setupComplete.checked = qry.value("wooper_sucomplete");
      _setupTimeRemaining.text = qry.value("suremaining");
      _reportSetup.checked = qry.value("wooper_surpt");

      _runTime.text = qry.value("wooper_rntime");
      _runTimeConsumed.text = qry.value("wooper_rnconsumed");
      _runComplete.checked = qry.value("wooper_rncomplete");
      _runTimeRemaining.text = qry.value("rnremaining");
      _reportRun.checked = qry.value("wooper_rnrpt");

      _receiveStock.checked = qry.value("wooper_rcvinv");
      _issueComp.checked = qry.value("wooper_issuecomp");
      _executionDay.value = qry.value("executionday");
      _instructions.plainText = qry.value("wooper_instruc");

      _price.setBaseValue(qry.value("wooper_price"));

      if ((qry.value("wooper_suconsumed") > 0) || (qry.value("wooper_rnconsumed") > 0))
      {
        _stdopn.enabled = false;
        _description1.enabled = false;
        _description2.enabled = false;
        _toolingReference.enabled = false;
        _prodUOM.enabled = false;
        _invProdUOMRatio.enabled = false;
        _wrkcnt.enabled = false;
      }

      var qrywomatl = toolbox.executeQuery("SELECT womatl_id, item_number, item_descrip1, "
                                          +"       womatl_qtyreq, womatl_qtyiss, womatl_duedate, "
                                          +"       'qty' AS womatl_qtyreq_xtnumericrole, "
                                          +"       'qty' AS womatl_qtyiss_xtnumericrole "
                                          +"  FROM womatl "
                                          +"    INNER JOIN itemsite ON (itemsite_id=womatl_itemsite_id) "
                                          +"    INNER JOIN item ON (item_id=itemsite_item_id) "
                                          +" WHERE (womatl_wooper_id=<? value('wooper_id') ?>);", params);
      if(qrywomatl.first())
        _womatl.populate(qrywomatl);
      else if (qrywomatl.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qrywomatl.lastError().text);
        return;
      }
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  } catch(e) {
    print("woOperation populate exception @ " + e.lineNumber + ": " + e);
  }
}

function sHandleStdopn(pStdopnid)
{
  if (_debug) print("woOperation sHandleStdopn called");
  try {
    if (_stdopn.id() == -1)
      return;

    var params = new Object;
    params.stdopn_id = pStdopnid;

    var qry = toolbox.executeQuery("SELECT * "
                                  +"  FROM xtmfg.stdopn "
                                  +" WHERE(stdopn_id=<? value('stdopn_id') ?>);", params );
    if(qry.first())
    {
      _description1.text = qry.value("stdopn_descrip1");
      _description2.text = qry.value("stdopn_descrip2");
      _toolingReference.text = qry.value("stdopn_toolref");
      _instructions.plainText = qry.value("stdopn_instructions");

      _wrkcnt.setId(qry.value("stdopn_wrkcnt_id"));
      _optype.setId(qry.value("stdopn_opntype_id"));
      _optype.enabled = false;

      if (qry.value("stdopn_stdtimes"))
      {
        _setupTime.setDouble(qry.value("stdopn_sutime"));
        _runTime.setDouble(qry.value("stdopn_rntime"));
        _prodUOM.text = qry.value("stdopn_produom");
        _invProdUOMRatio.setDouble(qry.value("stdopn_invproduomratio"));
      }
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  } catch(e) {
    print("woOperation sHandleStdopn exception @ " + e.lineNumber + ": " + e);
  }
}

function sPopulateWoInfo(pWoid)
{
  if (_debug) print("woOperation sPopulateWoInfo called");
  try {
    if(pWoid == -1)
      return;

    var params = new Object;
    params.wo_id = pWoid;

    var qry = toolbox.executeQuery("SELECT wo_qtyord, uom_name "
                                  +"  FROM wo, itemsite, item, uom "
                                  +" WHERE((wo_itemsite_id=itemsite_id)"
                                  +"   AND (itemsite_item_id=item_id)"
                                  +"   AND (item_inv_uom_id=uom_id)"
                                  +"   AND (wo_id=<? value('wo_id') ?>) );", params);
    if(qry.first())
    {
      _cachedQtyOrdered = qry.value("wo_qtyord");

      _invUOM1.text = qry.value("uom_name"); 
      _invUOM2.text = qry.value("uom_name"); 
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  } catch(e) {
    print("woOperation sPopulateWoInfo exception @ " + e.lineNumber + ": " + e);
  }
}

function sHandleFont(pFixed)
{
  if (_debug) print("woOperation sHandleFont called");
  try {
    if(pFixed)
      _instructions.font = mainwindow.fixedFont();
    else
      _instructions.font = mainwindow.systemFont();
  } catch(e) {
    print("woOperation sHandleFont exception @ " + e.lineNumber + ": " + e);
  }
}

function sCalculateInvRunTime()
{
  if (_debug) print("woOperation sCalculateInvRunTime called");
  try {
    if((_runTime.toDouble() != 0.0) && (_invProdUOMRatio.toDouble() != 0.0))
    {
      _invRunTime.setDouble(_runTime.toDouble() / _cachedQtyOrdered / _invProdUOMRatio.toDouble());
      _invPerMinute.setDouble((1 / (_runTime.toDouble() / _cachedQtyOrdered / _invProdUOMRatio.toDouble())));
    }
    else
    {
      _invRunTime.setDouble(0.0);
      _invPerMinute.setDouble(0.0);
    }
  } catch(e) {
    print("woOperation sCalculateInvRunTime exception @ " + e.lineNumber + ": " + e);
  }
}


_save.clicked.connect(sSave);
_stdopn.newID.connect(sHandleStdopn);
_fixedFont.toggled.connect(sHandleFont);
_runTime.textChanged.connect(sCalculateInvRunTime);
_invProdUOMRatio.textChanged.connect(sCalculateInvRunTime);
_wo.newId.connect(sPopulateWoInfo);

_close.clicked.connect(mydialog, "reject");

_setupTime.setValidator(mainwindow.runTimeVal());
_runTime.setValidator(mainwindow.runTimeVal());
_invProdUOMRatio.setValidator(mainwindow.ratioVal());
_qtyOrdered.setPrecision(mainwindow.qtyVal());
_invRunTime.setPrecision(mainwindow.runTimeVal());
_invPerMinute.setPrecision(mainwindow.runTimeVal());
_setupTimeConsumed.setPrecision(mainwindow.runTimeVal());
_runTimeConsumed.setPrecision(mainwindow.runTimeVal());
_setupTimeRemaining.setPrecision(mainwindow.runTimeVal());
_runTimeRemaining.setPrecision(mainwindow.runTimeVal());

InputManager.notify(InputManager.cBCWorkOrder, mywindow, _wo, InputManager.slotName("setId(int)"));

sHandleFont(_fixedFont.checked);

_wo.type = 14; // cWoExploded(2) | cWoIssued(4) | cWoReleased(8)

_prodUOM.type = XComboBox.UOMs;
_wrkcnt.type = XComboBox.WorkCenters;

_stdopn.populate("SELECT -1, TEXT('None') AS stdopn_number, TEXT('None') AS stdopn_number2 "
                +" UNION "
                +"SELECT stdopn_id, stdopn_number, stdopn_number "
                +"  FROM xtmfg.stdopn "
                +" ORDER BY stdopn_number" );

