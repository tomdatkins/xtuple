/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.standard.initInventoryModels = function () {

    /**
      Extension of `XM.IssueToShipping` that includes support
      for `Tranfer Orders`.

      @extends XM.IssueToShipping
      @params {Array} Data
      @params {Object} Options
    */
    XM.IssueToShippingMulti = XM.IssueToShipping.extend({

      recordType: "XM.IssueToShippingMulti",

      issueMethod: "issueToShippingMulti"

    });

    /**
      Static function to call issue to shipping on a set of multiple items
      that includes support for `Transfer Orders`.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Inventory.issueToShippingMulti = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", "issueToShippingMulti", params, options);
    };

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.IssueToShippingMultiCollection = XM.Collection.extend({

      model: XM.IssueToShippingMulti

    });

  };

}());

