{
  "name":         "quality",
  "version":      "1.0.0",
  "comment":      "Quality Control",
  "loadOrder":    2021,
  "dependencies": ["manufacturing"],
  "databaseScripts": [
    "xm/javascript/quality.sql",
    "xt/tables/rptdef.sql",
    "xt/tables/qthead.sql",
    "xt/tables/qualitytestwf.sql",
    "xt/tables/qualityplanwf.sql",
    "xt/tables/acttype.sql",
    "xt/functions/wftype.sql"
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
