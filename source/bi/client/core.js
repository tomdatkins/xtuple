/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, 
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.bi = {
    setVersion: function () {
      XT.setVersion("4.5.0Beta", "bi");
    }
  };
  
  _.extend(XT, {
    /*
     *   Generate MDX query string based on queryTemplate.  members are optional.  
     *   rows, columns, cube and where filters are required.  Additional filters can
     *   be added using the filters argument.
     */
    jsonToMDX: function (tokens, filters) {
      var that = this,
      query = "",
      comma = "",
      filterSet = filters ? filters : [];
      
      // WITH MEMBERS clause
      filterSet = tokens.where ? filters.concat(tokens.where) : filterSet;
      _.each(tokens.members, function (member, index) {
        query = index === 0 ? "WITH " : query;
        query += " MEMBER " + member.name + " AS " + member.value;
      });
      
      // SELECT clause
      query += " SELECT NON EMPTY {";
      _.each(tokens.columns, function (column, index) {
        comma = index > 0 ? ", " : "";
        query += comma + column;
      });
      query += "} ON COLUMNS, NON EMPTY {";
      _.each(tokens.rows, function (row, index) {
        comma = index > 0 ? ", " : "";
        query += comma + row;
      });
      query += "} ON ROWS";
      
      // FROM clause
      query += " FROM " + tokens.cube;
      
      // WHERE clause
      _.each(filterSet, function (filter, index) {
        query = index === 0 ? query + " WHERE (" : query;
        comma = index > 0 ? ", " : "";
        query += comma + filter;
      });
      if (query.indexOf(" WHERE (") !== -1) {
        query += ")";
      }
      
      return query;
    }
    
  });
}());
