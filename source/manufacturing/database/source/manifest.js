{
  "name": "manufacturing",
  "comment": "Manufacturing extension",
  "loadOrder": 110,
  "dependencies": ["inventory"],
  "databaseScripts": [
    "public/tables/wo.sql",
    "xm/javascript/manufacturing.sql",
    "xt/views/postproductioninfo.sql",
    "xt/views/womatlissue.sql"
  ]
}