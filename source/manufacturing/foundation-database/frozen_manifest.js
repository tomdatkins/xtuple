{
  "name": "manufacturing_foundation_frozen",
  "version": "1.8.1",
  "comment": "Manufacturing foundation",
  "loadOrder": 2000,
  "databaseScripts": [
    "frozen/create_xtmfg_schema.sql",
    "frozen/tables/bbomitem.sql",
    "frozen/tables/wrkcnt.sql",
    "frozen/tables/boohead.sql",
    "frozen/tables/booitem.sql",
    "frozen/tables/booimage.sql",
    "frozen/tables/brddist.sql",
    "frozen/tables/brdvar.sql",
    "frozen/tables/bufrsts.sql",
    "frozen/tables/itemsitecap.sql",
    "frozen/tables/lbrrate.sql",
    "frozen/tables/lt_report.sql",
    "frozen/tables/mrpexcp.sql",
    "frozen/tables/ovrhead.sql",
    "frozen/tables/planoper.sql",
    "frozen/tables/pschhead.sql",
    "frozen/tables/pschitem.sql",
    "frozen/tables/stdopn.sql",
    "frozen/tables/tashift.sql",
    "frozen/tables/wooper.sql",
    "frozen/tables/wooperpost.sql",
    "frozen/tables/woopervar.sql",
    "frozen/tables/wotc.sql",
    "frozen/tables/tatc.sql",
    "frozen/tables/whsecal.sql",
    "frozen/tables/whsewk.sql",
    "frozen/misc/setup_shifts.sql",
    "frozen/views/vw_tashift.sql",
    "frozen/views/wotclinearized.sql",
    "frozen/triggers/boohead.sql",
    "frozen/triggers/booitem.sql",
    "frozen/triggers/wooper.sql",
    "frozen/triggers/tatc.sql",
    "frozen/functions/booitem.sql",
    "frozen/functions/toolcapacity.sql",
    "frozen/functions/loadbytool.sql",
    "frozen/functions/bomanalysis.sql",
    "frozen/functions/calcbufferstatus.sql",
    "frozen/functions/calcrate.sql",
    "frozen/functions/calcwooperstart.sql",
    "frozen/functions/checkboositeprivs.sql",
    "frozen/functions/closewo.sql",
    "frozen/functions/copyboo.sql",
    "frozen/functions/copyitem.sql",
    "frozen/functions/copyplannedschedule.sql",
    "frozen/functions/correctoperationsposting.sql",
    "frozen/functions/correctproduction-mfg.sql",
    "frozen/functions/createboorev.sql",
    "frozen/functions/createbufferstatus.sql",
    "frozen/functions/createwobufferstatus.sql",
    "frozen/functions/cumulativempsschedule.sql",
    "frozen/functions/deleteboo.sql",
    "frozen/functions/deleteitem.sql",
    "frozen/functions/deletewooper.sql",
    "frozen/functions/deleteworkcenter.sql",
    "frozen/functions/directlaborcost.sql",
    "frozen/functions/directlaborcostoper.sql",
    "frozen/functions/distributebreederproduction.sql",
    "frozen/functions/formatwooperbarcode.sql",
    "frozen/functions/getbooitemid.sql",
    "frozen/functions/getstdopnid.sql",
    "frozen/functions/getwrkcntid.sql",
    "frozen/functions/indentedwoops.sql",
    "frozen/functions/issuetobreeder.sql",
    "frozen/functions/loadbyworkcenter.sql",
    "frozen/functions/logwotcevent.sql",
    "frozen/functions/machineoverheadcost.sql",
    "frozen/functions/machineoverheadcostoper.sql",
    "frozen/functions/movebbomitemdown.sql",
    "frozen/functions/movebbomitemup.sql",
    "frozen/functions/movebooitemdown.sql",
    "frozen/functions/movebooitemup.sql",
    "frozen/functions/movewooperdown.sql",
    "frozen/functions/movewooperup.sql",
    "frozen/functions/mrpexceptions.sql",
    "frozen/functions/overheadcost.sql",
    "frozen/functions/overheadcostoper.sql",
    "frozen/functions/plannedruntime.sql",
    "frozen/functions/plannedsetuptime.sql",
    "frozen/functions/postoperation.sql",
    "frozen/functions/postoverheadtime.sql",
    "frozen/functions/postproduction-mfg.sql",
    "frozen/functions/postrntime.sql",
    "frozen/functions/postsutime.sql",
    "frozen/functions/qtyforecasted.sql",
    "frozen/functions/receivefrombreeder.sql",
    "frozen/functions/returnovertimehours.sql",
    "frozen/functions/saveboohead.sql",
    "frozen/functions/savebooitemimage.sql",
    "frozen/functions/setwhsewkday.sql",
    "frozen/functions/taclockin.sql",
    "frozen/functions/taclockout.sql",
    "frozen/functions/unwoclockout.sql",
    "frozen/functions/woclockin.sql",
    "frozen/functions/woclockout.sql",
    "frozen/functions/woopermatlissued.sql",
    "frozen/functions/wooperqtyavail.sql",
    "frozen/functions/woopertime.sql",
    "frozen/functions/workcentercapacity.sql",
    "frozen/functions/workcenterruncost.sql",
    "frozen/functions/workcentersetupcost.sql",
    "frozen/functions/wotctime.sql",
    "frozen/functions/wotime.sql",
    "frozen/functions/wotimebywo.sql",
    "frozen/functions/mpsreport.sql",
    "frozen/indexes/wotc.sql",
    "frozen/api/views/boo.sql",
    "frozen/api/views/booitem.sql",
    "frozen/api/views/booitemimage.sql",
    "frozen/priv.sql"
  ]
}
