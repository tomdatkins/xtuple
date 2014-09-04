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
  var _custid = -1;
  var _close           = mywindow.findChild("_close");
  var _select          = mywindow.findChild("_select");
  var _searchFor       = mywindow.findChild("_searchFor");
  var _showInactive    = mywindow.findChild("_showInactive");
  var _searchNumber    = mywindow.findChild("_searchNumber");
  var _searchDescrip1  = mywindow.findChild("_searchDescrip1");
  var _searchDescrip2  = mywindow.findChild("_searchDescrip2");
//  var _warehouse       = mywindow.findChild("_warehouse");
  var _items           = mywindow.findChild("_items");

  _items.addColumn(qsTr("Alias Number"),          100, Qt.AlignLeft,  true, "itemalias_number");
  _items.addColumn(qsTr("Item Number"),           100, Qt.AlignLeft,  true, "item_number");
  _items.addColumn(qsTr("Active"),                100, Qt.AlignLeft,  true, "item_active");
  _items.addColumn(qsTr("CRM Account"),           100, Qt.AlignLeft,  true, "crmacct_name");
  _items.addColumn(qsTr("Customer"),              100, Qt.AlignLeft,  true, "cust_name");
  _items.addColumn(qsTr("Last Price Paid"),       100, Qt.AlignRight, true, "coitem_price");
  _items.addColumn(qsTr("Description 1"),          -1, Qt.AlignLeft,  true, "item_descrip1");
  _items.addColumn(qsTr("Description 2"),          -1, Qt.AlignLeft,  true, "item_descrip2");
  _items.addColumn(qsTr("Site"),                  100, Qt.AlignLeft,  true, "warehous_code");
  _items.addColumn(qsTr("Netable QOH"),           100, Qt.AlignRight, true, "netableqoh");

  _items["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(sPopulateMenu)
  _close.clicked.connect(mywindow, "close");
  _select.clicked.connect(sSelect);
  _items.itemSelected.connect(sSelect);
  _searchFor.textChanged.connect(sFillList);
  _items.valid.connect(_select, "setEnabled");
}
catch (e)
{
  QMessageBox.critical(mywindow, "catalogList",
                       "itemAliasList.js exception: " + e);
}

function set(params)
{
  try
  {
    if("cust_id" in params)
      _custid = params.cust_id;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemAliasList",
                         qsTr("set exception: ") + e);
  }
}

function sFillList()
{
  try
  {
    if (_searchFor.text.length < 3)
      return;
    if ((!_searchNumber.checked) &&
        (!_searchDescrip1.checked) &&
        (!_searchDescrip2.checked))
      return;
    _items.clear();
    var params = new Object;
//    params.warehous_id = _warehouse.id();
    params.searchFor = _searchFor.text;
    if(!_showInactive.checked)
      params.showActiveOnly = true;
    if(_searchNumber.checked)
      params.searchNumber = true;
    if(_searchDescrip1.checked)
      params.searchDescrip1 = true;
    if(_searchDescrip2.checked)
      params.searchDescrip2 = true;
    if(_custid > -1)
      params.cust_id = _custid;
    
    var qry = toolbox.executeDbQuery("itemalias", "search", params);
    _items.populate(qry, true);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemAliasList",
                         "sFillList exception: " + e);
  }
}

function sSelect()
{
  try
  {
    var _result;
    if (_items.altId() > 0)
      _result = _items.altId() * -1;
    else
      _result = _items.id();
    mydialog.done(_result);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemAliasList",
                         "sFillList exception: " + e);
  }
}

function sItemAlias()
{
  try
  {
    var params = new Object();
    params.cust_id = _custid;
    params.item_id = _items.id();
    if (_items.altId() > 0)
    {
      params.itemalias_id = _items.altId();
      params.mode = 'edit';
    }
    else
      params.mode = 'new';
    var newdlg = toolbox.openWindow("itemAlias", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = newdlg.exec();
    sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemAliasList",
                         qsTr("sItemAlias exception: ") + e);
  }
}

function sPopulateMenu(pMenu, pItem, pCol)
{
  try
  {
    if(pMenu == null)
      pMenu = _list.findChild("_menu");
  
    if(pMenu != null)
    {
      if (_items.altId() > 0)
      {
        tmpact = pMenu.addAction(qsTr("Edit Alias..."));
        tmpact.enabled = true;
        tmpact.triggered.connect(sItemAlias);
      }
      else
      {
        tmpact = pMenu.addAction(qsTr("New Alias..."));
        tmpact.enabled = true;
        tmpact.triggered.connect(sItemAlias);
      }

      tmpact = pMenu.addAction(qsTr("Print Item Label..."));
      tmpact.enabled = true;
      tmpact.triggered.connect(sPrintLabel);
    }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "itemAliasList",
                         "sPopulateMenu exception: " + e);
  }
}

function sPrintLabel()
{
  try
  {
    var params = new Object();
    params.labelform_name = "ItemLabels";

    var qry = "SELECT labelform_report_name AS report_name "
            + "FROM labelform "
            + "WHERE (labelform_name=<? value('labelform_name') ?>);";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var reportname = data.value("report_name");
      params.item_id = _items.id();
      params.itemalias_id = _items.altId();
      toolbox.printReport(reportname, params);
    }
    else
      QMessageBox.critical(mywindow, "itemAliasList",
                           "Label form ItemLabels not found");
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemAliasList",
                         "sPrintLabel exception: " + e);
  }
}
