/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

debugger;

include("storedProcErrorLookup");
include("xwdErrors");

try
{
  var _itemloc = mywindow.findChild("_itemloc");
  var _bcLit = mywindow.findChild("_bcLit");
  var _layout  = toolbox.widgetGetLayout(_bcLit);

  var _searchLit = toolbox.createWidget("QLabel", mywindow, "_searchLit");
  _searchLit.text = "Location Search:";
  _layout.insertWidget(1, _searchLit);
  var _search = toolbox.createWidget("QLineEdit", mywindow, "_search");
  _layout.insertWidget(2, _search);

  _search.textChanged.connect(sSearch);
}
catch (e)
{
  QMessageBox.critical(mywindow, "distributeInventory",
                       "distributeInventory.js exception: " + e);
}

function sSearch()
{
  try
  {
    _itemloc.clearSelection();
    if (_search.text.length == 0)
      return;
    var i;
    for (i=0; i < _itemloc.topLevelItemCount; i++)
    {
      if (_itemloc.topLevelItem(i).text(0).indexOf(_search.text) == 0)
        break;
    }
    if (i < _itemloc.topLevelItemCount)
    {
      _itemloc.setCurrentItem(_itemloc.topLevelItem(i));
      _itemloc.scrollToItem(_itemloc.topLevelItem(i));
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "distributeInventory",
                         "sSearch exception: " + e);
  }
}
