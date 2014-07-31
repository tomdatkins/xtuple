{
  "name": "distribution",
  "version": "4.6.0-beta",
  "comment": "Distribution extension",
  "loadOrder": 125,
  "dependencies": ["inventory"],
  "databaseScripts": [
    "populate_settings_data.sql",
    "populate_crm_data.sql",
    "populate_xwd_data.sql",
    "populate_item_data.sql"
  ]
}
