{
  "name": "bi",
  "version": "",
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
