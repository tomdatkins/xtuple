/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.standard.initShipmentModels = function () {

    /**
      @class

      @extends XM.Shipment
    */
    XM.ShipmentMulti = XM.Shipment.extend({

      recordType: "XM.ShipmentMulti",

    });

    /**
      @class

      @extends XM.ShipShipment
    */
    XM.ShipShipmentMulti = XM.ShipShipment.extend({

      recordType: "XM.ShipShipmentMulti"

    });

    /**
      @class

      @extends XM.ShipmentLine
    */
    XM.ShipmentLineMulti = XM.ShipmentLine.extend({

      recordType: "XM.ShipmentLine"

    });

    /**
      @class

      @extends XM.ShipShipmentLine
    */
    XM.ShipShipmentLineMulti = XM.ShipShipmentLine.extend({

      recordType: "XM.ShipShipmentLine"

    });

    /**
      @class

      @extends XM.ShipmentSalesOrder
    */
    XM.ShipmentOrder = XM.ShipmentSalesOrder.extend({

      recordType: "XM.ShipmentOrder"

    });

    /**
      @class

      @extends XM.ShipmentListItem
    */
    XM.ShipmentMultiListItem = XM.ShipmentListItem.extend({

      recordType: "XM.ShipmentMultiListItem",

      editableModel: "XM.ShipmentMulti"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ShipmentMultiRelation = XM.Info.extend({

      recordType: "XM.ShipmentMultiRelation",

      editableModel: "XM.ShipmentMulti"

    });


    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.ShipmentMultiCollection = XM.Collection.extend({

      model: XM.ShipmentMulti

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.ShipmentMultiListItemCollection = XM.Collection.extend({

      model: XM.ShipmentMultiListItem

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.ShipmentMultiRelationCollection = XM.Collection.extend({

      model: XM.ShipmentMultiRelation

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.ShipmentOrderCollection = XM.Collection.extend({

      model: XM.ShipmentOrder

    });
  };

}());

