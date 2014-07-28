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

try
{
  var _price_src_name       = mywindow.findChild("_price_src_name");
  var _provider             = mywindow.findChild("_provider");
  var _mfr_ucc_num          = mywindow.findChild("_mfr_ucc_num");
  var _mfr_shortname        = mywindow.findChild("_mfr_shortname");
  var _mfr_fullname         = mywindow.findChild("_mfr_fullname");
  var _cat_num              = mywindow.findChild("_cat_num");
  var _comm_code            = mywindow.findChild("_comm_code");
  var _product_name         = mywindow.findChild("_product_name");
  var _product_category     = mywindow.findChild("_product_category");
  var _upc                  = mywindow.findChild("_upc");
  var _mfr_description      = mywindow.findChild("_mfr_description");
  var _2k_desc              = mywindow.findChild("_2k_desc");
  var _ps_uom               = mywindow.findChild("_ps_uom");
  var _ps_lgcy_uom          = mywindow.findChild("_ps_lgcy_uom");
  var _list                 = mywindow.findChild("_list");
  var _custom_price1        = mywindow.findChild("_custom_price1");
  var _col3                 = mywindow.findChild("_col3");
  var _cost                 = mywindow.findChild("_cost");
  var _ps_dscnt_schd_code   = mywindow.findChild("_ps_dscnt_schd_code");
  var _layout               = mywindow.findChild("_webviewLayout");
  var _productImage         = new QWebView();
  _layout.insertWidget(0, _productImage, 0, 0);
  var _viewPDF              = mywindow.findChild("_viewPDF");

  var _save                 = mywindow.findChild("_save");
  var _close                = mywindow.findChild("_close");

  var _catalogid = -1;
  var _mode = '';
  var _pdfurl = '';

  _close.clicked.connect(myclose);
  _viewPDF.clicked.connect(viewpdf);
  mydialog.rejected.connect(myclose);
}
catch (e)
{
  QMessageBox.critical(mywindow, "catalog",
                       "catalog.js exception: " + e);
}

function set(params)
{
  if ("mode" in params)
    _mode = params.mode;

  if ("catalog_id" in params)
  {
    _catalogid = params.catalog_id;
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
    var params = new Object();
    params.catalog_id = _catalogid;

    var qry = "SELECT *, COALESCE(catalog_i2_cat_num, catalog_mfr_cat_num) AS cat_num "
            + "FROM xwd.catalog "
            + "WHERE (catalog_id = <? value('catalog_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _price_src_name.setText(data.value("catalog_price_src_name"));
      _provider.setText(data.value("catalog_provider"));
      _mfr_ucc_num.setText(data.value("catalog_mfr_ucc_num"));
      _mfr_shortname.setText(data.value("catalog_mfr_shortname"));
      _mfr_fullname.setText(data.value("catalog_mfr_fullname"));
      _cat_num.setText(data.value("cat_num"));
      _comm_code.setText(data.value("catalog_comm_code"));
      _product_name.setText(data.value("catalog_product_name"));
      _product_category.setText(data.value("catalog_product_category"));
      _upc.setText(data.value("catalog_upc"));
      _mfr_description.setText(data.value("catalog_mfr_description"));
      _2k_desc.setText(data.value("catalog_2k_desc"));
      _ps_uom.setText(data.value("catalog_ps_uom"));
      _ps_lgcy_uom.setText(data.value("catalog_ps_lgcy_uom"));
      _list.setDouble(data.value("catalog_list"));
      _custom_price1.setDouble(data.value("catalog_custom_price1"));
      _col3.setDouble(data.value("catalog_col3"));
      _cost.setDouble(data.value("catalog_cost"));
      _ps_dscnt_schd_code.setText(data.value("catalog_ps_dscnt_schd_code"));
      _productImage.load(QUrl(data.value("catalog_web_url")));
      _pdfurl = data.value("catalog_pdf_url");
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catalog",
                         "populate exception: " + e);
  }
}

function save()
{
  try
  {
    var q_str = "UPDATE xwd.catalog "
              + "SET catalog_mfr_ucc_num=<? value('mfr_ucc_num') ?>,"
              + "    catalog_mfr_shortname=<? value('mfr_shortname') ?>,"
              + "    catalog_mfr_fullname=<? value('mfr_fullname') ?>,"
              + "    catalog_comm_code=<? value('comm_code') ?>,"
              + "    catalog_product_name=<? value('product_name') ?>,"
              + "    catalog_product_category=<? value('product_category') ?>,"
              + "    catalog_upc=<? value('upc') ?>,"
              + "    catalog_mfr_description=<? value('mfr_description') ?>,"
              + "    catalog_ps_uom=<? value('ps_uom') ?>,"
              + "    catalog_ps_lgcy_uom=<? value('ps_lgcy_uom') ?>,"
              + "    catalog_list=<? value('list') ?>,"
              + "    catalog_custom_price1=<? value('custom_price1') ?>,"
              + "    catalog_col3=<? value('col3') ?>,"
              + "    catalog_cost=<? value('cost') ?>,"
              + "    catalog_ps_dscnt_schd_code=<? value('dscnt_schd_code') ?> "
              + "WHERE (catalog_id = <? value('catalog_id') ?>);";
 
    var params = new Object();

    if (setParams(params))
    {
      var data = toolbox.executeQuery(q_str, params);

      if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
      }
      mywindow.close();
    }
    else
      return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catalog",
                         "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.catalog_id = _catalogid;

    if (_mfr_ucc_num.text.length > 0)
      params.mfr_ucc_num = _mfr_ucc_num.text;
    if (_mfr_shortname.text.length > 0)
      params.mfr_shortname = _mfr_shortname.text;
    if (_mfr_fullname.text.length > 0)
      params.mfr_fullname = _mfr_fullname.text;
    if (_comm_code.text.length > 0)
      params.comm_code = _comm_code.text;
    if (_product_name.text.length > 0)
      params.product_name = _product_name.text;
    if (_product_category.text.length > 0)
      params.product_category = _product_category.text;
    if (_upc.text.length > 0)
      params.upc = _upc.text;
    if (_mfr_description.text.length > 0)
      params.mfr_description = _mfr_description.text;
    if (_ps_uom.text.length > 0)
      params.ps_uom = _ps_uom.text;
    if (_ps_lgcy_uom.text.length > 0)
      params.ps_lgcy_uom = _ps_lgcy_uom.text;
    if (_list.toDouble() > 0.0)
      params.list = _list.toDouble();
    if (_custom_price1.toDouble() > 0.0)
      params.custom_price1 = _custom_price1.toDouble();
    if (_col3.toDouble() > 0.0)
      params.col3 = _col3.toDouble();
    if (_cost.toDouble() > 0.0)
      params.cost = _cost.toDouble();
    if (_ps_dscnt_schd_code.text.length > 0)
      params.ps_dscnt_schd_code = _ps_dscnt_schd_code.text;

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catalog",
                         "setParams(params) exception: " + e);
  }
}

function viewpdf()
{
  try
  {
    toolbox.openUrl(QUrl(_pdfurl));
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catalog",
                         "viewpdf exception: " + e);
  }
}

function myclose()
{
  try
  {
    if (_mode == "new")
    {
      if (QMessageBox.question(mywindow, qsTr("Save Product Catalog?"),
                              qsTr("Are you sure you want to close without saving the new Product Catalog?"),
                              QMessageBox.Yes,
                              QMessageBox.No | QMessageBox.Default)
                              == QMessageBox.No)
        return;
    }
    mywindow.close();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catalog",
                         "myclose exception: " + e);
  }
}