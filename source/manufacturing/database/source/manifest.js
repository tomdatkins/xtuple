{
  "name": "manufacturing",
  "comment": "Manufacturing extension",
  "loadOrder": 110,
  "dependencies": ["inventory"],
  "databaseScripts": [
    "public/tables/bomhead.sql",
    "public/tables/bomitem.sql",
    "public/tables/wo.sql",
    "public/tables/womatl.sql",
    "xtmfg/tables/boohead.sql",
    "xtmfg/tables/booitem.sql",
    "xm/javascript/manufacturing.sql",
    "xt/functions/womatl_posted_value .sql",
    "xt/functions/wooper_posted_quantity.sql",
    "xt/functions/wooper_posted_value.sql",
    "xt/views/bomiteminfo.sql",
    "xt/views/booiteminfo.sql",
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