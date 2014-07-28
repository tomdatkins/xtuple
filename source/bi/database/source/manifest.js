{
  "name": "bi",
  "version": "4.6.0-beta",
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
