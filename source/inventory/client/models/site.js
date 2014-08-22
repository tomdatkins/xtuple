/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSiteModels = function () {

    XM.Site.prototype.augment({

      defaults: {
        isShippingSite: true,
        isTransitSite: false
      },

      handlers: {
        "change:code": "codeChanged",
        "change:isTransitSite": "isTransitSiteChanged"
      },
      
      codeChanged: function (model, value) {
        if (this.isReady() && value) {
          this.set("bolPrefix", value);
          this.set("counttagPrefix", value);
        }
      },

      isTransitSiteChanged: function () {
        if (this.isReady()) {
          var isTransitSite = this.get("isTransitSite");
          
          if (isTransitSite) {
            this.set("isShippingSite", false);
            this.requiredAttributes.push("costCategory");
          } else if (!isTransitSite) {
            this.set("isShippingSite", true);
            this.requiredAttributes = _.without(this.requiredAttributes, "costCategory");
          }
        }
      }
    });

    // Stomp on postbook's v. of couldCreate which restricts creating > 1 Site. Call original.
    XM.SiteListItem.prototype.couldCreate = function () {
      return XM.Info.prototype.couldCreate.apply(this, arguments);
    };

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

