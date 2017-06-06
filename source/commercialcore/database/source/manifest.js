{
  "name": "commercialcore",
  "version": "",
  "comment": "Commercial Core extension",
  "loadOrder": 50,
  "dependencies": [],
  "databaseScripts": [
    "../../foundation-database/workflow/sql/trigger_functions/createwf_triggers.sql",
    "../../foundation-database/workflow/scripts/initMenu.js",
    {"path": "../../foundation-database/workflow/scripts/setup.js", "order": 10},
    "../../foundation-database/workflow/sql/update_metric.sql"
  ]
}

