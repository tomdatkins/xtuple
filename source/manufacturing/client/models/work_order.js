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

    _.extend(XM.WorkOrderParent, {
      /** @scope XM.WorkOrder */

      /**
        Sales Order.

        @static
        @constant
        @type String
        @default S
      */
      SALES_ORDER: 'S',

      /**
        Work Order.

        @static
        @constant
        @type String
        @default W
      */
      WORK_ORDER: 'W',
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

    /** @private
      Move this to backbone-x?
    */
    var LeafModel = Backbone.Model.extend({
      couldRead: function () {
        return false;
      },
      couldUpdate: function () {
        return false;
      },
      couldDelete: function () {
        return false;
      },
      getStatus: function () {
        return XM.Model.READY_CLEAN;
      },
      getValue: XM.ModelMixin.getValue,
      isActive: function () {
        var model = this.get("model");
        return model.getValue("isActive");
      }
    });

    /** @private */
    var _materialsComparator = function (a, b) {
      var aitem = a.get("item"),
        bitem = b.get("item"),
        aseq = aitem ? aitem.id : false,
        bseq = bitem ? bitem.id : false;

      // If one or both models don't have an item assigned yet
      if (!aseq && !bseq) {
        return 0;
      } else if (aseq && !bseq) {
        return -1;
      } else if (bseq && !aseq) {
        return 1;
      }

      // Otherwise sort by item number
      return aseq < bseq ? -1 : (aseq > bseq ? 1 : 0);
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
          site: XT.defaultSite(),
          priority: 1,
          isAdhoc: false,
          leadTime: 0,
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
        "add:materials remove:materials": "materialsChanged",
        "change:dueDate": "dueDateChanged",
        "change:item": "itemChanged",
        "change:number": "numberChanged",
        "change:site": "fetchItemSite",
        "change:status": "workOrderStatusChanged",
        "status:READY_CLEAN": "statusReadyClean"
      },

      /**
        Reset and recursively build the tree from scratch.

        returns {Backbone.Collection}
      */
      buildTree: function () {
        var tree = this.getValue("tree"),

          addWorkOrder = function (level, workOrder) {
            var materials = workOrder.get("materials"),
              routings = workOrder.get("routings");

            // Add materials not associated with routings
            materials.comparator = _materialsComparator;
            materials.each(function (material) {
              if (_.isEmpty(material.get("operation"))) {
                addMaterial(level, material);
              }
            });

            // Add routings
            routings.comparator = "sequence";
            routings.sort();
            routings.each(function (operation) {
              addOperation(level, operation);
            });
          },

          addOperation = function (level, operation) {
            var materials = operation.getValue("workOrder.materials"),
              leaf = new LeafModel({
                level: level,
                model: operation
              }),
              isCollapsed;

            // Detrmine any materials associated to this operation
            materials = materials.filter(function (material) {
              var moper = material.get("operation");
              return moper && moper.id === operation.id;
            });

            if (materials.length) {
              leaf.set("isCollapsed", false);
            }

            tree.add(leaf);
            level++;

            _.each(materials, function (material) {
              addMaterial(level, material);
            });
          },

          addMaterial = function (level, material) {
            var children = material.getValue("workOrder.children"),
              leaf = new LeafModel({
                level: level,
                model: material
              }),
              child;

            tree.add(leaf);

            // Add child Work Order if applicable
            child = children.find(function (workOrder) {
              var wmatl = workOrder.get("workOrderMaterial");
              return wmatl && wmatl.id === material.id;
            });

            if (child) {
              addChild(level, child);
            }
          },

          addChild = function (level, child) {
            var leaf = new LeafModel({
                level: level,
                model: child,
                isCollapsed: false
              });

            tree.add(leaf);
            level++;
            addWorkOrder(level, child);
          };

        tree.reset();
        tree._collapsed = {};
        addWorkOrder(0, this);

        return tree;
      },

      canView: function (attribute) {
        var status = this.getStatus(),
          K = XM.Model;
        // Once a date has been set, we don't need to worry about the
        // Lead time any more.
        if (attribute === "leadTime" && this.get("dueDate")) {
          return false;
        } else if (attribute === "name") {
          return this.numberPolicy !== XM.Document.MANUAL_NUMBER || !this.isNew();
        } else if (attribute === "number") {
          return this.numberPolicy === XM.Document.MANUAL_NUMBER && this.isNew();
        }
        return XM.Document.prototype.canView.apply(this, arguments);
      },

      /**
        Collapse the tree at index.

        returns Receiver
      */
      collapse: function (index) {
        var tree = this.getValue("tree"),
          cache = new Backbone.Collection(),
          leaf = tree.at(index),
          item,
          level,
          id;

        if (leaf) {
          level = leaf.get("level");
          leaf.set("isCollapsed", true);

          // "Make like a tree and get outta here"
          index++;
          while (tree.length > index &&
                 level < tree.at(index).get("level")) {
            item = tree.at(index);
            tree.remove(item);
            cache.add(item);
          }

          // Keep track of this so we can expand again
          id = leaf.get("model").id;
          tree._collapsed[id] = cache;
        }

        return this;
      },

      /**
        Expand the tree at index.

        @params {Number} Index to expand.
        returns Receiver
      */
      expand: function (index) {
        var tree = this.getValue("tree"),
          cache,
          leaf,
          id;

        leaf = tree.at(index);
        if (leaf) {
          leaf.set("isCollapsed", false);
          index++;
          id = leaf.get("model").id;
          cache = tree._collapsed[id];
          tree.add(cache.models, {at: index});
          delete tree._collapsed[id];
        }

        return this;
      },

      /**
        returns Receiver
      */
      explode: function () {
        var K = XM.Model,
          W = XM.WorkOrder,
          status = this.get("status"),
          number = this.get("number"),
          itemSite = this.getValue("itemSite"),
          mode = this.get("mode"),
          quantity = this.get("quantity"),
          startDate = this.get("startDate"),
          dueDate = this.get("dueDate"),
          materials = this.get("materials"),
          routings = this.get("routings"),
          that = this,
          params,

          // Build up order detail
          buildOrder = function (detail) {
            _.each(detail.routings, buildOperation);
            _.each(detail.materials, buildMaterial);
            _.each(detail.children, _.bind(buildChild, that));
            that.revertStatus();
            that.buildTree();
            that.setReadyOnly(["item", "site"], detail.materials.length > 0);
            that.on("add:materials", this.materialsChanged);
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
              childRoutings = child.routings,
              childMaterials = child.materials,
              childChildren = child.children;

            // Reset where we are
            routings = workOrder.get("routings");
            materials = workOrder.get("materials");

            // Don't want these directly added on new work order
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
        this.setReadOnly(["item", "site", "mode"]);
        this.setStatus(K.BUSY_FETCHING);
        this.off("add:materials", this.materialsChanged);

        // Adjust quantity according to mode
        quantity = quantity * (mode === W.ASSEMBLY_MODE ? 1 : -1);

        // Go fetch exploded profile to build order definition
        params = [itemSite.id, quantity, dueDate, {startDate: startDate}];
        this.dispatch("XM.ItemSite", "explode", params, options);

        return this;
      },

      fetch: function () {
        // Only once because we don't want the result of child 
        // fetches to kick over fetchChildren without a root argument.
        this.once("status:READY_CLEAN", this.fetchChildren);
        return XM.Document.prototype.fetch.apply(this, arguments);
      },

      /**
        Fetch child work orders and store them in `meta` because it is not
        possible to define a recursive ORM.

        @params {Object} Root work order.
        returns Receiver
      */
      fetchChildren: function (root) {
        var children = this.getValue("children"),
          parent = root || this,
          that = this,
          options = {};
        
        options.query = {
          parameters: [
            {attribute: "parent", value: this.id}
          ]
        };

        options.success = function () {
          // Do this recursively
          children.each(function (child) {
            child.fetchChildren(parent);
          });
        };

        parent.buildTree();
        children.fetch(options);

        return this;
      },

      fetchItemSite: function (options) {
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
              that.set("leadTime", itemSite.get("leadTime"));
            }
          };
          itemSites.fetch(fetchOptions);
        } else {
          this.meta.unset("itemSite");
          this.handleCostRecognition();
        }
      },

      /**
      Return an array of models that includes the current workorder
      and all its children.

      @params {Array} Parent work order.
      returns Array
      */
      getWorkOrders: function (coll) {
        var workOrders =  coll  || new Backbone.Collection([this]),
          children = this.getValue("children");
        children.each(function (child) {
          workOrders.add(child);
          // Do this recursively
          child.getWorkOrders(workOrders);
        });
        return workOrders;
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
        var tree = new Backbone.Collection();

        if (options && options.isChild) {
          this.numberPolicy = XM.Document.MANUAL_NUMBER;
        }
        XM.Document.prototype.initialize.apply(this, arguments);

        // Setup meta data
        tree._collapsed = {};
        tree.parent = this;
        this.meta = new Backbone.Model({
          children: new XM.WorkOrderCollection(),
          tree: tree
        });

        // Handle special project setting
        if (XT.session.settings.get("RequireProjectAssignment")) {
          this.requiredAttributes.push("project");
        }
      },

      itemChanged: function () {
        var item = this.get("item"),
          characteristics = this.get("characteristics"),
          itemCharAttrs,
          charTypes;

        characteristics.reset();

        // Set sort for characteristics
        if (!characteristics.comparator) {
          characteristics.comparator = function (a, b) {
            var aOrd = a.getValue("characteristic.order"),
              aName = a.getValue("characteristic.name"),
              bOrd = b.getValue("characteristic.order"),
              bName = b.getValue("characteristic.name");
            if (aOrd === bOrd) {
              return aName === bName ? 0 : (aName > bName ? 1 : -1);
            } else {
              return aOrd > bOrd ? 1 : -1;
            }
          };
        }

        // Build characteristics
        itemCharAttrs = _.pluck(item.get("characteristics").models, "attributes");
        charTypes = _.unique(_.pluck(itemCharAttrs, "characteristic"));
        _.each(charTypes, function (char) {
          var lineChar = new XM.PurchaseOrderLineCharacteristic(null, {isNew: true}),
            defaultChar = _.find(itemCharAttrs, function (attrs) {
              return attrs.isDefault === true &&
                attrs.characteristic.id === char.id;
            });
          lineChar.set("characteristic", char);
          lineChar.set("value", defaultChar ? defaultChar.value : "");
          characteristics.add(lineChar);
        });

        this.fetchItemSite();
      },

      materialsChanged: function () {
        var materials = this.get("materials");
        this.setReadyOnly(["item", "site"], materials.length > 0);
        this.set("isAdhoc", true);
      },

      numberChanged: function () {
        var number = this.get("number"),
         subNumber = this.get("subNumber");
        this.set("name", number + "-" + subNumber);
      },

      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        var success = options.success;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        // We want to persist this work order and all its children
        options.collection = this.getWorkOrders();

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) { value = options; }

        // Don't use XM.Document prototype because duplicate key rules are diffrent here
        return XM.Model.prototype.save.call(this, key, value, options);
      },

      dueDateChanged: function () {
        var dueDate = this.get("dueDate"),
          leadTime = this.get("leadTime"),
          site = this.get("site"),
          useSiteCalendar = XT.session.settings.get("UseSiteCalendar"),
          options = {},
          startDate = new Date(),
          params;

        if (this.get("startDate")) {
          return;
        }

        //if (useSiteCalendar) {
        if (1 === 2) {
          // Do something complicated
        } else {
          startDate.setDate(dueDate.getDate() - leadTime);
          this.set("startDate", startDate);
        }

/*
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
*/
      },

      statusReadyClean: function (model, value, options) {
        options = options || {};
        this.materialsChanged();
        this.setReadOnly("startDate", false);
        this.fetchItemSite(this, null, {isLoading: true});
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
      },

      workOrderStatusChanged: function () {
        var status = this.get("status");
        this.setReadOnly(status === XM.WorkOrder.CLOSED_STATUS);
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

      handlers: {
        "change:item": "itemChanged",
        "change:quantityFixed": "calculateQuantityRequired",
        "change:quantityPer": "calculateQuantityRequired",
        "change:scrap": "calculateQuantityRequired",
        "change:workOrder": "workOrderChanged",
        "status:READY_CLEAN": "statusReadyClean"
      },

      defaults: function () {
        return {
          cost: 0,
          isAutoIssueToWorkOrder: false,
          isCreateWorkOrder: false,
          isPicklist: false,
          isScheduleAtOperation: true,
          issueMethod: XT.session.settings.get("DefaultWomatlIssueMethod"),
          quantityFixed: 0,
          quantityPer: 0,
          quantityRequired: 0,
          quantityIssued: 0,
          scrap: 0
        };
      },

      /**
        Returns Receiver
      */
      calculateQuantityRequired: function () {
        var workOrder = this.get("workOrder"),
          item = this.get("item"),
          unit = this.get("unit"),
          scale = XT.QTY_SCALE,
          scrap = this.get("scrap") || 0,
          qtyPer = this.get("quantityPer") || 0,
          qtyFixed = this.get("quantityFixed") || 0,
          qtyRequired = 0,
          qtyOrdered,
          options = {},
          params,

          handleFractional = function (fractional) {
            if (fractional) {
              qtyRequired = Math.ceil(qtyRequired);
            }
          };

        if (workOrder && item) {
          qtyOrdered = workOrder.get("quantity");
          qtyRequired = XT.math.add(qtyFixed, qtyOrdered * qtyPer, scale) * (1 + scrap);

          if (unit.id === item.get("unit").id) {
            this.handleFractional(item.get("isFractional"));
          } else {
            params = [item.id, unit.id];
            options.success = handleFractional;
            this.dispatch("XM.Item", "unitFractional", params, options);
          }
        }

        this.set("quantityRequired", qtyRequired);

        return this;
      },

      initialize: function () {
        XM.Model.prototype.initialize.apply(this, arguments);
        this.meta = new Backbone.Model();
        this.meta.set("units", new Backbone.Collection());
      },

      isActive: function () {
        var mode = this.getValue("workOrder.mode"),
          sense = mode === XM.WorkOrder.ASSEMBLY_MODE ? 1 : -1,
          quantityRequired = this.get("quantityRequired") * sense,
          quantityIssued = this.get("quantityIssued") * sense,
          status = this.getValue("workOrder.status");

        return quantityRequired > quantityIssued &&
          status !== XM.WorkOrder.CLOSED_STATUS;
      },

      itemChanged: function () {
        var item = this.get("item"),
          that = this,
          options = {},
          addUnits = function (units) {
            var itemType = item.get("type"),
              quantityPer = that.get("quantityPer"),
              K = XM.Item;

            that.meta.add(units);
            that.set("unit", item.get("inventoryUnit"));

            // Set default quantities of none set yet
            if (!quantityPer) {
              if (itemType === K.TOOLING || itemType === K.REFERENCE) {
                that.set("quantityPer", 0);
                that.set("quantityFixed", 1);
              } else {
                that.set("quantityPer", 1);
                that.set("quantityFixed", 0);
              }
            }
          };

        this.meta.get("units").reset();

        if (item) {
          options.success = addUnits;
          this.dispatch("XM.Item", "materialIssueUnits", [item.id], options);
        }

      },

      getIssueMethodString: function () {
        var issueMethod = this.get("issueMethod"),
          K = XM.Manufacturing;

        switch (issueMethod)
        {
        case K.ISSUE_PUSH:
          return "_push".loc();
        case K.ISSUE_PULL:
          return "_pull".loc();
        case K.ISSUE_MIXED:
          return "_mixed".loc();
        }
        
        return "error";
      },

      statusReadyClean: function () {
        var status = this.getValue("workOrder.status");
        this.setReadOnly(status === XM.WorkOrder.CLOSED_STATUS);
      },

      workOrderChanged: function () {
        this.set("dueDate", this.getValue("workOrder.startDate"));
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

      defaults: function () {
        return {
          isRunReport: true,
          isSetupReport: true,
          postedQuantity: 0,
          postedQuantityPer: 0,
          runConsumed: 0,
          setupConsumed: 0
        };
      },

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

      TYPE_POST_PRODUCTION: "P",

      TYPE_TEST: "T"

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
