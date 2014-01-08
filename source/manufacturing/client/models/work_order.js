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

      recordType: "XM.WorkOrder",

      numberPolicySetting: "WONumberGeneration",

      keyIsString: false,

      defaults: function () {
        return {
          subNumber: 1,
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
        "name",
        "status",
        "postedValue",
        "received",
        "receivedValue",
        "startDate",
        "subNumber",
        "wipValue"
      ],

      handlers: {
        "status:READY_CLEAN": "statusReadyClean",
        "change:item change:site": "itemSiteChanged",
        "change:number": "numberChanged"
      },

      canView: function (attribute) {
        // Once a date has been set, we don't need to worry about the
        // Lead time any more.
        if (attribute === "itemSite.leadTime" && this.get("dueDate")) {
          return false;
        }
        return XM.Document.prototype.canView.apply(this, arguments);
      },

      /**
        returns Receiver
      */
      explode: function () {
        var status = this.get("status"),
          number = this.get("number"),
          itemSite = this.getValue("itemSite"),
          quantity = this.get("quantity"),
          startDate = this.get("startDate"),
          dueDate = this.get("dueDate"),
          characteristics = this.get("characteristics"),
          materials = this.get("materials"),
          routings = this.get("routings"),
          K = XM.Model,
          that = this,
          params,

          // Build up order detail
          buildOrder = function (detail) {
            _.each(detail.characteristics, buildCharacteristic);
            _.each(detail.routings, buildOperation);
            _.each(detail.materials, buildMaterial);
            _.each(detail.children, _.bind(buildChild, that));
            that.revertStatus();
          },

          // Add a characteristic
          buildCharacteristic = function (characteristic) {
            var workOrderCharacteristic = new XM.WorkOrderCharacteristic(null, {isNew: true});
            workOrderCharacteristic.set(characteristic);
            characteristics.add(workOrderCharacteristic);
          },

          // Add a material
          buildMaterial = function (material) {
            var workOrderMaterial = new XM.WorkOrderMaterial(null, {isNew: true});
            material.dueDate = new Date(material.dueDate);
            workOrderMaterial.set(material);
            materials.add(workOrderMaterial);
          },

          // Add an operation
          buildOperation = function (routing) {
            var operation = new XM.WorkOrderOperation(null, {isNew: true});
            operation.set(routing);
            routings.add(operation);
          },

          // Add children
          buildChild = function (child) {
            var options = {isNew: true, isChild: true},
              workOrder = new XM.WorkOrder(null, options),
              childCharacteristics = child.characteristics,
              childRoutings = child.routings,
              childMaterials = child.materials,
              childChildren = child.children;

            // Reset where we are
            characteristics = workOrder.get("characteristics");
            routings = workOrder.get("routings");
            materials = workOrder.get("materials");

            // Don't want these directly added on new work order
            delete child.characteristics;
            delete child.routings;
            delete child.materials;
            delete child.children;

            child.parent.uuid = this.id;
            workOrder.set(_.extend(child, {
              number: number,
              startDate: new Date(child.startDate),
              dueDate: new Date(child.dueDate)
            }));

            // Add to our meta data
            options = {status: K.READY_NEW};
            this.getValue("children").add(workOrder, options);

            // Now build up the child work order
            _.each(childCharacteristics, buildCharacteristic);
            _.each(childRoutings, buildOperation);
            _.each(childMaterials, buildMaterial);
            _.each(childChildren, _.bind(buildChild, workOrder));
          },

          options = {success: buildOrder};

        // Validate
        if (status !== XM.WorkOrder.OPEN_STATUS || !itemSite) {
          return;

        // Come back when we have a quantity
        } else if (!quantity) {
          this.once("change:quantity", this.explode);
          return;

        // Come back when we have a startDate
        } else if (!startDate) {
          this.once("change:startDate", this.explode);
          return;

        // Come back when we have a dueDate
        } else if (!dueDate) {
          this.once("change:dueDate", this.explode);
          return;

        // On the outside chance we tried to explode before we had a number
        } else if (!number) {
          this.once("change:number", this.explode);
          return;
        }

        // Update status
        this.set("status", XM.WorkOrder.EXPLODED_STATUS);
        this.setReadOnly(["item", "site"]);
        this.setStatus(K.BUSY_FETCHING);

        // Go fetch exploded profile to build order definition
        params = [itemSite.id, quantity, dueDate, {startDate: startDate}];
        this.dispatch("XM.ItemSite", "explode", params, options);

        return this;
      },

      /**
        Fetch child work orders and store them in `meta` because it is not
        possible to define a recursive ORM.

        returns Receiver
      */
      fetchChildren: function () {
        var children = this.getValue("children"),
          that = this,
          options = {};

        options.query = {
          parameters: [
            {attribute: "parent", value: this.id}
          ]
        };

        options.succes = function () {
          // Do this recursively
          children.each(function (child) {
            child.fetchChildren();
          });
        };

        children.fetch(options);

        return this;
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

      initialize: function (attributes, options) {
        if (options && options.isChild) {
          this.numberPolicy = XM.Document.MANUAL_NUMBER;
        }
        XM.Document.prototype.initialize.apply(this, arguments);
        var that = this,
          K = XM.Model,
          workOrders,
          statusBusyCommitting = function () {
            that.setStatus(K.BUSY_COMMITTING, {cascade: true});
          },
          statusReadyClean = function () {
            that.setStatus(K.READY_CLEAN, {cascade: true});
          },
          childAdded = function (model, collection, options) {
            model.on("status:BUSY_COMMITTING", statusBusyCommitting, model);
            model.on("status:READY_CLEAN", statusReadyClean, model);
          };

        // Set up children to keep committing status synced with parent
        workOrders = new XM.WorkOrderCollection();
        workOrders.on("add", childAdded);
        this.meta = new Backbone.Model();
        this.meta.set("children", workOrders);
        this._committing = 0;

        // Special project setting
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
              {attribute: "site", value: site}
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
                  that.unset("site");
                }
              });
            } else {
              that.meta.set("itemSite", itemSite);
              if (XT.session.settings.get("AutoExplodeWO")) {
                that.explode();
              }
            }
          };
          itemSites.fetch(fetchOptions);
        } else {
          this.meta.unset("itemSite");
          this.handleCostRecognition();
        }
      },

      numberChanged: function () {
        var number = this.get("number"),
         subNumber = this.get("subNumber");
        this.set("name", number + "-" + subNumber);
      },

      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        var success = options.success;

        // Ensure we don't get to READY_CLEAN until chidren
        // Have been saved
        this._committing++;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        options.success = function (model, resp, options) {
          var K = XM.Model,
            children = model.getValue("children");

          // We can get to READY_CLEAN now whenever the children are done saving
          model._committing--;

          // Save the children!
          children.each(function (child) {
            child.save(null, options);
          });

          if (success) { success(model, resp, options); }
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) { value = options; }

        // Don't use XM.Document prototype because duplicate key rules are diffrent here
        return XM.Model.prototype.save.call(this, key, value, options);
      },

      /**
        Modified so that as long as any children are BUSY_COMMITTING
        the parent will stay in that state also until the parent and
        all children are READY_CLEAN.
      */
      setStatus: function (status, options) {
        var K = XM.Model;
        if (status === K.BUSY_COMMITTING) {
          this._committing++;
        } else if (status === K.READY_CLEAN &&
          this.status === K.BUSY_COMMITTING) {
          this._committing--;
          if (this._committing) {
            return;
          }
        }
        XM.Document.prototype.setStatus.apply(this, arguments);
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
