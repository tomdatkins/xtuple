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
  var _buttonBox = mywindow.findChild('_buttonBox'),
      _items = mywindow.findChild('_items'),
      _itemGrid = mywindow.findChild('_itemGrid'),
      _verticalLayout = mywindow.findChild('_verticalLayout'),
      _stacked = mywindow.findChild('_stacked'),
      _selectAll = mywindow.findChild('_selectAll'),
      _search = mywindow.findChild('_search'),
      _searchBtn = mywindow.findChild('_searchBtn'),
      _orderType, _orderNumber, _lastSearch, _checked,
      _cust = mywindow.findChild('_cust'),
      _shipto = mywindow.findChild('_shipto'),
      _warehous = mywindow.findChild('_warehous'),
      _prev = _buttonBox.addButton('Previous', QDialogButtonBox.ActionRole),
      _next = _buttonBox.addButton('&Next', QDialogButtonBox.ActionRole),
      _ok = _buttonBox.button(QDialogButtonBox.Ok),
      _qtyAry = [];
 
  _prev.setVisible(false);
  _next.setEnabled(false);
  _ok.setEnabled(false);
  _selectAll.setEnabled(false);
 
  _items.addColumn("Item Number", XTreeWidget.itemColumn, Qt.AlignLeft   , true, "item_number" );
  _items.addColumn("Description", -1,                     Qt.AlignLeft   , true, "itemdescrip" );
  _items.addColumn("S/O #",       XTreeWidget.itemColumn, Qt.AlignLeft   , true, "cohead_number" );
  _items.addColumn("Qty. Ordered",XTreeWidget.itemColumn, Qt.AlignRight  , true, "coitem_qtyord" );
  _items.addColumn("Unit Price",  XTreeWidget.itemColumn, Qt.AlignRight  , true, "coitem_price" );
  _items.addColumn("Sched. Date", XTreeWidget.itemColumn, Qt.AlignCenter , true, "coitem_scheddate" );

  _items.populated.connect(enableSelectAll);
  _items['valid(bool)'].connect(_next['setEnabled(bool)']);
  _selectAll.toggled.connect(checkSelectAll);
  _ok.clicked.connect(saveOrder);
  _searchBtn.clicked.connect(fillList);
  _prev.clicked.connect(prevPage);
  _next.clicked.connect(nextPage);
}
catch (e)
{
  QMessageBox.critical(mywindow, "favorites",
                       qsTr("favorites.js exception: ") + e);
}
 
function set(params)
{
  try
  {
    if("order_type" in params)
      _orderType = params.order_type;
    if("order_number" in params)
      _orderNumber = params.order_number;
    if("cust_id" in params)
      _cust.setId(params.cust_id);
    if("shipto_id" in params)
      _shipto.setId(params.shipto_id);
    if("site_code" in params)
      _warehous.code = params.site_code;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "favorites",
                         qsTr("set exception: ") + e);
  }
 }

function fillList()
{
  try
  {
     _selectAll.checked = false;
     var params = new Object;
     if (_search.text.length > 0)
       params.search_pattern = _search.text;
     params.site_code = _warehous.code;
     params.cust_id = _cust.id();
     if (_shipto.id() > 0)
       params.shipto_id = _shipto.id();
     params.bySite = true;
     _items.populate(toolbox.executeDbQuery('customer','favorites', params));
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "favorites",
                         qsTr("fillList exception: ") + e);
  }
}
 
function prevPage()
{
  try
  {
     _stacked.setCurrentIndex(0);
     _prev.setVisible(false); //This can't work until we can refresh the contents
     _next.setVisible(true);
     _ok.setEnabled(false);
     _search.text = _lastSearch;
     fillList();
     _selectAll.checked = _checked;
     checkSelectAll();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "favorites",
                         qsTr("prevPage exception: ") + e);
  }
}
 
function nextPage()
{
  try
  {
     // Save last search
     _lastSearch = _search.text;
     _checked = _selectAll.checked;
     // Turn page
     _stacked.setCurrentIndex(1);
     _prev.setVisible(true);
     _next.setVisible(false);
     _ok.setEnabled(true);
 
     // Reset the grid
     _qtyAry = [];
     for ( var r = _itemGrid.rowCount(); r >= 0; r = r - 1)  // removed -1
     {
       for ( var c = _itemGrid.columnCount() -1 ;  c >= 0; c = c - 1)
       {
         var widget = _itemGrid.itemAtPosition(r, c).widget();
         _itemGrid.removeWidget(widget);
         if (widget)
           widget.deleteLater();
       }
     }
     // add new rows
     var selected = _items.selectedItems();
     for (var i = 0; i < selected.length; i++)
     {
       var _item = toolbox.createWidget('QLabel', mywindow, '_label' + i);
       _item.text = selected[i].text('item_number') + ' -' + selected[i].text('itemdescrip');
       var _qty = toolbox.createWidget('XLineEdit', mywindow, '_qty' + i);
       _qty.setValidator(mainwindow.orderVal());
       _itemGrid.addWidget(_item, i, 0);
       _itemGrid.addWidget(_qty, i, 1);
 
       _qtyAry.push(_qty);
     }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "favorites",
                         qsTr("nextPage exception: ") + e);
  }
}
 
function saveOrder()
{
  try
  {
     var selected = _items.selectedItems();
     for (var i = 0; i < selected.length; i++)
     {
       if (_qtyAry[i].text != '')
       {
         if (_orderType == "SO")
         {
           var sql = "insert into api.salesline (order_number, item_number, sold_from_site, qty_ordered) "
                   + "values ('" + _orderNumber + "','" + selected[i].text('item_number') + "','"
                   + _warehous.code + "'," + _qtyAry[i].text + ");"
           toolbox.executeQuery(sql);
         }
         else
         {
           var sql = "insert into api.quoteline (quote_number, item_number, sold_from_site, scheduled_date, qty_ordered) "
                   + "values ('" + _orderNumber + "','" + selected[i].text('item_number') + "','"
                   + _warehous.code + "',CURRENT_DATE," + _qtyAry[i].text + ");"
           toolbox.executeQuery(sql);
         }
       }
     }
     mydialog.accept();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "favorites",
                         qsTr("saveOrder exception: ") + e);
  }
}
 
function enableSelectAll()
{
  try
  {
     _selectAll.enabled = true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "favorites",
                         qsTr("enableSelectAll exception: ") + e);
  }
}
 
function checkSelectAll()
{
  try
  {
    if (_selectAll.checked)
      _items.selectAll();
    else
      _items.clearSelection();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "favorites",
                         qsTr("checkSelectAll exception: ") + e);
  }
}
 
 

