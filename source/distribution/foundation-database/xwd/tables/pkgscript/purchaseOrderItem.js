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
  var _poNumber = mywindow.findChild("_poNumber");
  var _item = mywindow.findChild("_item");
  var _warehouse = mywindow.findChild("_warehouse");
  var _ordered = mywindow.findChild("_ordered");
  var _unitPrice = mywindow.findChild("_unitPrice");
  var _dueDate = mywindow.findChild("_dueDate");
  var _vendorItemNumber = mywindow.findChild("_vendorItemNumber");
  var _vendorDescrip = mywindow.findChild("_vendorDescrip");
  var _vendorUOM = mywindow.findChild("_vendorUOM");
  var _invVendorUOMRatio = mywindow.findChild("_invVendorUOMRatio");
  var _minOrderQty = mywindow.findChild("_minOrderQty");
  var _orderQtyMult = mywindow.findChild("_orderQtyMult");
  var _manufName = mywindow.findChild("_manufName");
  var _manufItemNumber = mywindow.findChild("_manufItemNumber");
  var _manufItemDescrip = mywindow.findChild("_manufItemDescrip");
  var _save = mywindow.findChild("_save");

  var _layout  = toolbox.widgetGetLayout(_warehouse);

  var _search = toolbox.createWidget("QPushButton", mywindow, "_search");
  _search.text = qsTr("&Item/Alias Search");
  _layout.addWidget(_search, 0, 2);

  _search.clicked.connect(sItemAliasSearch);

  var _catalog = toolbox.createWidget("QPushButton", mywindow, "_catalog");
  _catalog.text = qsTr("Vendor Catalog");
  _layout.addWidget(_catalog, 0, 3);

  _catalog.clicked.connect(sProductCatalog);
  _vendorItemNumber.textChanged.connect(sEnableFields);
  toolbox.coreDisconnect(_save, "clicked()", mywindow, "sSave()");
  _save.clicked.connect(sSave);
}
catch (e)
{
  QMessageBox.critical(mywindow, "purchaseOrderItem",
                       qsTr("purchaseOrderItem.js exception: ") + e);
}

function sEnableFields()
{
  try
  {
    _ordered.enabled = true;
    _dueDate.enabled = true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "purchaseOrderItem",
                         qsTr("sEnableFields exception: ") + e);
  }
}

function sProductCatalog()
{
  try
  {
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
    QMessageBox.critical(mywindow, "purchaseOrderItem",
                         qsTr("sProductCatalog exception: ") + e);
  }
}

function sItemAliasSearch()
{
  try
  {
    var params = new Object();
    params.captive = true;
    var newdlg = toolbox.openWindow("itemAliasList", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = newdlg.exec();
//    QMessageBox.critical(mywindow, "purchaseOrderItem",
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
        }
        else if (data.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
          return;
        }
      }
      _ordered.setFocus();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "purchaseOrderItem",
                         qsTr("sProductCatalog exception: ") + e);
  }
}

function sSave()
{
  try
  {
    // check for expense poitem
    if (_item.id() <= 0)
    {
      mywindow.sSave();
      return;
    }

    var params = new Object();
    params.pohead_number = _poNumber.text;
    var vendq = "SELECT pohead_id, pohead_vend_id "
             +"FROM pohead "
             +"WHERE (pohead_number=<? value('pohead_number') ?>)"
    var vendd = toolbox.executeQuery(vendq, params);
    if (vendd.first())
      params.itemsrc_vend_id = vendd.value("pohead_vend_id");

    params.itemsrc_item_id = _item.id();
    var qry = "SELECT itemsrc_id "
             +"FROM itemsrc  "
             +"WHERE (itemsrc_vend_id=<? value('itemsrc_vend_id') ?> AND itemsrc_item_id=<? value('itemsrc_item_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (!data.first())
    {
      var answer = QMessageBox.question(mywindow,
                           qsTr("Create Item Source"),
                           qsTr("<p>Do you want to create an Item Source for this Item/Vendor?"),
                           QMessageBox.Yes | QMessageBox.No,
                           QMessageBox.Yes);
      if(answer == QMessageBox.Yes)
      {
        if (_vendorItemNumber.text.length > 0)
          params.itemsrc_vend_item_number = _vendorItemNumber.text;
        else
          params.itemsrc_vend_item_number = _item.itemNumber();
        params.itemsrc_vend_item_descrip = _vendorDescrip.text;
        params.itemsrc_vend_uom = _vendorUOM.text;
        params.itemsrc_invvendoruomratio = _invVendorUOMRatio.toDouble();
        params.itemsrc_minordqty = _minOrderQty.toDouble();
        params.itemsrc_multordqty = _orderQtyMult.toDouble();
        params.itemsrc_manuf_name = _manufName.text;
        params.itemsrc_manuf_item_number = _manufItemNumber.text;
        params.itemsrc_manuf_item_descrip = _manufItemDescrip.text;
        var qry2 = "INSERT INTO itemsrc "
              + "( itemsrc_item_id, itemsrc_active,"
              + "  itemsrc_default, itemsrc_vend_id,"
              + "  itemsrc_contrct_id, itemsrc_effective, itemsrc_expires,"
              + "  itemsrc_vend_item_number, itemsrc_vend_item_descrip,"
              + "  itemsrc_vend_uom, itemsrc_invvendoruomratio,"
              + "  itemsrc_minordqty, itemsrc_multordqty, itemsrc_upccode,"
              + "  itemsrc_leadtime, itemsrc_ranking,"
              + "  itemsrc_comments, itemsrc_manuf_name, "
              + "  itemsrc_manuf_item_number, itemsrc_manuf_item_descrip ) "
              + "VALUES "
              + "( <? value('itemsrc_item_id') ?>, TRUE,"
              + "  FALSE, <? value('itemsrc_vend_id') ?>,"
              + "  <? value('itemsrc_contrct_id') ?>, startOfTime(), endOfTime(),"
              + "  <? value('itemsrc_vend_item_number') ?>, <? value('itemsrc_vend_item_descrip') ?>,"
              + "  <? value('itemsrc_vend_uom') ?>, <? value('itemsrc_invvendoruomratio') ?>,"
              + "  <? value('itemsrc_minordqty') ?>, <? value('itemsrc_multordqty') ?>, <? value('itemsrc_upccode') ?>,"
              + "  <? value('itemsrc_leadtime') ?>, <? value('itemsrc_ranking') ?>,"
              + "  <? value('itemsrc_comments') ?>, <? value('itemsrc_manuf_name') ?>, "
              + "  <? value('itemsrc_manuf_item_number') ?>, <? value('itemsrc_manuf_item_descrip') ?> ) "
              + "RETURNING itemsrc_id AS itemsrcid;";
        var data2 = toolbox.executeQuery(qry2, params);
        if (data2.first())
          params.itemsrcp_itemsrc_id = data2.value("itemsrcid");
        if (data2.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"), data2.lastError().text);
          return;
        }
        params.itemsrcp_qtybreak = _ordered.toDouble();
        params.itemsrcp_price = _unitPrice.localValue;
        var qry3 = "INSERT INTO itemsrcp "
              + "(itemsrcp_itemsrc_id, itemsrcp_type,"
              + " itemsrcp_warehous_id, itemsrcp_dropship,"
              + " itemsrcp_qtybreak, itemsrcp_price,"
              + " itemsrcp_discntprcnt, itemsrcp_fixedamtdiscount,"
              + " itemsrcp_updated, itemsrcp_curr_id) "
              + "VALUES "
              + "(<? value('itemsrcp_itemsrc_id') ?>, 'N',"
              + " -1, FALSE,"
              + " <? value('itemsrcp_qtybreak') ?>, <? value('itemsrcp_price') ?>,"
              + " 0.0, 0.0,"
              + " CURRENT_DATE, baseCurrId());";
        var data3 = toolbox.executeQuery(qry3, params);
        if (data3.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"), data3.lastError().text);
          return;
        }
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), data.lastError().text);
      return;
    }

    // core save
    mywindow.sSave();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "purchaseOrderItem",
                         qsTr("sSave exception: ") + e);
  }
}
