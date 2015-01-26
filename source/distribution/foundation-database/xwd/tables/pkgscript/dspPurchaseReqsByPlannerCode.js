debugger;

try
{
  var _list = mywindow.list();
  _list.addColumn(qsTr("Vendor #"), XTreeWidget.orderColumn, Qt.AlignLeft, true, "vend_number");
  _list.addColumn(qsTr("Amount"), XTreeWidget.moneyColumn, Qt.AlignRight, true, "amount");
  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(sPopulateVendorMenu)

  with (_list)
  {
    moveColumn(column("vend_number"),column("pr_number"));
    moveColumn(column("amount"),column("netableqoh"));
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
