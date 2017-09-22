/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/
include("storedProcErrorLookup");
include("xwdErrors");

try
{
  var _item_number                  = mywindow.findChild("_item_number");
  var _provider                     = mywindow.findChild("_provider");
  var _wholesale_price              = mywindow.findChild("_wholesale_price");
  var _price_uom                    = mywindow.findChild("_price_uom");
  var _po_cost                      = mywindow.findChild("_po_cost");
  var _po_uom                       = mywindow.findChild("_po_uom");
  var _itemsrcp_qtybreak            = mywindow.findChild("_itemsrcp_qtybreak");
  var _vend_number                  = mywindow.findChild("_vend_number");
  var _invvendoruomratio            = mywindow.findChild("_invvendoruomratio");
  var _upc                          = mywindow.findChild("_upc");
  var _warehous_code                = mywindow.findChild("_warehous_code");
  var _provider                     = mywindow.findChild("_provider");
  var _save                         = mywindow.findChild("_save");
  var _mode = '';

  _wholesale_price.setValidator(mainwindow.moneyVal());
  _po_cost.setValidator(mainwindow.moneyVal());
  _itemsrcp_qtybreak.setValidator(mainwindow.qtyVal());

  mywindow.findChild("_close").clicked.connect(mywindow, "close");
  mywindow.findChild("_updateitemcost").clicked.connect(updateitemcost);
}
catch (e)
{
  QMessageBox.critical(mywindow, "catCost", "catCost.js exception: " + e);
}

function set(params)
{
  if ("mode" in params)
    _mode = params.mode;

  if ("catcost_id" in params)
  {
    _catcostid = params.catcost_id;
    _itemid = params.catcost_item_id;
    populate();
  }

  if (_mode == "view")
  {
    _save.hide();
  }
  else
  {
    _save.clicked.connect(save);
  }
}

function populate()
{
  try
  {
    var data = toolbox.executeDbQuery('catcost', 'detail', { catcost_id: _catcostid});
    if (data.first())
    {
      _item_number.setText(data.value("catcost_item_number"));
      _wholesale_price.setDouble(data.value("wholesale_price"));
      _price_uom.setText(data.value("catcost_price_uom"));
      _po_cost.setDouble(data.value("po_cost"));
      _po_uom.setText(data.value("catcost_po_uom"));
      _itemsrcp_qtybreak.setDouble(data.value("catcost_itemsrcp_qtybreak"));
      _vend_number.setText(data.value("catcost_vend_number"));
      _invvendoruomratio.setDouble(data.value("catcost_cost_invvendoruomratio"));
      _upc.setText(data.value("catcost_upc"));
      _warehous_code.setText(data.value("warehous_code"))
      _provider.setText(data.value("provider"));
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      throw new Error(data.lastError().text);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCost", "populate exception: " + e);
  }
}

function save()
{
  try
  {
    var q_str = "UPDATE xwd.catcost"
              + "   SET catcost_wholesale_price=<? value('wholesale_price') ?>,"
              + "       catcost_po_cost=<? value('po_cost') ?>,"
              + "       catcost_price_uom=<? value('_price_uom') ?>,"
              + "       catcost_po_uom=<? value('po_uom') ?>,"
              + "       catcost_itemsrcp_qtybreak=COALESCE(<? value('qtybreak') ?>, 1),"
              + "       catcost_vend_number=<? value('vend_number') ?>,"
              + "       catcost_invvendoruomratio=<? value('invvendoruomratio') ?>,"
              + "       catcost_warehous_code=<? value('warehous_code')?>,"
              + "       catcost_upc=<? value('upc') ?>"
              + " WHERE catcost_id = <? value('catcost_id') ?>;";

    var params = { }
    if (setParams(params))
    {
      var data = toolbox.executeQuery(q_str, params);
      if (data.lastError().type != QSqlError.NoError)
      {
        throw new Error(data.lastError().text);
      }
      mywindow.close();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCost", "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.catcost_id = _catcostid;

    if (_item_number.text.length > 0)
      params.item_number = _item_number.text;
    if (_wholesale_price.toDouble() > 0)
      params.wholesale_price = _wholesale_price.toDouble();
    if (_price_uom .text.length > 0)
      params._price_uom = _price_uom.text;
    if (_po_cost.toDouble() > 0)
      params.po_cost = _po_cost.toDouble();
    if (_po_uom.text.length > 0)
      params.po_uom = _po_uom.text;
    if (_itemsrcp_qtybreak.text.length > 0)
      params.qtybreak = _itemsrcp_qtybreak.text;
    if (_vend_number.text.length > 0)
      params.vend_number = _vend_number.text;
    if (_invvendoruomratio.text.length > 0)
      params.invvendoruomratio = _invvendoruomratio.text;
    if (_upc.text.length > 0)
          params.upc = _upc.text;
    if (_warehous_code.text.length > 0)
      params.warehous_code = _warehous_code.text;
    if (_warehous_code.text.length =0)
      params.warehous_code = '-1';

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCost",
                         "setParams(params) exception: " + e);
  }
}

function updateitemcost()
{
  try
  {
    save();
    var qry1 = toolbox.executeQuery("SELECT xwd.updatecatcostitem(<? value('catcost_id') ?>);",
                                    { catcost_id: _catcostid });
    if (qry1.lastError().type != QSqlError.NoError)
    {
      throw new Error(qry1.lastError().text);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catCost", "updateitemcost exception: " + e);
  }
}
