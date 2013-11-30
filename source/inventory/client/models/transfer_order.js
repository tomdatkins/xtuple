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

      documentKey: "number",

      numberPolicySetting: 'TONumberGeneration',

      defaults: function () {
        return {
          sourceSite: XT.defaultSite(),
          orderDate: XT.date.today(),
          status: XM.TransferOrder.UNRELEASED_STATUS,
          transiteSite: XT.session.settings.get("DefaultTransitWarehouse")
        };
      },

      readOnlyAttributes: [
        "destinationName",
        "destinationAddress1",
        "destinationAddress2",
        "destinationAddress3",
        "destinationCity",
        "destinationState",
        "destinationPostalCode",
        "destinationCountry",
        "scheduleDate",
        "sourceName",
        "sourceAddress1",
        "sourceAddress2",
        "sourceAddress3",
        "sourceCity",
        "sourceState",
        "sourcePostalCode",
        "sourceCountry"
      ],

      handlers: {
        "change:sourceSite": "sourceSiteChanged",
        "change:destinationSite": "destinationSiteChanged",
        "change:transitSite": "transiteSiteChanged"
      },

      destinationSiteChanged: function () {
        var site = this.get("sourceSite"),
          address = site.get("address"),
          contact = site.get("contact");

        this.set({
          destinationName: site.get("name"),
          destinationAddress1: address.get("line1"),
          destinationAddress2: address.get("line2"),
          destinationAddress3: address.get("line3"),
          destinationCity: address.get("city"),
          destinationState: address.get("state"),
          destinationPostalCode: address.get("postalCode"),
          destinationCountry: address.get("country"),
          destinationContact: contact.id,
          destinationContactName: contact.name(),
          destinationPhone: contact.get("phone"),
          taxZone: site.get("taxZone")
        });
      },

      sourceSiteChanged: function () {
        var site = this.get("sourceSite"),
          address = site.get("address"),
          contact = site.get("contact");

        this.set({
          sourceName: site.get("name"),
          sourceAddress1: address.get("line1"),
          sourceAddress2: address.get("line2"),
          sourceAddress3: address.get("line3"),
          sourceCity: address.get("city"),
          sourceState: address.get("state"),
          sourcePostalCode: address.get("postalCode"),
          sourceCountry: address.get("country"),
          sourceContact: contact.id,
          sourceContactName: contact.name(),
          sourcePhone: contact.get("phone")
        });
      },

      transitSiteChanged: function () {
        var site = this.get("transitSite");

        this.set({
          shipNotes: site.get("shipNotes"),
          shipVia: site.get("shipVia")
        });
      }

    });

    // ..........................................................
    // CONSTANTS
    //
    _.extend(XM.TransferOrder, /** @lends XM.TransferOrder# */{

      /**
        Order is unreleased.

        @static
        @constant
        @type String
        @default U
      */
      UNRELEASED_STATUS: "U",

      /**
        Order is open.

        @static
        @constant
        @type String
        @default O
      */
      OPEN_STATUS: "O",

      /**
        Order is closed.

        @static
        @constant
        @type String
        @default C
      */
      CLOSED_STATUS: "C"

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.TransferOrderCharacteristic = XM.CharacteristicAssignment.extend(/** @lends XM.TransferOrderCharacteristic.prototype */{

      recordType: 'XM.TransferOrderCharacteristic',

      which: 'isTransferOrders'

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
    XM.TransferOrderWorkflow = XM.Workflow.extend(/** @lends XM.TransferOrderWorkflow.prototype */{

      recordType: 'XM.TransferOrderWorkflow'

    });


    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderLine = XM.Model.extend({

      recordType: "XM.TransferOrderLine",

      readOnlyAttributes: [
        "lineNumber",
        "received",
        "shipped",
        "unitCost"
      ]

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
    XM.TransferOrderUrl = XM.Model.extend(/** @lends XM.TransferOrderUrl.prototype */{

      recordType: 'XM.TransferOrderUrl',

      isDocumentAssignment: true

    });


    /**
      @class

      @extends XM.Info
    */
    XM.TransferOrderListItem = XM.Info.extend({

      recordType: "XM.TransferOrderListItem",

      editableModel: "XM.TransferOrder",

      /**
      Returns transfer order status as a localized string.

      @returns {String}
      */
      getOrderStatusString: function () {
        var K = XM.TransferOrder,
          status = this.get('status');

        switch (status)
        {
        case K.UNRELEASED_STATUS:
          return '_unreleased'.loc();
        case K.OPEN_STATUS:
          return '_open'.loc();
        case K.CLOSED_STATUS:
          return '_closed'.loc();
        }
      }

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

