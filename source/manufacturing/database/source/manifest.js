{
  "name": "manufacturing",
  "version": "",
  "comment": "Manufacturing extension",
  "loadOrder": 110,
  "dependencies": ["inventory"],
  "databaseScripts": [
    "xt/trigger_functions/bomitem_did_change.sql",
    "xt/trigger_functions/booitem_did_change.sql",
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
    "xt/functions/womatl_posted_value.sql",
    "xt/functions/wooper_posted_value.sql",
    "xt/tables/objtype.sql",
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
    "xt/tables/rptdef.sql",
    "xt/tables/woemlprofile.sql"
  ]
}
