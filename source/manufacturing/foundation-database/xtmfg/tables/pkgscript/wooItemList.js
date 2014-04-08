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

var _wooperseqid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _select       = mywindow.findChild("_select");
var _clear        = mywindow.findChild("_clear");
var _close        = mywindow.findChild("_close");
var _item         = mywindow.findChild("_item");
var _wooitem      = mywindow.findChild("_wooitem");

_wooitem.addColumn(qsTr("#"), -1, Qt.AlignCenter,  true, "wooper_seqnumber");
_wooitem.addColumn(qsTr("Description"), -1, Qt.AlignLeft,    true, "wooper_descrip1");
_wooitem.addColumn(qsTr("Descrip Line 2"), -1, Qt.AlignLeft, true, "wooper_descrip2");

function set(params)
{
  try {
    if("wooper_seq_id" in params)
      _wooperseqid = params.wooper_seq_id;
  
    if("wo_id" in params)
    {
      _item.setId(params.wo_id);
      _item.setReadOnly(true);
    }
  } catch (e) {
    print(e.lineNumber + ": " + e);
  }

  return mainwindow.NoError;
}

function sFillList()
{

  try {
    var params = new Object;
    params.item_id = _item.id();
    var qry = toolbox.executeDbQuery("wooItemList", "detail", params);
//QMessageBox.critical(mywindow, qsTr("Database Error"), _wooperseqid);
    _wooitem.populate(qry, _wooperseqid, false);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return;
    }
  } catch (e) {
    print(e.lineNumber + ": " + e);
  }

}

function sClose()
{
  mydialog.done(_wooperseqid);
}

function sClear()
{
  mydialog.done(-1);
}

function sSelect()
{
  mydialog.done(_wooitem.id());
}

_item.newId.connect(sFillList);
_select.clicked.connect(sSelect);
_clear.clicked.connect(sClear);

_close.clicked.connect(sClose);

