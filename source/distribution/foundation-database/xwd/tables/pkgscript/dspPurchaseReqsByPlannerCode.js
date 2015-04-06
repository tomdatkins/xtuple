debugger;

try
{
  var _list = mywindow.list();
  _list.addColumn(qsTr("Vendor #"), XTreeWidget.orderColumn, Qt.AlignLeft, true, "vend_number");
  _list.addColumn(qsTr("Amount"), XTreeWidget.moneyColumn, Qt.AlignRight, true, "amount");
  _list.addColumn(qsTr("Freight Allowed"), XTreeWidget.moneyColumn, Qt.AlignRight, true, "freight_allowed");
  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(sPopulateVendorMenu);
  toolbox.coreDisconnect(_list, "populateMenu(QMenu *, QTreeWidgetItem *, int)", mywindow, "sPopulateMenu(QMenu *, QTreeWidgetItem *, int)");

  with (_list)
  {
    moveColumn(column("vend_number"),column("pr_number"));
    moveColumn(column("amount"),column("netableqoh"));
    moveColumn(column("freight_allowed"),column("netableqoh"));
  }

  var _warehouse = mywindow.findChild("_warehouse");
  var _layout  = toolbox.widgetGetLayout(_warehouse);

  var _byVendor = toolbox.createWidget("XCheckBox", mywindow, "_byVendor");
  _byVendor.text = qsTr("Sort by Vendor");
  _byVendor.enabled = true;
  _layout.addWidget( _byVendor, 1, 1);
  _byVendor.toggled.connect(sHandleByVendor);

}
catch (e)
{
  QMessageBox.critical(mywindow, "dspPurchaseReqsByPlannerCode",
                       "dspPurchaseReqsByPlannerCode.js exception: " + e);
}

function sHandleByVendor()
{
  try
  {
    if (_byVendor.checked)
      mywindow.setMetaSQLOptions("purchase", "purchaserequestsxwd");
    else
      mywindow.setMetaSQLOptions("purchase", "purchaserequests");
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspPurchaseReqsByPlannerCode",
                         qsTr("sHandleByVendor exception: ") + e);
  }
}

function sPopulateVendorMenu(pMenu, pItem, pCol)
{
  try
  {
    if(pMenu == null)
      pMenu = _list.findChild("_menu");
  
    if(pMenu != null)
    {
      if (_list.altId() == -1)
      {
        tmpact = pMenu.addAction(qsTr("Release P/R's by Vendor..."));
        tmpact.enabled = true;
        tmpact.triggered.connect(sReleaseVendor);
        tmpact = pMenu.addAction(qsTr("Run MRP by Planner/Vendor..."));
        tmpact.enabled = true;
        tmpact.triggered.connect(sMRPVendor);
      }
      else
      {
        mywindow.sPopulateMenu(pMenu, pItem, pCol)
        tmpact = pMenu.addAction(qsTr("Usage Statistics..."));
        tmpact.enabled = true;
        tmpact.triggered.connect(sUsageStatistics);
      }
    }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "dspPurchaseReqsByPlannerCode",
                         "sPopulateMenu exception: " + e);
  }
}

function sReleaseVendor()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Release by Vendor?"),
                            qsTr("Are you sure you want to release all P/R's for this Vendor?"),
                            QMessageBox.Yes,
                            QMessageBox.No | QMessageBox.Default)
                            == QMessageBox.No)
      return;

    var params = new Object();
    params.vend_id = _list.id();

    var qry = "SELECT xwd.releaseVendorPR(<? value('vend_id') ?>) AS result;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var _result = data.value("result");
      if (_result < 0)
      {
        QMessageBox.critical(mywindow, "dspPurchaseReqsByPlannerCode",
                             "releaseVendorPR returned result " + _result);
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspPurchaseReqsByPlannerCode",
                         "sReleaseVendor exception: " + e);
  }
}

function sMRPVendor()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("MRP by PlannerVendor?"),
                            qsTr("Are you sure you want to run MRP for this Planner/Vendor?"),
                            QMessageBox.Yes,
                            QMessageBox.No | QMessageBox.Default)
                            == QMessageBox.No)
      return;

    var params = new Object();
    params.vend_id = _list.id();

    var qry = "SELECT createPlannedOrders(itemsite_id, (CURRENT_DATE + 365),"
            + "                           FALSE, FALSE, FALSE) AS result "
            + "FROM vendinfo LEFT OUTER JOIN char ON (UPPER(char_name)='VENDORPLANNER')"
            + "              LEFT OUTER JOIN charass ON (charass_target_type='V' AND"
            + "                                          charass_target_id=vend_id AND"
            + "                                          charass_char_id=char_id)"
            + "              JOIN plancode ON (plancode_code=COALESCE(charass_value, vend_number))"
            + "              JOIN itemsite ON (itemsite_plancode_id=plancode_id) "
            + "              JOIN item ON (item_id=itemsite_item_id) "
            + "WHERE (vend_id=<? value('vend_id') ?>)"
            + "  AND (itemsite_active)"
            + "  AND (item_active)"
            + "  AND (itemsite_planning_type='M');";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var qry2 = "SELECT releasePlannedOrder(planord_id,"
               + "                           TRUE, FALSE) AS result "
               + "FROM vendinfo LEFT OUTER JOIN char ON (UPPER(char_name)='VENDORPLANNER')"
               + "              LEFT OUTER JOIN charass ON (charass_target_type='V' AND"
               + "                                          charass_target_id=vend_id AND"
               + "                                          charass_char_id=char_id)"
               + "              JOIN plancode ON (plancode_code=COALESCE(charass_value, vend_number))"
               + "              JOIN itemsite ON (itemsite_plancode_id=plancode_id) "
               + "              JOIN planord ON (planord_itemsite_id=itemsite_id) "
               + "WHERE (vend_id=<? value('vend_id') ?>);";

      var data2 = toolbox.executeQuery(qry2, params);
      if (data2.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data2.lastError().text);
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspPurchaseReqsByPlannerCode",
                         "sReleaseVendor exception: " + e);
  }
}

function sUsageStatistics()
{
  try
  {
    var params = new Object;
    params.itemsite_id = _list.altId();
    var qry = "SELECT itemsite_item_id, itemsite_warehous_id "
            + "FROM itemsite "
            + "WHERE (itemsite_id=<? value('itemsite_id') ?>);";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      params.item_id = data.value("itemsite_item_id");
      params.warehous_id = data.value("itemsite_warehous_id");
      params.run = true;
      var wnd = toolbox.openWindow("dspTimePhasedUsageStatisticsByItem", 0, Qt.NonModal, Qt.Window);
      wnd.set(params);
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
    QMessageBox.critical(mywindow, "dspPurchaseReqsByPlannerCode",
                         "sUsageStatistics exception: " + e);
  }
}

