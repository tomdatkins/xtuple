debugger;

var _code                 = mywindow.findChild("_code");
var _desc                 = mywindow.findChild("_desc");
var _revnum               = mywindow.findChild("_revnum");
var _revstat              = mywindow.findChild("_revstat");
var _notes                = mywindow.findChild("_notes")
var _cancel               = mywindow.findChild("_cancel");
var _save                 = mywindow.findChild("_save");
var _qspecTab             = mywindow.findChild("_qspecTab");
var _itemAssignments      = mywindow.findChild("_itemAssignments");
var _availableSpecs      = mywindow.findChild("_availableQSpecs");
var _selectedSpecs       = mywindow.findChild("_selectedQSpecs");
var _addSpec              = mywindow.findChild("_addSpec");
var _removeSpec           = mywindow.findChild("_removeSpec");
var _assignedItems        = mywindow.findChild("_assignedItems");
var _addItem              = mywindow.findChild("_addItem");
var _removeItem           = mywindow.findChild("_removeItem");

var _qphead_id             = 0;

_availableSpecs.addColumn(qsTr("Code"),        100,    Qt.AlignLeft,   true,  "code"    );
_availableSpecs.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true,  "descrip" );

_selectedSpecs.addColumn(qsTr("Code"),         100,    Qt.AlignLeft,   true,  "code"    );
_selectedSpecs.addColumn(qsTr("Description"),   -1,    Qt.AlignLeft,   true,  "descrip" );

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

     QMessageBox.warning(mywindow, '', 'populate_availspecs showing items for qphead ' + params.qphead_id);

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

     QMessageBox.warning(mywindow, '', 'populate_selectedspecs showing items for qphead ' + params.qphead_id);

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
      QMessageBox.warning(mywindow, '', 'adding spec_id ' + _availableSpecs.id() 
               + ' to qphead_id ' + _qphead_id);
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

// also need a partial save function to use for new plans when adding qpitems and qtitem
// add validation to save

function save()
{
  try {
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
           + " WHERE qphead_id = <? value('qphead_id') ?>", params);  
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
    mywindow.close();
  } 
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_addSpec.clicked.connect(add_spec);
_removeSpec.clicked.connect(remove_spec);