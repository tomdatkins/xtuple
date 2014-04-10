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

// create a script var for each child of mywindow with an objectname starting _
var _print             = mywindow.findChild("_print");
var _new               = mywindow.findChild("_new");
var _edit              = mywindow.findChild("_edit");
var _copy              = mywindow.findChild("_copy");
var _delete            = mywindow.findChild("_delete");
var _searchFor         = mywindow.findChild("_searchFor");
var _close             = mywindow.findChild("_close");
var _view              = mywindow.findChild("_view");
var _showInactiveBOOs  = mywindow.findChild("_showInactiveBOOs");
var _showInactiveItems = mywindow.findChild("_showInactiveItems");
var _boo               = mywindow.findChild("_boo");

var _debug = false;

_boo.addColumn(qsTr("Item Number"), -1, Qt.AlignLeft,    true, "item_number");
_boo.addColumn(qsTr("Description"), -1, Qt.AlignLeft,    true, "itemdescrip");
_boo.addColumn(qsTr("Revision"),    -1, Qt.AlignLeft,    true, "rev_number");
_boo.addColumn(qsTr("Rev. Status"), -1, Qt.AlignLeft,    true, "rev_status");

function sPrint()
{
  var params = new Object;
  params.item_id = _boo.id();
  params.revision_id = _boo.altId();
  toolbox.printReport("BillOfOperations", params);
}

function openBoo(params)
{
  if (_debug) print("openBoo called");
  try {
    var wnd = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
    wnd.set(params);
  } catch(e) {
    print("booList open boo exception @ " + e.lineNumber + ": " + e);
  }
}

function sNew()
{
  if (_debug) print("sNew called");
  var params = new Object;
  params.mode = "new";

  openBoo(params);
}

function sEdit()
{
  if (_debug) print("sEdit called");
  var params = new Object;
  params.mode = "edit";
  params.item_id = _boo.id();
  params.revision_id = _boo.altId();

  openBoo(params);
}

function sView()
{
  if (_debug) print("sView called");
  var params = new Object;
  params.mode = "view";
  params.item_id = _boo.id();
  params.revision_id = _boo.altId();

  openBoo(params);
}

function sCopy()
{
  var params = new Object;
  params.item_id = _boo.id();
  params.revision_id = _boo.altId();

  try {
    var wnd = toolbox.openWindow("copyBOO", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    wnd.exec();
  } catch(e) {
    print("booList open copyBOO exception @ " + e.lineNumber + ": " + e);
  }
  
}

function sDelete()
{
  var params = new Object;
  params.item_id = _boo.id();
  params.revision_id = _boo.altId();

  var qry = toolbox.executeQuery("SELECT rev_id AS _result "
                                +"FROM rev "
                                +'WHERE ((rev_target_id=<? value("item_id") ?>) '
                                +"  AND (rev_target_type = 'BOO')) "
                                +"LIMIT 1;",
                                 params );
  if(qry.first())
  {
    QMessageBox.warning(mywindow, qsTr("Delete Routing"),
                        qsTr( "<p>The selected Routing has revision control records and may not be deleted."));
    return;
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  var answer = QMessageBox.question(mywindow,
                       qsTr("Delete Routing"),
                       qsTr("<p>Are you sure that you want to delete the selected Routing?"),
                       QMessageBox.Yes | QMessageBox.No,
                       QMessageBox.Yes);
  if(answer == QMessageBox.Yes)
  {
    qry = toolbox.executeQuery('SELECT xtmfg.deleteBoo(<? value("item_id") ?>) AS result;',
                               params );
    if (qry.first())
    {
      var result = qry.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow, qsTr("Processing Error"),
                             storedProcErrorLookup("deleteBoo", result, xtmfgErrors));
        return;
      }
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }

    mainwindow.sBOOsUpdated(_boo.id(), true);
  }
}

function sQuery()
{
  sFillList(-1, true);
}

function sFillList(pItemid, pLocal)
{
  var params = new Object;
  if(!_showInactiveBOOs.checked)
    params.showActiveBOOsOnly = true;
  if(!_showInactiveItems.checked)
    params.showActiveItemsOnly = true;
  var qry = toolbox.executeDbQuery("booList", "detail", params);
  if((pItemid != -1) && pLocal)
    _boo.populate(qry, pItemid, true);
  else
    _boo.populate(qry, true);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

function sHandleButtons()
{
  if(_boo.altId() == -1)
    _delete.enabled = true;
  else
    _delete.enabled = false;
}

_print.clicked.connect(sPrint);
_new.clicked.connect(sNew);
_edit.clicked.connect(sEdit);
_copy.clicked.connect(sCopy);
_delete.clicked.connect(sDelete);
_view.clicked.connect(sView);
_searchFor.textChanged.connect(_boo, "sSearch");
_showInactiveBOOs.toggled.connect(sQuery);
_showInactiveItems.toggled.connect(sQuery);

_close.clicked.connect(mywindow, "close");

if(privileges.check("MaintainBOOs"))
{
  _boo.valid.connect(_edit, "setEnabled");
  _boo.valid.connect(_copy, "setEnabled");
//  _boo.valid.connect(_delete, "setEnabled");
  _boo.valid.connect(sHandleButtons);
  _boo.itemSelected.connect(_edit, "animateClick");
}
else
{
  _boo.itemSelected.connect(_view, "animateClick");
  _new.enabled=false;
}

mainwindow.boosUpdated.connect(sFillList);

sQuery();

include("xtmfgErrors");
include("storedProcErrorLookup");
