<!DOCTYPE packageManagerDef>
<package version   = "1.1"
         id        = "430pbtodist"
         developer = "xTuple"
         updater   = "2.2.4" >

  <prerequisite type="Query" name="Checking xTuple Edition">
    <query>SELECT fetchMetricText('Application') = 'PostBooks';</query>
    <message>This package must be applied against a PostBooks database.</message>
  </prerequisite>

  <prerequisite type="Query" name="Checking xTuple ERP database version">
    <query>SELECT fetchMetricText('ServerVersion') = '4.3.0';</query>
    <message>This package must be applied against a 4.3.0 database.</message>
  </prerequisite>

    "dbscripts/misc/updateMetric.sql",
  <loadmetasql file="dbscripts/metasql/lotserial-detail.mql" />
  <loadmetasql file="dbscripts/metasql/lotserial-label.mql" />
  <loadmetasql file="dbscripts/metasql/returnAuthorizationWorkbench-duecredit.mql" />
  <loadmetasql file="dbscripts/metasql/returnAuthorizationWorkbench-review.mql" /> 
  <loadmetasql file="dbscripts/metasql/reserveInventory-locations.mql" />
  <loadmetasql file="dbscripts/metasql/schedule-create.mql" />
  <loadmetasql file="dbscripts/metasql/schedule-expedite.mql" />
  <loadmetasql file="dbscripts/metasql/schedule-load.mql" />
  <loadmetasql file="dbscripts/metasql/schedule-plannedorders.mql" />
  <loadmetasql file="dbscripts/metasql/transferOrders-detail.mql" />
  <loadreport file="reports/DetailedInventoryHistoryByLotSerial.xml" />
  <loadreport file="reports/ExpediteExceptionsByPlannerCode.xml" />
  <loadreport file="reports/ListOpenReturnAuthorizations.xml" />
  <loadreport file="reports/LocationLotSerialNumberDetail.xml" />
  <loadreport file="reports/LotSerialLabel.xml" />
  <loadreport file="reports/MRPDetail.xml" />
  <loadreport file="reports/PlannedOrders.xml" />
  <loadreport file="reports/PlannedRevenueExpensesByPlannerCode.xml" />
  <loadreport file="reports/ReturnAuthorizationForm.xml" />
  <loadreport file="reports/ReturnAuthorizationWorkbenchDueCredit.xml" />
  <loadreport file="reports/ReturnAuthorizationWorkbenchReview.xml" />
  <loadreport file="reports/WarehouseLocationMasterList.xml" />

