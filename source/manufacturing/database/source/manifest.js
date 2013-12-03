{
  "name": "manufacturing",
  "comment": "Manufacturing extension",
  "loadOrder": 110,
  "dependencies": ["inventory"],
  "databaseScripts": [
    "xm/javascript/manufacturing.sql",
    "xt/views/distributioninfo.sql",
    "xt/views/postproductioninfo.sql",
    "xt/views/womatlissue.sql"
  ]
}