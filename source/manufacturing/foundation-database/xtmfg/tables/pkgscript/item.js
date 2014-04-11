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

var _mode = "new";

var _itemtype = mywindow.findChild("_itemtype");

var _existing = mywindow.findChild("_materials");
var layout = toolbox.widgetGetLayout(_existing);

var _boo = toolbox.createWidget("QPushButton", mywindow, "_boo");
_boo.text = qsTr("Routing...");
layout.insertWidget( 2, _boo);

function set(params)
{
  sHandleItemtype();
  if("mode" in params)
  {
    if(params.mode == "new")
      _boo.visible = false;

    if(params.mode == "view")
      _mode = "view";
  }
  return 0;
}

function sHandleItemtype()
{
  if(privileges.check("MaintainBOOs") && metrics.boolean("Routings"))
    _boo.visible = ( (_itemtype.currentIndex == 0) ||  // itemType = Purchased
                     (_itemtype.currentIndex == 1) ||  // itemType = Manufactured
                     (_itemtype.currentIndex == 9) ); // itemType = Breeder
}

function sEditBOO()
{
  var params = new Object;
  params.item_id = mywindow.id();
  var qry = toolbox.executeQuery("SELECT *"
                               + "  FROM xtmfg.booitem"
                               + ' WHERE (booitem_item_id=<? value("item_id") ?>);',
                               params)
  if(qry.first())
    params.mode = "edit";
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                         qry.lastError().text);
    return;
  }
  else
    params.mode = "new";

  if(_mode == "view")
    params.mode = "view";
  var wnd = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
  wnd.set(params);
}

_itemtype['activated(int)'].connect(sHandleItemtype);
_boo.clicked.connect(sEditBOO);

if(!privileges.check("MaintainBOOs") || !metrics.boolean("Routings"))
{
print("wha?");
  _boo.visible = false;
}

if(metrics.boolean("BBOM"))
{
  _itemtype.append(10, qsTr("Breeder"));
  _itemtype.append(11, qsTr("Co-Product"));
  _itemtype.append(12, qsTr("By-Product"));
}
