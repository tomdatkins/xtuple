{
  "name": "quality",
  "version": "1.0.0",
  "comment": "Quality Control",
  "loadOrder": 120,
  "dependencies": ["manufacturing"],
  "defaultSchema": "xt",
  "databaseScripts": [
    "../../foundation-database/sql/update_version.sql",
    "../../foundation-database/source/xm/javascript/quality.sql",
    "../../foundation-database/source/xt/tables/qspec.sql",
    "../../foundation-database/source/xt/tables/qspectype.sql",
    "../../foundation-database/source/xt/tables/qphead.sql",
    "../../foundation-database/source/xt/tables/qpitem.sql",
    "../../foundation-database/source/xt/tables/qpheadass.sql",
    "../../foundation-database/source/xt/tables/qthead.sql",
    "../../foundation-database/source/xt/tables/qtitem.sql",
    "../../foundation-database/source/xt/tables/qtrlscode.sql",
    "../../foundation-database/source/xt/tables/qtrsncode.sql",
    "../../foundation-database/source/xt/tables/qplanemlprofile.sql",
    "../../foundation-database/source/xt/tables/qualitytestwf.sql",
    "../../foundation-database/source/xt/tables/qualityplanwf.sql",
    "../../foundation-database/source/xt/tables/acttype.sql",
    "../../foundation-database/source/xt/tables/rptdef.sql",
    "../../foundation-database/source/xt/trigger_functions/qphead_trigger.sql",
    "../../foundation-database/source/xt/trigger_functions/qthead_trigger.sql",
    "../../foundation-database/source/xt/trigger_functions/qtitem_trigger.sql",
    "../../foundation-database/source/xt/trigger_functions/inv_hist_did_change.sql",
    "../../foundation-database/source/xt/trigger_functions/inv_detail_did_change.sql",
    "../../foundation-database/source/xt/trigger_functions/triggerwooperquality.sql",
    "../../foundation-database/source/public/tables/invhist.sql",
    "../../foundation-database/source/public/tables/invdetail.sql",
    "../../foundation-database/source/public/tables/wooper.sql",
    "../../foundation-database/source/xt/functions/quality_comment_type.sql",
    "../../foundation-database/source/xt/functions/formatqualityitemnumber.sql",
    "../../foundation-database/source/xt/functions/wftype.sql",
    "../../foundation-database/source/priv.sql",

    "../../foundation-database/sql/qthead_doctype.sql"

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
