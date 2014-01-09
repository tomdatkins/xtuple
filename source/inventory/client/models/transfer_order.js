/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.inventory.initTransferOrderModels = function () {

    XM.TransferOrderMixin = {
      /**
        Returns transfer order status as a localized string.

        @returns {String}
      */
      getTransferOrderStatusString: function () {
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
    };

    /**
      @class

      @extends XM.Document
    */
    XM.TransferOrder = XM.Document.extend({

      recordType: "XM.TransferOrder",

      documentKey: "number",

      numberPolicySetting: 'TONumberGeneration',

      defaults: function () {
        var agent = XM.agents.find(function (agent) {
            return agent.id === XM.currentUser.id;
          });

        return {
          uuid: XT.generateUUID(),
          shipComplete: true,
          sourceSite: XT.defaultSite(),
          orderDate: XT.date.today(),
          status: XM.TransferOrder.UNRELEASED_STATUS,
          transitSite: XT.session.settings.get("DefaultTransitWarehouse"),
          agent: agent ? agent.id : null
        };
      },

      readOnlyAttributes: [
        "lineItems",
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
        "sourceCountry",
        "status"
      ],

      handlers: {
        "add:lineItems": "lineItemsChanged",
        "remove:lineItems": "lineItemsChanged",
        "change:sourceSite": "sourceSiteChanged",
        "change:status": "transferOrderStatusChanged",
        "change:destinationSite": "destinationSiteChanged",
        "change:transitSite": "transitSiteChanged"
      },

      /**
        If there are line items, this function should set the date to the first scheduled
        date.

        @returns {Object} Receiver
      */
      calculateScheduleDate: function () {
        var lineItems = this.get("lineItems").models,
          scheduleDate;

        if (lineItems.length) {
          _.each(lineItems, function (line) {
            var lineSchedDate = line.get("scheduleDate");
            scheduleDate = scheduleDate || lineSchedDate;
            if (XT.date.compareDate(scheduleDate, lineSchedDate) > 1) {
              scheduleDate = lineSchedDate;
            }
          });
          this.set("scheduleDate", scheduleDate);
        }
        return this;
      },

      destinationSiteChanged: function () {
        var site = this.get("destinationSite"),
          address = site ? site.get("address") : false,
          contact = site ? site.get("contact") : false,
          attrs = {
            destinationName: "",
            destinationContact: "",
            destinationContactName: "",
            destinationPhone: "",
            destinationAddress1: "",
            destinationAddress2: "",
            destinationAddress3: "",
            destinationCity: "",
            destinationState: "",
            destinationPostalCode: "",
            destinationCountry: ""
          };

        if (site) {
          attrs.destinationName = site.get("code");

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
        }

        this.set(attrs);
        this.siteChanged();
      },

      lineItemsChanged: function () {
        var hasLineItems = this.get("lineItems").length > 0;
        this.setReadOnly(["sourceSite", "destinationSite", "transitSite"], hasLineItems);
        this.setReadOnly("status", !hasLineItems);
        if (!hasLineItems) {
          this.set("status", XM.TransferOrder.UNRELEASED_STATUS);
        }
      },

      siteChanged: function () {
        var hasSites = this.get("sourceSite") &&
                       this.get("destinationSite") &&
                       this.get("transitSite");
        this.setReadOnly("lineItems", !hasSites);
      },

      sourceSiteChanged: function () {
        var site = this.get("sourceSite"),
          address = site.get("address"),
          contact = site.get("contact"),
          attrs = {
            sourceName: site.get("code"),
            sourceContact: "",
            sourceContactName: "",
            sourcePhone: "",
            sourceAddress1: "",
            sourceAddress2: "",
            sourceAddress3: "",
            sourceCity: "",
            sourceState: "",
            sourcePostalCode: "",
            sourceCountry: ""
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
        this.siteChanged();
        this.inheritWorkflowSource(
          site.get("siteType"),
          "XM.TransferOrderCharacteristic",
          "XM.TransferOrderWorkflow"
        );
      },

      transferOrderStatusChanged: function () {
        var status = this.get("status"),
          lineItems = this.get("lineItems");

        lineItems.each(function (lineItem) {
          var quantity = lineItem.get("quantity");
          if (status === XM.TransferOrder.CLOSED_STATUS ||
             (lineItem.get("shipped") < quantity &&
              lineItem.get("received") < quantity)) {
            lineItem.set("status", status);
          }
        });
      },

      statusDidChange: function () {
        XM.Document.prototype.statusDidChange.apply(this, arguments);
        var status = this.getStatus(),
          K = XM.Model;
        if (status === K.READY_NEW) {
          this.sourceSiteChanged();
          this.transitSiteChanged();
        } else if (status === K.READY_CLEAN) {
          this.lineItemsChanged();
          this.siteChanged();
        }
      },

      transitSiteChanged: function () {
        var site = this.get("transitSite");

        this.set({
          shipNotes: site.get("shipNotes"),
          shipVia: site.getValue("shipVia.id")
        });
        this.siteChanged();
      },

      validate: function () {
        var err = XM.Document.prototype.validate.apply(this, arguments);
        if (!err) {
          if (this.get("sourceSite").id === this.get("destinationSite").id) {
            return XT.Error.clone('inv1001');
          }
        }
        return XM.Document.prototype.validate.apply(this, arguments);
      }

    });

    XM.TransferOrder = XM.TransferOrder.extend(XM.TransferOrderMixin);
    XM.TransferOrder = XM.TransferOrder.extend(XM.WorkflowMixin);
    XM.TransferOrder = XM.TransferOrder.extend(XM.EmailSendMixin);
    XM.TransferOrder = XM.TransferOrder.extend({
      emailDocumentName: "_transferOrder".loc(),
      emailProfileAttribute: "sourceSite.siteType.emailProfile",
      emailStatusMethod: "getTransferOrderStatusString"
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

      recordType: 'XM.TransferOrderWorkflow',

      getTransferOrderWorkflowStatusString: function () {
        return XM.TransferOrderWorkflow.prototype.getWorkflowStatusString.call(this);
      }

    });

    _.extend(XM.TransferOrderWorkflow, /** @lends XM.TransferOrderWorkflow# */{

      TYPE_OTHER: "O",

      TYPE_PACK: "P",

      TYPE_SHIP: "S"

    });


    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderLine = XM.Model.extend({

      recordType: "XM.TransferOrderLine",

      defaults: function () {
        return {
          received: 0,
          shipped: 0,
          status: XM.TransferOrder.UNRELEASED_STATUS,
          unitCost: 0
        };
      },

      readOnlyAttributes: [
        "lineNumber",
        "received",
        "shipped",
        "unit",
        "unitCost"
      ],

      handlers: {
        "change:item": "itemChanged",
        "change:scheduleDate": "scheduleDateChanged",
        "change:transferOrder": "transferOrderChanged"
      },

      itemChanged: function () {
        var item = this.get("item");
        this.set("unit", item ? item.getValue("inventoryUnit.name") : "");
        this.set("unitCost", item ? item.getValue("standardCost") : 0);
      },

      scheduleDateChanged: function () {
        var order = this.get("transferOrder");

        // Header should always show first schedule date
        if (order) { order.calculateScheduleDate(); }
      },

      transferOrderChanged: function () {
        var parent = this.getParent(),
         lineNumber = this.get("lineNumber"),
         lineNumberArray,
         maxLineNumber,
         scheduleDate;

        // Set next line number to be 1 more than the highest living model
        if (parent && !lineNumber) {
          lineNumberArray = _.compact(_.map(parent.get("lineItems").models, function (model) {
            return model.isDestroyed() ? null : model.get("lineNumber");
          }));
          maxLineNumber = lineNumberArray.length > 0 ? Math.max.apply(null, lineNumberArray) : 0;
          this.set("lineNumber", maxLineNumber + 1);
        }

        // Default to schedule date of header
        if (parent) {
          scheduleDate = parent.get("scheduleDate");
          if (scheduleDate) {
            this.set("scheduleDate", scheduleDate);
          }
          parent.calculateScheduleDate();
        }
      }

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
    XM.TransferOrderItem = XM.Model.extend(/** @lends XM.TransferOrderItem.prototype */{

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

      canIssueItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("IssueStockToShipping");
        if (callback) {
          callback(XM.TransferOrder.OPEN_STATUS && hasPrivilege);
        }
        return this;
      },

      // TODO - check if TO is shipped
      canReceiveItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("EnterReceipts"),
          isShipped = this.getValue("isShipped");
        if (callback) {
          callback(XM.TransferOrder.OPEN_STATUS && hasPrivilege && isShipped);
        }
        return this;
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

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderItemRelation = XM.Model.extend(/** @lends XM.TransferOrderRelation.prototype */{

      recordType: 'XM.TransferOrderItemRelation'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderItemListItem = XM.Model.extend(/** @lends XM.TransferOrderListItem.prototype */{

      recordType: 'XM.TransferOrderItemListItem'

    });

    XM.TransferOrderListItem = XM.TransferOrderListItem.extend(XM.TransferOrderMixin);

    /**
      @class

      @extends XM.Model
    */
    XM.TransferOrderItemListItemCharacteristic = XM.Model.extend({
      /** @scope XM.TransferOrderItemListItemCharacteristic.prototype */

      recordType: 'XM.TransferOrderItemListItemCharacteristic'

    });


    // ..........................................................
    // COLLECTIONS
    //

    /**
      We need to perform a dispatch instead of a fetch to get the data we need.
      This is because we only want to show items that are candidates for transfer
      orders. This collection requires parameters for source, destination and transit
      sites.
     */
    var fetch = function (options) {
      options = options ? options : {};
      var that = this,
        params = options.query ? options.query.parameters : [],
        recordType = this.model.prototype.recordType,
        param,
        sourceId,
        destinationId,
        transitId,
        success,
        omit = function (params, attr) {
          return _.filter(params, function (param) {
            return param.attribute !== attr;
          });
        };

      // Process Source
      param = _.findWhere(params, {attribute: "source"});
      sourceId = param.value.id;

      // Process Destination
      param = _.findWhere(params, {attribute: "destination"});
      destinationId = param.value.id;

      // Process Transit
      param = _.findWhere(params, {attribute: "transit"});
      transitId = param.value.id;
      
      params = _.filter(params, function (param) {
        return !_.contains(["source", "destination", "transit"], param.attribute);
      });
      options.query.parameters = params;
      XM.Collection.formatParameters("XM.ItemSiteListItem", options.query.parameters);

      // Dispatch the query
      success = options.success;
      options.success = function (data) {
        that.reset(data);
        if (success) { success(data); }
      };
      params = [recordType, sourceId, destinationId, transitId, options.query];
      XM.ModelMixin.dispatch("XM.TransferOrder", "items", params, options);
    };


    /**
      @class

      @extends XM.Collection
    */
    XM.TransferOrderListItemCollection = XM.Collection.extend({

      model: XM.TransferOrderListItem

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.TransferOrderItemRelationCollection = XM.Collection.extend({

      model: XM.TransferOrderItemRelation,

      fetch: fetch

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.TransferOrderItemListItemCollection = XM.Collection.extend({

      model: XM.TransferOrderItemListItem,

      fetch: fetch

    });

  };

}());

