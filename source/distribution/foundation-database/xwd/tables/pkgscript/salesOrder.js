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
  var _insideRepCreated = false;
  var _orderType = 'SO';
  var _connectionsOn = false;
  var _orderNumber = mywindow.findChild("_orderNumber");
  var _new = mywindow.findChild('_action');
  var _soitem = mywindow.findChild("_soitem");
  var _delete = mywindow.findChild("_delete");
  var _issueLineBalance = mywindow.findChild("_issueLineBalance");
  var _cust = mywindow.findChild('_cust');
  _cust.newId.connect(sGetInfo);
  var _shipto = mywindow.findChild('_shipTo');
  var _site = mywindow.findChild("_warehouse");
  var _commission = mywindow.findChild("_commission");
  var _commissionLit = mywindow.findChild("_commissionLit");
  var _commissionPrcntLit = mywindow.findChild("_commissionPrcntLit");
  var _orderCurrency = mywindow.findChild("_orderCurrency");
  var _more = mywindow.findChild("_more");
  var _salesRepLit = mywindow.findChild("_salesRepLit");
  _salesRepLit.text = "Outside Rep.";
  var _salesOrderInformation = mywindow.findChild("_salesOrderInformation");
  _salesOrderInformation["currentChanged(int)"].connect(sGetInfo);

  var _layout  = toolbox.widgetGetLayout(_delete);
  var _layout2 = toolbox.widgetGetLayout(_issueLineBalance);
  var _layout3 = toolbox.widgetGetLayout(_new);
  var _layout4 = toolbox.widgetGetLayout(_soitem);

  var _moveUp = toolbox.createWidget("QPushButton", mywindow, "_moveUp");
  _moveUp.text = qsTr("Move Up");
  _moveUp.enabled = false;
  _layout.insertWidget(4, _moveUp);
  _moveUp.clicked.connect(sMoveUp);

  var _moveDown = toolbox.createWidget("QPushButton", mywindow, "_moveDown");
  _moveDown.text = qsTr("Move Down");
  _moveDown.enabled = false;
  _layout.insertWidget(5, _moveDown);
  _moveDown.clicked.connect(sMoveDown);

  var _smoothMargin = toolbox.createWidget("QPushButton", mywindow, "_smoothMargin");
  _smoothMargin.text = qsTr("Smooth Margin");
  _smoothMargin.enabled = false;
  _layout.insertWidget(6, _smoothMargin);
  _smoothMargin.clicked.connect(sSmoothMargin);

  var _issueOrder = toolbox.createWidget("QPushButton", mywindow, "_issueOrder");
  _issueOrder.text = qsTr("Issue Order Avail.");
  _issueOrder.enabled = false;
  _layout2.insertWidget(2, _issueOrder);
  _issueOrder.clicked.connect(sIssueOrder);

  var _shipOrder = toolbox.createWidget("QPushButton", mywindow, "_shipOrder");
  _shipOrder.text = qsTr("Ship Order");
  _shipOrder.enabled = false;
  _layout2.insertWidget(3, _shipOrder);
  _shipOrder.clicked.connect(sShipOrder);

  var _favorites = toolbox.createWidget('QPushButton', mywindow, '_favorites');
  _favorites.text = qsTr("Favorites");
  _favorites.enabled = false;
  _layout3.insertWidget(0,_favorites);
  _favorites.clicked.connect(sFavorites);

  var _salesOrderAddend = toolbox.loadUi("salesOrderAddend", mywindow);
  _layout4.addWidget(_salesOrderAddend, 2, 0);

  var _quickItem = _salesOrderAddend.findChild("_quickItem");
  _quickItem.setType(ItemLineEdit.cSold + ItemLineEdit.cActive);
  var _quickWarehouse = _salesOrderAddend.findChild("_quickWarehouse");
  var _quickQtyOrdered = _salesOrderAddend.findChild("_quickQtyOrdered");
  var _quickNetUnitPrice = _salesOrderAddend.findChild("_quickNetUnitPrice");
  var _quickScheduledDate = _salesOrderAddend.findChild("_quickScheduledDate");
  _quickScheduledDate.date = mainwindow.dbDate();
  var _quickSave = _salesOrderAddend.findChild("_quickSave");

  if(!privileges.check("ViewCommissions"))
  {
    _commission.textChanged.connect(sHideCommission);
  }

}
catch (e)
{
  QMessageBox.critical(mywindow, "salesOrder",
                       qsTr("salesOrder.js exception: ") + e);
}

function sHideCommission()
{
  try
  {
    _commission.hide();
    _commissionLit.hide();
    _commissionPrcntLit.hide();
    _more.hide();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sHideCommission exception: ") + e);
  }
}

function sGetInfo()
{
  try
  {
    if (mywindow.modeState() == 1) // new mode
    {
      if (!_insideRepCreated)
      {
        var params = new Object;
        params.order_id = mywindow.id();
        params.char_name = "insiderep";
        if (mywindow.modeType() == 1)
          params.target_type="QU";
        else
          params.target_type="SO";

        var salesrepq = toolbox.executeQuery("SELECT salesrep_id "
                                           + "FROM salesrep "
                                           + "WHERE (UPPER(salesrep_number)=UPPER(getEffectiveXtUser()));", params);
        if (!salesrepq.first())
          QMessageBox.warning(mywindow, qsTr("Missing Inside Rep"),
                              qsTr("Inside Rep user not setup as Sales Rep"));
       

        var qry = "INSERT INTO charass(charass_target_type, charass_target_id,"
                + "                    charass_char_id, charass_value) "
                + "SELECT <? value('target_type') ?>, <? value('order_id') ?>, "
                + "       char_id, getEffectiveXtUser() "
                + "FROM char "
                + "WHERE (char_name ~* <? value('char_name') ?>);";
        var data = toolbox.executeQuery(qry, params);
        if (data.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"),
                               data.lastError().text);
          return;
        }

        mywindow.sFillCharacteristic();
        _insideRepCreated = true;
      }
    }

    if (mywindow.modeType() == 2) // sales order
    {
      if (mywindow.modeState() != 3) // not view
      {
        _issueOrder.show();
        _shipOrder.show();
        _favorites.show();
        _issueOrder.enabled = true;
        _shipOrder.enabled = true;
        _favorites.enabled = true;
      }
      else
      {
        _issueOrder.hide();
        _shipOrder.hide();
        _favorites.hide();
      }
    }
    else
    {
      if (mywindow.modeState() != 3) // not view
      {
        _favorites.show();
        _favorites.enabled = true;
      }
      else
      {
        _favorites.hide();
      }

      _issueOrder.hide();
      _shipOrder.hide();

      _orderType = "QU";
    }

    if (mywindow.modeState() != 3) // not view
    {
      sSetShipto();
      _quickSave.enabled = true;

      if (!_connectionsOn)
      {
        _connectionsOn = true;
        _soitem.valid.connect(_moveUp, "setEnabled");
        _soitem.valid.connect(_moveDown, "setEnabled");
        _soitem.valid.connect(_smoothMargin, "setEnabled");

        _cust.newId.connect(sSetShipto);
        _site.newID.connect(sSetShipto);

        _quickSave.clicked.connect(sQuickSave);
        _quickItem.newId.connect(sQuickCalcPrice);
        _quickWarehouse.newID.connect(sQuickCalcPrice);
        _quickQtyOrdered.editingFinished.connect(sQuickCalcPrice);
        _quickScheduledDate.newDate.connect(sQuickCalcPrice);

        _quickItem.newId.connect(sQuickHandleSite);
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("set exception: ") + e);
  }
}

function sMoveUp()
{
  try
  {
    var params = new Object;
    params.soitem_id = _soitem.id();
    var _soitemid = _soitem.id();

    var qry = "";
    if (mywindow.modeType() == 1)
      qry = "SELECT xwd.moveQuitemUp(<? value('soitem_id') ?>) AS result;"
    else
      qry = "SELECT xwd.moveCoitemUp(<? value('soitem_id') ?>) AS result;"
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
        return;
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
    mywindow.sFillItemList();
    _soitem.setId(_soitemid);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sMoveUp exception: ") + e);
  }
}

function sMoveDown()
{
  try
  {
    var params = new Object;
    params.soitem_id = _soitem.id();
    var _soitemid = _soitem.id();

    var qry = "";
    if (mywindow.modeType() == 1)
      qry = "SELECT xwd.moveQuitemDown(<? value('soitem_id') ?>) AS result;"
    else
      qry = "SELECT xwd.moveCoitemDown(<? value('soitem_id') ?>) AS result;"
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
        return;
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
    mywindow.sFillItemList();
    _soitem.setId(_soitemid);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sMoveDown exception: ") + e);
  }
}

function sSmoothMargin()
{
  try
  {
    var params = new Object;
    params.order_type = mywindow.modeType();
    params.order_number = _orderNumber.text;
    var newdlg = toolbox.openWindow("smoothMargin", mywindow, mywindow.windowModality, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = newdlg.exec();
    if (result > 0)
    {
      var qry = "";
      var selected = _soitem.selectedItems();
      for (var i = 0; i < selected.length; i++)
      {
        params.orderitem_id = selected[i].id();
        params.margin = result;
        qry = "SELECT xwd.smoothMargin(<? value('order_type') ?>,<? value('orderitem_id') ?> , <? value('margin') ?>) AS qresult;"
        var data = toolbox.executeQuery(qry, params);
        if (data.first())
        {
          var qresult = data.value("qresult");
          if (qresult < 0)
          {
            QMessageBox.critical(mywindow, "salesOrder",
                                 qsTr("smoothMargin function exception: ") + qresult);
            return;
          }
        }
        else if (data.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"),
                               data.lastError().text);
          return;
        }
      }
      mywindow.sFillItemList();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sSmoothMargin exception: ") + e);
  }
}

function sIssueOrder()
{
  try
  {
    toolbox.executeBegin(); // because of possible lot, serial, or location distribution cancelations
    var params = new Object;
    params.order_number = _orderNumber.text;
    var _soitemid = _soitem.id();

    var qry = "SELECT xwd.issueOrderAvail(<? value('order_number') ?>) AS itemlocseries;"
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var itemlocseries = data.value("itemlocseries");
      if (itemlocseries <= 0)
      {
        toolbox.executeRollback();
        QMessageBox.critical(mywindow, qsTr("Processing Error"),
                             storedProcErrorLookup("issueOrder", itemlocseries, xwdErrors));
        return;
      }
      if (DistributeInventory.SeriesAdjust(itemlocseries, mywindow) == 0)
      {
        toolbox.executeRollback();
        QMessageBox.information(mywindow, qsTr("Issue Order"),
                                   qsTr("Transaction Canceled") );
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      toolbox.executeRollback();
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
    toolbox.executeCommit();
    mywindow.sFillItemList();
    _soitem.setId(_soitemid);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sIssueOrder exception: ") + e);
  }
}

function sShipOrder()
{
  try
  {
    var params = new Object;
    params.order_number = _orderNumber.text;
    var _soitemid = _soitem.id();

    var qry = "SELECT shiphead_id "
            + "FROM cohead JOIN shiphead ON (shiphead_order_type='SO' AND shiphead_order_id=cohead_id AND NOT shiphead_shipped) "
            + "WHERE (cohead_number=<? value('order_number') ?>);"
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      params.shiphead_id = data.value("shiphead_id");
      var newdlg = toolbox.openWindow("shipOrder", mywindow, Qt.ApplicationModal, Qt.Dialog);
      toolbox.lastWindow().set(params);
      var result = newdlg.exec();
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
    else
    {
      QMessageBox.critical(mywindow, qsTr("Processing Error"),
                           qsTr("Nothing to Ship"));
      return;
    }
    mywindow.sFillItemList();
    _soitem.setId(_soitemid);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sShipOrder exception: ") + e);
  }
}

function sFavorites()
{
  try
  {
    if(mywindow.save(true))
    {
      var params = new Object;
      params.order_type = _orderType;
      params.cust_id = _cust.id();
      params.customer_number = _cust.number;
      params.shipto_number = _shipto.number;
      params.shipto_id = _shipto.id();
      params.order_number = _orderNumber.text;
      params.site_code = _site.text;
      var wnd = toolbox.openWindow("favorites", mywindow, Qt.NonModal, Qt.Dialog);
      toolbox.lastWindow().set(params);
      var execval = wnd.exec();

      mywindow.sFillItemList();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sFavorites exception: ") + e);
  }
}

function sSetShipto()
{
  try
  {
    if(_cust.id() > 0 && _site.id() > 0)
    {
      var params = new Object;
      params.cust_id = _cust.id();
      params.warehous_id = _site.id();
      // check for default shipto
      var qry = "SELECT shipto_id "
              + "FROM shiptoinfo "
              + "WHERE (shipto_cust_id=<? value('cust_id') ?>)"
              + "  AND (shipto_default);"
      var data = toolbox.executeQuery(qry, params);
      if (data.first())
      {
        return;
      }
      else if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        return;
      }
      // check for matching preferred selling site
      var qry2 = "SELECT shipto_id "
               + "FROM shiptoinfo "
               + "WHERE (shipto_cust_id=<? value('cust_id') ?>)"
               + "  AND (shipto_preferred_warehous_id=<? value('warehous_id') ?>);"
      var data2 = toolbox.executeQuery(qry2, params);
      if (data2.first())
      {
        _shipto.setId(data2.value("shipto_id"));
      }
      else if (data2.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data2.lastError().text);
        return;
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sSetShipto exception: ") + e);
  }
}

function sQuickSave()
{
  try
  {
    if(_quickItem.id() > 0 &&
       _quickQtyOrdered.toDouble() > 0.0 &&
       _quickNetUnitPrice.localValue > 0.0 &&
       _quickScheduledDate.isValid())
    {
      if (!mywindow.save(true))
        return;

      var params = new Object;
      params.order_type = _orderType;
      params.order_id = mywindow.id();
      params.item_id = _quickItem.id();
      params.warehous_id = _quickWarehouse.id();
      params.qtyordered = _quickQtyOrdered.toDouble();
      params.netunitprice = _quickNetUnitPrice.localValue;
      params.scheduledate = _quickScheduledDate.date;
      var qry = "SELECT xwd.quickItemAdd(<? value('order_type') ?>,"
              + "                        <? value('order_id') ?>,"
              + "                        <? value('item_id') ?>,"
              + "                        <? value('warehous_id') ?>,"
              + "                        <? value('qtyordered') ?>,"
              + "                        <? value('netunitprice') ?>,"
              + "                        <? value('scheduledate') ?>) AS result;"
      var data = toolbox.executeQuery(qry, params);
      if (data.first())
      {
        if (data.value("result") < 0)
        {
          QMessageBox.critical(mywindow, qsTr("quickItemAdd Error"),
                               qsTr("quickItemAdd result=") + data.value("result"));
          return;
        }
        mywindow.sFillItemList();
        _quickItem.clear();
        _quickQtyOrdered.clear();
        _quickNetUnitPrice.clear();
//        _quickScheduledDate.clear();
        _quickItem.setFocus();
        return;
      }
      else if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        return;
      }
    }
    else
      QMessageBox.critical(mywindow, qsTr("Quick Item Entry"),
                           qsTr("Please supply all Quick Item Entry information"));
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sQuickSave exception: ") + e);
  }
}

function sQuickCalcPrice()
{
  try
  {
    if(_quickItem.id() > 0 &&
       _quickQtyOrdered.toDouble() > 0.0 &&
       _quickScheduledDate.isValid())
    {
      var params = new Object;
      params.item_id = _quickItem.id();
      params.cust_id = _cust.id();
      params.shipto_id = _shipto.id();
      params.qtyordered = _quickQtyOrdered.toDouble();
      params.curr_id = _orderCurrency.id();
      params.scheduledate = _quickScheduledDate.date;
      var qry = "SELECT itemPrice(<? value('item_id') ?>,"
              + "                 <? value('cust_id') ?>,"
              + "                 <? value('shipto_id') ?>,"
              + "                 <? value('qtyordered') ?>,"
              + "                 <? value('curr_id') ?>,"
              + "                 <? value('scheduledate') ?>) AS result;"
      var data = toolbox.executeQuery(qry, params);
      if (data.first())
      {
        _quickNetUnitPrice.setId(_orderCurrency.id());
        _quickNetUnitPrice.setEffective(_quickScheduledDate.date);
        _quickNetUnitPrice.setLocalValue(data.value("result"));
        return;
      }
      else if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        return;
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sQuickCalcPrice exception: ") + e);
  }
}

function sQuickHandleSite()
{
  try
  {
    if(_quickItem.id() > 0)
    {
      _quickWarehouse.findItemsites(_quickItem.id());
      if (_site.id() > 0)
        _quickWarehouse.setId(_site.id());
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("sQuickHandleSite exception: ") + e);
  }
}