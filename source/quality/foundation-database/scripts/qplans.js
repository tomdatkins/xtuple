debugger;

// Specifiy which query to use
mywindow.setMetaSQLOptions('qplan','detail');
 
// Make the search visible
mywindow.setSearchVisible(true);

// Set automatic query on start
mywindow.setQueryOnStartEnabled(true);

// Window title
mywindow.setWindowTitle(qsTr("Quality Plans"));

// Set the Report
mywindow.setReportName("");

var _list   = mywindow.findChild("_list");
var _new    = mywindow.findChild("_new");
var _edit   = mywindow.findChild("_edit");
var _delete = mywindow.findChild("_delete");

_list.addColumn(qsTr("Code"),        100,    Qt.AlignLeft,   true,  "code"   );
_list.addColumn(qsTr("Revision #"),  50,    Qt.AlignLeft,   true, "revnum"   );
_list.addColumn(qsTr("Revision Status"),   100,    Qt.AlignLeft,   true,  "revstat"   );
_list.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true,  "desc"   );

// Add filter criteria
// This says we want to use the parameter widget to filter results
mywindow.setParameterWidgetVisible(true);
mywindow.setNewVisible(true);
var _newAction = mywindow.newAction();

// Parameters
  // TODO add some params

// Functions
function sNew()
{
  var params          = new Object;
  params.mode         = "new";
  var newdlg          = toolbox.openWindow("qplan", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  mywindow.sFillList();
}

function sEdit()
{
  var params          = new Object;
  params.qphead_id    = _list.id();
  params.mode         = "edit";
  var newdlg          = toolbox.openWindow("qplan", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  mywindow.sFillList();
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
     mywindow.sFillList();
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
      menuItem = pMenu.addAction(qsTr("Open Quality Plan"));
      menuItem.triggered.connect(sEdit);
      menuItem = pMenu.addAction(qsTr("Delete Quality Plan"));
      menuItem.triggered.connect(sDelete);
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["itemSelected(int)"].connect(sEdit);
_newAction.triggered.connect(sNew);