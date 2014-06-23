{
  "name": "bi",
  "version": "4.5.0",
  "comment": "Business Intelligence",
  "loadOrder": 999,
  "dependencies": [],
  "databaseScripts": [
    "create-bi-schema.sql",
    "usrbichart.sql",
    "register.sql"
  ],
  "routes": [
    {
      "path": "queryOlap",
      "filename": "routes/olapdata.js",
      "functionName": "queryOlapCatalog"
    },
    {
      "path": "analysis",
      "filename": "routes/analysis.js",
      "functionName": "analysis"
    }
  ]
}
