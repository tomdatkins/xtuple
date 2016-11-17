/*
 * This file is part of the Commercial Core Package for xTuple ERP, and is
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
 
//debugger;

include("sharedwf")

var _list = mywindow.list();
var _previewAct = mywindow.previewAction();
var _printAct = mywindow.printAction();
var _queryAct = mywindow.queryAction();

mywindow.setWindowTitle(qsTr("Workflow Activities"));
mywindow.setListLabel(qsTr("Workflow Activities"));
mywindow.setReportName("WorkflowActivities");
mywindow.setMetaSQLOptions("WorkflowActivities", "detail");

with (_list)
{ 
  addColumn(qsTr("Module"), 100, Qt.AlignLeft, true, "module");
  addColumn(qsTr("Order #"), 100, Qt.AlignLeft, true, "order_number");
  addColumn(qsTr("Type"), 50, Qt.AlignLeft, true, "type");
  addColumn(qsTr("Owner"), 100, Qt.AlignLeft, true, "owner");
  addColumn(qsTr("Assigned To"), 100, Qt.AlignLeft, true, "assigned_to");
  addColumn(qsTr("Action"), 50, Qt.AlignLeft, true, "wftype");
  addColumn(qsTr("Name"), 150, Qt.AlignLeft, true, "name");
  addColumn(qsTr("Description"), -1, Qt.AlignLeft, true, "description");
  addColumn(qsTr("Status"), 100, Qt.AlignLeft, true, "status");
  addColumn(qsTr("Priority"), 100, Qt.AlignLeft, true, "priority");
  addColumn(qsTr("Start"), 100, Qt.AlignLeft, true, "wf_start_date");
  addColumn(qsTr("Due"), 100, Qt.AlignLeft, true, "wf_due_date");
  addColumn(qsTr("Assigned"), 100, Qt.AlignLeft, true, "wf_assigned_date");
  addColumn(qsTr("Completed"), 100, Qt.AlignLeft, true, "wf_completed_date");    
}

var listparams = new Object;
if(isdist)
  listparams.isdist = isdist;
if(ismfg)
  listparams.ismfg = ismfg;
if(hasqual)
  listparams.hasqual = hasqual;

mywindow.setParameterWidgetVisible(true);

mywindow.parameterWidget().appendComboBox(qsTr("Module"), "module", 
             " SELECT * FROM ( SELECT 1 AS id, 'Sales' AS module "
           + " UNION SELECT 2 AS id, 'Purchase' AS module "
           + " UNION SELECT 3 AS id, 'Project' AS module "
           + " UNION SELECT 4 AS id, 'Inventory' AS module "
           + " UNION SELECT 5 AS id, 'Manufacture' AS module "
           + " UNION SELECT 6 AS id, 'Quality' AS module ) as qry "
           + " ORDER BY id", null, true); 

mywindow.parameterWidget().appendComboBox(qsTr("Status"), "status", 
             " SELECT * FROM (SELECT 1 AS id, 'Pending' AS status "
           + " UNION SELECT 2 AS id, 'In-Process' AS status "
           + " UNION SELECT 3 AS id, 'Completed' AS status "
           + " UNION SELECT 4 AS id, 'Deferred' AS status ) as qry "
           + " ORDER BY id");     
 
mywindow.parameterWidget().append(qsTr("Assigned To"), "assigned_to", ParameterWidget.Multiselect, null, false,
			 " SELECT usesysid, usename FROM pg_user "
           + " JOIN usrpref ON usename = usrpref_username "
           + " WHERE usrpref_name = 'active' "
           + " AND usrpref_value = 't' "
           + " ORDER BY usename" );
           
mywindow.parameterWidget().append(qsTr("Owner"), "owner", ParameterWidget.User);
mywindow.parameterWidget().append(qsTr("Show Completed"), "show_completed", ParameterWidget.Exists);

betterlist();

function sAssignUser()
{
  var params = new Object;
  params.wfid = _list.id();
  params.user = mainwindow.username();  

  if(_list.currentItem() && (params.user != _list.currentItem().text('assigned_to')))
  {
    var ret = QMessageBox.warning(mywindow, qsTr("Update Assigned To"),
                                 qsTr("Do you want to assign this Activity to yourself?"),
                                 QMessageBox.Yes| QMessageBox.No,
                                 QMessageBox.Yes);
    if(ret == QMessageBox.Yes)
    {
      var qry = toolbox.executeQuery("UPDATE xt.wf SET wf_assigned_username = <? value('user') ?> "
                                + " WHERE wf_id = <? value('wfid') ?>", params);
      betterlist();                                
    }
  }
}

function priv_warn()
{
  QMessageBox.warning(mywindow, 'Insufficient Privileges', 'You do not have the system privilege required to perform this operation');
} 

function sOpen()
{
  try {
  var params = new Object;
  params.module = _list.currentItem().text('module');
  params.modcode = _list.currentItem().data(_list.column('module'), Xt.IdRole).toString();
  params.wftype = _list.currentItem().data(_list.column('wftype'), Xt.IdRole).toString();
  var window = '';
  
  if(params.wftype == 'O')
  	sEdit();	
  	
  else if(params.modcode=='S') 
  {
    if(!privileges.value("IssueStockToShipping"))
    {
      priv_warn();
      return;
    }

    params.sohead_id = _list.currentItem().data(_list.column('order_number'), Xt.IdRole).toString();  
    if((params.wftype == 'P')||(params.wftype == 'S')) 
    {
      window = "issueToShipping";
    }
    else
    {
      QMessageBox.warning(mywindow, "Error", "no supported action yet");  
    }
  }
  else if(params.modcode=='P') 
  {
    if(!privileges.value("EnterReceipts"))
    {
      priv_warn();
      return;
    }
    params.pohead_id = _list.currentItem().data(_list.column('order_number'), Xt.IdRole).toString();
    if(params.wftype == 'R' || params.wftype == 'T')
    {
      //make sure the PO is released
      var qry = toolbox.executeQuery("SELECT pohead_status FROM pohead WHERE pohead_id = <? value('pohead_id') ?>", params);
      if(qry.first())
        if(qry.value("pohead_status") != "O")
          QMessageBox.information(mywindow, "msg", "Unable to receive this PO. Please check PO Status");
         
      window = "enterPoReceipt";
    }
  }
  else if(params.modcode=='TO') 
  {
    params.tohead_id = _list.currentItem().data(_list.column('order_number'), Xt.IdRole).toString();
    //make sure the TO is released
    var qry = toolbox.executeQuery("SELECT tohead_status FROM tohead WHERE tohead_id = <? value('tohead_id') ?>", params);
    if(qry.first())
      if(qry.value("tohead_status") != "O")
        QMessageBox.warning(mywindow, "msg", "Please check TO Status.");

    if((params.wftype == 'P') || (params.wftype == "S"))
    {
      if(!privileges.value("IssueStockToShipping"))
      {
        priv_warn();
        return;
      }
      window = "issueToShipping";
    }
    else if(params.wftype == "R" || params.wftype == "T")
    {
      if(!privileges.value("EnterReceipts"))
      {
        priv_warn();
        return;
      }
      window = "enterPoReceipt";
    }
  }
  else if(params.modcode=='W') 
  {

    params.wo_id = _list.currentItem().data(_list.column('order_number'), Xt.IdRole).toString();
    if(params.wftype == 'I')
    {
      if(!privileges.value("IssueWoMaterials"))
      {
        priv_warn();
        return;
      }
      window = "issueWoMaterialItem";
    }
    else if(params.wftype == 'P')
    {
      if(!privileges.value("PostProduction"))
      {
        priv_warn();
        return;
      }
      window = "postProduction";
    }
    else if(params.wftype == 'T')
      sEdit();  
  }
  else if(params.modcode=='Q') 
  {    
    params.qthead_id = _list.currentItem().data(_list.column('order_number'), Xt.IdRole).toString();
    window = "qtest";
  }

  if(window != '')
  {
    sAssignUser();
    if(window == "issueWoMaterialItem" || window == "postProduction" || window == "qtest") 
    {
      var wnd = toolbox.openWindow(window, mywindow, Qt.ApplicationModal, Qt.Dialog);
      toolbox.lastWindow().set(params);
      wnd.exec();
      betterlist();
    }
    else
    {
      var wnd = toolbox.openWindow(window, mywindow, Qt.NonModal, Qt.Window);
      wnd.set(params);

      ["_close", "_save", "_post", "_ship", "_issue"].forEach( function(name) {
        var btn = wnd.findChild(name);
        if (btn)
          btn.clicked.connect(betterlist);
      });
    }
  }
  } catch (e) { QMessageBox.warning(mywindow, 'msg', "exception found at " + e.lineNumber + ": " + e.message); }
}

function sEdit()
{
  var params          = new Object;
  params.workflow_id  = _list.id();
  params.module       = _list.currentItem().rawValue("module").toString();
  params.type         = _list.currentItem().rawValue("type").toString();
  params.order        = _list.currentItem().data(_list.column('order_number'), Qt.DisplayRole).toString();
  params.mode         = "edit";
  
  var editWnd = toolbox.openWindow("WorkflowActivity", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  editWnd.exec();
  betterlist();
}

function sDelete()
{
   if (QMessageBox.question(mywindow, qsTr("Delete Workflow Item?"),
    qsTr("Are you sure you want to delete the selected Workflow Item?"),
    QMessageBox.Yes, QMessageBox.No | QMessageBox.Default) == QMessageBox.No)
      return;
      
   var params = new Object;
   params.workflow_id = _list.id();
   var txt = "DELETE FROM xt.wf WHERE wf_id = <? value('workflow_id') ?>";
   var qry = toolbox.executeQuery(txt, params);

   if (qry.lastError().type != QSqlError.NoError)
      QMessageBox.warning(mywindow, "Database Error", qry.lastError().text);
   
   betterlist();
}

function sPopulateMenu(pMenu, selected)
{
  var menuItem;
  
  var module = _list.currentItem().data(_list.column('module'), Xt.IdRole).toString();
  var wftype = _list.currentItem().data(_list.column('wftype'), Xt.IdRole).toString();
  
  if( (module == 'S' || module == 'TO') && (wftype == 'P')) {
      menuItem = pMenu.addAction(qsTr("Issue to Shipping"));
      menuItem.enabled = (privileges.check("IssueStockToShipping"));
      menuItem.triggered.connect(sOpen);
  } 
  if( (module == 'S' || module == 'TO') && (wftype == 'S')) {
      menuItem = pMenu.addAction(qsTr("Ship Order"));
      menuItem.enabled = (privileges.check("ShipOrders"));
      menuItem.triggered.connect(sOpen);
  } 
  if( (module == 'P' || module == 'TO') && (wftype == 'R' || wftype == 'T') ) 
  {
      menuItem = pMenu.addAction(qsTr("Receive/Post Receipt"));
      menuItem.enabled = (privileges.check("EnterReceipts"));
      menuItem.triggered.connect(sOpen);
  }
  if(module == 'W' && wftype == 'I')
  {
      menuItem = pMenu.addAction(qsTr("Issue Materials"));
      menuItem.enabled = (privileges.check("IssueWoMaterials"));
      menuItem.triggered.connect(sOpen);
  }
  if(module == 'W' && wftype == 'P')
  {
      menuItem = pMenu.addAction(qsTr("Post Production"));
      menuItem.enabled = (privileges.check("PostProduction"));
      menuItem.triggered.connect(sOpen);
  }
  menuItem = pMenu.addAction(qsTr("Edit Activity"));
  if(privileges.check("MaintainAllWorkflows") || privileges.check("MaintainWorkflowsSelf"))
    menuItem.enabled = true;
  else 
    menuItem.enabled = false;
  menuItem.triggered.connect(sEdit);      
  menuItem = pMenu.addAction(qsTr("Delete Activity"));
  if(privileges.check("MaintainAllWorkflows") || privileges.check("MaintainWorkflowsSelf"))
    menuItem.enabled = true;
  else 
    menuItem.enabled = false;
  menuItem.triggered.connect(sDelete);
}

function betterlist()
{
  mywindow.sFillList(listparams, true);
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["itemSelected(int)"].connect(sOpen);

_queryAct.triggered.connect(betterlist);

// Enable Autoupdate 
mainwindow.tick.connect(betterlist);
