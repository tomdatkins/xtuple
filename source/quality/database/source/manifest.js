{
  "name":         "quality",
  "version":      "1.1.0",
  "comment":      "Quality Control",
  "loadOrder":    2021,
  "dependencies": ["manufacturing"],
  "databaseScripts": [
    "xt/tables/rptdef.sql"
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
