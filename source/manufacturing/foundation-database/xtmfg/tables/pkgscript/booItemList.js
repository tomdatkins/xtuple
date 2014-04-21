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

var _booitemseqid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _select       = mywindow.findChild("_select");
var _clear        = mywindow.findChild("_clear");
var _close        = mywindow.findChild("_close");
var _item         = mywindow.findChild("_item");
var _booitem      = mywindow.findChild("_booitem");

_booitem.addColumn(qsTr("#"), -1, Qt.AlignCenter,  true, "booitem_seqnumber");
_booitem.addColumn(qsTr("Description"), -1, Qt.AlignLeft,    true, "booitem_descrip1");
_booitem.addColumn(qsTr("Descrip Line 2"), -1, Qt.AlignLeft, true, "booitem_descrip2");

function set(params)
{
  try {
    if("booitem_seq_id" in params)
      _booitemseqid = params.booitem_seq_id;
  
    if("item_id" in params)
    {
      _item.setId(params.item_id);
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
    var qry = toolbox.executeDbQuery("booItemList", "detail", params);
    _booitem.populate(qry, _booitemseqid, false);
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
  mydialog.done(_booitemseqid);
}

function sClear()
{
  mydialog.done(-1);
}

function sSelect()
{
  mydialog.done(_booitem.id());
}

_item.newId.connect(sFillList);
_select.clicked.connect(sSelect);
_clear.clicked.connect(sClear);

_close.clicked.connect(sClose);

