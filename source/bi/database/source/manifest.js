{
  "name": "bi",
  "version": "4.5.0Beta",
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
    }
  ]
}
