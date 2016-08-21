debugger;

var _printers = mywindow.findChild("_printers");
var _newBtn   = mywindow.findChild("_newBtn");
var _editBtn  = mywindow.findChild("_editBtn");
var _deleteBtn = mywindow.findChild("_deleteBtn");
var _close    = mywindow.findChild("_close");

_printers.addColumn(qsTr("Name"),        100,  Qt.AlignLeft,  true,  "name"  );
_printers.addColumn(qsTr("Description"),  -1,  Qt.AlignLeft,  true,  "desc"  );

popPrinters();

function sNew()
{
  var params          = new Object;
  params.mode         = "new";
  var newdlg          = toolbox.openWindow("printer", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  popPrinters();
}

function sEdit()
{
  if(_printers.id() <= 0)
    return;
    
  var params          = new Object;
  params.printer_id  = _printers.id();
  params.mode         = "edit";

  var newdlg          = toolbox.openWindow("printer", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  popPrinters();
}

function popPrinters()
{
  var sql = toolbox.executeQuery("SELECT printer_id AS id, printer_name AS name, "
          + "printer_description AS desc FROM xt.printer");
  _printers.populate(sql);  
}  
  
function sDelete()
{
  if(_printers.id() <= 0)
    return;

  if (QMessageBox.question(mywindow, qsTr("Delete Printer?"),
    qsTr("Are you sure you want to delete the selected printer?"),
    QMessageBox.Yes, QMessageBox.No | QMessageBox.Default) == QMessageBox.No)
      return;
      
  var params = new Object;
  params.printer_id = _printers.id();
  var txt = "DELETE FROM xt.printer WHERE printer_id = <? value('printer_id') ?>";
  var qry = toolbox.executeQuery(txt, params);

  if (qry.lastError().type != QSqlError.NoError)
    QMessageBox.warning(mywindow, "Database Error", qry.lastError().text);
   
  popPrinters();
}

function sPopulateMenu(pMenu, selected)
{
  var menuItem;
      menuItem = pMenu.addAction(qsTr("Open Printer"));
      menuItem.triggered.connect(sEdit);
      menuItem = pMenu.addAction(qsTr("Delete Printer"));
      menuItem.triggered.connect(sDelete);
}

_printers["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_printers["itemSelected(int)"].connect(sEdit);

_close.clicked.connect(mywindow.close);
_newBtn.clicked.connect(sNew);
_editBtn.clicked.connect(sEdit);
_deleteBtn.clicked.connect(sDelete);