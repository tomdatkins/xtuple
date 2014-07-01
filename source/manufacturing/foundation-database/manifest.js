{
  "name": "manufacturing_foundation",
  "version": "",
  "comment": "Manufacturing foundation",
  "loadOrder": 2010,
  "defaultSchema": "xtmfg",
  "databaseScripts": [
    "update_version.sql",
    "xtmfg/views/vw_tashift.sql",
    "xtmfg/views/wotclinearized.sql",
    "xtmfg/triggers/boohead.sql",
    "xtmfg/triggers/booitem.sql",
    "xtmfg/triggers/wooper.sql",
    "xtmfg/triggers/tatc.sql",
    "xtmfg/functions/booitem.sql",
    "xtmfg/functions/toolcapacity.sql",
    "xtmfg/functions/loadbytool.sql",
    "xtmfg/functions/bomanalysis.sql",
    "xtmfg/functions/calcbufferstatus.sql",
    "xtmfg/functions/calcrate.sql",
    "xtmfg/functions/calcwooperstart.sql",
    "xtmfg/functions/checkboositeprivs.sql",
    "xtmfg/functions/closewo.sql",
    "xtmfg/functions/copyboo.sql",
    "xtmfg/functions/copyitem.sql",
    "xtmfg/functions/copyplannedschedule.sql",
    "xtmfg/functions/correctoperationsposting.sql",
    "xtmfg/functions/correctproduction-mfg.sql",
    "xtmfg/functions/createboorev.sql",
    "xtmfg/functions/createbufferstatus.sql",
    "xtmfg/functions/createwobufferstatus.sql",
    "xtmfg/functions/cumulativempsschedule.sql",
    "xtmfg/functions/deleteboo.sql",
    "xtmfg/functions/deleteitem.sql",
    "xtmfg/functions/deletewooper.sql",
    "xtmfg/functions/deleteworkcenter.sql",
    "xtmfg/functions/directlaborcost.sql",
    "xtmfg/functions/directlaborcostoper.sql",
    "xtmfg/functions/distributebreederproduction.sql",
    "xtmfg/functions/formatwooperbarcode.sql",
    "xtmfg/functions/getbooitemid.sql",
    "xtmfg/functions/getstdopnid.sql",
    "xtmfg/functions/getwrkcntid.sql",
    "xtmfg/functions/indentedwoops.sql",
    "xtmfg/functions/issuetobreeder.sql",
    "xtmfg/functions/loadbyworkcenter.sql",
    "xtmfg/functions/logwotcevent.sql",
    "xtmfg/functions/machineoverheadcost.sql",
    "xtmfg/functions/machineoverheadcostoper.sql",
    "xtmfg/functions/movebbomitemdown.sql",
    "xtmfg/functions/movebbomitemup.sql",
    "xtmfg/functions/movebooitemdown.sql",
    "xtmfg/functions/movebooitemup.sql",
    "xtmfg/functions/movewooperdown.sql",
    "xtmfg/functions/movewooperup.sql",
    "xtmfg/functions/mrpexceptions.sql",
    "xtmfg/functions/overheadcost.sql",
    "xtmfg/functions/overheadcostoper.sql",
    "xtmfg/functions/plannedruntime.sql",
    "xtmfg/functions/plannedsetuptime.sql",
    "xtmfg/functions/postoperation.sql",
    "xtmfg/functions/postoverheadtime.sql",
    "xtmfg/functions/postproduction-mfg.sql",
    "xtmfg/functions/postrntime.sql",
    "xtmfg/functions/postsutime.sql",
    "xtmfg/functions/qtyforecasted.sql",
    "xtmfg/functions/receivefrombreeder.sql",
    "xtmfg/functions/returnovertimehours.sql",
    "xtmfg/functions/saveboohead.sql",
    "xtmfg/functions/savebooitemimage.sql",
    "xtmfg/functions/setwhsewkday.sql",
    "xtmfg/functions/taclockin.sql",
    "xtmfg/functions/taclockout.sql",
    "xtmfg/functions/unwoclockout.sql",
    "xtmfg/functions/woclockin.sql",
    "xtmfg/functions/woclockout.sql",
    "xtmfg/functions/woopermatlissued.sql",
    "xtmfg/functions/wooperqtyavail.sql",
    "xtmfg/functions/woopertime.sql",
    "xtmfg/functions/workcentercapacity.sql",
    "xtmfg/functions/workcenterruncost.sql",
    "xtmfg/functions/workcentersetupcost.sql",
    "xtmfg/functions/wotctime.sql",
    "xtmfg/functions/wotime.sql",
    "xtmfg/functions/wotimebywo.sql",
    "xtmfg/functions/mpsreport.sql",
    "api/views/boo.sql",
    "api/views/booitem.sql",
    "api/views/booitemimage.sql",
    "xtmfg/tables/pkgmetasql/MRPExceptions-detail.mql",
    "xtmfg/tables/pkgmetasql/MRPExceptions-run.mql",
    "xtmfg/tables/pkgmetasql/bbom-detail.mql",
    "xtmfg/tables/pkgmetasql/bboms-detail.mql",
    "xtmfg/tables/pkgmetasql/boo-detail.mql",
    "xtmfg/tables/pkgmetasql/boo-items.mql",
    "xtmfg/tables/pkgmetasql/boo-locations.mql",
    "xtmfg/tables/pkgmetasql/booItem-images.mql",
    "xtmfg/tables/pkgmetasql/booItem-locations.mql",
    "xtmfg/tables/pkgmetasql/booItemList-detail.mql",
    "xtmfg/tables/pkgmetasql/booList-detail.mql",
    "xtmfg/tables/pkgmetasql/booitemImage-detail.mql",
    "xtmfg/tables/pkgmetasql/capacitybufferstatus_detail.mql",
    "xtmfg/tables/pkgmetasql/inventorybufferstatus_detail.mql",
    "xtmfg/tables/pkgmetasql/laborRates-detail.mql",
    "xtmfg/tables/pkgmetasql/manufacture-laborvarianceitemhead.mql",
    "xtmfg/tables/pkgmetasql/manufacture-laborvariancewohead.mql",
    "xtmfg/tables/pkgmetasql/manufacture-laborvariancewrkcnthead.mql",
    "xtmfg/tables/pkgmetasql/MRPExceptions-detail.mql",
    "xtmfg/tables/pkgmetasql/MRPExceptions-run.mql",
    "xtmfg/tables/pkgmetasql/operationsByWorkCenter-detail.mql",
    "xtmfg/tables/pkgmetasql/operationsByWorkCenter-header.mql",
    "xtmfg/tables/pkgmetasql/plannedSchedule-detail.mql",
    "xtmfg/tables/pkgmetasql/plannedSchedules-detail.mql",
    "xtmfg/tables/pkgmetasql/poitemsbybufferstatus_detail.mql",
    "xtmfg/tables/pkgmetasql/roughcutcapacity_detail.mql",
    "xtmfg/tables/pkgmetasql/sequencedbom_detail.mql",
    "xtmfg/tables/pkgmetasql/shifts-detail.mql",
    "xtmfg/tables/pkgmetasql/standardOperations-detail.mql",
    "xtmfg/tables/pkgmetasql/standardOperationsByWorkCenter-detail.mql",
    "xtmfg/tables/pkgmetasql/standardOperationsByWorkCenter-header.mql",
    "xtmfg/tables/pkgmetasql/timeattend-getTimeDetail.mql",
    "xtmfg/tables/pkgmetasql/timeattend-insertshift.mql",
    "xtmfg/tables/pkgmetasql/timeattend-postoverheadtime.mql",
    "xtmfg/tables/pkgmetasql/timeattend-timeDetail.mql",
    "xtmfg/tables/pkgmetasql/timeattend-timeSummary.mql",
    "xtmfg/tables/pkgmetasql/timeattend-updateshift.mql",
    "xtmfg/tables/pkgmetasql/undefinedManufacturedItemsxtmfg-detail.mql",
    "xtmfg/tables/pkgmetasql/whseCalendars-detail.mql",
    "xtmfg/tables/pkgmetasql/woeffort-detail.mql",
    "xtmfg/tables/pkgmetasql/wooItemList-detail.mql",
    "xtmfg/tables/pkgmetasql/wooper_detail.mql",
    "xtmfg/tables/pkgmetasql/wooperbufferstatus_parameterlist.mql",
    "xtmfg/tables/pkgmetasql/wooperbufferstatus_workcenter.mql",
    "xtmfg/tables/pkgmetasql/workCenters-detail.mql",
    "xtmfg/tables/pkgmetasql/workOrderOperations-detail.mql",
    "xtmfg/tables/pkgmetasql/wooperbufferstatus-workcenter.mql",
    "xtmfg/tables/pkgmetasql/employees-detail.mql",
    "xtmfg/tables/pkgmetasql/manufacture-jobcosting.mql",
    "xtmfg/tables/pkgmetasql/manufacture-laborvariance.mql",
    "xtmfg/tables/pkgmetasql/breederDistributionVariance-detail.mql",
    "xtmfg/tables/pkgreport/BillOfOperations.xml",
    "xtmfg/tables/pkgreport/BreederBOM.xml",
    "xtmfg/tables/pkgreport/BreederDistributionVarianceByItem.xml",
    "xtmfg/tables/pkgreport/BreederDistributionVarianceByWarehouse.xml",
    "xtmfg/tables/pkgreport/CapacityBufferStatusByWorkCenter.xml",
    "xtmfg/tables/pkgreport/InventoryBufferStatusByParameterList.xml",
    "xtmfg/tables/pkgreport/LaborVarianceByBOOItem.xml",
    "xtmfg/tables/pkgreport/LaborVarianceByItem.xml",
    "xtmfg/tables/pkgreport/LaborVarianceByWorkCenter.xml",
    "xtmfg/tables/pkgreport/LaborVarianceByWorkOrder.xml",
    "xtmfg/tables/pkgreport/MPSDetail.xml",
    "xtmfg/tables/pkgreport/MRPException.xml",
    "xtmfg/tables/pkgreport/OperationsByWorkCenter.xml",
    "xtmfg/tables/pkgreport/PlannedOrdersByItem.xml",
    "xtmfg/tables/pkgreport/PlannedOrdersByPlannerCode.xml",
    "xtmfg/tables/pkgreport/PlannedSchedulesMasterList.xml",
    "xtmfg/tables/pkgreport/POLineItemsByBufferStatus.xml",
    "xtmfg/tables/pkgreport/RoughCutCapacityPlanByWorkCenter.xml",
    "xtmfg/tables/pkgreport/Routing.xml",
    "xtmfg/tables/pkgreport/RoutingAndPickList.xml",
    "xtmfg/tables/pkgreport/SequencedBOM.xml",
    "xtmfg/tables/pkgreport/ShiftsMasterList.xml",
    "xtmfg/tables/pkgreport/StandardOperationsByWorkCenter.xml",
    "xtmfg/tables/pkgreport/StdLaborRatesMasterList.xml",
    "xtmfg/tables/pkgreport/StdOperationsMasterList.xml",
    "xtmfg/tables/pkgreport/TimeAttendDetail.xml",
    "xtmfg/tables/pkgreport/TimeAttendSummary.xml",
    "xtmfg/tables/pkgreport/TimePhasedAvailableCapacityByWorkCenter.xml",
    "xtmfg/tables/pkgreport/TimePhasedCapacityByWorkCenter.xml",
    "xtmfg/tables/pkgreport/TimePhasedLoadByWorkCenter.xml",
    "xtmfg/tables/pkgreport/TimePhasedRoughCutByWorkCenter.xml",
    "xtmfg/tables/pkgreport/WarehouseCalendarExceptionsMasterList.xml",
    "xtmfg/tables/pkgreport/WOBufferStatusByParameterList.xml",
    "xtmfg/tables/pkgreport/WOEffortByUser.xml",
    "xtmfg/tables/pkgreport/WOEffortByWorkOrder.xml",
    "xtmfg/tables/pkgreport/WOOperationBufrStsByWorkCenter.xml",
    "xtmfg/tables/pkgreport/WOOperationsByWorkCenter.xml",
    "xtmfg/tables/pkgreport/WOOperationsByWorkOrder.xml",
    "xtmfg/tables/pkgreport/WorkCentersMasterList.xml",
    "xtmfg/tables/pkgreport/WorkOrderDetail.xml",
    "xtmfg/tables/pkgscript/bbom.js",
    "xtmfg/tables/pkgscript/bbomItem.js",
    "xtmfg/tables/pkgscript/bboms.js",
    "xtmfg/tables/pkgscript/bomItem.js",
    "xtmfg/tables/pkgscript/bomitems.js",
    "xtmfg/tables/pkgscript/boo.js",
    "xtmfg/tables/pkgscript/booItem.js",
    "xtmfg/tables/pkgscript/booitemImage.js",
    "xtmfg/tables/pkgscript/booItemList.js",
    "xtmfg/tables/pkgscript/booList.js",
    "xtmfg/tables/pkgscript/changeQtyToDistributeFromBreeder.js",
    "xtmfg/tables/pkgscript/closeWo.js",
    "xtmfg/tables/pkgscript/configureMS.js",
    "xtmfg/tables/pkgscript/configurePD.js",
    "xtmfg/tables/pkgscript/configureWO.js",
    "xtmfg/tables/pkgscript/copyBOO.js",
    "xtmfg/tables/pkgscript/copyItem.js",
    "xtmfg/tables/pkgscript/copyPlannedSchedule.js",
    "xtmfg/tables/pkgscript/correctOperationsPosting.js",
    "xtmfg/tables/pkgscript/correctProductionPosting.js",
    "xtmfg/tables/pkgscript/costCategory.js",
    "xtmfg/tables/pkgscript/createBufferStatusByItem.js",
    "xtmfg/tables/pkgscript/createBufferStatusByPlannerCode.js",
    "xtmfg/tables/pkgscript/createItemSitesByClassCode.js",
    "xtmfg/tables/pkgscript/createPlannedOrdersByItem.js",
    "xtmfg/tables/pkgscript/createPlannedOrdersByPlannerCode.js",
    "xtmfg/tables/pkgscript/databaseInformation.js",
    "xtmfg/tables/pkgscript/distributeBreederProduction.js",
    "xtmfg/tables/pkgscript/dspBreederDistributionVariance.js",
    "xtmfg/tables/pkgscript/dspCapacityBufferStatusByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspInventoryBufferStatusByParameterList.js",
    "xtmfg/tables/pkgscript/dspJobCosting.js",
    "xtmfg/tables/pkgscript/dspLaborVarianceByBOOItem.js",
    "xtmfg/tables/pkgscript/dspLaborVarianceByItem.js",
    "xtmfg/tables/pkgscript/dspLaborVarianceByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspLaborVarianceByWorkOrder.js",
    "xtmfg/tables/pkgscript/dspMPSDetail.js",
    "xtmfg/tables/pkgscript/dspMRPException.js",
    "xtmfg/tables/pkgscript/dspOperationsByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspPlannedRevenueExpensesByPlannerCode.js",
    "xtmfg/tables/pkgscript/dspPoItemsByBufferStatus.js",
    "xtmfg/tables/pkgscript/dspRoughCutByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspSequencedBOM.js",
    "xtmfg/tables/pkgscript/dspSingleLevelWhereUsed.js",
    "xtmfg/tables/pkgscript/dspStandardOperationsByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspTaSummary.js",
    "xtmfg/tables/pkgscript/dspTimePhasedAvailableCapacityByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspTimePhasedCapacityByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspTimePhasedDemandByPlannerCode.js",
    "xtmfg/tables/pkgscript/dspTimePhasedLoadByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspTimePhasedPlannedREByPlannerCode.js",
    "xtmfg/tables/pkgscript/dspTimePhasedProductionByItem.js",
    "xtmfg/tables/pkgscript/dspTimePhasedProductionByPlannerCode.js",
    "xtmfg/tables/pkgscript/dspTimePhasedRoughCutByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspUndefinedManufacturedItems.js",
    "xtmfg/tables/pkgscript/dspWoBufferStatusByParameterList.js",
    "xtmfg/tables/pkgscript/dspWoEffortByUser.js",
    "xtmfg/tables/pkgscript/dspWoEffortByWorkOrder.js",
    "xtmfg/tables/pkgscript/dspWoOperationBufrStsByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspWoOperationsByWorkCenter.js",
    "xtmfg/tables/pkgscript/dspWoOperationsByWorkOrder.js",
    "xtmfg/tables/pkgscript/dspWoSchedule.js",
    "xtmfg/tables/pkgscript/employees.js",
    "xtmfg/tables/pkgscript/initMenu.js",
    "xtmfg/tables/pkgscript/item.js",
    "xtmfg/tables/pkgscript/items.js",
    "xtmfg/tables/pkgscript/itemSite.js",
    "xtmfg/tables/pkgscript/laborRate.js",
    "xtmfg/tables/pkgscript/laborRates.js",
    "xtmfg/tables/pkgscript/ltanalysis.js",
    "xtmfg/tables/pkgscript/overhead.js",
    "xtmfg/tables/pkgscript/overheadList.js",
    "xtmfg/tables/pkgscript/overheadSelect.js",
    "xtmfg/tables/pkgscript/ParameterGroupUtils.js",
    "xtmfg/tables/pkgscript/plannedSchedule.js",
    "xtmfg/tables/pkgscript/plannedScheduleItem.js",
    "xtmfg/tables/pkgscript/plannedSchedules.js",
    "xtmfg/tables/pkgscript/plannerCode.js",
    "xtmfg/tables/pkgscript/postMiscProduction.js",
    "xtmfg/tables/pkgscript/postOperations.js",
    "xtmfg/tables/pkgscript/postProduction.js",
    "xtmfg/tables/pkgscript/printProductionEntrySheet.js",
    "xtmfg/tables/pkgscript/printWoRouting.js",
    "xtmfg/tables/pkgscript/printWoTraveler.js",
    "xtmfg/tables/pkgscript/purchaseOrderItem.js",
    "xtmfg/tables/pkgscript/rescheduleWo.js",
    "xtmfg/tables/pkgscript/returnAuthorizationItem.js",
    "xtmfg/tables/pkgscript/runMPSByPlannerCode.js",
    "xtmfg/tables/pkgscript/runMRPException.js",
    "xtmfg/tables/pkgscript/salesOrderItem.js",
    "xtmfg/tables/pkgscript/setup.js",
    "xtmfg/tables/pkgscript/shift.js",
    "xtmfg/tables/pkgscript/shifts.js",
    "xtmfg/tables/pkgscript/standardOperation.js",
    "xtmfg/tables/pkgscript/standardOperations.js",
    "xtmfg/tables/pkgscript/taDetail.js",
    "xtmfg/tables/pkgscript/taTimeEdit.js",
    "xtmfg/tables/pkgscript/transferOrderItem.js",
    "xtmfg/tables/pkgscript/user.js",
    "xtmfg/tables/pkgscript/whseCalendar.js",
    "xtmfg/tables/pkgscript/whseCalendars.js",
    "xtmfg/tables/pkgscript/whseWeek.js",
    "xtmfg/tables/pkgscript/woMaterialItem.js",
    "xtmfg/tables/pkgscript/wooItemList.js",
    "xtmfg/tables/pkgscript/woOperation.js",
    "xtmfg/tables/pkgscript/workCenter.js",
    "xtmfg/tables/pkgscript/workCenters.js",
    "xtmfg/tables/pkgscript/workOrder.js",
    "xtmfg/tables/pkgscript/workOrderOperations.js",
    "xtmfg/tables/pkgscript/wotc.js",
    "xtmfg/tables/pkgscript/woTimeClock.js",
    "xtmfg/tables/pkgscript/xtmfgErrors.js",
    "xtmfg/tables/pkguiform/bbom.ui",
    "xtmfg/tables/pkguiform/bbomItem.ui",
    "xtmfg/tables/pkguiform/bboms.ui",
    "xtmfg/tables/pkguiform/bomItemAddend.ui",
    "xtmfg/tables/pkguiform/bomitems.ui",
    "xtmfg/tables/pkguiform/boo.ui",
    "xtmfg/tables/pkguiform/booItem.ui",
    "xtmfg/tables/pkguiform/booitemImage.ui",
    "xtmfg/tables/pkguiform/booItemList.ui",
    "xtmfg/tables/pkguiform/booList.ui",
    "xtmfg/tables/pkguiform/changeQtyToDistributeFromBreeder.ui",
    "xtmfg/tables/pkguiform/configurePDAddend.ui",
    "xtmfg/tables/pkguiform/configureTimeAddend.ui",
    "xtmfg/tables/pkguiform/configureWOAddend.ui",
    "xtmfg/tables/pkguiform/copyBOO.ui",
    "xtmfg/tables/pkguiform/copyItemBOO.ui",
    "xtmfg/tables/pkguiform/copyPlannedSchedule.ui",
    "xtmfg/tables/pkguiform/correctOperationsPosting.ui",
    "xtmfg/tables/pkguiform/createBufferStatusByItem.ui",
    "xtmfg/tables/pkguiform/createBufferStatusByPlannerCode.ui",
    "xtmfg/tables/pkguiform/distributeBreederProduction.ui",
    "xtmfg/tables/pkguiform/dspBreederDistributionVariance.ui",
    "xtmfg/tables/pkguiform/dspCapacityBufferStatusByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspInventoryBufferStatusByParameterList.ui",
    "xtmfg/tables/pkguiform/dspLaborVarianceByBOOItem.ui",
    "xtmfg/tables/pkguiform/dspMPSDetail.ui",
    "xtmfg/tables/pkguiform/dspMRPException.ui",
    "xtmfg/tables/pkguiform/dspOperationsByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspPlannedRevenueExpensesByPlannerCode.ui",
    "xtmfg/tables/pkguiform/dspPoItemsByBufferStatus.ui",
    "xtmfg/tables/pkguiform/dspRoughCutByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspSequencedBOM.ui",
    "xtmfg/tables/pkguiform/dspStandardOperationsByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspTaSummary.ui",
    "xtmfg/tables/pkguiform/dspTimePhasedAvailableCapacityByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspTimePhasedCapacityByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspTimePhasedDemandByPlannerCode.ui",
    "xtmfg/tables/pkguiform/dspTimePhasedLoadByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspTimePhasedPlannedREByPlannerCode.ui",
    "xtmfg/tables/pkguiform/dspTimePhasedProductionByItem.ui",
    "xtmfg/tables/pkguiform/dspTimePhasedProductionByPlannerCode.ui",
    "xtmfg/tables/pkguiform/dspTimePhasedRoughCutByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspWoBufferStatusByParameterList.ui",
    "xtmfg/tables/pkguiform/dspWoEffortByUser.ui",
    "xtmfg/tables/pkguiform/dspWoEffortByWorkOrder.ui",
    "xtmfg/tables/pkguiform/dspWoOperationBufrStsByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspWoOperationsByWorkCenter.ui",
    "xtmfg/tables/pkguiform/dspWoOperationsByWorkOrder.ui",
    "xtmfg/tables/pkguiform/itemsiteSched.ui",
    "xtmfg/tables/pkguiform/laborRate.ui",
    "xtmfg/tables/pkguiform/laborRates.ui",
    "xtmfg/tables/pkguiform/ltanalysis.ui",
    "xtmfg/tables/pkguiform/overhead.ui",
    "xtmfg/tables/pkguiform/overheadList.ui",
    "xtmfg/tables/pkguiform/overheadSelect.ui",
    "xtmfg/tables/pkguiform/plannedSchedule.ui",
    "xtmfg/tables/pkguiform/plannedScheduleItem.ui",
    "xtmfg/tables/pkguiform/plannedSchedules.ui",
    "xtmfg/tables/pkguiform/postOperations.ui",
    "xtmfg/tables/pkguiform/printProductionEntrySheet.ui",
    "xtmfg/tables/pkguiform/printWoRouting.ui",
    "xtmfg/tables/pkguiform/runMPSByPlannerCode.ui",
    "xtmfg/tables/pkguiform/runMRPException.ui",
    "xtmfg/tables/pkguiform/shift.ui",
    "xtmfg/tables/pkguiform/shifts.ui",
    "xtmfg/tables/pkguiform/standardOperation.ui",
    "xtmfg/tables/pkguiform/standardOperations.ui",
    "xtmfg/tables/pkguiform/taDetail.ui",
    "xtmfg/tables/pkguiform/taTimeEdit.ui",
    "xtmfg/tables/pkguiform/whseCalendar.ui",
    "xtmfg/tables/pkguiform/whseCalendars.ui",
    "xtmfg/tables/pkguiform/whseWeek.ui",
    "xtmfg/tables/pkguiform/woMaterialItemAddend.ui",
    "xtmfg/tables/pkguiform/wooItemList.ui",
    "xtmfg/tables/pkguiform/woOperation.ui",
    "xtmfg/tables/pkguiform/workCenter.ui",
    "xtmfg/tables/pkguiform/workCenters.ui",
    "xtmfg/tables/pkguiform/workOrderOperations.ui",
    "xtmfg/tables/pkguiform/wotc.ui",
    "xtmfg/tables/pkguiform/woTimeClock.ui"
  ]
}
