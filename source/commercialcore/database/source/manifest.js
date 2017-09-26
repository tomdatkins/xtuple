{
  "name": "commercialcore",
  "version": "",
  "comment": "Commercial Core extension",
  "loadOrder": 50,
  "dependencies": [],
  "databaseScripts": [
    "../../foundation-database/xtcore/trigger_functions/createwf_triggers.sql",
    "../../foundation-database/xtcore/tables/pkgscript/initMenu.js",
    {"path": "../../foundation-database/xtcore/tables/pkgscript/setup.js", "order": 10},
    "../../foundation-database/xtcore/update_metric.sql"
  ]
}

