/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict: false */
/*global XM:true, enyo:true */

(function () {

  // ..........................................................
  // ORDER
  //

  enyo.kind({
    name: "XV.OrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.OrderRelationCollection",
    keyAttribute: "number",
    list: "XV.OrderList",
    query: {parameters: [
      {attribute: "status", value: XM.SalesOrderBase.OPEN_STATUS},
    ]}
  });

}());
