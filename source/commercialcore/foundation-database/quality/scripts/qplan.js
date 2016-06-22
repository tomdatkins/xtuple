debugger;

var _code                = mywindow.findChild("_code");
var _desc                = mywindow.findChild("_desc");
var _revnum              = mywindow.findChild("_revnum");
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

_documents.setType("QPLAN");
_comments.setType("QPLAN");

var _qphead_id             = 0;

_availableSpecs.addColumn(qsTr("Code"),        100,    Qt.AlignLeft,   true,  "code"    );
_availableSpecs.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true,  "descrip" );

_selectedSpecs.addColumn(qsTr("Code"),         100,    Qt.AlignLeft,   true,  "code"    );
_selectedSpecs.addColumn(qsTr("Description"),   -1,    Qt.AlignLeft,   true,  "descrip" );

_assignedItems.addColumn(qsTr("Item Number"),  100,    Qt.AlignLeft,   true,  "item_number"    );
_assignedItems.addColumn(qsTr("Site"),          -1,    Qt.AlignLeft,   true,  "site" );

populate_revstat();

function populate_revstat()
{
  try {
      var qrytxt = "SELECT 0 AS id, '' AS code "
          + " UNION SELECT 1 AS id, 'Pending' AS code "
          + " UNION SELECT 2 AS id, 'Active' AS code "
          + " UNION SELECT 3 AS id, 'Inactive' AS code "
          + " ORDER BY id"
      var qry = toolbox.executeQuery(qrytxt);
      _revstat.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_availspecs()
{
  try { 
     var params = new Object();
     params.qphead_id = _qphead_id;
     var qrytxt = " SELECT qspec_id, qspec_code AS code, qspec_descrip AS descrip "
                + " FROM xt.qspec "
                + " WHERE qspec_id NOT IN ( "
                + "   SELECT qspec_id FROM xt.qpitem "
                + "   JOIN xt.qspec ON qspec_id = qpitem_qspec_id "
                + "   JOIN xt.qphead ON qphead_id = qpitem_qphead_id "
                + "   WHERE qphead_id = <? value('qphead_id') ?>) "
     var qry = toolbox.executeQuery(qrytxt, params);
     _availableSpecs.populate(qry);
  } catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

function populate_selectedspecs()
{
  try {
     var params = new Object();
     params.qphead_id = _qphead_id;
     var qrytxt = " SELECT qspec_id, qspec_code AS code, qspec_descrip AS descrip "
                + " FROM xt.qpitem "
                + " JOIN xt.qphead ON qphead_id = qpitem_qphead_id "
                + " JOIN xt.qspec ON qspec_id = qpitem_qspec_id "
                + " WHERE qphead_id = <? value('qphead_id') ?> " 
     var qry = toolbox.executeQuery(qrytxt, params);
     _selectedSpecs.populate(qry);
  } catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
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
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
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
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
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
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
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
  newdlg.exec();
  populate_assigneditems();
}

function editItem()
{
  var params          = new Object;
  params.qpheadass_id = _assignedItems.id();
  params.mode         = "edit";
  var newdlg          = toolbox.openWindow("qplanass", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  populate_assigneditems();
}

function removeItem()
{
   if(QMessageBox.question(mywindow, qsTr("WARNING"), 
    qsTr("Are you sure you want to remove this item association?"), 
    QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;
   try
   {      
     var params = new Object;
     params.qpheadass_id = _assignedItems.id();
     // DELETE FROM qpheadass
     var qrytxt = "DELETE FROM xt.qpheadass WHERE qpheadass_id = <? value('qpheadass_id') ?>";
     var qry = toolbox.executeQuery(qrytxt, params);
     if (qry.lastError().type != QSqlError.NoError)
       throw new Error(qry.lastError().text);  
     populate_assigneditems();
  } 
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " 
                         + e.lineNumber + ": " + e);
  }
}

function set(input)
{  
  try 
  {
    var params = new Object();
 
    if("qphead_id" in input) 
    {
       params.qphead_id = input.qphead_id;
       _qphead_id = input.qphead_id;
    
       var qry = toolbox.executeDbQuery("qplan", "detail", params);
       if (qry.first())
       {
         _code.text            = qry.value("code");
         _desc.text            = qry.value("desc");
         _revnum.text          = qry.value("revnum");
         _revstat.text         = qry.value("revstat");
         _notes.setText(qry.value("qphead_notes"));
         _documents.setId(_qphead_id);
         _comments.setId(_qphead_id);
       }
       else if (qry.lastError().type != QSqlError.NoError) 
        throw new Error(qry.lastError().text);
    }  
    populate_availspecs();
    populate_selectedspecs();
    populate_assigneditems();
  }
  catch(e) 
  {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

function validate()
{
  if(_code.text == '' ||
     _revnum.text == '' ||
     _revstat.id() <= 0 )
  {
     QMessageBox.warning(mywindow, "Data Missing", "Please fill in all required fields [Code, Revision 3, Revision Status].");
     return false;
  }
  else
  {
     return true;       
  }
}

function save()
{
   presave();
   if(_qphead_id > 0)
     mywindow.close();
}

function presave()
{
  try {
    if (!validate()) {
      return;
    }
    
    var params = new Object();
       
    params.code         = _code.text;
    params.desc         = _desc.text;
    params.revnum       = _revnum.text;
    params.revstat      = _revstat.text;
    params.notes        = _notes.plainText;
    
    if (_qphead_id > 0)
    {
      params.qphead_id = _qphead_id;
      var qry = toolbox.executeQuery("UPDATE xt.qphead SET "
           + "  qphead_code            = <? value('code') ?> "
           + ", qphead_descrip         = <? value('desc') ?> "
           + ", qphead_rev_number      = <? value('revnum') ?> "
           + ", qphead_rev_status = CASE "
           + "    WHEN <? value('revstat') ?> = 'Active' THEN 'A' "
           + "    WHEN <? value('revstat') ?> = 'Inative' THEN 'I' "  
           + "    WHEN <? value('revstat') ?> = 'Pending' THEN 'P' "
           + "  ELSE <? value('revstat') ?> END "
           + ", qphead_rev_date = CASE "
           + "   WHEN <? value('revnum') ?> <> qphead_rev_number "
           + "    THEN current_date END  "
           + ", qphead_notes          = <? value('notes') ?> "   
           + " WHERE qphead_id = <? value('qphead_id') ?> "
           + " RETURNING qphead_id ", params);  
      if (qry.lastError().type != QSqlError.NoError)
        throw new Error(qry.lastError().text);
    }
    else 
    {
      var qry = toolbox.executeQuery("INSERT INTO xt.qphead ("
           + "    qphead_code, qphead_descrip, qphead_rev_number, "
           + "    qphead_rev_status, qphead_rev_date, qphead_notes ) "
           + " VALUES (<? value('code') ?> "
           + ",   <? value('desc') ?> "
           + ",   <? value('revnum') ?> "
           + ",   CASE "
           + "       WHEN <? value('revstat') ?> = 'Active' THEN 'A' "
           + "       WHEN <? value('revstat') ?> = 'Inactive' THEN 'I' "  
           + "       WHEN <? value('revstat') ?> = 'Pending' THEN 'P' "
           + "    ELSE <? value('revstat') ?> END "
           + ",   current_date "
           + ",   <? value('notes') ?> "
           + " ) RETURNING qphead_id", params);  
        if (qry.lastError().type != QSqlError.NoError)
          throw new Error(qry.lastError().text);
        
    }
    if(qry.first())
      _qphead_id = qry.value('qphead_id');
    return _qphead_id;
  } 
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_addSpec.clicked.connect(add_spec);
_removeSpec.clicked.connect(remove_spec);
_addItem.clicked.connect(addItem);
_editItem.clicked.connect(editItem);
_removeItem.clicked.connect(removeItem);
_assignedItems["itemSelected(int)"].connect(editItem);