{
  "name": "incident_plus",
  "version": "1.4.5",
  "comment": "Found In / Fixed In Extension",
  "loadOrder": 120,
  "dependencies": ["crm"],
  "databaseScripts": [
    "xtincdtpls/schema/xtincdtpls.sql",
    "xtincdtpls/trigger_functions/incdtvertrigger.sql",
    "xtincdtpls/tables/prjver.sql",
    "xtincdtpls/tables/incdtver.sql"
  ]
}
