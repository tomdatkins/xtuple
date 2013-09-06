/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global  enyo:true, XT:true, XV:true*/

(function () {


  XT.extensions.standard.initList = function () {

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    // Add support for Transfer Orders
    enyo.mixin(XV.IssueToShippingList.prototype, {
      collection: "XM.IssueToShippingMultiCollection",
      parameterWidget: "XV.IssueToShippingMultiParameters"
    });

  };

}());
