/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSiteModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.SiteEmailProfile = XM.Document.extend({

      recordType: "XM.SiteEmailProfile",

      documentKey: "name"

    });

    /**
      @class

      @extends XM.WorkflowSource
    */
    XM.SiteTypeWorkflow = XM.WorkflowSource.extend({

      recordType: "XM.SiteTypeWorkflow"

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.SiteTypeCharacteristic = XM.CharacteristicAssignment.extend({

      recordType: "XM.SiteTypeCharacteristic",

      which: 'isTransferOrders'

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.SiteEmailProfileCollection = XM.Collection.extend({
      /** @scope XM.SiteEmailProfileCollection.prototype */

      model: XM.SiteEmailProfile

    });

  };

}());

