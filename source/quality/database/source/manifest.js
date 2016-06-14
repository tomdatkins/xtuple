{
  "name": "quality",
  "version": "1.0.0",
  "comment": "Quality Control",
  "loadOrder": 120,
  "dependencies": ["manufacturing"],
  "defaultSchema": "xt",
  "databaseScripts": [
    "xm/javascript/quality.sql",
    "xt/tables/qspec.sql",
    "xt/tables/qspectype.sql",
    "xt/tables/qphead.sql",
    "xt/tables/qpitem.sql",
    "xt/tables/qpheadass.sql",
    "xt/tables/qthead.sql",
    "xt/tables/qtitem.sql",
    "xt/tables/qtrlscode.sql",
    "xt/tables/qtrsncode.sql",
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
    "xt/functions/wftype.sql",
    "priv.sql",
    "xt/tables/pkgmetasql/qualityTests-detail.mql",
    "xt/tables/pkgmetasql/qualityTests-summary.mql",
    "xt/tables/pkgscript/initMenu.js",
    "xt/tables/pkgscript/qualityTests.js",
    "xt/tables/pkgreport/QualityCertificate.xml",
    "xt/tables/pkgreport/QualityNonConformance.xml",
    "xt/tables/pkgreport/QualityTest.xml",
    "xt/tables/pkgreport/QualityTestSummary.xml",
    "xt/tables/pkgreport/WorkOrderQualityCertificate.xml"
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