debugger;

var _list   = mywindow.findChild("_list");
var _new    = mywindow.findChild("_new");
var _edit   = mywindow.findChild("_edit");
var _delete = mywindow.findChild("_delete");

_list.addColumn(qsTr("Test Number"),      75,  Qt.AlignLeft,  true,  "qthead_number" );
_list.addColumn(qsTr("Start Date"),       75,  Qt.AlignLeft,  true,  "qthead_start_date" );
_list.addColumn(qsTr("Order Type"),       50,  Qt.AlignLeft,  true,  "qthead_ordtype" );
_list.addColumn(qsTr("Order #"),          75,  Qt.AlignLeft,  true,  "qthead_ordnumber" );
_list.addColumn(qsTr("Completion Date"),  75,  Qt.AlignLeft,  true,  "qthead_completed_date"   );
_list.addColumn(qsTr("Test Status"),      50,  Qt.AlignLeft,  true,  "status"   );
_list.addColumn(qsTr("Quality Plan"),    100,  Qt.AlignLeft,  true,  "qphead_code"   );
_list.addColumn(qsTr("Item #"),           -1,  Qt.AlignLeft,  true,  "item_number"   );

populateList();

function sNew()
{
  var params          = new Object;
  params.mode         = "new";
  var newdlg          = toolbox.openWindow("qtest", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  populateList();
}

function sEdit()
{
  var params          = new Object;
  params.qthead_id    = _list.id();
  params.mode         = "edit";
  var newdlg          = toolbox.openWindow("qtest", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  populateList();
}

function sDelete()
{
   if(QMessageBox.question(mywindow, qsTr("WARNING"), 
    qsTr("Deleting this Quality Specification will delete any associated Quality Plan Items and Quality Test items. Do you wish to continue?"), 
    QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;
   try
   {      
     var params = new Object;
     params.qphead_id = _list.id();
     // Wrap the transaction
     toolbox.executeBegin();
     // DELETE FROM qtitem
     var qrytxt = "DELETE FROM xt.qtitem WHERE qtitem_qpitem_id IN "
                + "(SELECT qpitem_id FROM xt.qpitem "
                + " WHERE qpitem_qphead_id = <? value('qphead_id') ?>)";
     var qry = toolbox.executeQuery(qry, params);
     if (qry.lastError().type != QSqlError.NoError)
       throw new Error(qry.lastError().text);  
     // DELETE FROM qpitem
     var qrytxt = "DELETE FROM xt.qpitem WHERE qpitem_qphead_id = "
                + "<? value('qphead_id') ?>";
     var qry = toolbox.executeQuery(qrytxt, params);
     if (qry.lastError().type != QSqlError.NoError)
       throw new Error(qry.lastError().text);  
     // DELETE FROM qspec
     var qrytxt = "DELETE FROM xt.qphead WHERE qphead_id = <? value('qphead_id') ?>";
     var qry = toolbox.executeQuery(qrytxt, params);
     if (qry.lastError().type != QSqlError.NoError)
       throw new Error(qry.lastError().text);   
     // COMMIT the transaction
     toolbox.executeCommit(); 
     populateList();
  } 
  catch(e) {
    // If failed, ROLLBACK the transaction
    toolbox.executeRollback();
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " 
                         + e.lineNumber + ": " + e);
  }
}

function sPopulateMenu(pMenu, selected)
{
  var item = selected.text(1);
  var menuItem;
      menuItem = pMenu.addAction(qsTr("Open Quality Test"));
      menuItem.triggered.connect(sEdit);
      menuItem = pMenu.addAction(qsTr("Delete Quality Test"));
      menuItem.triggered.connect(sDelete);
}

function populateList()
{
  var qry = toolbox.executeDbQuery("qtest", "detail");
  _list.populate(qry);
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["itemSelected(int)"].connect(sEdit);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_delete.clicked.connect(sDelete);

