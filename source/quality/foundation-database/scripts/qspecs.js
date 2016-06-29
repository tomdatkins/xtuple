debugger;

var _list   = mywindow.findChild("_list");
var _new    = mywindow.findChild("_new");
var _edit   = mywindow.findChild("_edit");
var _delete = mywindow.findChild("_delete");

_list.addColumn(qsTr("Code"),        100,    Qt.AlignLeft,   true,  "qspec_code"   );
_list.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true, "qspec_descrip"   );
_list.addColumn(qsTr("Spec Type"),   100,    Qt.AlignLeft,   true,  "qspectype_code"   );
_list.addColumn(qsTr("Test Type"),   100,    Qt.AlignLeft,   true,  "testtype"   );
_list.addColumn(qsTr("Target"),       50,    Qt.AlignLeft,   true,  "qspec_target"   );
_list.addColumn(qsTr("Upper Limit"),  50,    Qt.AlignLeft,   true,  "qspec_upper"   );
_list.addColumn(qsTr("Lower Limit"),  50,    Qt.AlignLeft,   true,  "qspec_lower"   );
_list.addColumn(qsTr("UoM"),          50,    Qt.AlignLeft,   true,  "qspec_uom"   );
_list.addColumn(qsTr("Equipment"),   100,    Qt.AlignLeft,   true,  "qspec_equipment" );

populateList();

function sNew()
{
  var params          = new Object;
  params.mode         = "new";
  var newdlg          = toolbox.openWindow("qspec", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  populateList();
}

function sEdit()
{
  var params          = new Object;
  params.qspec_id  = _list.id();
  params.mode         = "edit";
  var newdlg          = toolbox.openWindow("qspec", 0,
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
     //TODO: add begin and commit to remove from qpitem and qtitem tables
     var params = new Object;
     params.qspec_id = _list.id();

     // Wrap the transaction
     toolbox.executeBegin();
     // DELETE FROM qtitem
     var qrytxt = "DELETE FROM xt.qtitem WHERE qtitem_qpitem_id = "
                + "(SELECT qpitem_id FROM qpitem "
                + " WHERE qpitem_qspec_id = <? value('qspec_id') ?>)";
     var qry = toolbox.executeQuery(qry, params);
     if (qry.lastError().type != QSqlError.NoError)
       throw new Error(qry.lastError().text);  
     // DELETE FROM qpitem
     var qrytxt = "DELETE FROM xt.qpitem WHERE qpitem_qspec_id = "
                + "<? value('qspec_id') ?>";
     var qry = toolbox.executeQuery(qrytxt, params);
     if (qry.lastError().type != QSqlError.NoError)
       throw new Error(qry.lastError().text);  
     // DELETE FROM qspec
     var qrytxt = "DELETE FROM xt.qspec WHERE qspec_id = <? value('qspec_id') ?>";
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
      menuItem = pMenu.addAction(qsTr("Open Quality Specification"));
      menuItem.triggered.connect(sEdit);
      menuItem = pMenu.addAction(qsTr("Delete Quality Specification"));
      menuItem.triggered.connect(sDelete);
}

function populateList()
{
  var qry = toolbox.executeDbQuery("qspec", "detail");
  _list.populate(qry);
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["itemSelected(int)"].connect(sEdit);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_delete.clicked.connect(sDelete);
