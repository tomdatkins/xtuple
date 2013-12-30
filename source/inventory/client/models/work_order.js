/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XM.WorkOrderListItem.prototype.augment({

    canIssueMaterial: function (callback) {
      var hasPrivilege = XT.session.privileges.get("IssueWoMaterials"),
        inventoryInstalled = XT.extensions.inventory || false,
        status = this.getValue("status");
      if (callback) {
        callback(hasPrivilege && inventoryInstalled && status !== "C");
      }
      return this;
    },

    canPostProduction: function (callback) {
      var hasPrivilege = XT.session.privileges.get("PostProduction"),
        inventoryInstalled = XT.extensions.inventory ? true : false,
        status = this.getValue("status");
      if (callback) {
        callback(hasPrivilege && inventoryInstalled && status !== "C");
      }
      return this;
    }

  });

}());

