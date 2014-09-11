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

/*
   TODO: several actions appear in different places and have separate
   QActions for each place. they should be shared.
   problem: they're currently different because the displayed text differs
   the different menus.
*/

var tmpaction;

function laborRates()
{
  try {
    toolbox.openWindow("laborRates", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::laborRates() exception @ " + e.lineNumber + ": " + e);
  }
}

function workCenters()
{
  try {
    toolbox.openWindow("workCenters", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::workCenters() exception @ " + e.lineNumber + ": " + e);
  }
}

function standardOperations()
{
  try {
    toolbox.openWindow("standardOperations", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::standardOperations() exception @ " + e.lineNumber + ": " + e);
  }
}

function sCreateBufferStatusByPlannerCode()
{
  toolbox.openWindow("createBufferStatusByPlannerCode", mainwindow,
                     Qt.ApplicationModal);
}

function sCreateBufferStatusByItem()
{
  toolbox.openWindow("createBufferStatusByItem", mainwindow,
                     Qt.ApplicationModal);
}

function sDspInventoryBufferStatusByPlannerCode()
{
  var param = new Object;
  param.plancode = true;
  var wind = toolbox.newDisplay("dspInventoryBufferStatusByParameterList", 0, Qt.NonModal, Qt.Window);
  wind.set(param);
}

function sDspInventoryBufferStatusByClassCode()
{
  var param = new Object;
  param.classcode = true;
  var wind = toolbox.newDisplay("dspInventoryBufferStatusByParameterList", 0, Qt.NonModal, Qt.Window);
  wind.set(param);
}

function sDspInventoryBufferStatusByItemGroup()
{
  var param = new Object;
  param.itemgrp = true;
  var wind = toolbox.newDisplay("dspInventoryBufferStatusByParameterList", 0, Qt.NonModal, Qt.Window);
  wind.set(param);
}

function sDspPoItemsByBufferStatus()
{
  toolbox.newDisplay("dspPoItemsByBufferStatus", 0, Qt.NonModal, Qt.Window);
}

function sDspWoBufferStatusByPlannerCode()
{
  var param = new Object;
  param.plancode = true;
  var wind = toolbox.newDisplay("dspWoBufferStatusByParameterList", 0, Qt.NonModal, Qt.Window);
  wind.set(param);
}

function sDspWoBufferStatusByClassCode()
{
  var param = new Object;
  param.classcode = true;
  var wind = toolbox.newDisplay("dspWoBufferStatusByParameterList", 0, Qt.NonModal, Qt.Window);
  wind.set(param);
}

function sDspWoBufferStatusByItemGroup()
{
  var param = new Object;
  param.itemgrp = true;
  var wind = toolbox.newDisplay("dspWoBufferStatusByParameterList", 0, Qt.NonModal, Qt.Window);
  wind.set(param);
}

function sDspWoOperationsByWorkCenter()
{
  toolbox.newDisplay("dspWoOperationsByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function sDspWoEffortByUser()
{
  toolbox.newDisplay("dspWoEffortByUser", 0, Qt.NonModal, Qt.Window);
}

function sDspWoEffortByWorkOrder()
{
  toolbox.newDisplay("dspWoEffortByWorkOrder", 0, Qt.NonModal, Qt.Window);
}

function sDspWoOperationsByWorkOrder()
{
  toolbox.newDisplay("dspWoOperationsByWorkOrder", 0, Qt.NonModal, Qt.Window);
}

function sDspWoOperationBufrStsByWorkCenter()
{
  toolbox.newDisplay("dspWoOperationBufrStsByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function sDspPlannedREByPlannerCode()
{
  toolbox.newDisplay("dspPlannedRevenueExpensesByPlannerCode", 0, Qt.NonModal, Qt.Window);
}

function sDspRoughCutByWorkCenter()
{
  toolbox.newDisplay("dspRoughCutByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function sDspTimePhasedAvailableCapacityByWorkCenter()
{
  toolbox.newDisplay("dspTimePhasedAvailableCapacityByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function sDspTimePhasedCapacityByWorkCenter()
{
  toolbox.newDisplay("dspTimePhasedCapacityByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function sDspTimePhasedLoadByWorkCenter()
{
  toolbox.newDisplay("dspTimePhasedLoadByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function sDspTimePhasedProductionByPlannerCode()
{
  toolbox.newDisplay("dspTimePhasedProductionByPlannerCode", 0, Qt.NonModal, Qt.Window);
}

function sDspTimePhasedProductionByItem()
{
  toolbox.newDisplay("dspTimePhasedProductionByItem", 0, Qt.NonModal, Qt.Window);
}

function sDspTimePhasedPlannedREByPlannerCode()
{
  toolbox.newDisplay("dspTimePhasedPlannedREByPlannerCode", 0, Qt.NonModal, Qt.Window);
}

function sDspTimePhasedDemandByPlannerCode()
{
  toolbox.newDisplay("dspTimePhasedDemandByPlannerCode", 0, Qt.NonModal, Qt.Window);
}

function sDspTimePhasedRoughCutByWorkCenter()
{
  toolbox.newDisplay("dspTimePhasedRoughCutByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function sDspCapacityBufferStatusByWorkCenter()
{
  toolbox.newDisplay("dspCapacityBufferStatusByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function sDspLaborVarianceByWorkCenter()
{
  toolbox.newDisplay("dspLaborVarianceByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function sDspLaborVarianceByItem()
{
  toolbox.newDisplay("dspLaborVarianceByItem", 0, Qt.NonModal, Qt.Window);
}

function sDspLaborVarianceByBOOItem()
{
  toolbox.newDisplay("dspLaborVarianceByBOOItem", 0, Qt.NonModal, Qt.Window);
}

function sDspLaborVarianceByWorkOrder()
{
  toolbox.newDisplay("dspLaborVarianceByWorkOrder", 0, Qt.NonModal, Qt.Window);
}

function dspBreederDistributionVariance()
{
  toolbox.newDisplay("dspBreederDistributionVariance", 0, Qt.NonModal, Qt.Window);
}

function dspOperationsByWorkCenter()
{
  toolbox.newDisplay("dspOperationsByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function dspStandardOperationsByWorkCenter()
{
  toolbox.newDisplay("dspStandardOperationsByWorkCenter", 0, Qt.NonModal, Qt.Window);
}

function printWoRouting()
{
  var printworoutingdialog = toolbox.openWindow("printWoRouting", 0, Qt.Modal, Qt.Dialog);
  printworoutingdialog.exec();
}

function sDspMPSDetail()
{
  toolbox.openWindow("dspMPSDetail", 0, Qt.NonModal, Qt.Window);
}

function sRunMPSByPlannerCode()
{
  var runMPSByPlannerCode = toolbox.openWindow("runMPSByPlannerCode", 0, Qt.NonModal, Qt.Dialog);
  runMPSByPlannerCode.exec();
}

function sNewProductionPlan()
{
  var params = new Object;
  params.mode = "new";

  var plannedSchedule = toolbox.openWindow("plannedSchedule", 0, Qt.Modal, Qt.Window);
  var tmpdlg = toolbox.lastWindow();
  tmpdlg.set(params);
  plannedSchedule.exec();
}

function sListProductionPlans()
{
  toolbox.openWindow("plannedSchedules", 0, Qt.NonModal, Qt.Window);
}

function printProductionEntrySheet()
{
  var wnd = toolbox.openWindow("printProductionEntrySheet", 0, Qt.Modal, Qt.Dialog);
  wnd.exec();
}

function dspSequencedBOM()
{
  toolbox.newDisplay("dspSequencedBOM", 0, Qt.NonModal, Qt.Window);
}

function sNewBreederBOMs()
{
  var params = new Object;
  params.mode = "new";

  var wnd = toolbox.openWindow("bbom", 0, Qt.NonModal, Qt.Window);
  wnd.set(params);
}

function sBreederBOMs()
{
  toolbox.openWindow("bboms", 0, Qt.NonModal, Qt.Window);
}

function sNewBOO()
{
  var params = new Object;
  params.mode = "new";

  var wnd = toolbox.openWindow("boo", 0, Qt.NonModal, Qt.Window);
  wnd.set(params);
}

function sBOOs()
{
  toolbox.openWindow("booList", 0, Qt.NonModal, Qt.Window);
}

function sCopyBOO()
{
  var wnd = toolbox.openWindow("copyBOO", 0, Qt.Modal, Qt.Dialog);
  wnd.exec();
}

function sWoTimeClock()
{
  toolbox.openWindow("woTimeClock", 0, Qt.NonModal, Qt.Window);
}

function sCreateWoOperation()
{
  var params = new Object;
  params.mode = "new";

  var wnd = toolbox.openWindow("woOperation", 0, Qt.Modal, Qt.Dialog);
  wnd.set(params);
  wnd.exec();
}

function sMaintainWoOperations()
{
  toolbox.openWindow("workOrderOperations", 0, Qt.NonModal, Qt.Window);
}

function sPostOperations()
{
  var wnd = toolbox.openWindow("postOperations", 0, Qt.Modal, Qt.Dialog);
  wnd.exec();
}

function sCorrectOperationsPosting()
{
  var wnd = toolbox.openWindow("correctOperationsPosting", 0, Qt.Modal, Qt.Dialog);
  wnd.exec();
}

function sDspMRPException()
{
  var mrpexception = toolbox.newDisplay("dspMRPException", mainwindow, Qt.Modal, Qt.Dialog);
}

function sLeadTimeAnalysis()
{
  var ltanalysis = toolbox.openWindow("ltanalysis", mainwindow, Qt.Modal, Qt.Dialog);
}


var inventoryMenu         = mainwindow.findChild("menu.im");
var inventoryReportsMenu  = mainwindow.findChild("menu.im.reports");
if (metrics.boolean("BufferMgt"))
{
  inventoryReportsMenu.addSeparator();

  var inventoryReportsStatusMenu = new QMenu(qsTranslate("menuInventory", "Inventory S&tatus"), mainwindow);
  inventoryReportsStatusMenu.objectName = "menu.im.reportinvbufrsts";
  inventoryReportsMenu.addMenu(inventoryReportsStatusMenu);

  tmpaction = inventoryReportsStatusMenu.addAction(qsTranslate("menuInventory", "by &Planner Code..."));
  tmpaction.enabled = privileges.value("ViewInventoryBufferStatus");
  tmpaction.setData("ViewInventoryBufferStatus");
  tmpaction.objectName = "im.dspInventoryBufferStatusByPlannerCode";
  tmpaction.triggered.connect(sDspInventoryBufferStatusByPlannerCode);

  tmpaction = inventoryReportsStatusMenu.addAction(qsTranslate("menuInventory", "by &Class Code..."));
  tmpaction.enabled = privileges.value("ViewInventoryBufferStatus");
  tmpaction.setData("ViewInventoryBufferStatus");
  tmpaction.objectName = "im.dspInventoryBufferStatusByClassCode";
  tmpaction.triggered.connect(sDspInventoryBufferStatusByClassCode);

  tmpaction = inventoryReportsStatusMenu.addAction(qsTranslate("menuInventory", "by &Item Group..."));
  tmpaction.enabled = privileges.value("ViewInventoryBufferStatus");
  tmpaction.setData("ViewInventoryBufferStatus");
  tmpaction.objectName = "im.dspInventoryBufferStatusByItemGroup";
  tmpaction.triggered.connect(sDspInventoryBufferStatusByItemGroup);
}

// Schedule
var scheduleMenu          = mainwindow.findChild("menu.sched");
var scheduleScheduleMenu  = mainwindow.findChild("menu.sched.plannedorders");
var scheduleScheduleMRPMenu = mainwindow.findChild("menu.sched.plannedordersmrp");
var scheduleReportsMenu   = mainwindow.findChild("menu.sched.reports");

// Schedule | Planning
var schedulePlanningMenu = new QMenu(qsTranslate("menuSchedule", "&Production Plan"), mainwindow);
schedulePlanningMenu.objectName = "menu.sched.planning";
scheduleMenu.insertMenu(scheduleScheduleMenu.menuAction(), schedulePlanningMenu);

tmpaction = schedulePlanningMenu.addAction(qsTranslate("menuSchedule", "&New..."));
tmpaction.enabled = privileges.value("MaintainPlannedSchedules");
tmpaction.setData("MaintainPlannedSchedules");
tmpaction.objectName = "ms.newProductionPlan";
tmpaction.triggered.connect(sNewProductionPlan)

tmpaction = schedulePlanningMenu.addAction(qsTranslate("menuSchedule", "&List..."));
tmpaction.enabled = privileges.value("MaintainPlannedSchedules") || privileges.value("ViewPlannedSchedules");
tmpaction.setData("MaintainPlannedSchedules ViewPlannedSchedules");
tmpaction.objectName = "ms.listProductionPlans";
tmpaction.triggered.connect(sListProductionPlans)

// Schedule | Scheduling
tmpaction = scheduleScheduleMenu.addAction(qsTranslate("menuSchedule", "Run M&PS..."));
tmpaction.enabled = privileges.value("CreatePlannedOrders");
tmpaction.setData("CreatePlannedOrders");
tmpaction.objectName = "ms.runMPSByPlannerCode";
tmpaction.triggered.connect(sRunMPSByPlannerCode);

scheduleScheduleMenu.removeAction(tmpaction);
scheduleScheduleMenu.insertAction(scheduleScheduleMRPMenu.menuAction(), tmpaction);

// Schedule | Constraint Management
if (metrics.boolean("BufferMgt"))
{
  var scheduleBufferMenu = new QMenu(qsTranslate("menuSchedule", "Cons&traint Management"), mainwindow);
  scheduleBufferMenu.objectName = "menu.sched.buffer";
  scheduleMenu.insertMenu(scheduleReportsMenu.menuAction(), scheduleBufferMenu);

  // Schedule | Constraint Management | Update Status
  {
    var scheduleBufferRunMenu = new QMenu(qsTranslate("menuSchedule", "&Update Status"), mainwindow);
        scheduleBufferRunMenu.objectName = "menu.sched.bufferrun";
        scheduleBufferMenu.addMenu(scheduleBufferRunMenu);

    tmpaction = scheduleBufferRunMenu.addAction(qsTranslate("menuSchedule", "by &Planner Code..."));
    tmpaction.enabled = privileges.value("CreateBufferStatus");
    tmpaction.setData("CreateBufferStatus");
    tmpaction.objectName = "ms.runBufferStatusByPlannerCode";
    tmpaction.triggered.connect(sCreateBufferStatusByPlannerCode);

    tmpaction = scheduleBufferRunMenu.addAction(qsTranslate("menuSchedule", "by &Item..."));
    tmpaction.enabled = privileges.value("CreateBufferStatus");
    tmpaction.setData("CreateBufferStatus");
    tmpaction.objectName = "ms.runBufferStatusByItem";
    tmpaction.triggered.connect(sCreateBufferStatusByItem);

    scheduleBufferMenu.addSeparator();
  }

  // Schedule | Constraint Management | Inventory Status
  {
    var scheduleBufferInvMenu            = new QMenu(qsTranslate("menuSchedule", "&Inventory"), mainwindow);
        scheduleBufferInvMenu.objectName = "menu.sched.bufferinv";
        scheduleBufferMenu.addMenu(scheduleBufferInvMenu);


    tmpaction = scheduleBufferInvMenu.addAction(qsTranslate("menuSchedule", "by &Planner Code..."));
    tmpaction.enabled = privileges.value("ViewInventoryBufferStatus");
    tmpaction.setData("ViewInventoryBufferStatus");
    tmpaction.objectName = "ms.dspInventoryBufferStatusByPlannerCode"
    tmpaction.triggered.connect(sDspInventoryBufferStatusByPlannerCode);

    tmpaction = scheduleBufferInvMenu.addAction(qsTranslate("menuSchedule", "by &Class Code..."));
    tmpaction.enabled = privileges.value("ViewInventoryBufferStatus");
    tmpaction.setData("ViewInventoryBufferStatus");
    tmpaction.objectName = "ms.dspInventoryBufferStatusByClassCode";
    tmpaction.triggered.connect(sDspInventoryBufferStatusByClassCode);

    tmpaction = scheduleBufferInvMenu.addAction(qsTranslate("menuSchedule", "by &Item Group..."));
    tmpaction.enabled = privileges.value("ViewInventoryBufferStatus");
    tmpaction.setData("ViewInventoryBufferStatus");
    tmpaction.objectName = "ms.dspInventoryBufferStatusByItemGroup";
    tmpaction.triggered.connect(sDspInventoryBufferStatusByItemGroup);
  }

  tmpaction = scheduleBufferMenu.addAction(qsTranslate("menuSchedule", "&Purchase Order..."));
  tmpaction.enabled = privileges.value("ViewPurchaseOrders");
  tmpaction.setData("ViewPurchaseOrders");
  tmpaction.objectName = "ms.dspPoLineItemsByBufferStatus";
  tmpaction.triggered.connect(sDspPoItemsByBufferStatus);

  // Schedule | Constraint Management | Work Order Status
  {
    var scheduleBufferWoMenu               = new QMenu(qsTranslate("menuSchedule", "&Work Order"), mainwindow);
        scheduleBufferWoMenu.objectName = "menu.sched.bufferwo";
        scheduleBufferMenu.addMenu(scheduleBufferWoMenu);

    tmpaction = scheduleBufferWoMenu.addAction(qsTranslate("menuSchedule", "by &Planner Code..."));
    tmpaction.enabled = privileges.value("MaintainWorkOrders") || privileges.value("ViewWorkOrders");
    tmpaction.setData("MaintainWorkOrders ViewWorkOrders");
    tmpaction.objectName = "ms.dspWoBufferStatusByPlannerCode";
    tmpaction.triggered.connect(sDspWoBufferStatusByPlannerCode);

    tmpaction = scheduleBufferWoMenu.addAction(qsTranslate("menuSchedule", "by &Class Code..."));
    tmpaction.enabled = privileges.value("MaintainWorkOrders") || privileges.value("ViewWorkOrders");
    tmpaction.setData("MaintainWorkOrders ViewWorkOrders");
    tmpaction.objectName = "ms.dspWoBufferStatusByClassCode";
    tmpaction.triggered.connect(sDspWoBufferStatusByClassCode);

    tmpaction = scheduleBufferWoMenu.addAction(qsTranslate("menuSchedule", "by &Item Group..."));
    tmpaction.enabled = privileges.value("MaintainWorkOrders") || privileges.value("ViewWorkOrders");
    tmpaction.setData("MaintainWorkOrders ViewWorkOrders");
    tmpaction.objectName = "ms.dspWoBufferStatusByItemGroup";
    tmpaction.triggered.connect(sDspWoBufferStatusByItemGroup);
  }

  if (metrics.boolean("Routings"))
  {
    scheduleBufferMenu.addSeparator();

    tmpaction = scheduleBufferMenu.addAction(qsTranslate("menuSchedule", "&Capacity..."));
    tmpaction.enabled = privileges.value("ViewWorkCenterBufferStatus");
    tmpaction.setData("ViewWorkCenterBufferStatus");
    tmpaction.objectName = "ms.dspCapacityBufferStatusByWorkCenter";
    tmpaction.triggered.connect(sDspCapacityBufferStatusByWorkCenter);

    tmpaction = scheduleBufferMenu.addAction(qsTranslate("menuSchedule", "W/O &Operation..."));
    tmpaction.enabled = privileges.value("MaintainWoOperations") || privileges.value("ViewWoOperations");
    tmpaction.setData("MaintainWoOperations ViewWoOperations");
    tmpaction.objectName = "ms.dspWoOperationBufrStsByWorkCenter";
    tmpaction.triggered.connect(sDspWoOperationBufrStsByWorkCenter);
  }
}

// Schedule | Capacity Planning
if (metrics.boolean("Routings") || metrics.boolean("BufferMgt"))
{
  var scheduleCapacityPlanMenu        = new QMenu(qsTranslate("menuSchedule", "&Capacity Planning"), mainwindow);
  scheduleCapacityPlanMenu.objectName = "menu.sched.capacityplan";
  scheduleMenu.insertMenu(scheduleReportsMenu.menuAction(), scheduleCapacityPlanMenu);

  if (metrics.boolean("Routings"))
  {
    tmpaction = scheduleCapacityPlanMenu.addAction(qsTranslate("menuSchedule", "Time-Phased &Capacity..."));
    tmpaction.enabled = privileges.value("ViewWorkCenterCapacity");
    tmpaction.setData("ViewWorkCenterCapacity");
    tmpaction.objectName = "cp.dspTimePhasedCapacityByWorkCenter";
    tmpaction.triggered.connect(sDspTimePhasedCapacityByWorkCenter);

    tmpaction = scheduleCapacityPlanMenu.addAction(qsTranslate("menuSchedule", "Time-Phased &Load..."));
    tmpaction.enabled = privileges.value("ViewWorkCenterLoad");
    tmpaction.setData("ViewWorkCenterLoad");
    tmpaction.objectName = "cp.dspTimePhasedLoadByWorkCenter";
    tmpaction.triggered.connect(sDspTimePhasedLoadByWorkCenter);

    tmpaction = scheduleCapacityPlanMenu.addAction(qsTranslate("menuSchedule", "Time-Phased &Available Capacity..."));
    tmpaction.enabled = privileges.value("ViewWorkCenterCapacity");
    tmpaction.setData("ViewWorkCenterCapacity");
    tmpaction.objectName = "cp.dspTimePhasedAvailableCapacityByWorkCenter";
    tmpaction.triggered.connect(sDspTimePhasedAvailableCapacityByWorkCenter);

    scheduleCapacityPlanMenu.addSeparator();
  }

  if (metrics.boolean("BufferMgt"))
  {
    var scheduleCapacityPlanTimePhasedMenu        = new QMenu(qsTranslate("menuSchedule", "Time-Phased &Production"), mainwindow);
    scheduleCapacityPlanTimePhasedMenu.objectName = "menu.sched.capacityplantpprd";
    scheduleCapacityPlanMenu.addMenu(scheduleCapacityPlanTimePhasedMenu);

    tmpaction = scheduleCapacityPlanTimePhasedMenu.addAction(qsTranslate("menuSchedule", "by &Planner Code..."));
    tmpaction.enabled = privileges.value("ViewProduction");
    tmpaction.setData("ViewProduction");
    tmpaction.objectName = "cp.dspTimePhasedProductionByPlannerCode";
    tmpaction.triggered.connect(sDspTimePhasedProductionByPlannerCode);

    tmpaction = scheduleCapacityPlanTimePhasedMenu.addAction(qsTranslate("menuSchedule", "by &Item..."));
    tmpaction.enabled = privileges.value("ViewProduction");
    tmpaction.setData("ViewProduction");
    tmpaction.objectName = "cp.dspTimePhasedProductionByItem";
    tmpaction.triggered.connect(sDspTimePhasedProductionByItem);

    tmpaction = scheduleCapacityPlanMenu.addAction(qsTranslate("menuSchedule", "Time-Phased &Demand..."));
    tmpaction.enabled = privileges.value("ViewProduction");
    tmpaction.setData("ViewProduction");
    tmpaction.objectName = "cp.dspTimePhasedDemandByPlannerCode";
    tmpaction.triggered.connect(sDspTimePhasedDemandByPlannerCode);
  }

  if (metrics.boolean("Routings") && metrics.boolean("BufferMgt"))
  {
    scheduleCapacityPlanMenu.addSeparator();

    tmpaction = scheduleCapacityPlanMenu.addAction(qsTranslate("menuSchedule", "Capacity &Buffer Status..."));
    tmpaction.enabled = privileges.value("ViewWorkCenterBufferStatus");
    tmpaction.setData("ViewWorkCenterBufferStatus");
    tmpaction.objectName = "cp.dspCapacityBufferStatusByWorkCenter";
    tmpaction.triggered.connect(sDspCapacityBufferStatusByWorkCenter);
  }
}

tmpaction = scheduleReportsMenu.addAction(qsTranslate("menuSchedule", "MRP Exceptions..."));
tmpaction.enabled = privileges.value("ViewInventoryAvailability");
tmpaction.setData("ViewInventoryAvailability");
tmpaction.objectName = "ms.dspMRPException";
tmpaction.triggered.connect(sDspMRPException);
scheduleReportsMenu.removeAction(tmpaction);
scheduleReportsMenu.insertAction(mainwindow.findChild("ms.dspMRPDetail"),
                                 tmpaction);

tmpaction = scheduleReportsMenu.addAction(qsTranslate("menuSchedule", "MP&S Detail..."));
tmpaction.enabled = privileges.value("ViewMPS");
tmpaction.setData("ViewMPS");
tmpaction.objectName = "ms.dspMPSDetail";
tmpaction.triggered.connect(sDspMPSDetail);
scheduleReportsMenu.removeAction(tmpaction);
scheduleReportsMenu.insertAction(mainwindow.findChild("ms.dspMRPDetail"),
                                 tmpaction);

tmpaction = scheduleReportsMenu.addAction(qsTranslate("menuSchedule", "Lead Time Analysis..."));
tmpaction.enabled = privileges.value("ViewBOMs");
tmpaction.objectName = "ms.ltanalysis";
tmpaction.triggered.connect(sLeadTimeAnalysis);

if (metrics.boolean("Routings"))
{
  scheduleReportsMenu.addSeparator();

  tmpaction = scheduleReportsMenu.addAction(qsTranslate("menuSchedule", "Rough &Cut Capacity Plan..."));
  tmpaction.enabled = privileges.value("ViewRoughCut");
  tmpaction.setData("ViewRoughCut");
  tmpaction.objectName = "ms.dspRoughCutByWorkCenter";
  tmpaction.triggered.connect(sDspRoughCutByWorkCenter);

  tmpaction = scheduleReportsMenu.addAction(qsTranslate("menuSchedule", "Time-P&hased Rough Cut Capacity Plan..."));
  tmpaction.enabled = privileges.value("ViewRoughCut");
  tmpaction.setData("ViewRoughCut");
  tmpaction.objectName = "ms.dspTimePhasedRoughCutByWorkCenter";
  tmpaction.triggered.connect(sDspTimePhasedRoughCutByWorkCenter);

  scheduleReportsMenu.addSeparator();

  tmpaction = scheduleReportsMenu.addAction(qsTranslate("menuSchedule", "P&lanned Revenue/Expenses..."));
  tmpaction.enabled = privileges.value("ViewPlannedOrders") &&
                      privileges.value("ViewCosts") &&
                      privileges.value("ViewListPrices");
  tmpaction.setData("ViewPlannedOrders+ViewCosts+ViewListPrices");
  tmpaction.objectName = "ms.dspPlannedRevenue/ExpensesByPlannerCode";
  tmpaction.triggered.connect(sDspPlannedREByPlannerCode);

  tmpaction = scheduleReportsMenu.addAction(qsTranslate("menuSchedule", "Time-Ph&ased Planned Revenue/Expenses..."));
  tmpaction.enabled = privileges.value("ViewPlannedOrders") &&
                      privileges.value("ViewCosts") &&
                      privileges.value("ViewListPrices");
  tmpaction.setData("ViewPlannedOrders+ViewCosts+ViewListPrices");
  tmpaction.objectName = "ms.dspTimePhasedPlannedREByPlannerCode";
  tmpaction.triggered.connect(sDspTimePhasedPlannedREByPlannerCode);
}

// Manufacturing || Operations
if(metrics.boolean("Routings"))
{
  var manufacturingMenu = mainwindow.findChild("menu.manu");
  var manufacturingMaterialsMenu = mainwindow.findChild("menu.manu.materials");
  var manufacturingOperationsMenu = new QMenu(qsTranslate("menuManufacture", "&Operations"),
                                                 mainwindow);
  manufacturingOperationsMenu.objectName = "menu.manu.operations";
  manufacturingMenu.insertMenu(manufacturingMaterialsMenu.menuAction(),
                               manufacturingOperationsMenu);
  manufacturingMenu.removeAction(manufacturingMaterialsMenu.menuAction());
  manufacturingMenu.insertAction(manufacturingOperationsMenu.menuAction(), 
                                 manufacturingMaterialsMenu.menuAction());
  
  tmpaction = manufacturingOperationsMenu.addAction(qsTranslate("menuManufacture", "&New..."));
  tmpaction.enabled = privileges.value("MaintainWoOperations");
  tmpaction.setData("MaintainWoOperations");
  tmpaction.objectName = "wo.createWoOperation";
  tmpaction.triggered.connect(sCreateWoOperation);
  
  tmpaction = manufacturingOperationsMenu.addAction(qsTranslate("menuManufacture", "&Maintain..."));
  tmpaction.enabled = privileges.value("MaintainWoOperations");
  tmpaction.setData("MaintainWoOperations");
  tmpaction.objectName = "wo.maintainWoOperation";
  tmpaction.triggered.connect(sMaintainWoOperations);
}

// Manufacturing || Transactions || Return
if(metrics.boolean("Routings"))
{
  var manufacturingTransMenu = mainwindow.findChild("menu.manu.transactions");
  var postProductionAction = mainwindow.findChild("wo.postProduction");

  var ta = "Shop Floor &Workbench...";
  if (metrics.value("TimeAttendanceMethod") == "Employee")
    ta = "&Time Clock...";
  tmpaction = manufacturingTransMenu.addAction(qsTranslate("menuManufacture", ta));
  tmpaction.enabled = privileges.value("WoTimeClock");
  tmpaction.setData("WoTimeClock");
  tmpaction.objectName = "wo.woTimeClock";
  tmpaction.triggered.connect(sWoTimeClock);
  tmpaction.toolTip = qsTranslate("menuManufacture", "Shop Floor Workbench");
  tmpaction.icon = new QIcon(":/images/shopFloorWorkbench.png");
  var manuToolbar = mainwindow.findChild("Manufacture Tools");
  if (manuToolbar)
    manuToolbar.addAction(tmpaction);

  manufacturingTransMenu.removeAction(tmpaction);
  manufacturingTransMenu.insertAction(postProductionAction, tmpaction);
  
  tmpaction = manufacturingTransMenu.addAction(qsTranslate("menuManufacture", "&Post Operation..."));
  tmpaction.enabled = privileges.value("PostWoOperations");
  tmpaction.setData("PostWoOperations");
  tmpaction.objectName = "wo.postOperations";
  tmpaction.triggered.connect(sPostOperations);

  manufacturingTransMenu.removeAction(tmpaction);
  manufacturingTransMenu.insertAction(postProductionAction, tmpaction);
  
  tmpaction = manufacturingTransMenu.addAction(qsTranslate("menuManufacture", "Co&rrect Operation Posting..."));
  tmpaction.enabled = privileges.value("PostWoOperations");
  tmpaction.setData("PostWoOperations");
  tmpaction.objectName = "wo.correctOperationsPosting";
  tmpaction.triggered.connect(sCorrectOperationsPosting);

  manufacturingTransMenu.removeAction(tmpaction);
  manufacturingTransMenu.insertAction(postProductionAction, tmpaction);

  manufacturingTransMenu.insertSeparator(postProductionAction);
}

// Manufacturing || Forms
if(metrics.boolean("Routings"))
{
  var manufacturingFormsMenu = mainwindow.findChild("menu.manu.forms");
  var printPickListAction = mainwindow.findChild("wo.printPickList");

  tmpaction = manufacturingFormsMenu.addAction(qsTranslate("menuManufacture", "Print &Routing..."));
  tmpaction.enabled = privileges.value("PrintWorkOrderPaperWork");
  tmpaction.setData("PrintWorkOrderPaperWork");
  tmpaction.objectName = "wo.printRouting";
  tmpaction.triggered.connect(printWoRouting);

  // We need to put this after the printPickListAction but we can only place it before
  // and there is a separator after it that we can't locate so we will place the new
  // menu item before the printPickListAction then remove and place printPickListAction
  // before the new action giving us the desired results
  manufacturingFormsMenu.removeAction(tmpaction);
  manufacturingFormsMenu.insertAction(printPickListAction, tmpaction);
  manufacturingFormsMenu.removeAction(printPickListAction);
  manufacturingFormsMenu.insertAction(tmpaction, printPickListAction);

  tmpaction = manufacturingFormsMenu.addAction(qsTranslate("menuManufacture", "Print Production &Entry Sheet..."));
  tmpaction.enabled = privileges.value("PrintWorkOrderPaperWork");
  tmpaction.setData("PrintWorkOrderPaperWork");
  tmpaction.objectName = "wo.rptPrintProductionEntrySheet";
  tmpaction.triggered.connect(printProductionEntrySheet);
}

var manufacturingReportsMenu = mainwindow.findChild("menu.manu.reports");
var manufacturingReportsHistoryMenu = mainwindow.findChild("menu.manu.reportshistory");
var manufacturingReportsScheduleMenu = mainwindow.findChild("menu.manu.reportsschedule");

if (metrics.boolean("Routings"))
{
  var manufacturingReportsWooperMenu = new QMenu(qsTranslate("menuManufacture", "&Operations"),
                                                 mainwindow);
  manufacturingReportsWooperMenu.objectName = "menu.manu.reportsoperations";
  manufacturingReportsMenu.insertMenu(manufacturingReportsHistoryMenu.menuAction(),
                                       manufacturingReportsWooperMenu);
  
  tmpaction = manufacturingReportsWooperMenu.addAction(qsTranslate("menuManufacture", "by &Work Center..."));
  tmpaction.enabled = privileges.value("MaintainWoOperations") || privileges.value("ViewWoOperations");
  tmpaction.setData("MaintainWoOperations ViewWoOperations");
  tmpaction.objectName = "wo.dspWoOperationsByWorkCenter";
  tmpaction.triggered.connect(sDspWoOperationsByWorkCenter);

  tmpaction = manufacturingReportsWooperMenu.addAction(qsTranslate("menuManufacture", "by Work &Order..."));
  tmpaction.enabled = privileges.value("MaintainWoOperations") || privileges.value("ViewWoOperations");
  tmpaction.setData("MaintainWoOperations ViewWoOperations");
  tmpaction.objectName = "wo.dspWoOperationsByWorkOrder";
  tmpaction.triggered.connect(sDspWoOperationsByWorkOrder);
}

if (metrics.boolean("BufferMgt") && metrics.boolean("Routings"))
{
  tmpaction = new QAction(qsTranslate("menuManufacture", "Operation Buf&fer Status..."), mainwindow);
  tmpaction.enabled = privileges.value("MaintainWoOperations") || privileges.value("ViewWoOperations");
  tmpaction.setData("MaintainWoOperations ViewWoOperations");
  tmpaction.objectName = "wo.dspWoOperationBufrStsByWorkCenter";
  tmpaction.triggered.connect(sDspWoOperationBufrStsByWorkCenter);
  manufacturingReportsMenu.insertAction(manufacturingReportsHistoryMenu.menuAction(),
                                        tmpaction);
}

if (metrics.boolean("Routings"))
{
  var manufacturingReportsWotcMenu = new QMenu(qsTranslate("menuManufacture", "Production &Time Clock"),
                                               mainwindow);
  manufacturingReportsWotcMenu.objectName = "menu.manu.reportswotc";

  manufacturingReportsMenu.insertMenu(manufacturingReportsHistoryMenu.menuAction(),
                                      manufacturingReportsWotcMenu);

  if (metrics.value("TimeAttendanceMethod") == "Employee")
    var ta = "by &Employee...";
  else
    var ta = "by &User...";
  tmpaction = manufacturingReportsWotcMenu.addAction(qsTranslate("menuManufacture", ta));
  tmpaction.enabled = privileges.value("MaintainWoTimeClock") || privileges.value("ViewWoTimeClock");
  tmpaction.setData("MaintainWoTimeClock ViewWoTimeClock");
  tmpaction.objectName = "wo.dspWoEffortByUser";
  tmpaction.triggered.connect(sDspWoEffortByUser);

  tmpaction = manufacturingReportsWotcMenu.addAction(qsTranslate("menuManufacture", "by &Work Order..."));
  tmpaction.enabled = privileges.value("MaintainWoTimeClock") || privileges.value("ViewWoTimeClock");
  tmpaction.setData("MaintainWoTimeClock ViewWoTimeClock");
  tmpaction.objectName = "wo.dspWoEffortByWorkOrder";
  tmpaction.triggered.connect(sDspWoEffortByWorkOrder);

  manufacturingReportsMenu.insertSeparator(manufacturingReportsHistoryMenu.menuAction());
}

if (metrics.boolean("BufferMgt"))
{
  // Manufacturing | Reports | Work Order Status
  {
    var manufacturingReportsWOStatusMenu = new QMenu(qsTranslate("menuManufacture", "Work Order Sta&tus"),
                                                     mainwindow);
    var manufacturingReportsMatlReqMenu = mainwindow.findChild("menu.manu.reportsmatlreq");

    manufacturingReportsWOStatusMenu.objectName = "menu.manu.reportsbufrsts";
    manufacturingReportsMenu.insertMenu(manufacturingReportsMatlReqMenu.menuAction(),
                                        manufacturingReportsWOStatusMenu);

    tmpaction = manufacturingReportsWOStatusMenu.addAction(qsTranslate("menuManufacture", "by &Planner Code..."));
    tmpaction.enabled = privileges.value("MaintainWorkOrders") || privileges.value("ViewWorkOrders");
    tmpaction.setData("MaintainWorkOrders ViewWorkOrders");
    tmpaction.objectName = "wo.dspWoBufferStatusByPlannerCode";
    tmpaction.triggered.connect(sDspWoBufferStatusByPlannerCode);

    tmpaction = manufacturingReportsWOStatusMenu.addAction(qsTranslate("menuManufacture", "by &Class Code..."));
    tmpaction.enabled = privileges.value("MaintainWorkOrders") || privileges.value("ViewWorkOrders");
    tmpaction.setData("MaintainWorkOrders ViewWorkOrders");
    tmpaction.objectName = "wo.dspWoBufferStatusByClassCode";
    tmpaction.triggered.connect(sDspWoBufferStatusByClassCode);

    tmpaction = manufacturingReportsWOStatusMenu.addAction(qsTranslate("menuManufacture", "by &Item Group..."));
    tmpaction.enabled = privileges.value("MaintainWorkOrders") || privileges.value("ViewWorkOrders");
    tmpaction.setData("MaintainWorkOrders ViewWorkOrders");
    tmpaction.objectName = "wo.dspWoBufferStatusByItemGroup";
    tmpaction.triggered.connect(sDspWoBufferStatusByItemGroup);

    manufacturingReportsMenu.insertSeparator(manufacturingReportsMatlReqMenu.menuAction());
  }
}

if (metrics.boolean("Routings"))
{
  var manufacturingReportsLaborVarMenu = new QMenu(qsTranslate("menuManufacture", "&Labor Variance"), mainwindow);
  manufacturingReportsMenu.addMenu(manufacturingReportsLaborVarMenu);

  tmpaction = manufacturingReportsLaborVarMenu.addAction(qsTranslate("menuManufacture", "by &Work Center..."));
  tmpaction.enabled = privileges.value("ViewLaborVariances");
  tmpaction.setData("ViewLaborVariances");
  tmpaction.objectName = "wo.dspLaborVarianceByWorkCenter";
  tmpaction.triggered.connect(sDspLaborVarianceByWorkCenter);

  tmpaction = manufacturingReportsLaborVarMenu.addAction(qsTranslate("menuManufacture", "by &Item..."));
  tmpaction.enabled = privileges.value("ViewLaborVariances");
  tmpaction.setData("ViewLaborVariances");
  tmpaction.objectName = "wo.dspLaborVarianceByItem";
  tmpaction.triggered.connect(sDspLaborVarianceByItem);

  tmpaction = manufacturingReportsLaborVarMenu.addAction(qsTranslate("menuManufacture", "by &BOO Item..."));
  tmpaction.enabled = privileges.value("ViewLaborVariances");
  tmpaction.setData("ViewLaborVariances");
  tmpaction.objectName = "wo.dspLaborVarianceByBOOItem";
  tmpaction.triggered.connect(sDspLaborVarianceByBOOItem);

  tmpaction = manufacturingReportsLaborVarMenu.addAction(qsTranslate("menuManufacture", "by Work &Order..."));
  tmpaction.enabled = privileges.value("ViewLaborVariances");
  tmpaction.setData("ViewLaborVariances");
  tmpaction.objectName = "wo.dspLaborVarianceByWorkOrder";
  tmpaction.triggered.connect(sDspLaborVarianceByWorkOrder);
}

tmpaction = manufacturingReportsMenu.addAction(qsTranslate("menuManufacture", "Breeder &Distribution Variance"));
tmpaction.enabled = privileges.value("ViewBreederVariances");
tmpaction.setData("ViewBreederVariances");
tmpaction.objectName = "ms.dspBreederDistributionVariance";
tmpaction.triggered.connect(dspBreederDistributionVariance);

// Products
// Products | Reports
var prodMenu = mainwindow.findChild("menu.prod");

if (metrics.boolean("Routings"))
{
  var prodReportMenu     = mainwindow.findChild("menu.prod.reports");
  var prodReportsCapMenu = mainwindow.findChild("menu.prod.reportscapuom");

  tmpaction = new QAction(qsTranslate("menuProducts", "&Operations..."), mainwindow);
  tmpaction.enabled = privileges.value("ViewBOOs");
  tmpaction.setData("ViewBOOs");
  tmpaction.objectname = "pd.dspOperationsByWorkCenter";
  tmpaction.triggered.connect(dspOperationsByWorkCenter);
  prodReportMenu.insertAction(prodReportsCapMenu.menuAction(), tmpaction);

  tmpaction = new QAction(qsTranslate("menuProducts", "&Standard Operations..."), mainwindow);
  tmpaction.enabled = privileges.value("ViewStandardOperations");
  tmpaction.setData("ViewStandardOperations");
  tmpaction.objectname = "pd.dspStandardOperationsByWorkCenter";
  tmpaction.triggered.connect(dspStandardOperationsByWorkCenter);
  prodReportMenu.insertAction(prodReportsCapMenu.menuAction(), tmpaction);

  prodReportMenu.insertSeparator(prodReportsCapMenu.menuAction());
}

// Products | Reports | BOMs
if(metrics.boolean("Routings"))
{
  var prodReportsBomMenu = mainwindow.findChild("menu.prod.reportsboms");

  tmpaction = prodReportsBomMenu.addAction(qsTranslate("menuProducts", "Se&quenced..."));
  tmpaction.enabled = privileges.value("ViewBOMs") || privileges.value("MaintainBOMs");
  tmpaction.setData("ViewBOMs MaintainBOMs");
  tmpaction.objectName = "pd.dspSequencedBOM";
  tmpaction.triggered.connect(dspSequencedBOM);
}

// Products | Bill of Operations
var prodCostingMenu = mainwindow.findChild("menu.prod.costing");
if(metrics.boolean("Routings"))
{
  var prodBooMenu = new QMenu(qsTranslate("menuProducts", "&Routing"), mainwindow);
  prodBooMenu.objectName = "menu.prod.boo";
  prodMenu.insertMenu(prodCostingMenu.menuAction(),
                      prodBooMenu);

  tmpaction = prodBooMenu.addAction(qsTranslate("menuProducts", "&New..."));
  tmpaction.enabled = privileges.check("MaintainBOOs");
  tmpaction.setData("MaintainBOOs");
  tmpaction.objectName = "pd.enterNewBOO";
  tmpaction.triggered.connect(sNewBOO);

  tmpaction = prodBooMenu.addAction(qsTranslate("menuProducts", "&List..."));
  tmpaction.enabled = privileges.check("MaintainBOOs") || privileges.check("ViewBOOs");
  tmpaction.setData("MaintainBOOs ViewBOOs");
  tmpaction.objectName = "pd.listBOOs";
  tmpaction.toolTip = qsTranslate("menuProducts", "List Routings");
  tmpaction.icon = new QIcon(":/images/boos.png");
  var prodToolbar = mainwindow.findChild("Products Tools");
  if (prodToolbar)
    prodToolbar.addAction(tmpaction);
  tmpaction.triggered.connect(sBOOs);

  tmpaction = prodBooMenu.addAction(qsTranslate("menuProducts", "&Copy..."));
  tmpaction.enabled = privileges.check("MaintainBOOs");
  tmpaction.setData("MaintainBOOs");
  tmpaction.objectName = "pd.copyBOO";
  tmpaction.triggered.connect(sCopyBOO);
}
// Products | Breeder Bill of Materials
if(metrics.boolean("BBOM"))
{
  var prodBbomMenu = new QMenu(qsTranslate("menuProducts", "&Breeder Bill Of Materials"), mainwindow);
  prodBbomMenu.objectName = "menu.prod.breeder";
  prodMenu.insertMenu(prodCostingMenu.menuAction(),
                      prodBbomMenu);

  tmpaction = prodBbomMenu.addAction(qsTranslate("menuProducts", "&New..."));
  tmpaction.enabled = privileges.check("MaintainBBOMs");
  tmpaction.setData("MaintainBBOMs");
  tmpaction.objectName = "pd.enterNewBreederBOM";
  tmpaction.triggered.connect(sNewBreederBOMs);

  tmpaction = prodBbomMenu.addAction(qsTranslate("menuProducts", "&List..."));
  tmpaction.enabled = privileges.check("MaintainBBOMs") || privileges.check("ViewBBOMs");
  tmpaction.setData("MaintainBBOMs ViewBBOMs");
  tmpaction.objectName = "pd.listBreederBOMs";
  tmpaction.triggered.connect(sBreederBOMs);
}

if (metrics.boolean("BufferMgt"))
{
  var purchaseReportsMenu = mainwindow.findChild("menu.purch.reports");

  tmpaction = purchaseReportsMenu.addAction(qsTranslate("menuPurchase", "P/O Item Sta&tus..."));
  tmpaction.enabled = privileges.value("ViewPurchaseOrders");
  tmpaction.setData("ViewPurchaseOrders");
  tmpaction.objectName = "po.dspPoLineItemsByBufferStatus";
  tmpaction.triggered.connect(sDspPoItemsByBufferStatus);

  /* TODO: this will not be required if we fix a_menu.addAction("title");*/
  purchaseReportsMenu.removeAction(tmpaction);
  purchaseReportsMenu.insertAction(mainwindow.findChild("po.dspPoHistory"),
                                   tmpaction);
}

