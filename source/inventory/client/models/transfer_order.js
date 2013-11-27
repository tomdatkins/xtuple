/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.inventory.initTransferOrderModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.TransferOrder = XM.Document.extend({

      recordType: "XM.TransferOrder",

      numberPolicySetting: 'TONumberGeneration',

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.TransferOrderCharacteristic = XM.CharacteristicAssignment.extend(/** @lends XM.TransferOrderCharacteristic.prototype */{

      recordType: 'XM.TransferOrderCharacteristic',

      which: 'isSalesOrders'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderComment = XM.Comment.extend({

      recordType: "XM.TransferOrderComment",

      sourceName: "TO"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderLine = XM.Model.extend({

      recordType: "XM.TransferOrderLine"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderLineComment = XM.Comment.extend({

      recordType: "XM.TransferOrderLineComment",

      sourceName: "TI"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderAccount = XM.Model.extend(/** @lends XM.TransferOrderAccount.prototype */{

      recordType: 'XM.TransferOrderAccount',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderContact = XM.Model.extend(/** @lends XM.TransferOrderContact.prototype */{

      recordType: 'XM.TransferOrderContact',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderItem = XM.Model.extend(/** @lends XM.TransferOrderContact.prototype */{

      recordType: 'XM.TransferOrderItem',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderFile = XM.Model.extend(/** @lends XM.TransferOrderFile.prototype */{

      recordType: 'XM.TransferOrderFile',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderUrl = XM.Model.extend(/** @lends XM.TransferOrderUrl.prototype */{

      recordType: 'XM.TransferOrderUrl',

      isDocumentAssignment: true

    });


    /**
      @class

      @extends XM.Info
    */
    XM.TransferOrderListItem = XM.Info.extend({

      recordType: "XM.TransferOrderListItem"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderListItemCharacteristic = XM.Model.extend({
      /** @scope XM.TransferOrderListItemCharacteristic.prototype */

      recordType: 'XM.TransferOrderListItemCharacteristic'

    });


    // ..........................................................
    // COLLECTIONS
    //


    /**
      @class

      @extends XM.Collection
    */
    XM.TransferOrderListItemCollection = XM.Collection.extend({

      model: XM.TransferOrderListItem

    });

  };

}());

