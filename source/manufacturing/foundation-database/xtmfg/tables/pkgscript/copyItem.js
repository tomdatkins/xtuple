/*
This file is part of the xtmfg Package for xTuple ERP,
and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
is licensed to you under the xTuple End-User License Agreement ("the
EULA"), the full text of which is available at www.xtuple.com/EULA.
While the EULA gives you access to source code and encourages your
involvement in the development process, this Package is not free
software.  By using this software, you agree to be bound by the
terms of the EULA.
*/

debugger;

var _copy             = mywindow.findChild("_copy");
var _copyBOM          = mywindow.findChild("_copyBOM");
var _source           = mywindow.findChild("_source");
var _targetItemNumber = mywindow.findChild("_targetItemNumber");
var _tab              = mywindow.findChild("_tab");
var _bomTab           = mywindow.findChild("_bomTab");

var _copyBOO    = new XCheckBox(qsTr("Copy &Routing"), mywindow);
var _copyUsedAt = new XCheckBox(qsTr("Copy &Used At Operation"),  mywindow);
_copyBOO.objectName    = "_copyBOO";
_copyUsedAt.objectName = "_copyUsedAt";

var cblayout = toolbox.widgetGetLayout(_copyBOM);
cblayout.addWidget(_copyBOO, 1, 0);
cblayout.addWidget(_copyUsedAt, 1, 1);

// Add new tab and set up contents
var _booTab = toolbox.loadUi("copyItemBOO", mywindow); 
var index = _tab.indexOf(_bomTab) + 1;
_tab.insertTab(index ,_booTab, qsTr("Routing"));

var _addBOO              = mywindow.findChild("_addBOO");
var _revokeBOO           = mywindow.findChild("_revokeBOO");
var _addedbooitems       = mywindow.findChild("_addedbooitems");
var _availableoperations = mywindow.findChild("_availableoperations");

_addedbooitems.addColumn(qsTr("#"),           -1, Qt.AlignCenter, true, "booitem_seqnumber");
_addedbooitems.addColumn(qsTr("Std. Oper."),  -1, Qt.AlignLeft,   true, "f_stdopnnumber");
_addedbooitems.addColumn(qsTr("Work Cntr."),  -1, Qt.AlignLeft,   true, "wrkcnt_code");
_addedbooitems.addColumn(qsTr("Description"), -1, Qt.AlignLeft,   true, "description");

_availableoperations.addColumn(qsTr("Std. Oper."),  -1, Qt.AlignLeft,   true, "stdopn_number");
_availableoperations.addColumn(qsTr("Work Cntr."),  -1, Qt.AlignLeft,   true, "wrkcnt_code");
_availableoperations.addColumn(qsTr("Description"), -1, Qt.AlignLeft,   true, "stdopn_descrip1");

_copyBOO.toggled.connect(sCopyBoo);
_addBOO.clicked.connect(sAddBooitem);
_revokeBOO.clicked.connect(sRevokeBooitem);
_addedbooitems.itemSelected.connect(sEditBooitem);

function sSaveItem()
{
  mywindow.sSaveItem();
  sCopyBoo();
}

function sCopyBoo()
{
  if (mywindow.id() <= 0)
    return;

  if (_copyBOO.checked)
  {
    var params = new Object;
    params.srcitemid    = _source.id();
    params.targetitemid = mywindow.id();
    params.usedat = _copyUsedAt.checked;

    var qry = toolbox.executeQuery('SELECT xtmfg.copyBoo(<? value("srcitemid") ?>,'
                                 + '                     <? value("targetitemid") ?>,'
                                 + '                     <? value("usedat") ?>)'
                                 + '       AS result;',
                                   params);
  }
  else
  {
    var params = new Object;
    params.targetitemid = mywindow.id();

    var qry = toolbox.executeQuery('SELECT xtmfg.deleteBoo(<? value("targetitemid") ?>)'
                                 + '       AS result;',
                                   params);
  }

  sFillBooitem();
}

function openBooItem(params)
{
  try {
    var wnd = toolbox.openWindow("booItem", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    wnd.exec();
  } catch(e) {
    print("boo open booItem exception @ " + e.lineNumber + ": " + e);
  }
}

function sAddBooitem()
{
  var params = new Object;
  params.mode = "new";
  params.item_id = mywindow.id();
  params.stdopn_id = _availableoperations.id();

  openBooItem(params);
  sFillBooitem();
}

function sEditBooitem()
{
  var params = new Object;
  params.mode = "edit";
  params.booitem_id = _addedbooitems.id();

  openBooItem(params);
  sFillBooitem();
}

function sRevokeBooitem()
{
  var params = new Object;
  params.mode = "edit";
  params.booitem_id = _addedbooitems.id();

  var qry = toolbox.executeQuery('DELETE FROM xtmfg.booitem '
                               + 'WHERE (booitem_id=<? value("booitem_id") ?>);',
                                 params);
  sFillBooitem();
}

function sFillBooitem()
{
  _addedbooitems.clear;
  var params = new Object;
  params.item_id = mywindow.id();
  params.revision_id = -1;

  qry = toolbox.executeDbQuery("boo", "items", params);
  _addedbooitems.populate(qry, true);

  qry = toolbox.executeQuery('SELECT * FROM xtmfg.stdopn JOIN xtmfg.wrkcnt ON (wrkcnt_id=stdopn_wrkcnt_id);',
                             params);
  _availableoperations.populate(qry);
}

function sClear()
{
  _addedbooitems.clear;
  _availableoperations.clear;
}

toolbox.coreDisconnect(_source, "newId(int)", mywindow, "sSaveItem()");
_source.newId.connect(sSaveItem);
_copy.clicked.connect(sClear);
