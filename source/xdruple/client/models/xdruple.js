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

    XM.XdrupleSite = XM.Model.extend({

      recordType: "XM.XdrupleSite",

      autoFetchId: true,

    });

    XM.XdrupleSiteRelation = XM.Model.extend({

      recordType: "XM.XdrupleSiteRelation",

      autoFetchId: true,

    });

    XM.XdrupleUserContact = XM.Model.extend({

      recordType: "XM.XdrupleUserContact",

      name: function () {
        return this.getValue("contact.firstName") + " " +
          this.getValue("contact.lastName");
      },

      autoFetchId: true,

    });

    XM.XdrupleCommerceContact = XM.Model.extend({

      recordType: "XM.XdrupleCommerceContact",

      autoFetchId: true,

    });

    XM.XdrupleCommerceAddress = XM.Model.extend({

      recordType: "XM.XdrupleCommerceAddress",

      autoFetchId: true,

    });

    //
    // COLLECTIONS
    //

    XM.XdrupleSiteCollection = XM.Collection.extend({
      model: XM.XdrupleSite
    });

    XM.XdrupleSiteRelationCollection = XM.Collection.extend({
      model: XM.XdrupleSiteRelation
    });

    XM.XdrupleUserContactCollection = XM.Collection.extend({
      model: XM.XdrupleUserContact
    });

    XM.XdrupleCommerceContactCollection = XM.Collection.extend({
      model: XM.XdrupleCommerceContact
    });

    XM.XdrupleCommerceAddressCollection = XM.Collection.extend({
      model: XM.XdrupleCommerceAddress
    });
  };
}());
