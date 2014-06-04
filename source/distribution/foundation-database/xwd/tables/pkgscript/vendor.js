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
  var _catvendorid = -1;
  var _catparentid = -1;
  var _save = mywindow.findChild("_save");
  var _default = mywindow.findChild("_defaultCurrLit");
  var _crmacct = mywindow.findChild("_crmacct");

  var _layout  = toolbox.widgetGetLayout(_default);

  var _costColumnLit = toolbox.createWidget("QLabel", mywindow, "_costColumnLit");
  _costColumnLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _costColumnLit.text = "Catalog Cost Column:";
  _layout.addWidget(_costColumnLit, 3, 0);

  var _costColumn = toolbox.createWidget("XComboBox", mywindow, "_costColumn");
  _layout.addWidget(_costColumn, 3, 1);

  _costColumn.append(0, "Default", "D");
  _costColumn.append(1, "Custom", "C");
  _costColumn.append(2, "Col3", "3");
  _costColumn.append(3, "List", "L");
  _costColumn.append(4, "Dist.", "T");

  var _freightAllowedAmountLit = toolbox.createWidget("QLabel", mywindow, "_freightAllowedAmountLit");
  _freightAllowedAmountLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _freightAllowedAmountLit.text = "Freight Allowed Amount:";
  _layout.addWidget(_freightAllowedAmountLit, 4, 0);

  var _freightAllowedAmount = toolbox.createWidget("XLineEdit", mywindow, "_freightAllowedAmount");
  _freightAllowedAmount.setValidator(mainwindow.moneyVal());
  _layout.addWidget(_freightAllowedAmount, 4, 1);

  var _freightAllowedWeightLit = toolbox.createWidget("QLabel", mywindow, "_freightAllowedWeightLit");
  _freightAllowedWeightLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _freightAllowedWeightLit.text = "Freight Allowed Weight:";
  _layout.addWidget(_freightAllowedWeightLit, 5, 0);

  var _freightAllowedWeight = toolbox.createWidget("XLineEdit", mywindow, "_freightAllowedWeight");
  _freightAllowedWeight.setValidator(mainwindow.moneyVal());
  _layout.addWidget(_freightAllowedWeight, 5, 1);

  var _layout2  = toolbox.widgetGetLayout(_crmacct);

  var _parent = toolbox.createWidget("VendorCluster", mywindow, "_parent");
  _parent.label = "Parent #:";
  _parent.nameVisible = false;
  _parent.descriptionVisible = false;
  _layout2.insertWidget(3, _parent);

  mywindow["saved(int)"].connect(save);
  mywindow["newId(int)"].connect(populate);
  _parent.newId.connect(sCheckParent);
  _freightAllowedAmount.editingFinished.connect(sCheckFreightAmount);
  _freightAllowedWeight.editingFinished.connect(sCheckFreightWeight);
}
catch (e)
{
  QMessageBox.critical(mywindow, "vendor",
                       qsTr("vendor.js exception: ") + e);
}

function sCheckParent()
{
  try
  {
    if (_parent.id() == mywindow.id())
    {
      QMessageBox.critical(mywindow, "Parent Vendor Error",
                           qsTr("Vendor cannot be a Parent Vendor to itself."));
      _parent.setId(-1);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "vendor",
                         qsTr("sCheckParent exception: ") + e);
  }
}

function sCheckFreightAmount()
{
  try
  {
    if (_freightAllowedAmount.text.length > 0)
      _freightAllowedWeight.clear();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "vendor",
                         qsTr("sCheckFreightAmount exception: ") + e);
  }
}

function sCheckFreightWeight()
{
  try
  {
    if (_freightAllowedWeight.text.length > 0)
      _freightAllowedAmount.clear();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "vendor",
                         qsTr("sCheckFreightWeight exception: ") + e);
  }
}

function populate(pVendid)
{
  try
  {
//    QMessageBox.critical(mywindow, "vendor", qsTr("populate called"));

    var params = new Object();
    params.catvendor_vend_id = pVendid;

    var qry = "SELECT * FROM xwd.catvendor WHERE catvendor_vend_id=<? value('catvendor_vend_id') ?>;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _catvendorid = data.value("catvendor_id");
      _costColumn.setId(data.value("catvendor_costcolumn"));
      _parent.setId(data.value("catvendor_parent_id"));
      _catparentid = data.value("catvendor_parent_id");
      if (data.value("catvendor_freight_allowed_amount") > 0.0)
        _freightAllowedAmount.setDouble(data.value("catvendor_freight_allowed_amount"));
      if (data.value("catvendor_freight_allowed_weight") > 0.0)
        _freightAllowedWeight.setDouble(data.value("catvendor_freight_allowed_weight"));
    }
    else if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "vendor",
                         qsTr("populate exception: ") + e);
  }
}

function save(pVendid)
{
  try
  {
//    QMessageBox.critical(mywindow, "vendor", qsTr("save called"));

    var params = new Object();
    params.catvendor_id = _catvendorid;
    params.catvendor_vend_id = pVendid;
    params.catvendor_costcolumn = _costColumn.id();
    if (_parent.isValid())
      params.catvendor_parent_id = _parent.id();
    if (_freightAllowedAmount.text.length > 0)
      params.catvendor_freight_allowed_amount = _freightAllowedAmount.toDouble();
    if (_freightAllowedWeight.text.length > 0)
      params.catvendor_freight_allowed_weight = _freightAllowedWeight.toDouble();

    if (_costColumn.id() == 0 && !_parent.isValid() && _freightAllowedAmount.text.length == 0 & _freightAllowedWeight.text.length == 0)
      var qry = "DELETE FROM xwd.catvendor "
               +"WHERE (catvendor_id=<? value('catvendor_id') ?>);";
    else if (_catvendorid == -1)
      var qry = "INSERT INTO xwd.catvendor"
               +" (catvendor_vend_id, catvendor_costcolumn, catvendor_parent_id, catvendor_freight_allowed_amount, catvendor_freight_allowed_weight) "
               +"VALUES"
               +" (<? value('catvendor_vend_id') ?>,"
               +"  <? value('catvendor_costcolumn') ?>,"
               +"  <? value('catvendor_parent_id') ?>,"
               +"  <? value('catvendor_freight_allowed_amount') ?>,"
               +"  <? value('catvendor_freight_allowed_weight') ?>);";
    else
      var qry = "UPDATE xwd.catvendor"
               +" SET catvendor_costcolumn=<? value('catvendor_costcolumn') ?>,"
               +"     catvendor_parent_id=<? value('catvendor_parent_id') ?>,"
               +"     catvendor_freight_allowed_amount=<? value('catvendor_freight_allowed_amount') ?>,"
               +"     catvendor_freight_allowed_weight=<? value('catvendor_freight_allowed_weight') ?> "
               +"WHERE (catvendor_id=<? value('catvendor_id') ?>);";

    var data = toolbox.executeQuery(qry, params);
    if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);

    if (_parent.id() != _catparentid && _parent.isValid())
    {
      var answer = QMessageBox.question(mywindow,
                           qsTr("Copy Item Sources"),
                           qsTr("<p>Copy the Item Sources for this Vendor to the Parent Vendor?"),
                           QMessageBox.Yes | QMessageBox.No,
                           QMessageBox.Yes);
      if(answer == QMessageBox.Yes)
      {
        var qry = "SELECT xwd.copyVendItemsrc(<? value('catvendor_vend_id') ?>, <? value('catvendor_parent_id') ?>) AS result;"

        var data = toolbox.executeQuery(qry, params);
        if (data.lastError().type != QSqlError.NoError)
          throw new Error(data.lastError().text);
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "vendor",
                         qsTr("save exception: ") + e);
  }
}
