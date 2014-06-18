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
try
{
  // permissions
  var _tabs = mywindow.findChild("_tabs");
  var _costsTab = mywindow.findChild("_costsTab");
  var _costsTab = toolbox.tabSetTabEnabled(_tabs,toolbox.tabTabIndex(_tabs,_costsTab),privileges.value("ViewSOItemDetailTab"));
  if(!privileges.check("ViewSOItemUnitCost"))
  {
    mywindow.findChild("_unitCostLit").visible=false;
    mywindow.findChild("_unitCost").visible=false;
  }
//  if(!privileges.check("ViewSOItemListCost"))
//  {
//    mywindow.findChild("_listPriceLit").visible=false;
//    mywindow.findChild("_listPrice").visible=false;
//  }
//  if(!privileges.check("ViewSOItemAvgCost"))
//  {
//    mywindow.findChild("_avgCostLit").visible=false;
//    mywindow.findChild("_avgCost").visible=false;
//  }
  if(!privileges.check("ViewSOItemHistoryCost"))
  {
    mywindow.findChild("_historyCostsButton").visible=false;
    mywindow.findChild("_historyCosts").visible=false;
  }

  var _mode = '';
  var _custid = -1;
  var _imageurl = "";
  var _specurl = "";
  var _orderNumber = mywindow.findChild("_orderNumber");
  var _lineNumber = mywindow.findChild("_lineNumber");
  var _save = mywindow.findChild("_save");
  var _cancel = mywindow.findChild("_cancel");
  var _item = mywindow.findChild("_item");
  var _warehouse = mywindow.findChild("_warehouse");
  var _qtyOrdered = mywindow.findChild("_qtyOrdered");
  var _customerPN = mywindow.findChild("_customerPN");
  var _createSupplyOrder = mywindow.findChild("_createSupplyOrder");
  var _historyCostsButton = mywindow.findChild("_historyCostsButton");
  var _historyDates = mywindow.findChild("_historyDates");
  var _showAvailability = mywindow.findChild("_showAvailability");
  var _onHand = mywindow.findChild("_onHand");
  var _allocated = mywindow.findChild("_allocated");
  var _unallocated = mywindow.findChild("_unallocated");
  var _onOrder = mywindow.findChild("_onOrder");
  var _available = mywindow.findChild("_available");
  var _qtyUOM = mywindow.findChild("_qtyUOM");
  var _availabilityGroup = mywindow.findChild("_availabilityGroup");

  var _layout  = toolbox.widgetGetLayout(_warehouse);
  var _layout2  = toolbox.widgetGetLayout(_historyDates);
  var _layout3  = toolbox.widgetGetLayout(_onHand);

  var _search = toolbox.createWidget("QPushButton", mywindow, "_search");
  _search.text = qsTr("&Adv. Item Search");
  _search.enabled = true;
  _layout.addWidget(_search, 0, 2);
  _search.clicked.connect(sItemAliasSearch);

  var _catalog = toolbox.createWidget("QPushButton", mywindow, "_catalog");
  _catalog.text = qsTr("Vendor Catalog");
  _catalog.enabled = true
;
  _layout.addWidget(_catalog, 0, 3);
  _catalog.clicked.connect(sProductCatalog);

  var _image = toolbox.createWidget("QPushButton", mywindow, "_image");
  _image.text = qsTr("View Image");
  _image.enabled = false;
  _layout.addWidget(_image, 1, 2);
  _image.clicked.connect(sImage);

  var _spec = toolbox.createWidget("QPushButton", mywindow, "_spec");
  _spec.text = qsTr("View Spec");
  _spec.enabled = false;
  _layout.addWidget(_spec, 1, 3);
  _spec.clicked.connect(sSpec);

  var _nbrOrdersLit = toolbox.createWidget("QLabel", mywindow, "_nbrOrdersLit");
  _nbrOrdersLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _nbrOrdersLit.text = "Orders:";
  _layout2.insertWidget(3, _nbrOrdersLit);

  var _nbrOrders = toolbox.createWidget("QLabel", mywindow, "_nbrOrders");
  _nbrOrders.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _nbrOrders.text = "data";
  _layout2.insertWidget(4, _nbrOrders);

  var _qtyPerOrderLit = toolbox.createWidget("QLabel", mywindow, "_qtyPerOrderLit");
  _qtyPerOrderLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _qtyPerOrderLit.text = "Qty. per Order:";
  _layout2.insertWidget(5, _qtyPerOrderLit);

  var _qtyPerOrder = toolbox.createWidget("QLabel", mywindow, "_qtyPerOrder");
  _qtyPerOrder.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _qtyPerOrder.text = "data";
  _layout2.insertWidget(6, _qtyPerOrder);

  var _onhanduom = toolbox.createWidget("XLabel", mywindow, "_onhanduom");
  _onhanduom.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _onhanduom.setPrecision(mainwindow.qtyVal());
  _layout3.addWidget(_onhanduom, 0, 2);

  var _allocateduom = toolbox.createWidget("XLabel", mywindow, "_allocateduom");
  _allocateduom.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _allocateduom.setPrecision(mainwindow.qtyVal());
  _layout3.addWidget(_allocateduom, 1, 2);

  var _unallocateduom = toolbox.createWidget("XLabel", mywindow, "_unallocateduom");
  _unallocateduom.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _unallocateduom.setPrecision(mainwindow.qtyVal());
  _layout3.addWidget(_unallocateduom, 2, 2);

  var _onorderuom = toolbox.createWidget("XLabel", mywindow, "_onorderuom");
  _onorderuom.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _onorderuom.setPrecision(mainwindow.qtyVal());
  _layout3.addWidget(_onorderuom, 3, 2);

  var _availableuom = toolbox.createWidget("XLabel", mywindow, "_availableuom");
  _availableuom.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _availableuom.setPrecision(mainwindow.qtyVal());
  _layout3.addWidget(_availableuom, 4, 2);

  _item.newId.connect(sHandleButtons);
  _item.newId.connect(sPopulateHistory);
  _historyCostsButton.toggled.connect(sPopulateHistory);
  _historyDates.updated.connect(sPopulateHistory);
  _cancel.clicked.connect(sLostSale);
  _qtyUOM.newID.connect(sAvailabilityUOM);
}
catch (e)
{
  QMessageBox.critical(mywindow, "salesOrderItem",
                       qsTr("salesOrderItem.js exception: ") + e);
}

//function set(params)
//{
//  try
//  {
//    if ("mode" in params)
//    {
//      _mode = params.mode;
//
//      if (_mode == "new" || _mode == "newQuote")
//      {
//        _search.enabled = true;
//        _catalog.enabled = true;
//      }
//    }
//
//    if("cust_id" in params)
//      _custid = params.cust_id;
//  }
//  catch (e)
//  {
//    QMessageBox.critical(mywindow, "salesOrderItem",
//                         qsTr("set exception: ") + e);
//  }
//}

function sHandleButtons()
{
  try
  {
    var params = new Object();
    params.item_id = _item.id();
    var qry = "SELECT url_url FROM docass JOIN urlinfo ON (url_id=docass_target_id) "
            + "WHERE (docass_target_type='URL')"
            + "  AND (url_title='Image')"
            + "  AND (docass_source_type='I')"
            + "  AND (docass_source_id=<? value('item_id') ?>);"
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _imageurl = data.value("url_url");
      _image.enabled = true;
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
      return;
    }
    else
    {
      _imageurl = "";
      _image.enabled = false;
    }

    var qry2 = "SELECT url_url FROM docass JOIN urlinfo ON (url_id=docass_target_id) "
            + "WHERE (docass_target_type='URL')"
            + "  AND (url_title='Spec Sheet')"
            + "  AND (docass_source_type='I')"
            + "  AND (docass_source_id=<? value('item_id') ?>);"
    var data2 = toolbox.executeQuery(qry2, params);
    if (data2.first())
    {
      _specurl = data2.value("url_url");
      _spec.enabled = true;
    }
    else if (data2.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), data2.lastError().text);
      return;
    }
    else
    {
      _specurl = "";
      _spec.enabled = false;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sHandleButtons exception: ") + e);
  }
}

function sProductCatalog()
{
  try
  {
    sGetInfo();
    if (_mode != "new" && _mode != "newQuote")
      return;

    var params = new Object();
    params.captive = true;
    var newdlg = toolbox.openWindow("catalogListDiag", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = newdlg.exec();
    if (result > 0)
      _item.setId(result);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sProductCatalog exception: ") + e);
  }
}

function sItemAliasSearch()
{
  try
  {
    sGetInfo();
    if (_mode != "new" && _mode != "newQuote")
      return;

    var params = new Object();
    params.captive = true;
    params.cust_id = _custid;
    var newdlg = toolbox.openWindow("itemAliasList", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = newdlg.exec();
//    QMessageBox.critical(mywindow, "salesOrderItem",
//                         qsTr("result=") + result);
    if (result != 0)
    {
      if (result > 0)
        _item.setId(result);
      else
      {
        params.itemalias_id = (result * -1);
        var qry = "SELECT * FROM itemalias WHERE itemalias_id=<? value('itemalias_id') ?>;"
        var data = toolbox.executeQuery(qry, params);
        if (data.first())
        {
          _item.setId(data.value("itemalias_item_id"));
          _customerPN.text = data.value("itemalias_number");
        }
        else if (data.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
          return;
        }
      }
      _qtyOrdered.setFocus();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sProductCatalog exception: ") + e);
  }
}

function sImage()
{
  try
  {
    toolbox.openUrl(QUrl(_imageurl));
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sImage exception: ") + e);
  }
}

function sSpec()
{
  try
  {
    toolbox.openUrl(QUrl(_specurl));
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sSpec exception: ") + e);
  }
}

function sPopulateHistory()
{
  try
  {
    if (_historyCostsButton.checked)
    {
      _nbrOrdersLit.hide();
      _nbrOrders.hide();
      _qtyPerOrderLit.hide();
      _qtyPerOrder.hide();
    }
    else
    {
      _nbrOrdersLit.show();
      _nbrOrders.show();
      _qtyPerOrderLit.show();
      _qtyPerOrder.show();
      var params = new Object();
      params.item_id = _item.id();
      params.warehous_id = _warehouse.id();
      sGetInfo();
      params.cust_id = _custid;
      params.startDate = _historyDates.startDate;
      params.endDate = _historyDates.endDate;
      var qry = "SELECT COUNT(*) AS nbrorders, "
              + "       (SUM(orderqty) / COUNT(*)) AS qtyperorder "
              + "FROM ( "
              + "SELECT SUM(cohist_qtyshipped) AS orderqty "
              + "FROM cohist JOIN itemsite ON (itemsite_id=cohist_itemsite_id) "
              + "WHERE (itemsite_warehous_id=<? value('warehous_id') ?>)"
              + "  AND (itemsite_item_id=<? value('item_id') ?>)"
              + "  AND (cohist_cust_id=<? value('cust_id') ?>)"
              + "  AND (cohist_invcdate >= <? value('startDate') ?>)"
              + "  AND (cohist_invcdate <= <? value('endDate') ?>)"
              + "GROUP BY cohist_ordernumber "
              + ") AS data;";
      var data = toolbox.executeQuery(qry, params);
      if (data.first())
      {
        _nbrOrders.text = data.value("nbrorders");
        _qtyPerOrder.text = data.value("qtyperorder");
      }
      else if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
        return;
      }
      else
      {
        _nbrOrders.text = "";
        _qtyPerOrder.text = "";
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sPopulateHistory exception: ") + e);
  }
}

function sLostSale()
{
  try
  {
    var params = new Object();
    params.coitem_id = mywindow.id();
    var newdlg = toolbox.openWindow("lostSale", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = newdlg.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sLostSale exception: ") + e);
  }
}

function sAvailabilityUOM()
{
  try
  {
    if (_showAvailability.checked)
    {
      var params = new Object();
      params.item_id = _item.id();
      params.uom_id = _qtyUOM.id();
      var qry = "SELECT itemuomtouomratio(item_id, <? value('uom_id') ?>, item_inv_uom_id) AS ratio"
              + "  FROM item"
              + " WHERE(item_id=<? value('item_id') ?>);";
      var data = toolbox.executeQuery(qry, params);
      if (data.first())
      {
        var ratio = data.value("ratio");
        _availabilityGroup.title = "Availability (Inv. UOM and Qty. UOM)";
        _onhanduom.setDouble(_onHand.toDouble() / ratio);
        _allocateduom.setDouble(_allocated.toDouble() / ratio);
        _unallocateduom.setDouble(_unallocated.toDouble() / ratio);
        _onorderuom.setDouble(_onOrder.toDouble() / ratio);
        _availableuom.setDouble(_available.toDouble() / ratio);
      }
      else if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
        return;
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sAvailabilityUOM exception: ") + e);
  }
}

function sGetInfo()
{
  try
  {
//    QMessageBox.critical(mywindow, "Debug", ("modeType=" + mywindow.modeType()));
//    QMessageBox.critical(mywindow, "Debug", ("mode=" + mywindow.mode()));
    if (_custid == -1)
    {
//      var params = new Object();
//      params.soitem_id = mywindow.id();
//      var qry = "";
//      if (mywindow.modeType() == 1)
//        qry = "SELECT quhead_cust_id AS custid"
//            + "  FROM quitem JOIN quhead ON (quhead_id=quitem_quhead_id)"
//            + " WHERE(quitem_id=<? value('soitem_id') ?>);";
//      else
//        qry = "SELECT cohead_cust_id AS custid"
//            + "  FROM coitem JOIN cohead ON (cohead_id=coitem_cohead_id)"
//            + " WHERE(coitem_id=<? value('soitem_id') ?>);";
//      var data = toolbox.executeQuery(qry, params);
//      if (data.first())
//      {
//        _custid = data.value("custid");
//      }
//      else if (data.lastError().type != QSqlError.NoError)
//      {
//        QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
//        return;
//      }
      _custid = mywindow.custid();
    }

    if (mywindow.mode() == 1)
      _mode = "new";
    if (mywindow.mode() == 33)
      _mode = "newQuote";
    if (_mode == "new" || _mode == "newQuote")
    {
      _search.enabled = true;
      _catalog.enabled = true;
    }
    else
    {
      _search.enabled = false;
      _catalog.enabled = false;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sGetInfo exception: ") + e);
  }
}
