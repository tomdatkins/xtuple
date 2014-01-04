{
  "name": "manufacturing",
  "comment": "Manufacturing extension",
  "loadOrder": 110,
  "dependencies": ["inventory"],
  "databaseScripts": [
    "public/tables/wo.sql",
    "public/tables/womatl.sql",
    "xm/javascript/manufacturing.sql",
    "xt/functions/womatl_posted_value .sql",
    "xt/functions/wooper_posted_quantity.sql",
    "xt/functions/wooper_posted_value.sql",
    "xt/views/postproductioninfo.sql",
    "xt/views/womatlissue.sql",
    "xt/views/woinfo.sql",
    "xt/views/woparent.sql",
    "xt/views/womatlinfo.sql",
    "xt/tables/plancodeext.sql",
    "xt/tables/plancodewf.sql",
    "xt/tables/wftype.sql",
    "xt/tables/woemlprofile.sql",
    "xt/tables/wowf.sql",
    "xt/tables/acttype.sql"
  ]
}