/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, window:true */

(function () {
  "use strict";

  XT.extensions.xdruple.initModels = function () {

    //
    // MODELS
    //

    XM.XdSite = XM.Model.extend({

      recordType: "XM.XdSite",

      autoFetchId: true,

    });

    XM.XdSiteRelation = XM.Model.extend({

      recordType: "XM.XdSiteRelation",

      autoFetchId: true,

    });

    XM.XdUserContact = XM.Model.extend({

      recordType: "XM.XdUserContact",

      name: function () {
        return this.getValue("contact.firstName") + " " +
          this.getValue("contact.lastName");
      },

      autoFetchId: true,

    });

    XM.XdContact = XM.Model.extend({

      recordType: "XM.XdContact",

      autoFetchId: true,

    });

    XM.XdAddress = XM.Model.extend({

      recordType: "XM.XdAddress",

      autoFetchId: true,

    });

    //
    // COLLECTIONS
    //

    XM.XdSiteCollection = XM.Collection.extend({
      model: XM.XdSite
    });

    XM.XdSiteRelationCollection = XM.Collection.extend({
      model: XM.XdSiteRelation
    });

    XM.XdUserContactCollection = XM.Collection.extend({
      model: XM.XdUserContact
    });

    XM.XdContactCollection = XM.Collection.extend({
      model: XM.XdContact
    });

    XM.XdAddressCollection = XM.Collection.extend({
      model: XM.XdAddress
    });
  };
}());
