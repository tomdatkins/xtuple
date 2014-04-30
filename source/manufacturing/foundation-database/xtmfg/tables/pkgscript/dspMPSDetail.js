/*
This file is part of the xtmfg Package for xTuple ERP,
and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
is licensed to you under the xTuple End-User License Agreement ("the
EULA"), the full text of which is available at www.xtuple.com/EULA.
While the EULA gives you access to source code and encourages your
involvement in the development process, this Package is not free
software.  By using this software, you agree to be bound by the
terms of the EULA.
*/
debugger;

include("ParameterGroupUtils", "storedProcErrorLookup", "xtmfgErrors");

var _column     = 0;
var _qtyScale   = toolbox.decimalPlaces("qty");

var _calendar   = mywindow.findChild("_calendar");
var _close      = mywindow.findChild("_close");
var _itemsite   = mywindow.findChild("_itemsite");
var _mps        = mywindow.findChild("_mps");
var _periods    = mywindow.findChild("_periods");
var _plannerCode= mywindow.findChild("_plannerCode");
var _print      = mywindow.findChild("_print");
var _warehouse  = mywindow.findChild("_warehouse");

_plannerCode.type = ParameterGroup.PlannerCode;

_itemsite.addColumn("Itemtype",                              0, Qt.AlignCenter,false,"item_type");
_itemsite.addColumn(qsTr("Item Number"),XTreeWidget.itemColumn, Qt.AlignLeft,  true, "item_number");
_itemsite.addColumn(qsTr("Description"),                    -1, Qt.AlignLeft,  true, "item_descrip1");
_itemsite.addColumn(qsTr("Description"),                    -1, Qt.AlignLeft,  true, "item_descrip2");
_itemsite.addColumn(qsTr("Site"),        XTreeWidget.whsColumn, Qt.AlignCenter,true, "warehous_code");
_itemsite.addColumn(qsTr("Safety Stock"),XTreeWidget.qtyColumn, Qt.AlignRight, true, "itemsite_safetystock");

_mps.addColumn("", 120, Qt.AlignRight);

{
var cid = metrics.value("DefaultMSCalendar");
if (cid > 0)
  _calendar.setId(cid);
}

sFillItemsites();

function set(pParams)
{
  if ("itemsite_id" in pParams)
  {
    _warehouse.setAll();
    sFillItemsites();
    _itemsite.setId(pParams.itemsite_id);
  }

  return mainwindow.NoError;
}

function sPrint()
{
  // TODO: why is this so different from sFillList?
  if ( (_periods.isPeriodSelected()) && (_itemsite.id() != -1))
  {
    var params = new Object;
    params.itemsite_id = _itemsite.id();
    params.periods     = _periods.periodString();
    var wsq = toolbox.executeQuery('SELECT xtmfg.mpsReport(<? value("itemsite_id") ?>,'
                                 + '    <? value("periods") ?>) AS worksetid;', params);
    if (wsq.first())
    {
      if (wsq.value("worksetid") < 0)
      {
        QMessageBox.critical(mywindow, qsTr("MPS Error"),
                           storedProcErrorLookup("mpsReport", result, xtmfgErrors));
        return;
      }

      if (_warehouse.isSelected())
        params.warehouse_id = _warehouse.id();

      ParameterGroup.appendValue(_plannerCode, params);

      var selected = _periods.selectedItems();
      params.period_id_list = new Array;
      for (var i = 0; i < selected.length; i++)
	params.period_id_list[i] = selected[i].id();

      params.workset_id = wsq.value("worksetid");

      toolbox.printReport("MPSDetail", params);

      toolbox.executeQuery('SELECT deleteMPSMRPWorkset(<? value("workset_id") ?>)'
                         + ' AS result;',
                           params);

    }
    else if (wsq.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         wsq.lastError().text);
      return;
    }
  }
  else
    QMessageBox.critical(mywindow, qsTr("Incomplete criteria"),
                       qsTr("<p>The criteria you specified are not complete. "
			  + "Please make sure all fields are correctly filled "
			  + "out before running the report." ) );
}

function sPopulateMenu(pMenu, pItem, pColumn)
{
  var menuItem;
  var mpsIndex = 0;

  _column = pColumn;

  var firstValue = new Object;  // of each itemtype
  for (var i = 0; i < _mps.topLevelItemCount; i++)
  {
    if (! (_mps.topLevelItem(i).text('item_type') in firstValue))
      firstValue[_mps.topLevelItem(i).text('item_type')] = _mps.topLevelItem(i).rawValue(pColumn);
  }

  menuItem = pMenu.addAction(qsTr("View Allocations..."));
  menuItem.enabled = (firstValue[qsTr("Allocations")] != 0);
  menuItem.triggered.connect(sViewAllocations);

  menuItem = pMenu.addAction(qsTr("View Orders..."));
  menuItem.enabled = (firstValue[qsTr("Orders")] != 0);
  menuItem.triggered.connect(sViewOrders);

  pMenu.addSeparator();

  if (_itemsite.currentItem().text('item_type') == "P")
  {
    menuItem = pMenu.addAction(qsTr("Issue P/R..."));
    menuItem.enabled = privileges.check("MaintainPurchaseRequests");
    menuItem.triggered.connect(sIssuePR);

    menuItem = pMenu.addAction(qsTr("Issue P/O..."));
    menuItem.enabled = privileges.check("MaintainPurchaseOrders");
    menuItem.triggered.connect(sIssuePO);
  }
  else if (_itemsite.currentItem().text('item_type') == "M")
  {
    menuItem = pMenu.addAction(qsTr("Issue W/O..."));
    menuItem.enabled = privileges.check("MaintainWorkOrders");
    menuItem.triggered.connect(sIssueWO);
  }
}

function sViewAllocations()
{
  var params = new Object;
  params.itemsite_id = _itemsite.id();
  params.byRange     = true;
  params.startDate   = _periods["getSelected(int)"](_column).startDate();
  params.endDate     = _periods["getSelected(int)"](_column).endDate();
  params.run         = true;

  var newdlg = toolbox.openWindow("dspAllocations", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sViewOrders()
{
  var params = new Object;
  params.itemsite_id = _itemsite.id();
  params.byRange     = true;
  params.startDate   = _periods["getSelected(int)"](_column).startDate();
  params.endDate     = _periods["getSelected(int)"](_column).endDate();
  params.run         = true;

  var newdlg = toolbox.openWindow("dspOrders", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sIssuePR()
{
  var params = new Object;
  params.mode        = "new";
  params.itemsite_id = _itemsite.id();

  var newdlg = toolbox.openWindow("purchaseRequest", mywindow,
                                  Qt.WindowModal, Qt.Dialog);
  newdlg.set(params);

  if (newdlg.exec() != QDialog.Rejected)
    sFillMPSDetail();
}

function sIssuePO()
{
  var params = new Object;
  params.mode        = "new";
  params.itemsite_id = _itemsite.id();

  var newdlg = toolbox.openWindow("purchaseOrder", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sIssueWO()
{
  var params = new Object;
  params.mode        = "new";
  params.itemsite_id = _itemsite.id();

  var newdlg = toolbox.openWindow("workOrder", 0, Qt.NonModal, Qt.Window);
  newdlg.set(params);
}

function sFillItemsites()
{
  var params = new Object;
  if (_warehouse.isSelected())
    params.warehouse_id = _warehouse.id();

  ParameterGroup.appendValue(_plannerCode, params);

  var q = toolbox.executeQuery("SELECT itemsite_id, item_type, item_number,"
                     + "       item_descrip1,item_descrip2,"
                     + "       warehous_code, itemsite_safetystock,"
                     + "       'qty' AS itemsite_safetystock_xtnumericrole "
                     + "FROM itemsite, item, whsinfo "
                     + "WHERE ((itemsite_active)"
                     + " AND (itemsite_item_id=item_id)"
                     + " AND (itemsite_warehous_id=warehous_id)"
                     + " AND (itemsite_planning_type='S')"
                     + ' <? if exists("plancode_id") ?>'
                     + ' AND (itemsite_plancode_id=<? value("plancode_id") ?>)'
                     + ' <? elseif exists("plancode_pattern") ?>'
                     + ' AND (itemsite_plancode_id IN ('
                     + '                 SELECT plancode_id'
                     + '                 FROM plancode'
                     + '                 WHERE (plancode_code ~ <? value("plancode_pattern") ?>)))'
                     + '<? endif ?>'
                     + ' <? if exists("warehouse_id") ?>'
                     + ' AND (warehous_id=<? value("warehouse_id") ?>)'
                     + '<? endif ?>'
                     + ") "
                     + "ORDER BY item_number, warehous_code;",
                    params);

  _itemsite.populate(q);
  if (q.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), q.lastError().text);
    return;
  }
}

function sFillMPSDetail()
{
  _mps.clear();
  _mps.setColumnCount(1);

  if (_periods.isPeriodSelected())
  {
    var params = new Object;
    params.itemsite_id = _itemsite.id();
    params.extracolumns = "";

    var selected = _periods.selectedItems();
    var counter  = selected.length;
    for (var i = 1; i <= selected.length; i++)
    {
      var cursor = selected[i - 1];
      var start  = "findPeriodStart(" + cursor.id() + ")";
      var end    = "findPeriodEnd("   + cursor.id() + ")";
      params.extracolumns +=
        ", qtyAllocated(itemsite_id, " + start + ", " + end + ") AS allocations" + i
      + ", qtyOrdered(itemsite_id, "   + start + ", " + end + ") AS orders"   + i
      + ", qtyPlanned(itemsite_id, "   + start + ", " + end + ") AS planned"  + i
      + ", xtmfg.qtyForecasted(itemsite_id, "+ start + ", " + end + ") AS forecast" + i
      + ", (" + start + " < (CURRENT_DATE+itemsite_mps_timefence)) AS inside" + i;

      _mps.addColumn(toolbox.formatDate(cursor.startDate()), XTreeWidget.qtyColumn,
                     Qt.AlignRight, true, '', '', toolbox.decimalPlaces("qty"));
    }

    var q = toolbox.executeQuery(
                      "SELECT itemsite_qtyonhand, itemsite_safetystock"
                    + '       <? literal("extracolumns") ?>'
                    + " FROM itemsite "
                    + 'WHERE (itemsite_id=<? value("itemsite_id") ?>);',
                    params)

    if (q.first())
    {

      var forecasted = Number(q.value("forecast1"));
      var actual     = Number(q.value("allocations1"));
      var demand     = (forecasted > actual && ! q.value("inside1")) ?
                         forecasted : actual;
      var orders     = Number(q.value("orders1"));
      var planned    = Number(q.value("planned1"));
      var runningAvailability = Number(q.value("itemsite_qtyonhand")) - demand + orders + planned;
      var toPromise           = Number(q.value("itemsite_qtyonhand")) + orders + planned - actual;
      var lastAtp = 1;

      var forecastrow    = new XTreeWidgetItem(_mps, 0, qsTr("Forecast"),      forecasted);
      var allocationsrow = new XTreeWidgetItem(_mps, 0, qsTr("Allocations"),   actual);
      var ordersrow      = new XTreeWidgetItem(_mps, 0, qsTr("Orders"),        orders);
      var availabilityrow= new XTreeWidgetItem(_mps, 0, qsTr("Projected QOH"), runningAvailability);
      var plannedrow     = new XTreeWidgetItem(_mps, 0, qsTr("Planned Orders"),planned);
      var qohrow         = new XTreeWidgetItem(_mps, 0, qsTr("Availability"),  runningAvailability - planned);
      var availablerow   = new XTreeWidgetItem(_mps, 0, qsTr("Available to Promise"));

      var bucketCounter;
      for (bucketCounter = 2; bucketCounter <= counter; bucketCounter++)
      {
        forecasted = Number(q.value("forecast"    + bucketCounter));
        actual     = Number(q.value("allocations" + bucketCounter));
        demand     = ((forecasted > actual) && ! q.value("inside" + bucketCounter)) ? forecasted : actual;
        orders     = Number(q.value("orders"      + bucketCounter));
        planned    = Number(q.value("planned" + bucketCounter));
        runningAvailability += orders - demand;

        if (orders > 0.0 || planned > 0.0)
        {
          availablerow.setData(lastAtp, XTreeWidget.RawRole, toPromise);
          availablerow.setData(lastAtp,XTreeWidget.EditRole, toolbox.formatQty(toPromise));
          lastAtp = bucketCounter;
          if (toPromise > 0.0)
            toPromise = 0.0;
          toPromise += orders + planned;
        }
        toPromise -= actual;

        forecastrow.setData(bucketCounter,    XTreeWidget.RawRole, forecasted);
        forecastrow.setData(bucketCounter,   XTreeWidget.EditRole, toolbox.formatQty(forecasted));
        allocationsrow.setData(bucketCounter, XTreeWidget.RawRole, actual);
        allocationsrow.setData(bucketCounter,XTreeWidget.EditRole, toolbox.formatQty(actual));
        ordersrow.setData(bucketCounter,      XTreeWidget.RawRole, orders);
        ordersrow.setData(bucketCounter,     XTreeWidget.EditRole, toolbox.formatQty(orders));
        qohrow.setData(bucketCounter,         XTreeWidget.RawRole, runningAvailability);
        qohrow.setData(bucketCounter,        XTreeWidget.EditRole, toolbox.formatQty(runningAvailability));
        plannedrow.setData(bucketCounter,     XTreeWidget.RawRole, planned);
        plannedrow.setData(bucketCounter,    XTreeWidget.EditRole, toolbox.formatQty(planned));

        runningAvailability += planned;
        availabilityrow.setData(bucketCounter, XTreeWidget.RawRole, runningAvailability);
        availabilityrow.setData(bucketCounter,XTreeWidget.EditRole, toolbox.formatQty(runningAvailability));
      }
      availablerow.setData(lastAtp, XTreeWidget.RawRole, toPromise);
      availablerow.setData(lastAtp,XTreeWidget.EditRole, toolbox.formatQty(toPromise));
    }
  }
}

_close.clicked.connect(mywindow, "close");
_itemsite["itemSelected(int)"].connect(sFillMPSDetail);
_itemsite.itemSelectionChanged.connect(sFillMPSDetail);
_mps["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_plannerCode.updated.connect(sFillItemsites);
_print.clicked.connect(sPrint);
_warehouse.updated.connect(sFillItemsites);
