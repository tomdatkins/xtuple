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
  var _captive         = false;
  var _close           = mywindow.findChild("_close");
  var _query           = mywindow.findChild("_query");
  var _view            = mywindow.findChild("_view");
  var _convert         = mywindow.findChild("_convert");
  var _parameterWidget = mywindow.findChild("_parameterWidget");
  var _queryLimit      = mywindow.findChild("_queryLimit");
  var _list            = mywindow.findChild("_catalog");
  var _commCode        = mywindow.findChild("_commCode");

  _parameterWidget.append(qsTr("Manufacturer"), "mfr", ParameterWidget.Text);
  _parameterWidget.append(qsTr("Catalog Number"), "catnum", ParameterWidget.Text);
  _parameterWidget.append(qsTr("UPC"), "upc", ParameterWidget.Text);
  _parameterWidget.append(qsTr("Product Name"), "name", ParameterWidget.Text);
  _parameterWidget.append(qsTr("Mfr. Description"), "description", ParameterWidget.Text);
  _parameterWidget.append(qsTr("General Search"), "search_pattern", ParameterWidget.Text);
  _parameterWidget.append(qsTr("Trade Service Electric Only"), "provider_tse", ParameterWidget.Exists);
  _parameterWidget.append(qsTr("Trade Service Plumbing Only"), "provider_tsp", ParameterWidget.Exists);
  _parameterWidget.applyDefaultFilterSet();

  _list.addColumn(qsTr("Provider"),            XTreeWidget.itemColumn, Qt.AlignLeft,  true, "catalog_provider");
  _list.addColumn(qsTr("Mfr. Name"),           XTreeWidget.itemColumn, Qt.AlignLeft,  true, "catalog_mfr_fullname");
  _list.addColumn(qsTr("Cat. Num."),           XTreeWidget.itemColumn, Qt.AlignLeft,  true, "cat_num");
  _list.addColumn(qsTr("Comm. Code"),          XTreeWidget.itemColumn, Qt.AlignLeft,  true, "catalog_comm_code");
  _list.addColumn(qsTr("UPC"),                 XTreeWidget.itemColumn, Qt.AlignLeft,  true, "catalog_upc");
  _list.addColumn(qsTr("Prod. Name"),          XTreeWidget.itemColumn, Qt.AlignLeft,  true, "catalog_product_name");
  _list.addColumn(qsTr("Custom Price"),        XTreeWidget.itemColumn, Qt.AlignRight, true, "catalog_custom_price1");
  _list.addColumn(qsTr("Dist. Price"),         XTreeWidget.itemColumn, Qt.AlignRight, true, "catalog_cost");
  _list.addColumn(qsTr("Col3 Price"),          XTreeWidget.itemColumn, Qt.AlignRight, true, "catalog_col3");
  _list.addColumn(qsTr("List Price"),          XTreeWidget.itemColumn, Qt.AlignRight, true, "catalog_list");
  _list.addColumn(qsTr("Mfr. Description"),    -1,                     Qt.AlignLeft,  true, "catalog_mfr_description");

  _commCode.addColumn(qsTr("Commodity Code"),  XTreeWidget.itemColumn, Qt.AlignLeft,  true, "catcomm_comm_code");
  _commCode.addColumn(qsTr("Description"),     -1,                     Qt.AlignLeft,  true, "catcomm_comm_desc");
  _commCode.addColumn(qsTr("Parent PIK"),      XTreeWidget.itemColumn, Qt.AlignLeft,  false, "catcomm_parent_pik");
  _commCode.addColumn(qsTr("PIK"),             XTreeWidget.itemColumn, Qt.AlignLeft,  false, "catcomm_pik");

  _view.clicked.connect(sView);
  _convert.clicked.connect(sConvert);

  _close.clicked.connect(mywindow, "close");
  _query.clicked.connect(sQuery);

  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(sPopulateMenu)

  if(privileges.check("MaintainCatalog"))
  {
    _list.valid.connect(_view, "setEnabled");
    _list.valid.connect(_convert, "setEnabled");
    _list.itemSelected.connect(_view, "animateClick");
  }
  else
  {
    _list.valid.connect(_view, "setEnabled");
    _list.itemSelected.connect(_view, "animateClick");
  }

  _queryLimit.value = metrics.value("CatalogQueryLimit");

  sFillCommCode();
}
catch (e)
{
  QMessageBox.critical(mywindow, "catalogList",
                       "catalogList.js exception: " + e);
}

function set(params)
{
  if ("captive" in params)
    _captive = true;

  return;
}

function sPopulateMenu(pMenu, pItem, pCol)
{
  try
  {
    if(pMenu == null)
      pMenu = _list.findChild("_menu");
  
    if(pMenu != null)
    {
      tmpact = pMenu.addAction(qsTr("View..."));
      tmpact.enabled = (privileges.check("MaintainCatalog") || privileges.check("ViewCatalog"));
      tmpact.triggered.connect(sView);

      tmpact = pMenu.addAction(qsTr("Convert..."));
      tmpact.enabled = (privileges.check("MaintainCatalog"));
      tmpact.triggered.connect(sConvert);
    }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "catalogList",
                         "sPopulateMenu exception: " + e);
  }
}

function openCatalog(params)
{
  try
  {
    var wnd = toolbox.openWindow("catalog", mywindow, Qt.ApplicationModal, Qt.Dialog);
    var tmp = toolbox.lastWindow().set(params);
    wnd.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catalogList",
                         "openCatalog exception: " + e);
  }
}

function sView()
{
  var params = new Object;
  params.mode = "view";
  params.catalog_id = _list.id();

  openCatalog(params);
}

function sConvert()
{
  try
  {
    var answer = QMessageBox.question(mywindow,
                         qsTr("Convert Product Catalog"),
                         qsTr("<p>Are you sure that you want to convert the selected Catalog Item?"),
                         QMessageBox.Yes | QMessageBox.No,
                         QMessageBox.Yes);
    if(answer == QMessageBox.Yes)
    {
      var params = new Object;
      params.catalog_id = _list.id();

      qry = toolbox.executeQuery('SELECT xwd.convertCatalog(<? value("catalog_id") ?>) AS result;',
                                 params );
      if (qry.first())
      {
        var result = qry.value("result");
        if (result < 0)
        {
          QMessageBox.critical(mywindow, qsTr("Processing Error"),
                               storedProcErrorLookup("convertCatalog", result, xwdErrors));
          return;
        }

//        params.item_id = result;
//        params.mode = "edit";
//        var wnd = toolbox.openWindow("item", 0, Qt.NonModal, Qt.Window);
//        wnd.set(params);

        if (_captive)
          mydialog.done(result);
//        else
//          sQuery();
      }
      else if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return;
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catalogList",
                         "sConvert exception: " + e);
  }
}

function sQuery()
{
  sFillList(-1, true);
//  sFillCommCode();
}

function sFillList(pItemid, pLocal)
{
  try
  {
    var params = new Object;
    params = _parameterWidget.parameters();
    var currentItem  = _commCode.currentItem();
    if (currentItem != null)
    {
      if (currentItem.rawValue("catcomm_pik") != 0)
        params.commpik = currentItem.rawValue("catcomm_pik");
    }
    params.queryLimit = _queryLimit.value;
    var qry = toolbox.executeDbQuery("catalog", "detail", params);
    if((pItemid != -1) && pLocal)
      _list.populate(qry, pItemid, true);
    else
      _list.populate(qry, true);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catalogList",
                         "sFillList exception: " + e);
  }
}

function sFillCommCode()
{
  try
  {
    var params = new Object;
    params = _parameterWidget.parameters();
    var qry = toolbox.executeDbQuery("catcomm", "detail", params);
    _commCode.populate(qry, true);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catalogList",
                         "sFillCommCode exception: " + e);
  }
}
