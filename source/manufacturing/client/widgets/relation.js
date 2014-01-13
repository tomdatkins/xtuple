/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XM:true, enyo:true */

(function () {

  // ..........................................................
  // WORK ORDER
  //

  enyo.kind({
    name: "XV.OpenWorkOrderWidget",
    kind: "XV.WorkOrderWidget",
    query: {parameters: [
      {attribute: "status", value: XM.WorkOrder.OPEN_STATUS},
    ]}
  });

}());