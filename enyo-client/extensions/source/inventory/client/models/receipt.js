/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initVendorModels = function () {

    /**
      @class

      @extends XM.Info
    */
    XM.VendorType = XM.Document.extend(/** @scope XM.VendorType.prototype */
    {

      recordType: 'XM.VendorType',

      documentKey: "code"

    }); 

    /**
      @class

      @extends XM.Info
    */
    XM.VendorRelation = XM.Info.extend({
      /** @scope XM.VendorRelation.prototype */

      recordType: 'XM.VendorRelation'

      //numberKey: "number"

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.VendorRelationCollection = XM.Collection.extend(/** @lends XM.VendorRelationCollection.prototype */{

      model: XM.VendorRelation

    });

  };

}());
