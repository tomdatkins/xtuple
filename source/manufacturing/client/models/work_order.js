/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, Globalize:true */

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
        bseq = bitem ? bitem.id : false,
        K = XM.Model;

      // New items come after non-new items
      if (a.isNew() && !b.isNew()) {
        return 1;
      } else if (b.isNew() && !a.isNew()) {
        return -1;

      // If both new, sort in the order entered
      } else if (a.isNew() && b.isNew()) {
        aseq = a.getValue("sequence");
        bseq =  b.getValue("sequence");
        if (_.isUndefined(aseq)) { return 1; }
        if (_.isUndefined(bseq)) { return -1; }
        return aseq - bseq;
      }

      // Otherwise, sort by item
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
          postedValue: 0,
          receivedValue: 0,
          wipValue: 0,
          createdBy: XM.currentUser.id
        };
      },

      readOnlyAttributes: [
        "costRecognitionDefault",
        "name",
        "postedValue",
        "received",
        "receivedValue",
        "startDate",
        "subNumber",
        "wipValue"
      ],

      handlers: {
        "add:materials remove:materials": "materialsChanged",
        "change:item": "itemChanged",
        "change:number": "numberChanged",
        "change:priority": "priorityChanged",
        "change:project": "projectChanged",
        "change:quantity": "quantityChanged",
        "change:site": "fetchItemSite",
        "change:status": "workOrderStatusChanged",
        "status:READY_CLEAN": "statusReadyClean",
        "status:READY_NEW": "statusReadyNew"
      },

      /**
        Build the collection Work Order statuses this Work Order can be in.
      */
      buildStatuses: function () {
        var workOrderStatus = this.get("status"),
          statuses = this.getValue("statuses"),
          privs = XT.session.privileges,
          K = XM.WorkOrder,
          canOpen = false,
          canExplode = false,
          canRelease = false,
          canInProcess = false,
          canClose = false;

        statuses.each(function (status) {
          status.set("isActive", false);
        });

        switch (workOrderStatus)
        {
        case K.OPEN_STATUS:
          canOpen = true;
          canExplode = privs.get("ExplodeWorkOrders");
          break;
        case K.EXPLODED_STATUS:
          canOpen = privs.get("ImplodeWorkOrders");
          canExplode = true;
          canRelease = privs.get("ReleaseWorkOrders");
          break;
        case K.RELEASED_STATUS:
          canExplode = privs.get("RecallWorkOrders");
          canRelease = true;
          canClose = privs.get("CloseWorkOrders");
          break;
        case K.INPROCESS_STATUS:
          canInProcess = true;
          canClose = privs.get("CloseWorkOrders");
          break;
        case K.CLOSED_STATUS:
          canClose = true;
        }

        statuses.get(K.OPEN_STATUS).set("isActive", canOpen);
        statuses.get(K.EXPLODED_STATUS).set("isActive", canExplode);
        statuses.get(K.RELEASED_STATUS).set("isActive", canRelease);
        statuses.get(K.INPROCESS_STATUS).set("isActive", canInProcess);
        statuses.get(K.CLOSED_STATUS).set("isActive", canClose);
        statuses.trigger("reset", this);

        return this;
      },

      /**
        Reset and recursively build the tree from scratch.

        returns Receiver
      */
      buildTree: function () {
        var tree = this.getValue("tree"),
          tmp = new Backbone.Collection(), // Prevents event churn
          that = this,
          cache = [],

          addWorkOrder = function (level, workOrder) {
            var materials = workOrder.get("materials"),
              routings = workOrder.get("routings");

            // Add materials not associated with routings
            materials.comparator = _materialsComparator;
            materials.sort();
            materials.each(function (material) {
              if (_.isEmpty(material.get("operation")) &&
                  !material.isDestroyed()) {
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
            var materials,
              leaf,
              isCollapsed;

            if (!operation.isDestroyed()) {
              materials = operation.getValue("workOrder.materials");
              leaf = new LeafModel({
                id: operation.id,
                level: level,
                model: operation
              });

              // Detrmine any materials associated to this operation
              materials = materials.filter(function (material) {
                var moper = material.get("operation");
                return moper && moper.id === operation.id &&
                  !material.isDestroyed();
              });

              if (materials.length) {
                leaf.set("isCollapsed", false);
              }

              tmp.push(leaf);
              level++;

              _.each(materials, function (material) {
                addMaterial(level, material);
              });
            }
          },

          addMaterial = function (level, material) {
            var children = material.getValue("workOrder.children"),
              leaf = new LeafModel({
                id: material.id,
                level: level,
                model: material
              }),
              child;

            tmp.push(leaf);

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
                id: child.id,
                level: level,
                model: child,
              }),
              hasLeaves = child.get("materials").length ||
                          child.get("routings").length;

            if (hasLeaves) {
              leaf.set("isCollapsed", false);
            }
            tmp.push(leaf);
            level++;
            addWorkOrder(level, child);
          },

          cacheCollapsed = function (leaf) {
            if (leaf.get("isCollapsed")) {
              cache.push({
                id: leaf.get("model").id,
                level: leaf.get("level")
              });
            }
          },

          cacheCollapsedTree = function (prop) {
            var cTree = tree._collapsed[prop];
            _.each(cTree.models, cacheCollapsed);
          },

          // Sort descending by level
          cacheSort = function (a, b) {
            return b.level - a.level;
          },

          // Collapse a cached item
          collapse = function (item) {
            var ids = tmp.pluck("id"),
              idx = ids.indexOf(item.id);

            that.collapse(idx, tmp);
          };

        tmp._collapsed = {};

        // First cache all collapsed nodes
        tree.each(cacheCollapsed);
        _.each(_.keys(tree._collapsed), cacheCollapsedTree);

        // Rebuild the tree on temporary collection
        addWorkOrder(0, this);

        // Reapply collapsed nodes on temporary tree
        cache.sort(cacheSort);
        _.each(cache, collapse);

        // Apply new values to the real tree
        tree._collapsed = tmp._collapsed;
        tree.reset(tmp.models);

        return this;
      },

      canView: function (attribute) {
        var status = this.getStatus(),
          workOrderStatus = this.get("status"),
          K = XM.Model,
          canViewNumber = this.numberPolicy !== XM.Document.AUTO_NUMBER &&
                          workOrderStatus === XM.WorkOrder.OPEN_STATUS &&
                          this.isNew();

        // Once a date has been set, we don't need to worry about the
        // Lead time any more.
        if (attribute === "leadTime" && this.get("dueDate")) {
          return false;
        }

        // Handle other special cases
        switch (attribute)
        {
        case "name":
          return !canViewNumber;
        case "number":
          return canViewNumber;
        case "project":
          return XT.session.settings.get("UseProjects");
        case "routings":
          return XT.session.settings.get("Routings");
        }

        return XM.Document.prototype.canView.apply(this, arguments);
      },

      /**
        Collapse the tree at index.

        @param {Number} Index.
        @param {Object} Tree. Defaults to local tree if not passed.
        returns Receiver
      */
      collapse: function (index, workingTree) {
        var tree = workingTree || this.getValue("tree"),
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
        This version of parent deals with the indirection of 
        Work Order children actually residing in meta. Finds
        it via the backbone relational store.
      */
      getParent: function (getRoot) {
        var parent = this.get("workOrder"),
          root;

        if (parent && getRoot) {
          // The local parent is WorkOrderRelation. Find the "real" parent here
          parent = Backbone.Relational.store.find(XM.WorkOrder, parent.id);
          root = parent.getParent(getRoot);
        }
        return root || parent;
      },

      dateChanged: function (value, changes, options) {
        options = options ? _.clone(options) : {};
        var routings = this.getValue("routings"),
          materials = this.getValue("materials"),
          children = this.getValue("children"),
          startDate = this.get("startDate"),
          prevStartDate = options.prevStartDate || this.previous("startDate"),
          prevDueDate = options.prevStartDate || this.previous("dueDate"),
          startDelta = XT.date.daysBetween(startDate, prevStartDate),
          dueDate = this.get("dueDate"),
          site = this.get("site"),
          count = children.length || 1,
          isNew = this.isNew(),
          useSiteCalendar = XT.session.settings.get("UseSiteCalendar"),
          K = XM.Model,
          nextStatus = this.isNew() ? K.READY_NEW : K.READY_DIRTY,
          that = this,

          afterReschedule, // Defined below

          afterQuestion = function (resp) {
            var setOptions = {rescheduleAll: false};

            if (resp.answer) {
              rescheduleAll();
            } else {
              that.set("startDate", prevStartDate, setOptions);
              that.set("dueDate", prevDueDate, setOptions);
            }
          },

          done = function () {
            that.buildTree();
            that.setStatus(nextStatus);

            // This will bubble 'done' back up to parent if we're in a child
            if (options.success) { options.success(); }
          },

          foundOperationWorkDays = function (resp) {
            var operation = this, // Just for readability
              params = [site.id, startDate, resp],
              cwdOptions = {};

            cwdOptions.success = _.bind(foundOperationWorkDate, operation);
            that.dispatch("XM.Site", "calculateNextWorkingDate", params, cwdOptions);
          },

          foundOperationWorkDate = function (resp) {
            var operation = this, // Just for readability
              scheduled = new Date(resp),
              materials = operation.getValue("materials");

            operation.set("scheduled", scheduled);

            // Forward schedule on to materials where applicable.
            materials.each(function (material) {
              if (material.get("isScheduleAtOperation")) {
                material.set("dueDate", scheduled);
              }
            });

            afterReschedule();
          },

          rescheduleAll = function () {
            // Reschedule Routings
            if (useSiteCalendar) {
              // Asynchronous requests to determine schedule.
              routings.each(function (operation) {
                var scheduled = operation.get("scheduled"),
                  params = [site.id, prevStartDate, scheduled],
                  cwdOptions = {};

                cwdOptions.success = _.bind(foundOperationWorkDays, operation);
                that.dispatch("XM.Site", "calculateWorkDays", params, cwdOptions);
              });
            } else {
              // We have enough to do it here
              routings.each(function (operation) {
                var scheduled = operation.get("scheduled");

                scheduled.setDate("scheduled", scheduled.getDate() + startDelta);
                foundOperationWorkDate.call(operation, scheduled);
              });
            }

            // Reschedule materials with no operation specified.
            materials.each(function (material) {
              if (!material.get("isScheduleAtOperation")) {
                material.set("dueDate", startDate);
              }
            });

            // Reschedule child work orders.
            if (children.length) {
              children.each(function (child) {
                var leadTime = child.getValue("itemSite.leadTime"),
                  childStartDate = new Date(startDate),
                  childOptions = {
                    rescheduleAll: true,
                    success: afterReschedule,
                    prevStartDate: child.get("startDate"),
                    prevDueDate: child.get("dueDate")
                  };

                childStartDate.setDate(childStartDate.getDate() - leadTime);
  
                // This setting of dates will cause a recursive rescheduling.
                // Turn off events and call date changed manually to avoid double
                // hits.          
                child.off("change:startDate change:dueDate", child.dateChanged);
                child.set({startDate: childStartDate, dueDate: startDate});
                child.dateChanged(child, null, childOptions);
                child.on("change:startDate change:dueDate", child.dateChanged);
              });
            } else {
              afterReschedule();
            }
          };

        // If there are subordinates involved, there's more work to do,
        if (routings.length || materials.length) {

          // Set busy, but don't cascade because we still want subordinate records,
          // to respond to events
          this.set(K.BUSY_FETCHING);

          // Prepare callback counter
          if (useSiteCalendar) {
            count += routings.length;
          }

          // This should call 'done' after all asynchronous events complete
          afterReschedule = _.after(count, done) || done;

          if (isNew || options.rescheduleAll) {
            rescheduleAll();

          // Prompt whether to reschedule if not specified.          
          } else if (_.isUndefined(options.rescheduleAll)) {
            this.notify("_updateAllDates?".loc(), {
              type: XM.Model.QUESTION,
              callback: afterQuestion
            });
          }
        } else {
          this.setExploded();
          if (options.success) { options.success(); }
        }
      },

      dueDateChanged: function () {
        var dueDate = this.get("dueDate"),
          leadTime = this.getValue("leadTime"),
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
          this.off("change:dueDate", this.dueDateChanged)
              .on("change:startDate change:dueDate", this.dateChanged)
              .setReadOnly("startDate", false);
          this.setExploded();
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
          breederDistributions = this.get("breederDistributions"),
          routings = this.get("routings"),
          that = this,
          params,

          // Build up order detail
          buildOrder = function (detail) {
            _.each(detail.routings, buildOperation);
            _.each(detail.materials, buildMaterial);
            _.each(detail.breederDistributions, buildBreederDistribution);
            _.each(detail.children, _.bind(buildChild, that));
            that.revertStatus(true);
            that.buildTree();
            that.setReadOnly(["item", "site"], detail.materials.length > 0);
            that.on("add:materials", this.materialsChanged);
          },

          // Add a material
          buildMaterial = function (material) {
            var workOrderMaterial = new XM.WorkOrderMaterial(null, {isNew: true});
            material.dueDate = new Date(material.dueDate);
            workOrderMaterial.set(material, {silent: true});
            materials.add(workOrderMaterial);
          },

          // Add a breeder distribution
          buildBreederDistribution = function (distribution) {
            var breederDist = new XM.WorkOrderBreederDistribution(null, {isNew: true});
            breederDist.set(distribution, {silent: true});
            breederDistributions.add(breederDist);
          },

          // Add an operation
          buildOperation = function (routing) {
            var operation = new XM.WorkOrderOperation(null, {isNew: true});
            routing.scheduled = new Date(routing.scheduled);
            operation.set(routing, {silent: true});
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
            }), {silent: true});

            // Kick over handlers we actually care about
            workOrder.numberChanged();
            workOrder.workOrderStatusChanged();
            workOrder.fetchItemSite();

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
        if (status !== XM.WorkOrder.EXPLODED_STATUS ||
           !itemSite || !quantity || !startDate || !dueDate) {
          return;
        }

        // Update status
        this.setReadOnly(["item", "site", "mode"]);
        this.setStatus(K.BUSY_FETCHING, {cascade: true});
        this.off("add:materials", this.materialsChanged);

        // Adjust quantity according to mode
        quantity = quantity * (mode === W.ASSEMBLY_MODE ? 1 : -1);

        // Go fetch exploded profile to build order definition
        params = [itemSite.id, quantity, dueDate, {startDate: startDate}];
        this.dispatch("XM.ItemSite", "explode", params, options);

        return this;
      },

      fetch: function (options) {
        // Lots of work here to deal with a result that's a recursive collection.
        // Seems unique for now, but if other similar situations crop up, We
        // should refactor.
        options = options ? _.clone(options) : {};
        var K = XM.Model,
          statusOpts = {cascade: true},
          success = options.success,
          key = this.idAttribute,
          that = this,
          id,

          setChildrenStatus = function (parent, status) {
            var children = parent.getValue("children");

            children.each(function (child) {
              child.setStatus(status, statusOpts);
              setChildrenStatus(child, status);
            });
          },

          afterDispatch = function (resp) {
            var first = resp.shift(),
              lockSuccess = function () {
                done.call(that);
                if (success) { success(that, first, options); }
              };

            if (!that.set(that.parse(first.data, options), options)) {
              return false;
            }
            that.etag = first.etag;
            that.obtainLock({success: _.bind(done, that)});
            appendChildren(that, resp);
            that.buildTree();
          },

          appendChildren = function (parent, ary) {
            var children = parent.getValue("children"),
              rem = [],
              child,
              obj,
              p;

            children.reset();

            // Look for children of the parent and
            // Add to meta collection
            while (ary.length) {
              obj = ary.shift();
              p = obj.data.parent;
              if (p && p.uuid === parent.id) {
                child = XM.WorkOrder.findOrCreate(obj.id) || new XM.WorkOrder();
                child.set(child.parse(obj.data, options), options);
                child.etag = obj.etag;
                child.obtainLock({success: _.bind(done, child)});
                children.add(child);
              } else {
                rem.push(obj);
              }
            }

            // Recursively process remaining data
            children.each(function (child) {
              appendChildren(child, rem);
            });
          },

          done = function () {
            this.setStatus(XM.Model.READY_CLEAN, {cascade: true});
          };

        // Get an id from... someplace
        if (options.id) {
          id = options.id;
        } else if (options[key]) {
          id = options[key];
        } else if (this._cache) {
          id = this._cache[key];
        } else if (this.id) {
          id = this.id;
        } else if (this.attributes) {
          id = this.attributes[key];
        } else {
          options.error("Cannot find id");
          return;
        }

        this.setStatus(K.BUSY_FETCHING, statusOpts);
        setChildrenStatus(this, K.BUSY_FETCHING);
        
        options.success = afterDispatch;
        return this.dispatch("XM.WorkOrder", "get", id, options);
      },

      fetchItemSite: function (model, value, options) {
        var item = this.get("item"),
          site = this.get("site"),
          that = this,
          fetchOptions = {},
          itemSites,
          message,
          unsetSite = function () {
            that.unset("site");
          };

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
                callback: unsetSite
              });
            } else {
              that.meta.set("itemSite", itemSite);
              that.setExploded();
              that.setValue("leadTime", itemSite.get("leadTime"));
            }
          };

          itemSites.fetch(fetchOptions);
        } else {
          this.meta.unset("itemSite");
          this.handleCostRecognition();
        }

        return this;
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

      implode: function () {
        var workOrderStatus = this.get("status"),
          routings = this.get("routings"),
          materials = this.get("materials"),
          breederDistributions = this.get("breederDistributions"),
          children = this.getValue("children"),
          K = XM.WorkOrder;

        if (workOrderStatus === K.OPEN_STATUS) {
          routings.each(function (operation) {
            operation.destroy();
          });

          materials.each(function (material) {
            material.destroy();
          });

          breederDistributions.each(function (dist) {
            dist.destroy();
          });

          children.each(function (child) {
            child.implode();
            if (child.get("status") === K.EXPLODED_STATUS) {
              child.destroy();
            }
          });
        }
      },

      initialize: function (attributes, options) {
        var tree = new Backbone.Collection(),
          statuses = XM.workOrderStatuses.toJSON();

        if (options && options.isChild) {
          this.numberPolicy = XM.Document.MANUAL_NUMBER;
        }

        // Setup meta data
        tree._collapsed = {};
        tree.parent = this;
        this.meta = new Backbone.Model({
          children: new XM.WorkOrderCollection(),
          leadTime: 0,
          tree: tree,
          statuses: new XM.WorkOrderStatusCollection(statuses)
        });

        XM.Document.prototype.initialize.apply(this, arguments);

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
        var materials = this.get("materials"),
          hasMaterials = materials.length > 0,
          status = this.get("status"),
          K = XM.WorkOrder;

        if (!this.isReady()) { return; } // Can't silence backbone relational events

        this.set("isAdhoc", true)
            .setReadOnly(["item", "site", "mode"], hasMaterials);

        if (status === K.OPEN_STATUS) {
          this.set("status", K.EXPLODED_STATUS);
        }

        this.buildTree();
      },

      numberChanged: function () {
        var number = this.get("number"),
         subNumber = this.get("subNumber");

        this.set("name", number + "-" + subNumber);
        this.setExploded();
      },

      priorityChanged: function (value, changes, options) {
        options = options || {};
        var children = this.getValue("children"),
          priority = this.get("priority"),
          that = this,
          callback = function (resp) {
            var setOptions = {updateChildren: false};

            if (resp.answer) {
              updateChildren();
            } else {
              that.set("priority", that.previous("priority"), setOptions);
            }
          },

          updateChildren = function () {
            children.each(function (child) {
              child.set("priority", priority, {updateChildren: true});
            });
          };

        // If there are children involved, prompt whether to prioritize them too
        if (children.length) {
          if (_.isUndefined(options.updateChildren)) {
            this.notify("_updateChildPriorities?".loc(), {
              type: XM.Model.QUESTION,
              callback: callback
            });
          } else if (options.updateChildren) {
            updateChildren();
          }
        }
      },

      projectChanged: function () {
        var children = this.getValue("children"),
          project = this.get("project");

        if (this.isNew()) {
          children.each(function (child) {
            child.set("project", project);
          });
        }
      },

      quantityChanged: function (model, changed, options) {
        options = options ? _.clone(options) : {};
        var quantity = this.get("quantity"),
          oldQuantity = this.previous("quantity"),
          itemSite = this.getValue("itemSite"),
          materials = this.get("materials"),
          routings = this.get("routings"),
          K = XM.Model,
          nextStatus = this.isNew() ? K.READY_NEW : K.READY_DIRTY,
          that = this,
          dispOptions = {},
          params,
          suggested,

          afterValidate = function (resp) {
            var scale = XT.locale.quantityScale,
              message;

            suggested = resp;

            if (suggested !== quantity) {
              message = "_updateQuantity?".loc();
              message = message.replace(
                "{quantity}",
                Globalize.format(suggested, "n" + scale)
              );
              that.notify(message, {
                type: XM.Model.QUESTION,
                callback: afterValidateQuestion
              });
            } else if (materials.length || routings.length) {
              message = "_updateAllQuantities?".loc();
              message = message.replace("{oldQuantity}", oldQuantity)
                               .replace("{newQuantity}", quantity);
              that.notify(message, {
                type: K.QUESTION,
                callback: afterUpdateQuestion
              });
            } else {
              that.setExploded();
            }
          },

          afterUpdateQuestion = function (resp) {
            if (resp.answer) {
              updateRequirements();
            } else {
              that.set("quantity", oldQuantity, {validate: false});
            }
          },

          afterValidateQuestion = function (resp) {
            if (resp.answer) {
              that.set("quantity", suggested);
            } else {
              that.unset("quantity");
            }
          },

          done = function () {
            that.buildTree();
            that.setStatus(nextStatus);

            // This will bubble up 'done' to parent if at child
            if (options.success) { options.success(); }
          },

          updateRequirements = function () {
            var mode = that.get("mode"),
              sense = mode === XM.WorkOrder.ASSEMBLY_MODE ? 1 : -1,
              isFractional = that.getValue("item.isFractional"),
              updatedQty = isFractional ? quantity : Math.ceil(quantity),
              matlOptions = {},
              count = 0;

            // There may be asynchronous activity involved.
            // Disallow other actions until that's all done.
            that.setStatus(K.BUSY_FETCHING);

            // Handle non-fractional situations.
            if (updatedQty !== quantity) {
              that.set("quantity", updatedQty, {validate: false});
              return; // We'll be starting this process over.
            }

            // Update routings.
            routings.each(function (operation) {
              operation.calculateRunTime();
            });

            // Determine how many materials will result in async requests.
            materials.each(function (material) {
              var materialUnit = material.get("unit"),
                itemUnit = material.getValue("item.inventoryUnit");

              if (materialUnit.id !== itemUnit.id) { count++; }
            });

            // We'll want to update children after all async work is done.
            matlOptions.success = _.after(count, updateChildren);

            // Update material requirements
            materials.each(function (material) {
              material.calculateQuantityRequired(material, null, matlOptions);
            });

            // Update children now if there were no async items.
            if (!count) { updateChildren(); }
          },

          updateChildren = function () {
            var  children = that.getValue("children"),
              materials = that.get("materials"),
              afterUpdate = _.after(children.length, done),
              childOptions = {
                validate: false,
                success: afterUpdate
              };

            // Loop through each child and update quantity.
            children.each(function (child) {
              var material,
                quantityRequired;
             
              // Find the material requirement that the child belongs to.
              material = materials.find(function (material) {
                return child.get("workOrderMaterial").id === material.id;
              });
              quantityRequired = material.get("quantityRequired");

              // Now update the child's quantity to match.
              // Will result in recusive behavior.
              child.set("quantity", quantityRequired, childOptions);
            });

            // If there weren't any children, then we're all done
            if (!children.length) { done(); }
          };

        // If no Item Site, come back when we have one
        if (!itemSite) {
          this.meta.once("change:itemSite", this.quantityChanged, this);
          return;
        } else if (!_.isNumber(quantity)) {
          return;
        } else if (options && options.validate === false) {
          updateRequirements();
          return;
        }

        params = [itemSite.id, quantity, true];
        dispOptions.success = afterValidate;
        this.dispatch("XM.ItemSite", "validateOrderQuantity", params, dispOptions);
      },

      releaseLock: function (options) {
        var children = this.getValue("children");

        XM.Document.prototype.releaseLock.apply(this, arguments);
        children.each(function (child) {
          child.releaseLock();
        });
      },

      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        var success = options.success,
          dirtyOrders = this.getWorkOrders().filter(function (order) {
            return order.isDirty();
          });

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        // We want to persist this work order and all its children
        options.collection = new Backbone.Collection(dirtyOrders);

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) { value = options; }

        // Refresh the tree, just this once
        this.once("status:READY_CLEAN", this.buildTree);

        // Don't use XM.Document prototype because duplicate key rules are diffrent here
        return XM.Model.prototype.save.call(this, key, value, options);
      },

      /**
        Explodes the Work Order if it is in a state where it can be exploded.
      */
      setExploded: function () {
        var K = XM.WorkOrder;

        if (this.isNew() && XT.session.settings.get("AutoExplodeWO") &&
          this.get("number") &&
          this.get("quantity") && this.get("startDate") &&
          this.get("dueDate") && this.get("status") === K.OPEN_STATUS) {
          this.set("status", K.EXPLODED_STATUS);
        }

        return this;
      },

      statusReadyNew: function () {
        this.buildStatuses();
        this.on("change:dueDate", this.dueDateChanged);
      },

      statusReadyClean: function (model, value, options) {
        options = options || {};
        this.buildStatuses()
            .off("change:dueDate", this.dueDateChanged)
            .on("change:startDate change:dueDate", this.dateChanged)
            .setReadOnly(["item", "site", "mode"], this.get("materials").length > 0)
            .setReadOnly(this.get("status") === XM.WorkOrder.CLOSED_STATUS)
            .fetchItemSite(this, null, {isLoading: true})
            .workOrderStatusChanged();
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
        var workOrderStatus = this.get("status"),
          previousStatus = this.previous("status"),
          isNotAdhoc = !this.get("isAdhoc"),
          K = XM.WorkOrder;

        if (isNotAdhoc) {
          switch (workOrderStatus)
          {
          case K.OPEN_STATUS:
            if (previousStatus === K.EXPLODED_STATUS) {
              this.implode();
            }
            break;
          case K.EXPLODED_STATUS:
            if (previousStatus === K.OPEN_STATUS) {
              this.explode();
            }
            break;
          }
        }

        this.buildStatuses();
        
        // Need to commit before changing again
        this.setReadOnly("status", previousStatus !== workOrderStatus);
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

      readOnlyAttributes: [
        "isScheduleAtOperation",
        "quantityIssued",
        "quantityRequired",
        "dueDate"
      ],

      handlers: {
        "change:item": "itemChanged",
        "change:operation": "operationChanged",
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
          isScheduleAtOperation: false,
          issueMethod: XT.session.settings.get("DefaultWomatlIssueMethod"),
          quantityFixed: 0,
          quantityPer: 0,
          quantityRequired: 0,
          quantityIssued: 0,
          scrap: 0
        };
      },

      destroy: function () {
        var workOrder = this.get("workOrder"),
          quantityIssued = this.get("quantityIssued"),
          events = "change:item change:quantityRequired change:operation",
          ret;

        if (quantityIssued) {
          this.notify("_noDeleteMaterials".loc(), {type: XM.Model.CRITICAL});
          return false;
        }

        this.off(events, workOrder.buildTree, workOrder);

        ret = XM.Model.prototype.destroy.apply(this, arguments);

        workOrder.buildTree();

        return ret;
      },

      /**
        Returns Receiver
      */
      calculateQuantityRequired: function (model, changed, options) {
        options = options ? _.clone(options) : {};
        var workOrder = this.get("workOrder"),
          item = this.get("item"),
          unit = this.get("unit"),
          scale = XT.QTY_SCALE,
          scrap = this.get("scrap") || 0,
          qtyPer = this.get("quantityPer") || 0,
          qtyFixed = this.get("quantityFixed") || 0,
          qtyRequired = 0,
          qtyOrdered,
          that = this,
          dispOptions = {},
          params,
          handleFractional = function (fractional) {
            if (fractional) {
              qtyRequired = Math.ceil(qtyRequired);
            }
            that.set("quantityRequired", qtyRequired);

            if (options.success) { options.success(); }
          };

        if (workOrder && item && unit && (qtyPer || qtyFixed)) {
          qtyOrdered = workOrder.get("quantity");
          qtyRequired = XT.math.add(qtyFixed, qtyOrdered * qtyPer, scale) * (1 + scrap);

          if (unit.id === item.get("inventoryUnit").id) {
            handleFractional(item.get("isFractional"));
          } else {
            params = [item.id, unit.id];
            dispOptions.success = handleFractional;
            this.dispatch("XM.Item", "unitFractional", params, dispOptions);
          }
        } else {
          this.set("quantityRequired", 0);
        }

        return this;
      },

      fetchUnits: function () {
        var item = this.get("item"),
          unit = this.get("unit"),
          units = this.getValue("units"),
          that = this,
          options = {},
          addUnits = function (resp) {
            var addUnit = function (id) {
                units.add(XM.Unit.findOrCreate(id));
              };

            // Loop through reponses and build the collection;
            _.each(resp, addUnit);

            // Set the original or default unit on the model
            that.set("unit", unit);
          };

        units.reset();

        if (item) {
          options.success = addUnits;
          this.dispatch("XM.Item", "materialIssueUnits", [item.id], options);
        }

        return this;
      },

      initialize: function () {
        XM.Model.prototype.initialize.apply(this, arguments);
        this.meta = new Backbone.Model();
        this.meta.set("units", new XM.UnitCollection());
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
          quantityPer = this.get("quantityPer"),
          itemType,
          K = XM.Item;

        if (item) {
          this.set("isPicklist", item.get("isPicklist"));
          this.set("unit", item.get("inventoryUnit"));

          // Set default quantities if none set yet
          itemType = item.get("type");
          if (!quantityPer) {
            if (itemType === K.TOOLING || itemType === K.REFERENCE) {
              this.set("quantityPer", 0);
              this.set("quantityFixed", 1);
            } else {
              this.set("quantityPer", 1);
              this.set("quantityFixed", 0);
            }
          }

          this.fetchUnits();
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

      operationChanged: function () {
        var operation = this.get("operation"),
          hasOperation = _.isObject(operation);

        this.setReadOnly("isScheduleAtOperation", !hasOperation);
        if (!hasOperation) { this.set("isScheduleAtOperation", false); }
      },

      statusReadyClean: function () {
        var status = this.getValue("workOrder.status"),
          itemUsed = this.get("quantityIssued") > 0,
          hasOperation = _.isObject(this.get("operation"));

        this.setReadOnly(status === XM.WorkOrder.CLOSED_STATUS);
        this.setReadOnly("item", itemUsed);
        this.setReadOnly("isScheduleAtOperation", !hasOperation);
        this.fetchUnits();
      },

      workOrderChanged: function () {
        var workOrder = this.get("workOrder"),
          events = "change:item change:quantityRequired change:operation",
          sequence;

        if (workOrder) {
          this.set("dueDate", workOrder.get("startDate"));

          // Keep lists synchronized
          this.on(events, workOrder.buildTree, workOrder);

          // Set sequence for ordering new records used by comparator
          sequence = workOrder.get("materials").length;
          this.meta.set("sequence", sequence);
        }
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
    XM.WorkOrderBreederDistribution = XM.Model.extend({

      recordType: "XM.WorkOrderBreederDistribution"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderOperation = XM.Model.extend({

      recordType: "XM.WorkOrderOperation",

      defaults: function () {
        return {
          isAutoIssueComponents: false,
          isReceiveInventory: false,
          isRunComplete: false,
          isRunReport: true,
          isSetupComplete: false,
          isSetupReport: true,
          postedQuantity: 0,
          postedQuantityPer: 0,
          productionUnitRatio: 1,
          runConsumed: 0,
          runTime: 0,
          setupConsumed: 0,
          setupTime: 0
        };
      },

      handlers: {
        "change:isReceiveInventory": "isReceiveInventoryChanged",
        "change:productionUnitRatio": "calculateOperationQuantity",
        "change:runTime": "runTimeChanged",
        "change:runTime change:productionUnitRatio": "calculateThroughput",
        "change:setupTime": "setupTimeChanged",
        "change:standardOperation": "standardOperationChanged",
        "change:workOrder": "workOrderChanged",
        "status:READY_CLEAN": "statusReadyClean"
      },

      readOnlyAttributes: [
        "operationQuantity",
        "minutesPerUnit",
        "quantityOrdered",
        "runConsumed",
        "runRemaining",
        "scheduled",
        "sequence",
        "setupConsumed",
        "setupRemaining",
        "unitsPerMinute"
      ],

      buildMaterials: function () {
        var materials = this.getValue("materials"),
          workOrderMaterials = this.getValue("workOrder.materials"),
          operationMaterials,
          that = this,

          unbind = function (material) {
            material.off("change:operation", that.buildMaterials, that);
          },

          localMaterials = function (material) {
            var operation = material.get("operation"),
              isLocal = operation && operation.id === that.id;

            // While we're here bind a listener on every material
            // in case the operation is changed.
            if (isLocal) {
              material.on("change:operation", that.buildMaterials, that);
            }

            return isLocal;
          };

        // Can't silence relational events
        if (!this.isReady()) { return; }

        // Temporarily turn off the bindings on our collection
        this.meta.off("add:materials", this.materialAdded);

        // Next remove any old bindings on work order materials
        materials.each(unbind);

        // Get the applicable materials and set them on our local collection
        operationMaterials = workOrderMaterials.filter(localMaterials);
        materials.reset(operationMaterials);

        // Turn the collection bindings back on
        this.meta.on("add:materials", this.materialAdded);

        return this;
      },

      calculateExecutionDay: function () {
        var workOrder = this.get("workOrder"),
          scheduled = this.getValue("scheduled"),
          that = this,
          options = {},
          startDate,
          site,
          params,
          setExecutionDay = function (resp) {
            that.meta.off("change:excutionDay", that.calculateScheduled);
            that.meta.set("executionDay", resp + 1);
            that.meta.on("change:excutionDay", that.calculateScheduled);
          };

        if (workOrder) {
          startDate = workOrder.get("startDate");
          site = workOrder.get("site");
          options.success = setExecutionDay;
          params = [site.id, startDate, scheduled];
          this.dispatch("XM.Site", "calculateWorkDays", params, options);
        }

        return this;
      },

      calculateOperationQuantity: function () {
        var quantityOrdered = this.getValue("workOrder.quantity") || 0,
          productionUnitRatio = this.get("productionUnitRatio") || 1,
          operationQuantity = quantityOrdered / productionUnitRatio;

        this.meta.set("operationQuantity", operationQuantity);

        return this;
      },

      calculateRunTime: function () {
        var routingOperation = this.get("routingOperation"),
          quantity = this.getValue("workOrder.quantity"),
          isRunReport,
          runQuantityPer,
          productionUnitRatio,
          runTime;

        // We can only recalculate if we have an original spec to reference
        if (routingOperation) {
          isRunReport = routingOperation.get("isRunReport");
          runTime = routingOperation.get("runTime");
          runQuantityPer = routingOperation.get("runQuantityPer");
          productionUnitRatio = routingOperation.get("productionUnitRatio");

          if (!isRunReport || !runQuantityPer || !productionUnitRatio) {
            runTime = 0;
          } else {
            runTime = (runTime / runQuantityPer / productionUnitRatio) * quantity;
          }

          this.set("runTime", runTime);
        }
      },

      calculateScheduled: function () {
        var workOrder = this.get("workOrder"),
          executionDay = this.getValue("executionDay"),
          that = this,
          options = {},
          startDate,
          site,
          params,
          setScheduled = function (resp) {
            that.set("scheduled", new Date(resp));
          };

        if (workOrder) {
          startDate = workOrder.get("startDate");
          site = workOrder.get("site");
          options.success = setScheduled;
          params = [site.id, startDate, executionDay - 1];
          this.dispatch("XM.Site", "calculateNextWorkingDate", params, options);
        }

        return this;
      },

      calculateThroughput: function () {
        var runTime = this.get("runTime") || 0,
          productionUnitRatio = this.get("productionUnitRatio"),
          workOrder = this.get("workOrder"),
          quantityOrdered,
          inventoryUnitName,
          inventoryRunTime,
          inventoryPerMinute,
          attrs = {
            unitsPerMinute: "_na".loc(),
            minutesPerUnit: "_na".loc()
          };

        if (runTime && productionUnitRatio && workOrder) {
          quantityOrdered = workOrder.get("quantity");
          inventoryUnitName = workOrder.getValue("item.inventoryUnit.name");
          inventoryPerMinute = Globalize.format(
            runTime / quantityOrdered / productionUnitRatio,
            "n" + XT.locale.quantityPerScale
          );
          inventoryRunTime = Globalize.format(
            1 / (runTime / quantityOrdered / productionUnitRatio),
            "n" + XT.MINUTES_SCALE
          );
          attrs = {
            unitsPerMinute:  inventoryRunTime + " " + inventoryUnitName + " " + "_perMinute".loc(),
            minutesPerUnit: inventoryPerMinute + " " + "_minPer".loc() + " " + inventoryUnitName
          };
        }

        this.meta.set(attrs);

        return this;
      },

      canEdit: function (attr) {
        // A bit of a hack. Technically quantity is editable, but not
        // wise to do it here.
        if (attr === "workOrder.quantity") {
          return false;
        }
        return XM.Model.prototype.canEdit.apply(this, arguments);
      },

      destroy: function () {
        var workOrder = this.get("workOrder"),
          postings = this.get("postings"),
          materials = this.getValue("materials"),
          status = workOrder.get("status"),
          ret,
          clearMaterialOperation = function (material) {
            material.unset("operation");
          };

        if (postings.length) {
          this.notify("_noDeleteOperations".loc(), {type: XM.Model.CRITICAL});
          return false;
        }

        // Disassociate all materials from this operation
        while (materials.length) {
          clearMaterialOperation(materials.first());
        }

        ret = XM.Model.prototype.destroy.apply(this, arguments);

        workOrder.buildTree();

        return ret;
      },

      getName: function () {
        return this.get("sequence") + " - " + this.getValue("workCenter.code");
      },

      getOperationStatusString: function () {
        var setupConsumed = this.get("setupConsumed"),
          setupComplete = this.get("isSetupComplete"),
          runConsumed = this.get("runConsumed"),
          runComplete = this.get("isRunComplete");

        if (runComplete) {
          return "_runComplete".loc();
        } else if (runConsumed) {
          return "_runStarted".loc();
        } else if (setupComplete) {
          return "_setupComplete".loc();
        } else if (setupConsumed) {
          return "_setupStarted".loc();
        } else {
          if (this.isStarted()) {
            return "_started".loc();
          } else {
            return "_notStarted".loc();
          }
        }
      },

      initialize: function () {
        XM.Model.prototype.initialize.apply(this, arguments);
        this.meta = new Backbone.Model({
          executionDay: 1,
          materials: new XM.WorkOrderMaterialsCollection(),
          operationQuantity: 0,
          unitsPerMinute: "_na".loc(),
          minutesPerUnit: "na".loc()
        });

        // Important for parent/child handling in views.
        this.meta.get("materials").operation = this;
        this.meta.on("add:materials", this.materialAdded);

        // Users can edit this meta attribute, so handle response on regular attrs.
        this.meta.on("change:executionDay", this.calculateScheduled, this);
      },

      isActive: function () {
        return !this.get("isRunComplete") &&
          this.getValue("workOrder.status") !== XM.WorkOrder.CLOSED_STATUS;
      },

      isStarted: function () {
        var timeClockHistory = this.getValue("workOrder.timeClockHistory"),
          that = this;

        return _.some(timeClockHistory.models, function (entry) {
          return entry.get("operation").id === that.id;
        });
      },

      isReceiveInventoryChanged: function () {
        var isReceiveInventory = this.get("isReceiveInventory"),
          workOrder = this.get("workOrder"),
          routings,
          that = this,
          resetReceiveInventory = function (operation) {
            if (that.id !== operation.id) {
              operation.set("isReceiveInventory", false);
            }
          };

        // There can only be one with this setting
        if (isReceiveInventory && workOrder) {
          routings = this.getValue("workOrder.routings");
          routings.each(resetReceiveInventory);
        }
      },

      /**
        Synchronize operation materials with work order materials list.
      */
      materialAdded: function (model) {
        var workOrder = this.get("workOrder"),
          workOrderMaterials = workOrder.get("workOrder.materials");

        // Materials added here should always relate to this operation
        // and resync if that changes.
        model.set("operation", this);
        model.on("change:operation", this.buildMaterials, this);

        workOrder.off("add:materials remove:materials", this.buildMaterials, this);
        workOrderMaterials.add(model);
        workOrder.on("add:materials remove:materials", this.buildMaterials, this);
      },

      runTimeChanged: function () {
        var runTime = this.get("runTime"),
          runConsumed = this.get("runConsumed"),
          scale = XT.MINUTES_SCALE,
          runRemaining = XT.math.subtract(runTime, runConsumed, scale);

        this.set("runRemaining", runRemaining < 0 ? 0 : runRemaining);
      },

      setupTimeChanged: function () {
        var setupTime = this.get("setupTime"),
          setupConsumed = this.get("setupConsumed"),
          scale = XT.MINUTES_SCALE,
          setupRemaining = XT.math.subtract(setupTime, setupConsumed, scale);

        this.set("setupRemaining", setupRemaining < 0 ? 0 : setupRemaining);
      },

      standardOperationChanged: function () {
        var standardOperation = this.get("standardOperation"),
          attrs;

        if (standardOperation) {
          attrs = {
            description1: standardOperation.get("description1"),
            description2: standardOperation.get("description2"),
            toolingReference: standardOperation.get("toolingReference"),
            instructions: standardOperation.get("instructions"),
            workCenter: standardOperation.get("workCenter"),
          };

          if (standardOperation.get("standardTimes")) {
            _.extend(attrs, {
              setupTime: standardOperation.get("setupTime"),
              runTime: standardOperation.get("runTime"),
              productionUnit: standardOperation.get("productionUnit"),
              productionUnitRatio: standardOperation.get("productionUnitRatio")
            });
          }

          this.set(attrs);
        }
      },

      statusReadyClean: function () {
        var status = this.getValue("workOrder.status");

        if (status === XM.WorkOrder.CLOSED_STATUS) {
          this.setReadOnly();
        } else if (this.isStarted()) {
          this.setReadOnly([
            "standardOperation",
            "description1",
            "description2",
            "toolingReference",
            "productionUnit",
            "productionUnitRatio",
            "workCenter"
          ]);
        }

        this.workOrderChanged();
        this.calculateExecutionDay();
        this.buildMaterials();
      },

      workOrderChanged: function () {
        var workOrder = this.get("workOrder"),
         sequence = this.get("sequence"),
         productionUnit = this.get("productionUnit"),
         attrs = {},
         sequenceArray,
         maxSequence;

        if (!this.isReady()) { return; } // Can't silence backbone relation events

        // Set next sequence to be 10 more than the highest living model
        if (workOrder && !sequence) {
          sequenceArray = _.compact(_.map(workOrder.get("routings").models, function (model) {
            return model.isDestroyed() ? null : model.get("sequence");
          }));
          maxSequence = sequenceArray.length > 0 ? Math.max.apply(null, sequenceArray) : 0;
          attrs.sequence = maxSequence + 10;

          if (!productionUnit) {
            attrs.productionUnit = workOrder.getValue("item.inventoryUnit.name");
          }
          this.set(attrs);

          this.calculateScheduled();
        }

        // Keep work order collections synchronized with local one
        if (workOrder) {
          workOrder.on("add:materials remove:materials", this.buildMaterials, this);
          this.meta.on("change:operationQuantity", workOrder.buildTree, workOrder);
        }

        this.calculateOperationQuantity()
            .calculateThroughput();
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

      couldDestroy: function (callback) {
        var hasPrivilege = XT.session.privileges.get("MaintainWorkOrders"),
          status = this.getValue("status"),
          K = XM.WorkOrder;

        if (callback) {
          callback(hasPrivilege &&
            (status === XM.WorkOrder.OPEN_STATUS ||
             status === XM.WorkOrder.EXPLODED_STATUS));
        }
        return this;
      },

      canIssueMaterial: function (callback) {
        var hasPrivilege = XT.session.privileges.get("IssueWoMaterials"),
          status = this.getValue("status"),
          K = XM.WorkOrder;

        if (callback) {
          callback(hasPrivilege &&
            (status === K.RELEASED_STATUS ||
             status === K.INPROCESS_STATUS));
        }
        return this;
      },

      canPostProduction: function (callback) {
        var hasPrivilege = XT.session.privileges.get("PostProduction"),
          status = this.getValue("status"),
          K = XM.WorkOrder;

        if (callback) {
          callback(hasPrivilege &&
            (status === K.RELEASED_STATUS ||
             status === K.INPROCESS_STATUS));
        }
        return this;
      },

      destroy: function (options) {
        this.dispatch("XM.WorkOrder", "delete", this.id, options);
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
    XM.WorkOrderMaterialsCollection = XM.Collection.extend(
      /** @lends XM.WorkOrderMaterialsCollection.prototype */{

      model: XM.WorkOrderMaterial

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
