{
  "name": "bi",
  "version": "4.5.1",
  "comment": "Business Intelligence",
  "loadOrder": 75,
  "dependencies": [],
  "databaseScripts": [
    "register.sql"
  ],
  "routes": [
    {
      "path": "analysis",
      "filename": "routes/analysis.js",
      "functionName": "analysis"
    }
  ]
}
