debugger;

var _test                = mywindow.findChild("_test");
var _qplan               = mywindow.findChild("_qplan");
var _revnum              = mywindow.findChild("_revnum");
var _teststat          = mywindow.findChild("_testStatus");
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
var _startDate           = mywindow.findChild("_startDate");
var _endDate             = mywindow.findChild("_endDate");
var _qtestItems          = mywindow.findChild("_qtestItems");
var _openqtestitem       = mywindow.findChild("_openqtestitem");
var _workflow            = mywindow.findChild("_workflow");

var _qthead_id             = 0;

_qtestItems.addColumn(qsTr("Test #"),      100,  Qt.AlignLeft,   true,  "qtnumber" );
_qtestItems.addColumn(qsTr("Description"),  -1,  Qt.AlignLeft,   true,  "descrip" );
_qtestItems.addColumn(qsTr("Status"),      100,  Qt.AlignLeft,   true,  "status" );

populate_teststat();
populate_testdisp();
populate_reason();
populate_release();

function populate_teststat()
{
  try {
      var qrytxt = "SELECT 1 AS id, 'Open' AS code "
          + " UNION SELECT 2 AS id, 'Pass' AS code "
          + " UNION SELECT 3 AS id, 'Fail' AS code "
          + " ORDER BY id"
      var qry = toolbox.executeQuery(qrytxt);
      _teststat.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_testdisp()
{
  try {
      var qrytxt = "SELECT 0 AS id, 'None' AS code "
          + " UNION SELECT 1 AS id, 'Quarantine' AS code "
          + " ORDER BY id"
      var qry = toolbox.executeQuery(qrytxt);
      _testdisp.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_reason()
{
  try {
      var qrytxt = "SELECT 0 AS id, 'None' AS code, '' AS descrip "
           + "UNION SELECT qtrsncode_id AS id, qtrsncode_code AS code, "
                        + "qtrsncode_descrip AS descrip "
                 + "FROM xt.qtrsncode ORDER BY id"
      var qry = toolbox.executeQuery(qrytxt);
      _reason.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_release()
{
  try {
      var qrytxt = "SELECT 0 AS id, 'None' AS code, '' AS descrip "
           + "UNION SELECT qtrlscode_id AS id, qtrlscode_code AS code, "
                        + "qtrlscode_descrip AS descrip "
                 + "FROM xt.qtrlscode ORDER BY id"
      var qry = toolbox.executeQuery(qrytxt);
      _release.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_qtitems()
{
   try {
      var params = new Object();
      params.qthead_id = _qthead_id;
      var qry = toolbox.executeDbQuery("qtitem", "detail", params);
      _qtestItems.populate(qry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function editItem()
{
  var params          = new Object;
  if(_qtestItems.id() <= 0)
    return;
  params.qtitem_id = _qtestItems.id();
  var newdlg          = toolbox.openWindow("qtitem", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  populate_qtitems();
}

function set(input)
{  
  try 
  {
    var params = new Object();
 
    if("qthead_id" in input) 
    {
       params.qthead_id = input.qthead_id;
       _qthead_id = input.qthead_id;
       populate_qtitems();
       var qry = toolbox.executeDbQuery("qtest", "detail", params);
       if (qry.first())
       {
         _test.text           = qry.value("qthead_number");
         _test.enabled        = false;
         _qplan.text          = qry.value("qphead_code");
         _qplan.enabled       = false;
         _revnum.text         = qry.value("qphead_rev_number");
         _revnum.enabled      = false;
         _teststat.text       = qry.value("status");
         _testdisp.text       = qry.value("qthead_disposition");
         _reason.text         = qry.value("qtrsncode_code");
         _release.text        = qry.value("qtrlscode_code");
         _order.text          = qry.value("qthead_ordnumber");
         _order.enabled       = false;
         _lotsrl.text         = qry.value("ls_number");
         _lotsrl.enabled      = false;
         _startDate.date      = qry.value("qthead_start_date");
         _endDate.date        = qry.value("qthead_completed_date");
         _item.setId(qry.value("qthead_item_id"));
         _item.enabled        = false;
         _site.setId(qry.value("qthead_warehous_id"));
         _site.enabled        = false;
         _notes.setText(qry.value("qthead_notes"));
       }
       else if (qry.lastError().type != QSqlError.NoError) 
        throw new Error(qry.lastError().text);
    }  
  }
  catch(e) 
  {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

function save()
{  
  try 
  {
    var params = new Object();
       
    params.status       = _teststat.text;
    params.testdisp     = _testdisp.text;
    params.reason       = _reason.id();
    params.release      = _release.id();
    params.startdate    = _startDate.date;
    params.enddate      = _endDate.date;
    params.notes        = _notes.plainText;
    
    params.qthead_id = _qthead_id;
    QMessageBox.warning(mywindow, '', "saving for reasoncode_id " + params.reason);
    
    var qry = toolbox.executeQuery("UPDATE xt.qthead SET "
           + "  qthead_status = CASE "
           + "    WHEN <? value('status') ?> = 'Open' THEN 'O' "
           + "    WHEN <? value('status') ?> = 'Pass' THEN 'P' "  
           + "    WHEN <? value('status') ?> = 'Fail' THEN 'F' "
           + "  ELSE <? value('status') ?> END "
           + ", qthead_disposition    = <? value('testdisp') ?> "
           + ", qthead_rsncode_id     = <? value('reason') ?> "
           + ", qthead_rlscode_id     = <? value('release') ?> "
           + ", qthead_start_date     = <? value('startdate') ?> "
           + ", qthead_completed_date = <? value('enddate') ?> "
           + ", qthead_notes          = <? value('notes') ?> "   
           + " WHERE qthead_id = <? value('qthead_id') ?> "
           + " RETURNING qthead_id ", params);  
    if (qry.lastError().type != QSqlError.NoError)
        throw new Error(qry.lastError().text);

    mywindow.close();
  } 
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_qtestItems["itemSelected(int)"].connect(editItem);
_openqtestitem.clicked.connect(editItem);