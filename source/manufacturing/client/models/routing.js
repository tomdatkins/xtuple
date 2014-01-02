/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initRoutingModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.LaborRate = XM.Document.extend(
      /** @lends XM.LaborRate.prototype */{

      recordType: "XM.LaborRate",

      documentKey: "code",

      enforceUpperKey: false

    });

    /**
      @class

      @extends XM.Document
    */
    XM.WorkCenter = XM.Document.extend(
      /** @lends XM.WorkCenter.prototype */{

      recordType: "XM.WorkCenter",

      documentKey: "code",

      enforceUpperKey: false

    });

    /**
      @class

      @extends XM.Document
    */
    XM.StandardOperation = XM.Document.extend(
      /** @lends XM.StandardOperation.prototype */{

      recordType: "XM.StandardOperation",

      enforceUpperKey: false

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.LaborRateCollection = XM.Collection.extend(
      /** @lends XM.LaborRateCollection.prototype */{

      model: XM.LaborRate

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.WorkCenterCollection = XM.Collection.extend(
      /** @lends XM.WorkCenterCollection.prototype */{

      model: XM.WorkCenter

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.StandardOperationCollection = XM.Collection.extend(
      /** @lends XM.StandardOperationCollection.prototype */{

      model: XM.StandardOperation

    });

  };

}());
