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
  var _list            = mywindow.findChild("_list");

  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(sPopulateMenu)
}
catch (e)
{
  QMessageBox.critical(mywindow, "dspAllocations",
                       "dspAllocations.js exception: " + e);
}

function sPopulateMenu(pMenu, pItem, pCol)
{
  try
  {
    if(pMenu == null)
      pMenu = _list.findChild("_menu");
  
    if (pMenu != null)
    {
      tmpact = pMenu.addAction(qsTr("Add to Packing List Batch..."));
      tmpact.enabled = true;
      tmpact.triggered.connect(sAddPackingListBatch);
    }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "dspAllocations",
                         "sPopulateMenu exception: " + e);
  }
}

function sAddPackingListBatch()
{
  try
  {
    var params = new Object;
    params.coitem_id = _list.id();
    var qry = toolbox.executeQuery("SELECT addToPackingListBatch(coitem_cohead_id) AS result FROM coitem WHERE (coitem_id=<? value('coitem_id') ?>);", params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspAllocations",
                         "sAddPackListBatch exception: " + e);
  }
}
