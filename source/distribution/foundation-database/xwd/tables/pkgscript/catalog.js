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