{
  "name": "incident_plus",
  "defaultSchema": "xtincdtpls",
  "version": "1.4.5",
  "comment": "Found In / Fixed In Extension",
  "loadOrder": 120,
  "dependencies": ["crm", "project"],
  "databaseScripts": [
    "xtincdtpls/schema/xtincdtpls.sql",
    "xtincdtpls/tables/prjver.sql",
    "xtincdtpls/tables/incdtbomver.sql",
    "xtincdtpls/tables/incdtprjtask.sql",
    "xtincdtpls/tables/incdtver.sql",
    "xtincdtpls/trigger_functions/incdtvertrigger.sql",
    "xtincdtpls/tables/pkgmetasql/incidents-xtuple.mql",
    "xtincdtpls/tables/pkgscript/incident.js",
    "xtincdtpls/tables/pkgscript/incidentWorkbench.js"
  ]
}
