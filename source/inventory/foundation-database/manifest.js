{
  "name": "inventory_foundation",
  "version": "",
  "comment": "Inventory foundation",
  "loadOrder": 45,
  "databaseScripts": [
    "search_path.sql",
    "public/tables/lsdetail.sql",
    "../database/source/public/tables/tohead.sql",
    "xt/tables/towf.sql",
    "xt/tables/wftype.sql",
    "xt/triggers/towf_trigger.sql",
    "public/indexes/raitem.sql",
    "public/indexes/tohead.sql",
    "public/indexes/toheadtax.sql",
    "public/indexes/toitemtax.sql",
    "public/types/lshist.sql",
    "public/triggers/checkitem.sql",
    "public/triggers/coitem.sql",
    "public/triggers/invdetail.sql",
    "public/triggers/ls.sql",
    "public/triggers/lsreg.sql",
    "public/triggers/lsseq.sql",
    "public/triggers/planord.sql",
    "public/triggers/rahead.sql",
    "public/triggers/raitem.sql",
    "public/triggers/raitemls.sql",
    "public/triggers/tohead.sql",
    "public/triggers/toitem.sql",
    "public/functions/activaterev.sql",
    "public/functions/allocatedforto.sql",
    "public/functions/authreturnitem.sql",
    "public/functions/autocreatels.sql",
    "public/functions/calcraamt.sql",
    "public/functions/calcradueamt.sql",
    "public/functions/calcrataxamt.sql",
    "public/functions/calculatenextworkingdate.sql",
    "public/functions/calculateworkdays.sql",
    "public/functions/changeprdate.sql",
    "public/functions/clearreturnitem.sql",
    "public/functions/closetoitem.sql",
    "public/functions/closetransferorder.sql",
    "public/functions/consolidatelotserial.sql",
    "public/functions/copytransferorder.sql",
    "public/functions/createandexplodeplannedorders.sql",
    "public/functions/createbomrev.sql",
    "public/functions/createlotserial.sql",
    "public/functions/createplannedorder.sql",
    "public/functions/createplannedorders.sql",
    "public/functions/createracreditmemo.sql",
    "public/functions/createto.sql",
    "public/functions/currentplannumber.sql",
    "public/functions/deactivaterev.sql",
    "public/functions/deleteitemlocdist.sql",
    "public/functions/deletempsmrpworkset.sql",
    "public/functions/deleteplannedorder.sql",
    "public/functions/deleteto.sql",
    "public/functions/distributetoreserveditemloc.sql",
    "public/functions/explodeplannedorder.sql",
    "public/functions/explodereturnkit.sql",
    "public/functions/fetchlsnumber.sql",
    "public/functions/fetchlsregnumber.sql",
    "public/functions/fetchplannumber.sql",
    "public/functions/fetchranumber.sql",
    "public/functions/findtoform.sql",
    "public/functions/formatlotserialnumberbarcode.sql",
    "public/functions/formatralinenumber.sql",
    "public/functions/formattobarcode.sql",
    "public/functions/formattoitembarcode.sql",
    "public/functions/formattonumber.sql",
    "public/functions/forwardupdatetrialbalancesync.sql",
    "public/functions/getlsid.sql",
    "public/functions/getlsregid.sql",
    "public/functions/getpacklistitemlotserialqty.sql",
    "public/functions/getplanordid.sql",
    "public/functions/getregtypeid.sql",
    "public/functions/grantsite.sql",
    "public/functions/importcoitemstora.sql",
    "public/functions/interwarehousetransfer.sql",
    "public/functions/issuewortnreceipt.sql",
    "public/functions/lshist.sql",
    "public/functions/mrpreport.sql",
    "public/functions/nextplansubnumber.sql",
    "public/functions/nexttolinenumber.sql",
    "public/functions/orderedbyto.sql",
    "public/functions/plannedcost.sql",
    "public/functions/plannedrevenue.sql",
    "public/functions/postcurradjustsync.sql",
    "public/functions/postintotrialbalancesync.sql",
    "public/functions/posttransformtrans.sql",
    "public/functions/qtyfirmed.sql",
    "public/functions/qtyfirmedallocated.sql",
    "public/functions/qtyplanned.sql",
    "public/functions/qtyplanneddemand.sql",
    "public/functions/qtyreservedlocation.sql",
    "public/functions/qtyunreserved.sql",
    "public/functions/reassignlotserial.sql",
    "public/functions/releaselsregnumber.sql",
    "public/functions/releaseplannedorder.sql",
    "public/functions/releaseplannumber.sql",
    "public/functions/releaseranumber.sql",
    "public/functions/releasetonumber.sql",
    "public/functions/releasetransferorder.sql",
    "public/functions/reserveallso.sql",
    "public/functions/reserveallsobalance.sql",
    "public/functions/reservelocationqty.sql",
    "public/functions/reservesolinebalance.sql",
    "public/functions/reservesolineqty.sql",
    "public/functions/resolvecoraccount.sql",
    "public/functions/revokesite.sql",
    "public/functions/setnextplannumber.sql",
    "public/functions/setnextranumber.sql",
    "public/functions/to_schedule_date.sql",
    "public/functions/transfers.sql",
    "public/functions/unreleasetransferorder.sql",
    "public/functions/unreservelocationqty.sql",
    "public/functions/unreservesolineqty.sql",
    "public/functions/updateplannedorder.sql",
    "public/patches/update_source.sql",
    "public/views/orderhead.sql",
    "public/views/orderitem.sql",
    "api/views/itemtransformation.sql",
    "api/views/lotserial.sql",
    "api/views/lotserialchar.sql",
    "api/views/lotserialreg.sql",
    "api/views/plannedorder.sql",
    "public/tables/metasql/lotserial-detail.mql",
    "public/tables/metasql/lotserial-label.mql",
    "public/tables/metasql/reserveInventory-locations.mql",
    "public/tables/metasql/returnAuthorizationWorkbench-duecredit.mql",
    "public/tables/metasql/returnAuthorizationWorkbench-review.mql",
    "public/tables/metasql/schedule-create.mql",
    "public/tables/metasql/schedule-expedite.mql",
    "public/tables/metasql/schedule-load.mql",
    "public/tables/metasql/transferOrders-detail.mql",
    "public/tables/report/DetailedInventoryHistoryByLotSerial.xml",
    "public/tables/report/ExpediteExceptionsByPlannerCode.xml",
    "public/tables/report/ListOpenReturnAuthorizations.xml",
    "public/tables/report/LocationLotSerialNumberDetail.xml",
    "public/tables/report/LotSerialLabel.xml",
    "public/tables/report/MRPDetail.xml",
    "public/tables/report/PlannedOrders.xml",
    "public/tables/report/PickingListTO.xml",
    "public/tables/report/PickingListTOLocs.xml",
    "public/tables/report/PlannedRevenueExpensesByPlannerCode.xml",
    "public/tables/report/ReturnAuthorizationForm.xml",
    "public/tables/report/ReturnAuthorizationWorkbenchDueCredit.xml",
    "public/tables/report/ReturnAuthorizationWorkbenchReview.xml",
    "public/patches/fixaddress.sql",
    "public/patches/ls_to_itemloc.sql",
    "xt/tables/acttype.sql"
  ]
}
