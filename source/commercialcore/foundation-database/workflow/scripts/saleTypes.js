// saletypes.js
// This script is disabled until we convert to use core EDI Profiles
// intercept sNew, sEdit and sView and redirect to saleTypeAlt
/*
debugger;

var _new      = mywindow.findChild("_new");
var _edit     = mywindow.findChild("_edit");
var _view     = mywindow.findChild("_view");
var _saletype = mywindow.findChild("_saleType");

function sNew()
{
  var params = new Object;
  params.mode = "new";
    
  var newWnd = toolbox.openWindow("saleTypeAlt", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  var result = newWnd.exec();
  
  if (result != XDialog.Rejected)
    mywindow.sFillList(result);

}

function sEdit()
{
  var params = new Object;
  params.mode = "edit";
  params.saletype_id = _saletype.id();

  var  editWnd = toolbox.openWindow("saleTypeAlt", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  editWnd.exec();
  mywindow.sFillList
}

function sView()
{
  var params = new Object;
  params.mode = "edit";
  params.saletype_id = _saletype.id();

  var  editWnd = toolbox.openWindow("saleTypeAlt", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set(params);
  editWnd.exec();
  mywindow.sFillList
}

toolbox.coreDisconnect(_new, "clicked()", mywindow, "sNew()");
_new.clicked.connect(sNew);
toolbox.coreDisconnect(_edit, "clicked()", mywindow, "sEdit()");
_edit.clicked.connect(sEdit);

*/