include("xtCore");

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
  var newdlg          = toolbox.openWindow("printer", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set({mode: "new"});
  newdlg.exec();
  
  popPrinters();
}

function sEdit()
{
  if(_printers.id() <= 0)
    return;
    
  var newdlg          = toolbox.openWindow("printer", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set({printer_id: _printers.id(), mode: "edit"});
  newdlg.exec();
  
  popPrinters();
}

function popPrinters()
{
  var qry = toolbox.executeQuery("SELECT printer_id AS id, printer_name AS name, "
          + "printer_description AS desc FROM xt.printer");
  if (xtCore.errorCheck(qry))
    _printers.populate(qry);
}  
  
function sDelete()
{
  if(_printers.id() <= 0)
    return;

  if (QMessageBox.question(mywindow, qsTr("Delete Printer?"),
    qsTr("Are you sure you want to delete the selected printer?"),
    QMessageBox.Yes, QMessageBox.No | QMessageBox.Default) == QMessageBox.No)
      return;
   
  var txt = "DELETE FROM xt.printer WHERE printer_id = <? value('printer_id') ?>";
  var qry = toolbox.executeQuery(txt, {printer_id: _printers.id()});
  if (xtCore.errorCheck(qry))
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