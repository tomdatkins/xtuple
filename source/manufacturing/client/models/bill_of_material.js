/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initBillOfMaterialModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.BillOfMaterial = XM.Model.extend(
      /** @lends XM.BillOfMaterial.prototype */{

      recordType: "XM.BillOfMaterial"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.BillOfMaterialItem = XM.Model.extend(
      /** @lends XM.BillOfMaterialItem.prototype */{

      recordType: "XM.BillOfMaterialItem"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.BillOfMaterialItemRelation = XM.Model.extend(
      /** @lends XM.BillOfMaterialItemRelation.prototype */{

      recordType: "XM.BillOfMaterialItemRelation"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.BillOfMaterialRevision = XM.Model.extend(
      /** @lends XM.BillOfMaterialRevision.prototype */{

      recordType: "XM.BillOfMaterialRevision"

    });

    _.extend(XM.BillOfMaterialRevision, {
      /** @scope XM.BillOfMaterialRevision */

      /**
        Active Status.

        @static
        @constant
        @type String
        @default A
      */
      ACTIVE_STATUS: "A",

      /**
        Inactive status.

        @static
        @constant
        @type String
        @default I
      */
      INACTIVE_STATUS: "I",

      /**
        Pending status.

        @static
        @constant
        @type String
        @default P
      */
      PENDING_STATUS: 'P',
    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.BillOfMaterialCollection = XM.Collection.extend(
      /** @lends XM.BillOfMaterialCollection.prototype */{

      model: XM.BillOfMaterial

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.BillOfMaterialRevisionCollection = XM.Collection.extend(
      /** @lends XM.BillOfMaterialRevisionCollection.prototype */{

      model: XM.BillOfMaterialRevision

    });

  };

}());
