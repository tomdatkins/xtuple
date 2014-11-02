{
  "name": "quality",
  "version": "1.0.0",
  "comment": "Quality Control",
  "loadOrder": 120,
  "dependencies": ["inventory", "manufacturing"],
  "defaultSchema": "xt",
  "databaseScripts": [
    "xm/javascript/quality.sql",
    "xt/tables/qspec.sql",
    "xt/tables/qphead.sql",
    "xt/tables/qpitem.sql",
    "xt/tables/qpheadass.sql",
    "xt/tables/qthead.sql",
    "xt/tables/qtitem.sql",
    "xt/tables/qplanemlprofile.sql",
    "xt/tables/qualitytestwf.sql",
    "xt/tables/qualityplanwf.sql",
    "xt/tables/acttype.sql",
    "xt/tables/rptdef.sql",
    "xt/trigger_functions/qphead_trigger.sql",
    "xt/trigger_functions/qthead_trigger.sql",
    "xt/trigger_functions/qtitem_trigger.sql",
    "xt/trigger_functions/inv_hist_did_change.sql",
    "xt/trigger_functions/inv_detail_did_change.sql",
    "xt/trigger_functions/triggerwooperquality.sql",
    "public/tables/invhist.sql",
    "public/tables/invdetail.sql",
    "public/tables/wooper.sql",
    "xt/functions/quality_comment_type.sql",
    "xt/functions/formatqualityitemnumber.sql",    
    "priv.sql",
    "xt/tables/pkgmetasql/qualityTests-detail.mql",
    "xt/tables/pkgscript/initMenu.js",
    "xt/tables/pkgscript/qualityTests.js"    
  ],
  "routes": [
    {
      "path": "quality",
      "verb": "no-route",
      "filename": "routes/rpttransforms.js",
      "functionName": "qualityTransformFunctions"
    }
  ]    
}
