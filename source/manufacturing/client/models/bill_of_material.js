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
    XM.BillOfMaterialRevision = XM.Model.extend(
      /** @lends XM.BillOfMaterialRevision.prototype */{

      recordType: "XM.BillOfMaterialRevision"

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

  };

}());
