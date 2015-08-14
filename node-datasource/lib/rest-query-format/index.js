/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true,
noarg:true, regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

(function () {
  'use strict';

  /**
   * Format acomplex query's using the REST query structure into an xTuple's query.
   * This is a helper function that reformats the query structure from a
   * rest_query to our XT.Rest structure. This function should be used by reformat
   * any REST API client queriers.
   * Sample usage:
   *   XM.Model.restQueryFormat("XM.Address", {"query": [{"city":{"EQUALS":"Norfolk"}}], "orderby": [{"ASC": "line1"}, {"DESC": "line2"}]})
   *
   * @param {Object} options: query
   * @returns {Object} The formated query
   */
  function restQueryFormat (recordType, request, options, schema) {
    try {
      var order = {},
          param = {},
          query = {},
          nameSpace = recordType.split(".")[0],
          type = recordType.split(".")[1],
          validColNamePattern = new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*$"),
          mapOperator = function (op) {
            var operators = {
                  value: {
                    ANY:          'ANY',
                    NOT_ANY:      'NOT ANY',
                    EQUALS:       '=',
                    NOT_EQUALS:   '!=',
                    LESS_THAN:    '<',
                    AT_MOST:      '<=',
                    GREATER_THAN: '>',
                    AT_LEAST:     '>=',
                    MATCHES:      'MATCHES',
                    BEGINS_WITH:  'BEGINS_WITH'
                  }
                };

            if (operators.value[op]) {
              return operators.value[op];
            } else {
              throw new Error;
            }
          },
          validateColumn = function (column) {
            var valid = false;

            if (validColNamePattern.test(column)) {
              for (var c = 0; c < schema.columns.length; c++) {
                if (schema.columns[c].name === column) {
                  valid = true;
                }
              }
            }

            return valid;
          },
          validateValue = function (value) {
            switch (typeof value) {
              case "undefined":
              case "symbol":
              case "object":
              case "function":
                throw new Error;
              default:
                return value;
            }
          };

      options = options || {}
      schema = schema || XT.Session.schema(nameSpace, type); // TODO: Test this in plv8.

      /* Convert from rest_query to XM.Model.query structure. */
      if (options) {
        if (options.query) {
          query.parameters = [];
          for (var column in options.query) {
            if (validateColumn(column)) {
              for (var op in options.query[column]) {
                param = {};
                param.attribute = column;
                param.operator = mapOperator(op);
                param.value = validateValue(options.query[column][op]);
                query.parameters.push(param);
              }
            } else {
              throw new Error;
            }
          }
        }

        /* Convert free text query. */
        if (recordType && options.q) {
          /* Add string columns to search query. */
          var param = {
              "attribute": []
            };

          // TODO: Test this in plv8.
          for (var c = 0; c < schema.columns.length; c++) {
            if (schema.columns[c].category === 'S') {
              param.attribute.push(schema.columns[c].name);
            }
          }

          if (param.attribute.length) {
            /* Add all string columns to attribute query. */
            query.parameters = query.parameters || [];
            param.operator = 'MATCHES';

            /* Replace any spaces with regex '.*' so multi-word search works on similar strings. */
            param.value = options.q.replace(' ', '.*');
            query.parameters.push(param);
          }
        }

        if (options.orderby || options.orderBy) {
          options.orderBy = options.orderby || options.orderBy;
          delete options.orderby;
          query.orderBy = [];
          for (var column in options.orderBy) {
            if (validateColumn(column)) {
              order = {};
              order.attribute = column;
              if (options.orderBy[column] === 'DESC') {
                order.descending = true;
              } else {
                order.descending = false;
              }
              query.orderBy.push(order);
            } else {
              throw new Error;
            }
          }
        }

        if (options.rowlimit || options.rowLimit) {
          options.rowLimit = +options.rowlimit || +options.rowLimit;
          delete options.rowlimit;
          query.rowLimit = options.rowLimit;
        } else {
          query.rowLimit = 100;
        }

        if (options.maxresults || options.maxResults) {
          options.maxResults = +options.maxresults || +options.maxResults;
          delete options.maxresults;
          query.rowLimit = options.maxResults;
        }

        if (options.pagetoken || options.pageToken) {
          options.pageToken = +options.pagetoken || +options.pageToken;
          delete options.pagetoken;
          if (query.rowLimit) {
            query.rowOffset = (options.pageToken || 0) * (query.rowLimit);
          } else {
            query.rowOffset = (options.pageToken || 0);
          }
        }

        if (options.count || (options.hasOwnProperty("count") && options.count !== false)) {
          query.count = true;
        }
      }

      return query;
    } catch (err) {
      X.err("Bad REST query request: ", request, "\nQuery string:\n", JSON.stringify(options, null, 2), "\nStack ", err.stack);
      return false;
    }
  }

  module.exports = restQueryFormat;
})();
