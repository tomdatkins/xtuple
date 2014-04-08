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

function getParams()
{
  // create an object to hold the parameters
  var params = new Object;
  if (mywindow.findChild("_item").isValid())
  {
    params.item_id = mywindow.findChild("_item").id();
    params.warehous_id = mywindow.findChild("_warehouse").id();
    var qry = toolbox.executeQuery("SELECT xtmfg.bomanalysis(<? value('item_id') ?>,"
                                 + "<? value('warehous_id') ?>) as o_result;",
                                 params);
    qry.first();
    params.result = qry.value("o_result");
  }
  else
    params.result = -1;
  return params;
}


function query()
{
  var params = getParams();
  display.clear();

  if (params.result == 1)
  {
    var qry1 = toolbox.executeQuery("select max(total_lt) as max_lt from xtmfg.lt_report;", params);
    qry1.first();
    var x_max_lt = qry1.value("max_lt");
    mywindow.findChild("_max_lt").text = x_max_lt;
    var qry = toolbox.executeQuery("SELECT itemsite_id, seq_number, item, item_descrip1, item_type, lt, parent_lt, "
                                 + " total_lt, rpad(lpad(' ', parent_lt::int, ' '), total_lt::int, '|') AS lt_patern, "
                                 + " CASE WHEN (TOTAL_LT = "+ x_max_lt +") then '#FF0000' "
                                 +  "WHEN(item_type='P') THEN '#0000CC' "
                                 + " WHEN(item_type='M') THEN '#00C000' "
                                 + " WHEN(item_type='O') THEN '#660066' "
                                 + " END AS qtforegroundrole, "
                                 + "lvl AS xtindentrole from xtmfg.lt_report order by report_id;",
                                 params);
    mywindow.findChild("_display").populate(qry);
    display.expandAll();
  }
}

mywindow.findChild("_query").clicked.connect(query);

mywindow.findChild("_close").clicked.connect(mywindow, "close");

var display = mywindow.findChild("_display");
display.addColumn("Seq", 50, 1, true, "seq_number");
display.addColumn("Item", 100, 1, true, "item");
display.addColumn("Description", -1, 1, true, "item_descrip1");
display.addColumn("Type", 50, 1, true, "item_type");
display.addColumn("LT", 75, 1, true, "lt");
//display.addColumn("Parent LT", 75, 1, true, "parent_lt");
display.addColumn("Cum. LT", 75, 1, true, "total_lt");
display.addColumn("LT Pattern", 76, 1, true, "lt_patern");

function expandAll()
{
  display.expandAll();
}

function collapseAll()
{
  display.collapseAll();
}

display["populateMenu(QMenu *, QTreeWidgetItem *, int)"].connect(populateuserMenu);
function populateuserMenu(pMenu, pItem, pCol)
{
  var option = pMenu.addAction(qsTr("Expand All"));
  option.enabled = true;
  option.triggered.connect(expandAll);

  var option1 = pMenu.addAction(qsTr("Collapse All"));
  option1.enabled = true;
  option1.triggered.connect(collapseAll);

  var option2 = pMenu.addAction(qsTr("Edit ItemSite"));
  option2.enabled = privileges.value("MaintainItemSites");
  option2.triggered.connect(itemsite);
}

function itemsite()
{
  var params = new Object;
  params.itemsite_id = display.id();
  params.mode = "edit";

  var newdlg = toolbox.openWindow("itemSite");
  var tmp = toolbox.lastWindow().set(params);
  var _itemsite = newdlg.exec();
}

