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

var _code                = mywindow.findChild("_code");
var _desc                = mywindow.findChild("_desc");
var _revnum              = mywindow.findChild("_revnum");
var _revDate             = mywindow.findChild("_revDate");
var _revstat             = mywindow.findChild("_revstat");
var _notes               = mywindow.findChild("_notes")
var _cancel              = mywindow.findChild("_cancel");
var _save                = mywindow.findChild("_save");
var _qspecTab            = mywindow.findChild("_qspecTab");
var _itemAssignments     = mywindow.findChild("_itemAssignments");
var _availableSpecs      = mywindow.findChild("_availableQSpecs");
var _selectedSpecs       = mywindow.findChild("_selectedQSpecs");
var _addSpec             = mywindow.findChild("_addSpec");
var _removeSpec          = mywindow.findChild("_removeSpec");
var _assignedItems       = mywindow.findChild("_assignedItems");
var _itemCluster         = mywindow.findChild("_itemCluster");
var _addItem             = mywindow.findChild("_addItem");
var _editItem            = mywindow.findChild("_editItem");
var _removeItem          = mywindow.findChild("_removeItem");
var _comments            = mywindow.findChild("_comments");
var _documents           = mywindow.findChild("_documents");
var _tabs                = mywindow.findChild("_tabs");

_documents.setType("QPLAN");
_comments.setType("QPLAN");

var _qphead_id  = 0;
var _rev = "";

_availableSpecs.addColumn(qsTr("Code"),        100,    Qt.AlignLeft,   true,  "code"    );
_availableSpecs.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true,  "descrip" );

_selectedSpecs.addColumn(qsTr("Code"),         100,    Qt.AlignLeft,   true,  "code"    );
_selectedSpecs.addColumn(qsTr("Description"),   -1,    Qt.AlignLeft,   true,  "descrip" );

_assignedItems.addColumn(qsTr("Item Number"),  100,    Qt.AlignLeft,   true,  "item_number"    );
_assignedItems.addColumn(qsTr("Site"),          -1,    Qt.AlignLeft,   true,  "site" );
_assignedItems.addColumn(qsTr("Sampling"),      -1,    Qt.AlignLeft,   true,  "freqtype" );

_revstat.append(1, 'Pending', 'P');
_revstat.append(2, 'Active',  'A');
_revstat.append(3, 'Inactive','I');

function populate_availspecs()
{
   var qrytxt = " SELECT qspec_id, qspec_code AS code, qspec_descrip AS descrip "
              + " FROM xt.qspec    "
              + " WHERE qspec_active "
              + "  AND (qspec_id NOT IN (SELECT qpitem_qspec_id FROM xt.qpitem WHERE qpitem_qphead_id = <? value('qphead_id') ?>)); ";
   var qry = toolbox.executeQuery(qrytxt, {qphead_id: _qphead_id});
   if (xtquality.errorCheck(qry))
     _availableSpecs.populate(qry);
}

function populate_selectedspecs()
{
   var qrytxt = " SELECT qspec_id, qspec_code AS code, qspec_descrip AS descrip "
              + " FROM xt.qpitem "
              + " JOIN xt.qspec ON qspec_id = qpitem_qspec_id "
              + " WHERE qpitem_qphead_id = <? value('qphead_id') ?> " 
   var qry = toolbox.executeQuery(qrytxt, {qphead_id: _qphead_id});
   if (xtquality.errorCheck(qry))
     _selectedSpecs.populate(qry);
}

function add_spec()
{
   try {
      _qphead_id = presave();
      var params = new Object();
      params.sourceid = _availableSpecs.id();
      params.qphead_id = _qphead_id;

      var qry = toolbox.executeQuery("INSERT INTO xt.qpitem "
              + " ( qpitem_qphead_id, qpitem_qspec_id )"
              + " VALUES (<? value('qphead_id') ?>, <? value('sourceid') ?>) ", params);

      populate_availspecs();
      populate_selectedspecs();
   } 
   catch(e) {
       QMessageBox.critical(mywindow, qsTr("Critical Error"), "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function remove_spec()
{
   try {
      var params = new Object();
      params.sourceid = _selectedSpecs.id();
      params.qphead_id = _qphead_id;

      var qry = toolbox.executeQuery("DELETE FROM xt.qpitem "
              + " WHERE qpitem_qphead_id = <? value('qphead_id') ?> "
              + " AND   qpitem_qspec_id = <? value('sourceid') ?> ", params);
      populate_availspecs();
      populate_selectedspecs();
   } 
   catch(e) {
       QMessageBox.critical(mywindow, qsTr("Critical Error"), "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_assigneditems()
{
  try {
     var params = new Object();
     params.qphead_id = _qphead_id;
     var qry = toolbox.executeDbQuery("qpheadass", "detail", params);
     _assignedItems.populate(qry);
  } 
  catch(e) {
    QMessageBox.critical(mywindow, qsTr("Critical Error"), "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

function addItem()
{
  _qphead_id = presave();

  var params          = new Object;
  params.qphead_id    = _qphead_id;
  params.mode         = "new";
  var newdlg          = toolbox.openWindow("qplanass", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  if (newdlg.exec() == QDialog.Accepted) 
    populate_assigneditems();
}

function editItem()
{
  if (_assignedItems.id() < 1)
  {
    QMessageBox.information(mywindow,qsTr("Selection"), qsTr("Please select an item first"));  
    return;
  }

  var params          = new Object;
  params.qphead_id    = _qphead_id;
  params.qpheadass_id = _assignedItems.id();
  params.mode         = "edit";
  var newdlg          = toolbox.openWindow("qplanass", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  if (newdlg.exec() == QDialog.Accepted) 
    populate_assigneditems();
}

function removeItem()
{
  if (_assignedItems.id() < 1)
  {
    QMessageBox.information(mywindow,qsTr("Selection"), qsTr("Please select an item first"));  
    return;
  }

  if(QMessageBox.question(mywindow, qsTr("WARNING"), 
    qsTr("Are you sure you want to remove this item association?"), 
    QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;
   // DELETE FROM qpheadass
   var qrytxt = "DELETE FROM xt.qpheadass WHERE qpheadass_id = <? value('qpheadass_id') ?>";
   var qry = toolbox.executeQuery(qrytxt, {qpheadass_id: _assignedItems.id()});
   if (xtquality.errorCheck(qry))
     populate_assigneditems();
}

function set(input)
{  
  var params = new Object();
 
  if("qphead_id" in input) 
  {
     params.qphead_id = input.qphead_id;
     _qphead_id = input.qphead_id;
    
     var qry = toolbox.executeDbQuery("qplan", "detail", params);
     xtquality.errorCheck(qry);
     if (qry.first())
     {
       _code.text            = qry.value("code");
       _desc.text            = qry.value("desc");
       _revnum.text          = qry.value("revnum");
       _rev                  = qry.value("revnum");
       _revstat.code         = qry.value("qphead_rev_status");
       _revDate.setDate(qry.value("qphead_rev_date"));
       _notes.setText(qry.value("qphead_notes"));
       _documents.setId(_qphead_id);
       _comments.setId(_qphead_id);

       _revDate.setEnabled(false);
       _revnum.setEnabled(_revstat.code != "I");
       _revstat.setEnabled(_revstat.code != "I");
       _code.setEnabled(_revstat.code != "I");
       _desc.setEnabled(_revstat.code != "I");
       _tabs.setEnabled(_revstat.code != "I");
     }
  }  
  populate_availspecs();
  populate_selectedspecs();
  populate_assigneditems();
}

function validate()
{
  if(_code.text == '' ||
     _revnum.text == '' ||
     !_revstat.isValid() )
  {
     QMessageBox.warning(mywindow, qsTr("Data Missing"), qsTr("Please fill in all required fields [Code, Revision #, Revision Status]."));
     return false;
  }

  return true;       
}

function save()
{
   if (presave())
     mywindow.close();
}

function presave()
{
  if (!validate())
    return false;
    
  var params = new Object();      
  params.code         = _code.text;
  params.desc         = _desc.text;
  params.revnum       = _revnum.text;
  params.revstat      = _revstat.code;
  params.notes        = _notes.plainText;
    
  if (_qphead_id > 0)
  {
    params.qphead_id = _qphead_id;
    var _sql = "UPDATE xt.qphead SET "
           + "  qphead_code            = <? value('code') ?> "
           + ", qphead_descrip         = <? value('desc') ?> "
           + ", qphead_rev_number      = <? value('revnum') ?> "
           + ", qphead_rev_status      = <? value('revstat') ?> "
           + ", qphead_rev_date = CASE "
           + "   WHEN <? value('revnum') ?> <> qphead_rev_number "
           + "    THEN current_date END  "
           + ", qphead_notes          = <? value('notes') ?> "   
           + " WHERE qphead_id = <? value('qphead_id') ?> "
           + " RETURNING qphead_id ";
  }
    else 
  {
    var _sql = "INSERT INTO xt.qphead ("
           + "    qphead_code, qphead_descrip, qphead_rev_number, "
           + "    qphead_rev_status, qphead_rev_date, qphead_notes ) "
           + " VALUES (<? value('code') ?> "
           + ",   <? value('desc') ?> "
           + ",   <? value('revnum') ?> "
           + ",   <? value('revstat') ?> "
           + ",   current_date "
           + ",   <? value('notes') ?> "
           + " ) RETURNING qphead_id";
  }
  var qry = toolbox.executeQuery(_sql, params);
  xtquality.errorCheck(qry);        
  if(qry.first())
    _qphead_id = qry.value('qphead_id');

  return _qphead_id;
}

function setButtons()
{
  _editItem.setEnabled(_assignedItems.id() > 0);
  _removeItem.setEnabled(_assignedItems.id() > 0);
}

function updateRevision()
{
  if (_qphead_id <= 0 )
    return;

  var _newrev = _revnum.text;
  if (_newrev != _rev)
  {
    if(QMessageBox.question(mywindow, qsTr("Revision Update"), 
       qsTr("New Revision number entered.  Do you want to make this version the active plan?"),
       QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
    {
      _revnum.text = _rev;
     return;
    }
    else
    {
    // Save existing version as Inactive, and create a new Active copy of the plan
      var qry = toolbox.executeQuery("SELECT xt.createqualityplanrevision(<? value('plan') ?>, <? value('revision') ?>) AS ret;",
                         {plan: _qphead_id, revision: _newrev});
      if (xtquality.errorCheck(qry) && qry.first())
      {
        _qphead_id = qry.value("ret");
        _revstat.code = "A";
        _revDate.setDate(new Date);
      }
      else
      {
        _revnum.text = _rev;
      }
    }
  }
  else
    return;  // nothing changed
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_addSpec.clicked.connect(add_spec);
_removeSpec.clicked.connect(remove_spec);
_addItem.clicked.connect(addItem);
_editItem.clicked.connect(editItem);
_removeItem.clicked.connect(removeItem);
_assignedItems.clicked.connect(setButtons);
_revnum["editingFinished()"].connect(updateRevision);
_assignedItems["doubleClicked(QModelIndex)"].connect(editItem);
_availableSpecs["doubleClicked(QModelIndex)"].connect(add_spec);
_selectedSpecs["doubleClicked(QModelIndex)"].connect(remove_spec);