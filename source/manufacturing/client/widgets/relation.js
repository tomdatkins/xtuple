/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XT:true, XM:true, enyo:true */

(function () {

  XT.extensions.manufacturing.initRelations = function () {

    // ..........................................................
    // WORK ORDER
    //

    enyo.kind({
      name: "XV.WorkOrderWidget",
      kind: "XV.RelationWidget",
      collection: "XM.WorkOrderRelationCollection",
      keyAttribute: "name",
      nameAttribute: "getItemSiteString",
      descripAttribute: "formatStatus",
      list: "XV.WorkOrderList"
    });

    var K = XM.WorkOrder;

    enyo.kind({
      name: "XV.IssuableWorkOrderWidget",
      kind: "XV.WorkOrderWidget",
      query: {parameters: [
        {attribute: "status", operator: "NOT ANY",
          value: [K.CLOSED_STATUS, K.OPEN_STATUS]}
      ]}
    });

  };

}());