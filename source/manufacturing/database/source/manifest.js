{
  "name": "manufacturing",
  "version": "1.7.0",
  "comment": "Manufacturing extension",
  "loadOrder": 110,
  "dependencies": ["inventory"],
  "databaseScripts": [
    "public/tables/bomhead.sql",
    "public/tables/bomitem.sql",
    "public/tables/womatl.sql",
    "xtmfg/tables/boohead.sql",
    "xtmfg/tables/booitem.sql",
    "xtmfg/tables/brddist.sql",
    "xm/javascript/item_site.sql",
    "xm/javascript/manufacturing.sql",
    "xm/javascript/site.sql",
    "xm/javascript/work_order.sql",
    "xt/functions/womatl_explode_phantom.sql",
    "xt/functions/womatl_posted_value .sql",
    "xt/functions/wooper_posted_value.sql",
    "xt/tables/ordtype.sql",
    "xt/tables/sordtype.sql",
    "xt/tables/wordtype.sql",
    "xt/views/bomiteminfo.sql",
    "xt/views/booiteminfo.sql",
    "xt/views/womatlissue.sql",
    "xt/views/woparent.sql",
    "xt/views/woinfo.sql",
    "xt/views/womatlinfo.sql",
    "xt/tables/brddistinfo.sql",
    "xt/tables/plancodeext.sql",
    "xt/tables/plancodewf.sql",
    "xt/tables/wftype.sql",
    "xt/tables/woemlprofile.sql",
    "xt/tables/wowf.sql",
    "xt/tables/acttype.sql"
  ]
}
