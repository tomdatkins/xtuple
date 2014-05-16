select xt.install_js('XM','ItemSite','xdruple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.ItemSiteListItem) { XM.ItemSiteListItem = {}; }

  XM.ItemSiteListItem.isDispatchable = true;


  /**
   Wrapper for XM.ItemSiteListItem.fetch with support for REST query formatting.
   Sample usage:
    select xt.post('{
      "nameSpace":"XM",
      "type":"ItemSiteListItem",
      "dispatch":{
        "functionName":"restFetch",
        "parameters":[
          {
            "query":[
              {"customer":{"EQUALS":"TTOYS"}},
              {"shipto":{"EQUALS":"1d103cb0-dac6-11e3-9c1a-0800200c9a66"}},
              {"effectiveDate":{"EQUALS":"2014-05-01"}}
            ]
          }
        ]
      },
      "username":"admin",
      "encryptionKey":"hm6gnf3xsov9rudi"
    }');

   @param {Object} options: query
   @returns Object
  */
  XM.ItemSiteListItem.xdCommerceProductFetch = function (options) {
    options = options || {};

    var items = {},
      query = {},
      result = {};

    if (options) {
      /* Convert from rest_query to XM.Model.query structure. */
      query = XM.Model.restQueryFormat(options);

      /* Perform the query. */
      return XM.ItemSite._fetch("XM.XdrupleCommerceProduct", "xdruple.xd_commerce_product", query, 'product_id', 'id');
    } else {
      throw new handleError("Bad Request", 400);
    }
  };
  XM.ItemSiteListItem.xdCommerceProductFetch.description = "Returns ItemSiteListItems with additional special support for exclusive item rules, to filter on only items with associated item sources and Cross check on `alias` and `barcode` attributes for item numbers.";
  XM.ItemSiteListItem.xdCommerceProductFetch.request = {
    "$ref": "XdCommerceProductFetchQuery"
  };
  XM.ItemSiteListItem.xdCommerceProductFetch.parameterOrder = ["options"];
  // For JSON-Schema deff, see:
  // https://github.com/fge/json-schema-validator/issues/46#issuecomment-14681103
  XM.ItemSiteListItem.xdCommerceProductFetch.schema = {
    XdCommerceProductFetchQuery: {
      properties: {
        attributes: {
          title: "XdCommerceProductFetchQuery Service request attributes",
          description: "An array of attributes needed to perform a XdCommerceProductFetchQuery query.",
          type: "array",
          items: [
            {
              title: "Options",
              type: "object",
              "$ref": "XdCommerceProductFetchOptions"
            }
          ],
          "minItems": 1,
          "maxItems": 1,
          required: true
        }
      }
    },
    XdCommerceProductFetchOptions: {
      properties: {
        query: {
          title: "query",
          description: "The query to perform.",
          type: "array",
          items: [
            {
              title: "column",
              type: "object"
            }
          ],
          "minItems": 1
        },
        orderby: {
          title: "Order By",
          description: "The query order by.",
          type: "array",
          items: [
            {
              title: "column",
              type: "object"
            }
          ]
        },
        rowlimit: {
          title: "Row Limit",
          description: "The query for paged results.",
          type: "integer"
        },
        maxresults: {
          title: "Max Results",
          description: "The query limit for total results.",
          type: "integer"
        },
        pagetoken: {
          title: "Page Token",
          description: "The query offset page token.",
          type: "integer"
        },
        count: {
          title: "Count",
          description: "Set to true to return only the count of results for this query.",
          type: "boolean"
        }
      }
    }
  };

}());

$$ );
