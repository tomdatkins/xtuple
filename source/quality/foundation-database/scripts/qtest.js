/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
include("xtQuality"); 
 //debugger;

var _test                = mywindow.findChild("_test");
var _qplan               = mywindow.findChild("_qplan");
var _revnum              = mywindow.findChild("_revnum");
var _teststat            = mywindow.findChild("_testStatus");
var _notes               = mywindow.findChild("_notes")
var _cancel              = mywindow.findChild("_cancel");
var _save                = mywindow.findChild("_save");
var _testdisp            = mywindow.findChild("_testDisp");
var _reason              = mywindow.findChild("_reason");
var _release             = mywindow.findChild("_release");
var _item                = mywindow.findChild("_item");
var _site                = mywindow.findChild("_site");
var _order               = mywindow.findChild("_order");
var _lotsrl              = mywindow.findChild("_lotsrl");
var _qtestItems          = mywindow.findChild("_qtestItems");
var _openqtestitem       = mywindow.findChild("_openqtestitem");
var _comments            = mywindow.findChild("_comments");
var _documents           = mywindow.findChild("_documents");
var _date                = mywindow.findChild("_date");

var _qplanStack          = mywindow.findChild("_qplanStack");
var _qplanSelect         = mywindow.findChild("_qplanSelect");

var _mode;
var _state = false;

var _qthead_id           = 0;
var _qplanid             = -1;

_qtestItems.addColumn(qsTr("Test #"),      100,  Qt.AlignLeft,   true,  "qtnumber" );
_qtestItems.addColumn(qsTr("Description"),  -1,  Qt.AlignLeft,   true,  "descrip" );
_qtestItems.addColumn(qsTr("Result"),       -1,  Qt.AlignLeft,   true,  "qtitem_actual" );
_qtestItems.addColumn(qsTr("Status"),      100,  Qt.AlignLeft,   true,  "status" );

_documents.setType("QTEST");
_comments.setType("QTEST");

_teststat.append(1, xtquality.status['O'], 'O');
_teststat.append(2, xtquality.status['P'], 'P');
_teststat.append(3, xtquality.status['F'], 'F');

_testdisp.append(1, xtquality.disposition['I'], 'I' );
_testdisp.append(2, xtquality.disposition['OK'], 'OK');
_testdisp.append(3, xtquality.disposition['Q'], 'Q' );
_testdisp.append(4, xtquality.disposition['R'], 'R' );
_testdisp.append(5, xtquality.disposition['S'], 'S' );

populate_reason();
populate_release();

function populate_reason()
{
  var qrytxt = "SELECT qtrsncode_id AS id, qtrsncode_code AS code, "
             + "qtrsncode_descrip AS descrip "
             + "FROM xt.qtrsncode ORDER BY id;";
  var qry = toolbox.executeQuery(qrytxt);
  _reason.populate(qry);      
  xtquality.errorCheck(qry);
}

function populate_release()
{
  var qrytxt = "SELECT qtrlscode_id AS id, qtrlscode_code AS code, "
             + "qtrlscode_descrip AS descrip "
             + "FROM xt.qtrlscode ORDER BY id;";
  var qry = toolbox.executeQuery(qrytxt);
  _release.populate(qry);
  xtquality.errorCheck(qry);
}

function populate_qtitems()
{
  var qry = toolbox.executeDbQuery("qtitem", "detail", {qthead_id: _qthead_id});
  if(xtquality.errorCheck(qry))
    _qtestItems.populate(qry);
}

function editItem()
{
  if(_qtestItems.id() < 1)
    return;

  var newdlg = toolbox.openWindow("qtitem", 0,
                      Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set({qtitem_id: _qtestItems.id()});
  newdlg.exec()
  populate_qtitems();
  editTestStatus();
}

function set(input)
{  
  _mode = input.mode || "new";

  if (_mode == "new")
    prepare();
  
  if("qthead_id" in input)
  {
    var params = new Object();
     params.qthead_id = input.qthead_id;
     _qthead_id = input.qthead_id;
     xtquality.extraParams(params);

     var qry = toolbox.executeDbQuery("qtest", "detail", params);
     if (qry.first() && xtquality.errorCheck(qry))
     {
       _test.text           = qry.value("qthead_number");
       _qplan.text          = qry.value("qphead_code");
       _qplan.enabled       = false;
       _qplanid             = qry.value("qphead_id");

       _revnum.text         = qry.value("qphead_rev_number");
       _revnum.enabled      = false;
       _teststat.code       = qry.value("qthead_status");
       _testdisp.code       = qry.value("qthead_disposition");
       _reason.text         = qry.value("qtrsncode_code");
       _release.text        = qry.value("qtrlscode_code");
       _order.text          = qry.value("qthead_ordnumber");
       _lotsrl.text         = qry.value("ls_number");
       _date.startDate      = qry.value("qthead_start_date");
       _date.endDate        = qry.value("qthead_completed_date");   
       _item.setId(qry.value("qthead_item_id"));
       if (_item.isValid())
         _item.enabled        = false;

       _site.setId(qry.value("qthead_warehous_id"));
       _site.enabled        = false;
       _notes.setText(qry.value("qthead_notes"));
       _documents.setId(_qthead_id);
       _comments.setId(_qthead_id);
     }
     populate_qtitems();
     setupScreenWidgets();
     _state = true;
  }
  _order.enabled       = false;
  _lotsrl.enabled      = false;        
  _test.enabled        = false;
  
  _qplanSelect["newID(int)"].connect(handleNewQualityPlan);

}

function prepare()
{
  _qplanStack.setCurrentIndex(1);
  var _sql = "SELECT qphead_id, qphead_code||'-'||qphead_descrip, qphead_code  "
           + " FROM qphead "
           + " WHERE (qphead_rev_status = 'A') "
           + " ORDER BY qphead_code;";
  _qplanSelect.populate(_sql);
  _qplanSelect.allowNull = true;
  _teststat.code = "O";
  setupScreenWidgets();
}

function setupScreenWidgets()
{
   _testdisp.setEnabled(_teststat.code == "F"); 
   _reason.setEnabled(_teststat.code == "F");
   _release.setEnabled(_teststat.code == "F" && privileges.check("ReleaseQualityTests"));
}

function handleTestStatus()
{
  setupScreenWidgets();
}

function handleNewQualityPlan()
{
  if (!save() || !_qplanSelect.isValid())
    return;

  _qplanid = _qplanSelect.id();

  var qry = toolbox.executeQuery("DELETE FROM xt.qtitem WHERE qtitem_qthead_id=<? value('qthead_id') ?>;", {qthead_id: _qthead_id});
  xtquality.errorCheck(qry);

  var _sql = "INSERT INTO xt.qtitem (qtitem_qthead_id,qtitem_linenumber,qtitem_qpitem_id, "
           + "qtitem_description, qtitem_instruction, qtitem_type, qtitem_target, qtitem_upper , "
           + "qtitem_lower, qtitem_uom, qtitem_status) "
           + "SELECT <? value('qthead_id') ?>, "
           + "dense_rank() OVER(ORDER BY qpitem_id), "
           + " qpitem_id, qspec_descrip, qspec_instructions, qspec_type, qspec_target, qspec_upper, "
           + " qspec_lower, qspec_uom, 'O' "
           + " FROM qpitem JOIN qspec ON (qpitem_qspec_id=qspec_id) "
           + " WHERE (qpitem_qphead_id = <? value('qphead_id') ?>);";
  var qry = toolbox.executeQuery(_sql, {qthead_id: _qthead_id, qphead_id: _qplanSelect.id()});
  xtquality.errorCheck(qry);
}

function close()
{
  if (_qthead_id > 0 && !_state)
  {
    var qry = toolbox.executeQuery("DELETE FROM xt.qthead WHERE qthead_id=<? value('id') ?>;", {id: _qthead_id});
    xtquality.errorCheck(qry);
  }
  mywindow.close();
}

function save()
{
  if (_mode != "new" && !validate())
    return;

  var params = {item:      _item.id(),
                qplan:     _qplanid,
                status:    _teststat.code,
                testdisp:  _testdisp.code,
                reason:    _reason.id(),
                release:   _release.id(),
                startdate: _date.startDate,
                enddate:   _date.endDate,
                notes:     _notes.plainText,
                qthead_id: _qthead_id
               };

  if (_mode == "new")
  {
    var _sql = "INSERT INTO xt.qthead (qthead_number) SELECT fetchnextnumber('QTNumber') "
             + "RETURNING qthead_id AS id;"; 
  } else {   
    var _sql = "UPDATE xt.qthead SET "
          + "  qthead_item_id        = <? value('item') ?> "
          + ", qthead_qphead_id      = <? value('qplan') ?> "
          + ", qthead_status         = <? value('status') ?> "
          + ", qthead_disposition    = <? value('testdisp') ?> "
          + ", qthead_rsncode_id     = <? value('reason') ?> "
          + ", qthead_rlscode_id     = <? value('release') ?> "
          + ", qthead_start_date     = <? value('startdate') ?> "
          + ", qthead_completed_date = <? value('enddate') ?> "
          + ", qthead_notes          = <? value('notes') ?> "   
          + " WHERE qthead_id        = <? value('qthead_id') ?> ";
  }
  var qry = toolbox.executeQuery(_sql, params);
  if(!xtquality.errorCheck(qry))
    return false;

  if (_mode == "edit")
    mydialog.done(1);
  else
  {
    if(qry.first())
    {
      _qthead_id = qry.value("id");
      _mode = "edit";
    }
  }
  return _qthead_id;
}

function validate()
{
  if (!_item.isValid())
  {
    QMessageBox.warning(mywindow, qsTr("Missing Information"), qsTr("Please enter a valid Item to test"));
    return false;
  }
  if (_date.startDate > _date.endDate)
  {
    QMessageBox.warning(mywindow, qsTr("Invalid Date"), qsTr("Start Date cannot be later than the Completion Date"));
    return false;
  }
  if (!_qplanSelect.isValid())
  {
    QMessageBox.warning(mywindow, qsTr("Invalid Plan"), qsTr("You must select a valid Quality Plan"));
    return false;
  }

  return true;
}

function editTestStatus()
{
  var _sql = "SELECT CASE WHEN ('P' = ALL(array_agg(qtitem_status))) THEN 'P' "
           + "            WHEN ('F' = ANY(array_agg(qtitem_status))) THEN 'F' "
           + "            ELSE 'O' END AS status "
           + " FROM xt.qtitem WHERE (qtitem_qthead_id=<? value('qthead_id') ?>);";
  var qry = toolbox.executeQuery(_sql, {qthead_id: _qthead_id});
  if (xtquality.errorCheck(qry) && qry.first())
  {
    if (qry.value("status") != _teststat.code)
      _teststat.code = qry.value("status");
  }
}

_cancel.clicked.connect(close);
_save.clicked.connect(save);
_qtestItems["doubleClicked(QModelIndex)"].connect(editItem);
_openqtestitem.clicked.connect(editItem);
_teststat["newID(int)"].connect(handleTestStatus);
