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
      descripAttribute: "getWorkOrderStatusString",
      list: "XV.WorkOrderList"
    });

    var K = XM.WorkOrder;

    enyo.kind({
      name: "XV.ReleasedWorkOrderWidget",
      kind: "XV.WorkOrderWidget",
      query: {parameters: [
        {attribute: "status", operator: "ANY",
          value: [K.RELEASED_STATUS, K.INPROCESS_STATUS]}
      ]}
    });

  };

}());