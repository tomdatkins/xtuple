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
  };
}());
