debugger;

include("sharedwf")

var _list   = mywindow.findChild("_list");
var _module = mywindow.findChild("_module");
var _query  = mywindow.findChild("_query");
var _new    = mywindow.findChild("_new");
var _edit   = mywindow.findChild("_edit");
var _delete = mywindow.findChild("_delete");

_list.addColumn(qsTr("Module"),        100,    Qt.AlignLeft,   true,  "module"   );
_list.addColumn(qsTr("Code"),          100,    Qt.AlignLeft,   true,  "type"   );
_list.addColumn(qsTr("Name"),           -1,    Qt.AlignLeft,   true,  "name"   );
_list.addColumn(qsTr("Description"),    -1,    Qt.AlignLeft,   false, "description"   );
_list.addColumn(qsTr("Status"),         50,    Qt.AlignLeft,   true,  "status"   );
_list.addColumn(qsTr("Workflow"),       50,    Qt.AlignLeft,   true,  "wftype"   );
_list.addColumn(qsTr("Priority"),       50,    Qt.AlignLeft,   true,  "priority"   );
_list.addColumn(qsTr("Sequence"),       50,    Qt.AlignLeft,   true,  "wfsequence"   );
_list.addColumn(qsTr("Owner"),         100,    Qt.AlignLeft,   true,  "owner"   );
_list.addColumn(qsTr("Assigned To"),   100,    Qt.AlignLeft,   true,  "assigned_to"   );

_module.append(0, "Any");
_module.append(1, "Sales");
_module.append(2, "Purchase");
_module.append(3, "Project"); 
if(isdist)
  _module.append(4, "Inventory");   
if(ismfg)
  _module.append(5, "Manufacture"); 
if(hasqual)
  _module.append(6, "Quality");

populateList();

function sNewWf()
{
  var params          = new Object;
  params.mode         = "new";
  var newdlg          = toolbox.openWindow("WorkflowItem", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  populateList();
}

function sEdit()
{
  var params          = new Object;
  params.workflow_id  = _list.id();
  params.module       = _list.currentItem().rawValue("module").toString();
  params.type         = _list.currentItem().rawValue("type").toString();
  params.mode         = "edit";

  var newdlg          = toolbox.openWindow("WorkflowItem", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  populateList();
}

function sDelete()
{
   if(QMessageBox.question(mywindow, qsTr("Delete Workflow Item"), 
    qsTr("Are you sure you want to delete the selected Workflow Item?"), 
    QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;
   try
   {      
     toolbox.executeBegin();
     var params = new Object;
     params.workflow_id = _list.id();
     // DELETE FROM wf step
     var wf = "DELETE FROM xt.wfsrc WHERE wfsrc_id = <? value('workflow_id') ?>";
     var delwf = toolbox.executeQuery(wf, params);
     if (delwf.lastError().type != QSqlError.NoError)
       throw new Error(delwf.lastError().text); 
     
     toolbox.executeCommit(); 
     populateList();
  } 
  catch(e) {
    toolbox.executeRollback();
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }

}

function sPopulateMenu(pMenu, selected)
{
  var wfitem = selected.text(1);
  var menuItem;
      menuItem = pMenu.addAction(qsTr("Open Workflow Item"));
      menuItem.triggered.connect(sEdit);
      menuItem = pMenu.addAction(qsTr("Delete Workflow Item"));
      menuItem.triggered.connect(sDelete);
}

function populateList()
{
  var params = new Object();
  if(isdist)
    params.isdist = isdist;
  if(ismfg)
    params.ismfg = ismfg;
  if(hasqual)
    params.hasqual = hasqual;
  if (_module.id() != 0)
  	params.module = _module.id();
  var qry = toolbox.executeDbQuery("WorkflowList", "detail", params);
  _list.populate(qry);
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["itemSelected(int)"].connect(sEdit);
_query.clicked.connect(populateList);
_new.clicked.connect(sNewWf);
_edit.clicked.connect(sEdit);
_delete.clicked.connect(sDelete);

