/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initWorkOrderModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.TimeClockRelation = XM.Model.extend({

      recordType: "XM.TimeClockRelation"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderEmailProfile = XM.Model.extend(
      /** @lends XM.WorkOrderEmail.prototype */{

      recordType: "XM.WorkOrderEmailProfile"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.WorkOrderParent = XM.Info.extend({

      recordType: "XM.WorkOrderParent"

    });

    XM.WorkOrderStatus = {

      /**
      Returns Work Order status as a localized string.

      @returns {String}
      */
      getWorkOrderStatusString: function () {
        var K = XM.WorkOrder,
          status = this.get('status');

        switch (status)
        {
        case K.RELEASED_STATUS:
          return '_released'.loc();
        case K.EXPLODED_STATUS:
          return '_exploded'.loc();
        case K.INPROCESS_STATUS:
          return '_in-process'.loc();
        case K.OPEN_STATUS:
          return '_open'.loc();
        case K.CLOSED_STATUS:
          return '_closed'.loc();
        }
      },

      isActive: function () {
        return this.get("status") !== XM.WorkOrder.CLOSED_STATUS;
      }

    };

    /**
      @class

      @extends XM.Document
    */
    XM.WorkOrder = XM.Document.extend({
      /** @lends XM.WorkOrder.prototype */

      recordType: 'XM.WorkOrder',

      defaults: function () {
        return {
          status: XM.WorkOrder.OPEN_STATUS,
          mode: XM.WorkOrder.ASSEMBLY_MODE,
          priority: 1,
          isAdhoc: false,
          postedValue: 0,
          receivedValue: 0,
          wipValue: 0,
          createdBy: XM.currentUser.id
        };
      },

      readOnlyAttributes: [
        "costRecognitionDefault",
        "number",
        "status",
        "postedValue",
        "received",
        "receivedValue",
        "startDate",
        "wipValue"
      ],

      handlers: {
        "status:READY_CLEAN": "statusReadyClean",
        "change:item change:site": "itemSiteChanged"
      },

      canView: function (attribute) {
        if (attribute === "itemSite.leadTime" && this.get("dueDate")) {
          return false;
        }
        return XM.Document.prototype.canView.apply(this, arguments);
      },

      explode: function () {
        var autoExplodeWO = XT.session.settings.get("AutoExplodeWO"),
          woExplosionLevel = XT.session.settings.get("WOExplosionLevel"),
          status = this.get("status");

        if (status !== XM.WorkOrder.OPEN_STATUS) {
          this.notify("_explodeStatusInvalid".loc(), {type: XM.Model.CRITICAL});
          return;
        }

        if (woExplosionLevel === XM.Manufacture.EXPLODE_MULTIPLE_LEVEL) {

        }
      },

      /**
        Fetch child work orders and store them in `meta` because it is not
        possible to define a recursive ORM.
      */
      fetchChildren: function () {
        var children = new XM.WorkOrderCollection(),
          that = this,
          options = {};

        options.query = {
          parameters: [
            {attribute: "parent", value: this.id}
          ]
        };

        options.succes = function () {
          that.meta.set("children", children);
          // Do this recursively
          children.each(function (child) {
            child.fetchChildren();
          });
        };

      },

      handleCostRecognition: function (itemSite, options) {
        options = options || {};
        var costMethod = itemSite ? itemSite.get("costMethod") : false,
          costRecognitionDefault;
        if (costMethod && (costMethod === XM.ItemSite.AVERAGE_COST ||
           (costMethod === XM.ItemSite.JOB_COST && this.get("parent")))) {
          if (!_.contains(this.requiredAttributes, "costRecognition")) {
            this.requiredAttributes.push("costRecognition");
          }
          this.setReadOnly("costRecognition", false);
          if (!options.isLoading) {
            costRecognitionDefault = itemSite.get("costRecognitionDefault") ||
                                     XT.session.settings.get("JobItemCosDefault") ||
                                     XM.Manufacturing.TO_DATE_COST_RECOGNITION;
            this.set("costRecognition", costRecognitionDefault);
          }
        } else {
          if (!options.isLoading) { this.unset("costRecognition"); }
          this.setReadOnly("costRecognition", true);
          this.requiredAttributes = _.without(this.requiredAttributes, "costRecognition");
        }
      },

      initialize: function () {
        XM.Document.prototype.initialize.apply(this, arguments);
        this.meta = new Backbone.Model();
        if (XT.session.settings.get("RequireProjectAssignment")) {
          this.requiredAttributes.push("project");
        }
      },

      itemSiteChanged: function (model, value, options) {
        var item = this.get("item"),
          site = this.get("site"),
          that = this,
          fetchOptions = {},
          itemSites,
          message;

        if (item && site) {

          // Find an associated item site and validate
          itemSites = new XM.ItemSiteRelationCollection();
          fetchOptions.query = {
            parameters: [
              {attribute: "item", value: item},
              {attribute: "site", value: site},
            ]
          };
          fetchOptions.success = function () {
            var itemSite,
              error;

            if (itemSites.length) {
              itemSite = itemSites.at(0);
            }

            error = that.validateItemSite(itemSite);
            that.handleCostRecognition(itemSite, options);

            if (error) {
              that.notify(error.message(), {
                type: XM.Model.CRITICAL,
                callback: function () {
                  that.meta.unset("site");
                }
              });
            } else {
              that.meta.set("itemSite", itemSite);
            }
          };
          itemSites.fetch(fetchOptions);
        } else {
          this.meta.unset("itemSite");
          this.handleCostRecognition();
        }
      },

      /**
        Calculate the balance remaining to issue.

        @returns {Number}
      */
      postBalance: function () {
        var quantity = this.get("quantity"),
          received = this.get("received"),
          toPost = XT.math.subtract(received, quantity, XT.QTY_SCALE);
        return toPost >= 0 ? toPost : 0;
      },

      startDateChanged: function () {
        var startDate = this.get("startDate"),
          site = this.get("site"),
          useSiteCalendar = XT.session.settings.get("UseSiteCalendar"),
          options = {},
          params;

        if (startDate && site) {
          params = [site.id, startDate, 0];
          options.success = function (resp) {
            var workDate = new Date(resp);
            if (startDate !== workDate) {
              // TO DO: Handle this
              console.log(startDate.toJSON(), workDate.toJSON());
            }
          };
          this.dispatch("XM.Manufacturing", "calculateNextWorkingDate", params, options);
        }
      },

      statusReadyClean: function () {
        this.setReadOnly(["item", "site", "mode"]);
        this.setReadOnly("startDate", false);
        this.itemSiteChanged(this, null, {isLoading: true});
        this.fetchChildren();
      },

      validate: function () {
        var error = XM.Document.prototype.validate.apply(this, arguments),
          itemSite;
        if (!error) {
          error = this.validateItemSite(this.getValue("itemSite"));
        }
        return error;
      },

      validateItemSite: function (itemSite) {
        var itemNumber,
          siteCode,
          params;

        if (!itemSite) {
          return XT.Error.clone("mfg1001");
        }

        // Validate this item can be built at this site if the work order is new.
        // If it's being edited, somebody may have changed the item site
        // settings since the work order was created so it's too late to care.
        if (this.isNew()) {
          if (!itemSite.get("isManufactured")) {
            params = {
              item: itemSite.getValue("item.number"),
              site: itemSite.getValue("site.code")
            };
            return XT.Error.clone("mfg1002", params);
          } else if (itemSite.get("costMethod") === XM.ItemSite.JOB_COST &&
                     !this.get("parent")) {
            return XT.Error.clone("mfg1003");
          }
        }

      }

    });

    XM.WorkOrder = XM.WorkOrder.extend(XM.WorkOrderStatus);

    _.extend(XM.WorkOrder, {
      /** @scope XM.WorkOrder */

      /**
        Open Status.

        @static
        @constant
        @type String
        @default O
      */
      OPEN_STATUS: 'O',

      /**
        Expoloded status.

        @static
        @constant
        @type String
        @default E
      */
      EXPLODED_STATUS: 'E',

      /**
        In-Process status.

        @static
        @constant
        @type String
        @default I
      */
      INPROCESS_STATUS: 'I',

      /**
        Released Status.

        @static
        @constant
        @type String
        @default R
      */
      RELEASED_STATUS: 'R',

      /**
        Open Status.

        @static
        @constant
        @type String
        @default C
      */
      CLOSED_STATUS: 'C',

      /**
        Assembly Mode.

        @static
        @constant
        @type String
        @default R
      */
      ASSEMBLY_MODE: 'A',

      /**
        Disassembly Mode.

        @static
        @constant
        @type String
        @default D
      */
      DISASSEMBLY_MODE: 'D',

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderMaterial = XM.Model.extend({

      recordType: "XM.WorkOrderMaterial",

      isActive: function () {
        var quantityRequired = this.get("quantityRequired"),
          quantityIssued = this.get("quantityIssued"),
          status = this.getValue("workOrder.status");
        return quantityRequired > quantityIssued && status !== XM.WorkOrder.CLOSED_STATUS;
      }

    });

    /**
      @class

      @extends XM.Info
    */
    XM.WorkOrderMaterialRelation = XM.Info.extend({

      recordType: "XM.WorkOrderMaterialRelation"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderMaterialPosting = XM.Model.extend({

      recordType: "XM.WorkOrderMaterialPosting"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderOperation = XM.Model.extend({

      recordType: "XM.WorkOrderOperation",

      isActive: function () {
        return !this.get("isRunComplete") &&
          this.getValue("workOrder.status") !== XM.WorkOrder.CLOSED_STATUS;
      },

      getOperationStatusString: function () {
        var setupConsumed = this.get("setupConsumed"),
          setupComplete = this.get("isSetupComplete"),
          runConsumed = this.get("runConsumed"),
          runComplete = this.get("isRunComplete"),
          that = this,
          timeClockHistory;

        if (runComplete) {
          return "_runComplete".loc();
        } else if (runConsumed) {
          return "_runStarted".loc();
        } else if (setupComplete) {
          return "_setupComplete".loc();
        } else if (setupConsumed) {
          return "_setupStarted".loc();
        } else {
          timeClockHistory = this.getValue("workOrder.timeClockHistory");
          if (_.some(timeClockHistory.models, function (entry) {
            return entry.get("operation").id === that.id;
          })) {
            return "_started".loc();
          } else {
            return "_notStarted".loc();
          }
        }
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderOperationRelation = XM.Model.extend({

      recordType: "XM.WorkOrderOperationRelation"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderOperationPosting = XM.Model.extend({

      recordType: "XM.WorkOrderOperationPosting"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderTimeClock = XM.Model.extend({

      recordType: "XM.WorkOrderTimeClock"

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.WorkOrderCharacteristic = XM.CharacteristicAssignment.extend(
      /** @lends XM.WorkOrderCharacteristic.prototype */{

      recordType: "XM.WorkOrderCharacteristic",

      canView: function () {
        return true;
      }

    });

    /**
      @class

      @extends XM.Comment
    */
    XM.WorkOrderComment = XM.Comment.extend({

      recordType: "XM.WorkOrderComment",

      sourceName: "W"

    });


    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderWorkflow = XM.Workflow.extend(/** @lends XM.WorkOrderWorkflow.prototype */{

      recordType: "XM.PurchaseOrderWorkflow",

      getWorkOrderWorkflowStatusString: function () {
        return XM.WorkOrderWorkflow.prototype.getWorkflowStatusString.call(this);
      }

    });

    _.extend(XM.WorkOrderWorkflow, /** @lends XM.WorkOrderWorkflow# */{

      TYPE_OTHER: "O",

      TYPE_ISSUE_MATERIAL: "I",

      TYPE_POST_PRODUCTION: "P"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.WorkOrderRelation = XM.Info.extend({
      /** @lends XM.WorkOrderRelation.prototype */

      recordType: 'XM.WorkOrderRelation',

      editableModel: 'XM.WorkOrder'

    });

    /**
      @class

      @extends XM.Info
    */
    XM.WorkOrderListItem = XM.Info.extend({
      /** @lends XM.WorkOrderListItem.prototype */

      recordType: 'XM.WorkOrderListItem',

      editableModel: 'XM.WorkOrder',

      canIssueMaterial: function (callback) {
        var hasPrivilege = XT.session.privileges.get("IssueWoMaterials");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      },

      canPostProduction: function (callback) {
        var hasPrivilege = XT.session.privileges.get("PostProduction");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      }

    });

    XM.WorkOrderListItem = XM.WorkOrderListItem.extend(XM.WorkOrderStatus);

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderListItemCharacteristic = XM.Model.extend({
      /** @scope XM.WorkOrderListItemCharacteristic.prototype */

      recordType: "XM.WorkOrderListItemCharacteristic"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.WorkOrderEmailProfileCollection = XM.Collection.extend(
      /** @lends XM.WorkOrderEmailProfileCollection.prototype */{

      model: XM.WorkOrderEmailProfile

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.WorkOrderCollection = XM.Collection.extend(
      /** @lends XM.WorkOrderCollection.prototype */{

      model: XM.WorkOrder

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.WorkOrderListItemCollection = XM.Collection.extend(
      /** @lends XM.WorkOrderListItemCollection.prototype */{

      model: XM.WorkOrderListItem

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.WorkOrderRelationCollection = XM.Collection.extend(
      /** @lends XM.WorkOrderRelationCollection.prototype */{

      model: XM.WorkOrderRelation

    });

  };

}());
