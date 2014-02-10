/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    assert = require("chai").assert;
  /**
    Transfer Orders are used to move Inventory between Sites. They are distinct from Inter-Site
    Transfers in three primary ways: 1) you can add multiple Items to a single Transfer Order
    and transfer all the Items at once; 2) all Transfer Order transfers involve a Transit Site,
    for tracking Inventory while it is "in transit"; and 3) there are reports (i.e., paperwork)
    associated with Transfer Orders.
    @class
    @alias TransferOrder
    @property {String} number that is the documentKey and idAttribute
    @property {String} Status
    @property {Date} orderDate
    @property {Date} packDate
    @property {Date} scheduleDate
    @property {Boolean} shipComplete required, defaulting to true
    @property {Site} sourceSite defaulting to preferred site of the User
    @property {Site} transitSite defaulting to the value set in Inventory setup
    @property {Site} destinationSite
    @property {UserAccount} Agent
    @property {Boolean} isShipped
    @property {ShipVia} ShipVia
    @property {String} orderNotes
    @property {String} shipNotes
    @property {Characteristics} Characteristics
    @property {TransferOrderLine} LineItems
    @property {TransferOrderWorkflow} Workflow
    @property {TransferOrderComment} Comments
    @property {TransferOrderContact} contacts
    @property {TransferOrderAccount} accounts
    @property {TransferOrderFile} files
    @property {TransferOrderUrl} urls
    @property {TransferOrderItem} items
  */
  var spec = {
    recordType: "XM.TransferOrder",
    skipAll: true,
    collectionType: "XM.TransferOrderListItemCollection",
    cacheName: null,
    listKind: "XV.TransferOrderList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof TransferOrder
      @description Transfer Orders are lockable.
    */
    //isLockable: true, //Related to issue 22496
    /**
      @member -
      @memberof TransferOrder
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "number",
    enforceUpperKey: true,
    requiredAttributes: ["number", "status", "shipComplete", "sourceSite", "transitSite",
    "destinationSite"],
    attributes: ["id", "uuid", "number", "status", "orderDate", "packDate", "scheduleDate",
    "sourceSite", "sourceName", "sourceAddress1", "sourceAddress2", "sourceAddress3",
    "sourceCity", "sourceState", "sourcePostalCode", "sourceCountry", "sourceContact",
    "sourceContactName", "sourcePhone", "transitSite", "transitName", "destinationSite",
    "destinationName", "destinationAddress1", "destinationAddress2", "destinationAddress3",
    "destinationCity", "destinationState", "destinationPostalCode", "destinationCountry",
    "destinationContact", "destinationContactName", "destinationPhone", "agent", "isShipped",
    "shipVia", "shipCharge", "shipComplete", "orderNotes", "shipNotes", "characteristics",
    "lineItems", "workflow", "comments", "accounts", "contacts", "items", "files", "urls"],
    /**
      @member -
      @memberof TransferOrder
      @description Used in the Inventory module
    */
    extensions: ["inventory"],
    /**
      @member -
      @memberof TransferOrder
      @description Transfer Orders can be read by people with "ViewTransferOrders"
       and can be created, updated,
       or deleted by users with the "MaintainTransferOrders" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTransferOrders",
      read: "ViewTransferOrders"
    },
    createHash: {
      shipComplete: true,
      sourceSite: { code: "WH1" },
      transitSite: { code: "INTRAN" },
      destinationSite: { code: "WH2"}
    },
    updateHash: {
      shipComplete: false
    }
  };
  var additionalTests = function () {
     /**
      @member -
      @memberof TransferOrder
      @description Ship From should be set to the User's preferred site by default
    */
    it.skip("Ship From should be set to the User's preferred site by default", function () {
    });
    /**
      @member -
      @memberof TransferOrder
      @description Characteristics can be assigned as being for Transfer Orders
    */
    describe.skip("Transfer order characteristics", function () { //Please verify it
      it("XM.Characteristic includes isTransferOrders as a context attribute", function () {
        var characteristic = new XM.Characteristic();
        assert.include(characteristic.getAttributeNames(), "isTransferOrders");
      });
      /**
        @member TransferOrderCharacteristic
        @memberof TransferOrder
        @description Follows the convention for characteristics
        @see Characteristic
      */
      it("convention for characteristic assignments", function () {
        var model;

        assert.isFunction(XM.TransferOrderCharacteristic);
        model = new XM.TransferOrderCharacteristic();
        assert.isTrue(model instanceof XM.CharacteristicAssignment);
      });
      it("can be set by a widget in the characteristics workspace", function () {
        var characteristicWorkspace = new XV.CharacteristicWorkspace();
        assert.include(_.map(characteristicWorkspace.$, function (control) {
          return control.attr;
        }), "isTransferOrders");
      });
    });
    /**
      @member -
      @memberof TransferOrder
      @description Characteristics of the Ship From Site's Site Type should be copied
      to the Transfer order by default
    */
    it.skip("Characteristics of the Ship From Site's Site Type should be copied to the Transfer" +
    "order by default", function () {
    });
    /**
      @member -
      @memberof TransferOrder
      @description Selecting Ship To should populate the Site address and contact details
    */
    it.skip("Selecting Ship To should populate the Site address and contact details", function () {
    });
    describe("Transfer Order workflow", function () {
      /**
        @member -
        @memberof TransferOrder
        @description Workflows can be added, edited and removed from a new Transfer Order
      */
      it.skip("Workflows can be added, edited and removed from a new Transfer Order", function () {
      });
      /**
        @member -
        @memberof TransferOrder
        @description Workflows can be added, edited and removed from an existing Transfer Order
      */
      it.skip("Workflows can be added, updated and removed to an existing Transfer Order",
      function () {
      });
      /**
        @member -
        @memberof TransferOrder
        @description Transfer Orders cannot be saved with incomplete workflows
      */
      it.skip("Transfer Orders cannot be saved with incomplete workflows", function () {
      });
      /**
        @member -
        @memberof TransferOrder
        @description When a workflow item is completed or deferred, the Status of the Transfer
          order will be set to be the applicable target Status of the workflow item
      */
      it.skip("When a workflow item is completed or deferred, the Status of the Transfer" +
      "order will be set to be the applicable target Status of the workflow item'", function () {
      });
      /**
        @member -
        @memberof TransferOrder
        @description For the Workflow items copied from the Site types, the start date and due date
        should be calculated correctly based on the offset
      */
      it.skip("For the Workflow items copied from the Site types, the start date and due date " +
        "should be calculated correctly based on the offset", function () {
      });
    });
      /**
    @member -
    @memberof TransferOrder
    @description Comments panel should exist to add new comments to the Transfer Order
    */
    it.skip("Comments panel should exist to add new comments to the Transfer Order", function () {
    });
    /**
    @member -
    @memberof TransferOrder
    @description Documents panel should exist to connect the Transfer Orders to : Account, contact,
       File, Incident, Item
    */
    it.skip("Documents panel should exist to connect the Transfer Orders to :Account, contact," +
       "File, Incident, Item", function () {
    });
    /**
    @member -
    @memberof TransferOrder
    @description 'Issue to Shipping' option should be active in the actions menu on selecting a
     Open Transfer Order in the Transfer Orders List and should be inactive for Unreleased and
     Closed TransferOrders
    */
    it.skip("'Issue to Shipping' option should be active in the actions menu on selecting a" +
       "Open Transfer Order in the Transfer Orders List and should be inactive for " +
       "Unreleased and Closed TransferOrders", function () {
    });
    /**
    @member -
    @memberof TransferOrder
    @description 'Enter Receipt' option should be active in the actions menu on selecting a
     Open Transfer Order for which Stock is shipped, in the Transfer Orders List and should be
     inactive for Unreleased, Closed TransferOrders and Transfer Orders for which Stock is
     not shipped
    */
    it.skip("''Enter Receipt' option should be active in the actions menu on selecting a" +
       "Open Transfer Order for which Stock is shipped in the Transfer Orders List and should be" +
       "inactive for Unreleased, Closed TransferOrders and Transfer Orders for" +
       "which Stock is not shipped", function () {
    });
    /**
    @member -
    @memberof TransferOrder
    @description Selecting to delete a Open Transfer order for which Stock is shipped should
     display a dialog 'Cannot delete Transfer Order'
    */
    it.skip("Selecting to delete a Open Transfer order for which Stock is shipped should" +
    "display 'Cannot delete Transfer Order'  dialog asking whether the user wants to close it" +
    "instead", function () {
    });
    it.skip("Selecting 'Yes' in the dialog should close the Transfer Order", function () {
    });
    it.skip("Selecting 'No' in the dialog should not close/delete the Transfer order", function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());