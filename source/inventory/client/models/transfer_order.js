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
          transitSite: XT.session.settings.get("DefaultTransitWarehouse")
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
        "statusChange": "statusDidChange",
        "change:sourceSite": "sourceSiteChanged",
        "change:destinationSite": "destinationSiteChanged",
        "change:transitSite": "transitSiteChanged"
      },

      destinationSiteChanged: function () {
        var site = this.get("sourceSite"),
          address = site.get("address"),
          contact = site.get("contact"),
          attrs = {
            destinationName: site.get("name")
          };

        if (address) {
          attrs.destinationAddress1 = address.get("line1");
          attrs.destinationAddress2 = address.get("line2");
          attrs.destinationAddress3 = address.get("line3");
          attrs.destinationCity = address.get("city");
          attrs.destinationState = address.get("state");
          attrs.destinationPostalCode = address.get("postalCode");
          attrs.destinationCountry = address.get("country");
        }

        if (contact) {
          attrs.destinationContact = contact.id;
          attrs.destinationContactName = contact.get("name");
          attrs.destinationPhone = contact.get("phone");
        }

        this.set(attrs);
      },

      sourceSiteChanged: function () {
        var site = this.get("sourceSite"),
          address = site.get("address"),
          contact = site.get("contact"),
          attrs = {
            sourceName: site.get("name")
          };

        if (address) {
          attrs.sourceAddress1 = address.get("line1");
          attrs.sourceAddress2 = address.get("line2");
          attrs.sourceAddress3 = address.get("line3");
          attrs.sourceCity = address.get("city");
          attrs.sourceState = address.get("state");
          attrs.sourcePostalCode = address.get("postalCode");
          attrs.sourceCountry = address.get("country");
        }

        if (contact) {
          attrs.sourceContact = contact.id;
          attrs.sourceContactName = contact.get("name");
          attrs.sourcePhone = contact.get("phone");
        }

        this.set(attrs);
      },

      statusDidChange: function () {
        XM.Document.prototype.statusDidChange.apply(this, arguments);
        if (this.getStatus() === XM.Model.READY_NEW) {
          this.sourceSiteChanged();
          this.transitSiteChanged();
        }
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

