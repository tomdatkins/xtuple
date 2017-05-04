/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
 
//debugger;

var _list = mywindow.findChild("_list");
var _newBtn   = mywindow.findChild("_newBtn");
var _editBtn  = mywindow.findChild("_editBtn");
var _deleteBtn = mywindow.findChild("_deleteBtn");
var _close    = mywindow.findChild("_close");

_list.addColumn(qsTr("Name"),        100,  Qt.AlignLeft,  true,  "qplantype_code"  );
_list.addColumn(qsTr("Description"),  -1,  Qt.AlignLeft,  true,  "qplantype_descr"  );
_list.addColumn(qsTr("Active"),  -1,  Qt.AlignLeft,  true,  "qplantype_active"  );
_list.addColumn(qsTr("Default"),  -1,  Qt.AlignLeft,  true,  "qplantype_default"  );

popList();

function sNew()
{
  var params          = new Object;
  params.mode         = "new";
  var newdlg          = toolbox.openWindow("qplantype", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  popList();
}

function sEdit()
{
  if(_list.id() <= 0)
    return;
    
  var params          = new Object;
  params.qplantype_id  = _list.id();
  params.mode         = "edit";

  var newdlg          = toolbox.openWindow("qplantype", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  newdlg.exec();
  
  popList();
}

function popList()
{
  var sql = toolbox.executeQuery("SELECT qplantype_id AS id, qplantype_code, "
          + "qplantype_descr, qplantype_active, qplantype_default FROM xt.qplantype");
  _list.populate(sql);  
}  
  
function sDelete()
{
  if(_list.id() <= 0)
    return;

  if (QMessageBox.question(mywindow, qsTr("Delete Code?"),
    qsTr("Are you sure you want to delete the selected code?"),
    QMessageBox.Yes, QMessageBox.No | QMessageBox.Default) == QMessageBox.No)
      return;
      
  var params = new Object;
  params.qplantype_id = _list.id();
  var txt = "DELETE FROM xt.qplantype WHERE qplantype_id = <? value('qplantype_id') ?>";
  var qry = toolbox.executeQuery(txt, params);

  if (qry.lastError().type != QSqlError.NoError)
    QMessageBox.warning(mywindow, "Database Error", qry.lastError().text);
   
  popList();
}

function sPopulateMenu(pMenu, selected)
{
  var menuItem;
      menuItem = pMenu.addAction(qsTr("Open..."));
      menuItem.triggered.connect(sEdit);
      menuItem = pMenu.addAction(qsTr("Delete..."));
      menuItem.triggered.connect(sDelete);
}

_list["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_list["itemSelected(int)"].connect(sEdit);

_close.clicked.connect(mywindow.close);
_newBtn.clicked.connect(sNew);
_editBtn.clicked.connect(sEdit);
_deleteBtn.clicked.connect(sDelete);
