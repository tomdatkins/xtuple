/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, async:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initManufacturingModels = function () {

    /**
      @class

      @extends XM.Transaction
    */
    XM.IssueMaterialMixin = {

      issueMethod: "issueItem",

      quantityAttribute: "toIssue",

      quantityTransactedAttribute: "issued",

      transactionDate: null,

      isReturn: null,

      keepInHistory: false,

      readOnlyAttributes: [
        "qohBefore",
        "qtyPer",
        "required",
        "issued",
        "unit"
      ],

      handlers: {
        "status:READY_CLEAN": "statusReadyClean",
        "change:toIssue": "toIssueDidChange"
      },

      canReturnItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("ReturnWoMaterials"),
          issued = this.get("issued");
        if (callback) {
          callback(hasPrivilege && issued > 0);
        }
        return this;
      },

      /**
      Returns issue method as a localized string.

      @returns {String}
      */
      getIssueMethodString: function () {
        var K = XM.Manufacturing,
          method = this.get('method');
        if (method === K.ISSUE_PULL) {
          return '_pull'.loc();
        } else if (method === K.ISSUE_PUSH) {
          return '_push'.loc();
        } else if (method === K.ISSUE_MIXED) {
          return '_mixed'.loc();
        }
      },

      qohAfter: function () {
        var qohBefore = this.get("qohBefore"),
          toIssue = this.get("toIssue"),
          qohAfter = XT.math.subtract(qohBefore, toIssue, XT.QTY_SCALE);
        return  qohAfter;
      },

      initialize: function (attributes, options) {
        var that = this,
          itemSiteId = this.getValue("itemSite.id"),
          dispOptions = {},
          detailModels,
          fifoDetail;

        options = options ? _.clone(options) : {};
        XM.Model.prototype.initialize.apply(this, arguments);
        if (this.meta) { return; }

        this.meta = new Backbone.Model();
        if (options.isFetching) { this.setReadOnly("workOrder"); }
        // Get the "oldest" lot
        if (this.requiresDetail()) {
          dispOptions.success = function (resp) {
            if (resp) {
              detailModels = that.getValue("itemSite.detail").models;
              fifoDetail = _.find(detailModels, function (detModel) {
                return detModel.id === resp;
              });
              if (_.isObject(fifoDetail)) {
                that.meta.set("fifoDetail", fifoDetail);
              }
            }
          };
          this.dispatch("XM.Inventory", "getOldestLocationId", itemSiteId, dispOptions);
        }
      },

      /**
        Calculate the balance remaining to issue.

        @returns {Number}
      */
      issueBalance: function () {
        var required = this.get("required"),
          issued = this.get("issued"),
          toIssue = XT.math.subtract(required, issued, XT.QTY_SCALE);

        return Math.max(toIssue, 0); //toIssue >= 0 ? toIssue : 0;
      },

      formatDetail: function () {
        if (this.isReturn) {
          return _.map(this.get("detail").models, function (detail) {
            var obj = { quantity: detail.get("quantity") };

            if (obj.quantity) {
              obj.location = detail.getValue("location.uuid") || undefined;
              obj.trace = detail.getValue("trace.number") || undefined;
              obj.expiration = detail.getValue("expireDate") || undefined;
              obj.warranty = detail.getValue("warrantyDate") || undefined;
            }
            return obj;
          });
        } else {return XM.TransactionMixin.formatDetail.call(this); }
      },

      name: function () {
        return this.getValue("order.name") + " " +
          this.getValue("item.number") + " " +
          this.getValue("site.code");
      },

      /**
        Unlike most validations on models, this one accepts a callback
        into which will be forwarded a boolean response. Errors will
        trigger `invalid`.

        @param {Function} Callback
        @returns {Object} Receiver
        */
      validate: function (callback) {
        var toIssue = this.get("toIssue"),
          err;

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toIssue <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (!this.isReturn && toIssue > this.issueBalance()) {
          this.notify("_issueExcess".loc(), {
            type: XM.Model.QUESTION,
            callback: function (resp) {
              callback(resp.answer);
            }
          });
          return this;
        }

        if (err) {
          this.trigger("invalid", this, err, {});
          callback(false);
        } else {
          callback(true);
        }

        return this;
      },

      statusReadyClean: function () {
        // XXX - TODO - Remove distribution model from BR and replace it with meta.detail
        //var coll = new XM.DistributionCollection();
        //coll.parent = this;
        if (this.isReturn) {
          this.set("toIssue", this.getValue("issued"));
          this.meta.set({
            //transactionDate: XT.date.today(),
            undistributed: 0
            //detail: coll
          });
          this.set("undistributed", this.undistributed());
        } else {
          this.set("toIssue", this.issueBalance());
          if (this.requiresDetail() && !(this.getValue("itemSite.detail").models.length)) {
            this.notify("_zeroDetailQOH".loc(), {
              type: XM.Model.NOTICE
            });
          }
        }
      },

      toIssueDidChange: function () {
        this.qohAfter();
        if (this.isReturn) {
          this.undistributed();
        } else {this.distributeToDefault(); }
      },

      /**
        Return the quantity of items that require detail distribution.

        @returns {Number}
      */
      undistributed: function () {
        if (this.isReturn) {
          var toReturn = this.getValue("toIssue"),
            scale = XT.QTY_SCALE,
            undist = 0,
            dist;

          // We only care about distribution on controlled items
          if (this.requiresDetail() && toReturn) {
            // Get the distributed values
            dist = _.compact(_.pluck(_.pluck(this.getValue("detail").models, "attributes"), "quantity"));
            if (XT.math.add(dist, scale) > 0) {
              undist = XT.math.add(dist, scale);
            }
            undist = XT.math.subtract(toReturn, undist, scale);
          }
          this.setValue("undistributed", undist);
          return undist;
        } else { return XM.TransactionMixin.undistributed.call(this); }
      }

    };

    XM.IssueMaterial = XM.Model.extend(_.extend({}, XM.TransactionMixin, XM.IssueMaterialMixin, {

      recordType: "XM.IssueMaterial",

      canIssueItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("IssueWoMaterials");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      },

      canReturnItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("ReturnWoMaterials"),
          issued = this.get("issued");
        if (callback) {
          callback(hasPrivilege && issued > 0);
        }
        return this;
      }

    }));

    /**
      @class

      @extends XM.Model
    */
    XM.PostProduction = XM.Model.extend(_.extend({}, XM.TransactionMixin, {

      recordType: "XM.PostProduction",

      quantityAttribute: "toPost",

      quantityTransactedAttribute: "received",

      transactionDate: null,

      nameAttribute: "workOrder.name",

      keepInHistory: false,

      readOnlyAttributes: [
        "balance",
        "dueDate",
        "isScrapOnPost",
        "notes",
        "ordered",
        "received",
        "required",
        "status",
        "undistributed"
      ],

      handlers: {
        "change:workOrder": "workOrderChanged"
        //"status:READY_CLEAN": "handleBackflushCheckbox"
      },

      /**
        Calculate the balance remaining to issue.

        @returns {Number}
      */
      balance: function () {
        var ordered = this.get("ordered") || 0,
          received = this.get("received") || 0,
          toPost = XT.math.subtract(ordered, received, XT.QTY_SCALE);

        return Math.max(toPost, 0);
      },

      backflush: function (saveCallback) {
        var order = this.getValue("workOrder.id"),
          quantity = this.getValue("toPost"),
          gatherDistributionDetail,
          dispatchError;

        gatherDistributionDetail = function (lineArray, options) {
          var processLine = function (line, done) {
            var details;
            if (!line.invControl) {
              // Just use the calculated quantity from getControlledLines dispatch
              done(null, {
                id: line.uuid,
                quantity: line.quantity
              });
              return;
            }
            // Open a workspace for user to input trace info
            details = {
              workspace: "XV.IssueMaterialWorkspace",
              id: line.uuid,
              //attributes: {toIssue: line.quantity}, // TODO - pass calculated qty/readOnly
              callback: function (workspace) {
                if (workspace) {
                  var lineModel = workspace.value; // must be gotten before doPrevious
                  workspace.doPrevious();
                  done(null, lineModel);
                } else {
                  return;
                }
              }
            };
            // TODO: this will not stand
            XT.app.$.postbooks.addWorkspace(null, details);
          },
          finish = function (err, results) {
            var params = _.map(results, function (result) {
              return {
                orderLine: result.id,
                quantity: result.quantity || result.get("toIssue"),
                options: {
                  post: true, // Issue Materials always posts the (receipt) transaction right away
                  asOf: result.get ? result.get("transactionDate") : new Date(),
                  detail: result.get && result.getValue("itemSite.detail") ? result.formatDetail() : undefined
                }
              };
            });
            options.saveCallback(params);
          };
          async.mapSeries(lineArray, processLine, finish);
        };

        dispatchError = function () {
          console.log("dispatch error", arguments);
        };

        this.dispatch("XM.WorkOrder", "getControlledLines", [order, quantity], {
          success: gatherDistributionDetail,
          error: dispatchError,
          saveCallback: saveCallback
        });
      },

      // Why?!?!
      clear: function (options) {
        options = options ? _.clone(options) : {};
        if (!options.isFetching) {
          XM.Model.prototype.clear.apply(this, arguments);
        }
        this.set({
          ordered: 0,
          received: 0
        });
        /** This was overriding "status:READY_CLEAN": "handleBackflushCheckbox" handler
        this.off("status:READY_CLEAN", this.statusReadyClean);
        this.setStatus(XM.Model.READY_CLEAN);
        this.on("status:READY_CLEAN", this.statusReadyClean);
        */
      },

      formatDetail: function () {
        return _.map(this.get("detail").models, function (detail) {
          var obj = { quantity: detail.get("quantity") };

          if (obj.quantity) {
            obj.location = detail.getValue("location.uuid") || undefined;
            obj.trace = detail.getValue("trace.number") || undefined;
            obj.expiration = detail.getValue("expireDate") || undefined;
            obj.warranty = detail.getValue("warrantyDate") || undefined;
          }
          return obj;
        });
      },

      handleBackflushCheckbox: function () {
        var isBackflushMaterials = this.get("isBackflushMaterials"),
          materialModels = this.get("materials").models,
          mode = this.getValue("workOrder.mode"),
          K = XM.Manufacturing,
          hasPullItem,
          hasZeroIssMixedItem;

        if (materialModels) {
          hasPullItem = _.find(materialModels, function (model) {
            return model.get("issueMethod") === K.ISSUE_PULL;
          });

          hasZeroIssMixedItem = _.find(materialModels, function (model) {
            return model.get("issueMethod") === K.ISSUE_MIXED && model.get("quantityIssued") <= 0;
          });

          // Copied from postProduction.cpp
          this.setReadOnly("isBackflushMaterials", false);
          this.set("isBackflushMaterials", true);

          if (mode === K.DISASSEMBLY_MODE) {
            this.setReadOnly("isBackflushMaterials", true);
            this.set("isBackflushMaterials", false);
          } else if (hasPullItem) {
            this.setReadOnly("isBackflushMaterials", true);
            this.set("isBackflushMaterials", true);
          } else if (hasZeroIssMixedItem) {
            this.setReadOnly("isBackflushMaterials", false);
            this.set("isBackflushMaterials", true);
          } else {
            this.setReadOnly("isBackflushMaterials", true);
            this.set("isBackflushMaterials", false);
          }
        }
        return;
      },

      initialize: function (attributes, options) {
        options = options ? _.clone(options) : {};
        XM.Model.prototype.initialize.apply(this, arguments);
        if (this.meta) { return; }
        this.meta = new Backbone.Model({
          transactionDate: XT.date.today(),
          undistributed: 0,
          toPost: null,
          isBackflushMaterials: false,
          isCloseOnPost: false,
          isScrapOnPost: false,
          notes: ""
        });
        this.meta.on("change:toPost", this.toPostChanged, this);
        if (options.isFetching) { this.setReadOnly("workOrder"); }
        this.clear(options);
      },

      save: function (key, value, options) {
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        var that = this,
          detail = this.formatDetail(),
          transDate = this.transactionDate || new Date(),
          params = [
            that.get("workOrder").id,
            that.getValue("toPost"),
            {
              asOf: transDate,
              detail: detail,
              closeWorkOrder: that.getValue("isCloseOnPost")
            }
          ],
          postProduction,
          success = function () {
            that.clear();
            options.success();
            console.log("success!");
          };

        // Do not persist invalid models.
        if (!this._validate(this.attributes, options)) { return false; }

        // First validate, then forward to server (dispatch postProduction)
        postProduction = function (params, options) {
          var callback = function (isValid) {
            if (isValid) {
              // Finally postProduction!!!
              that.dispatch("XM.Manufacturing", "postProduction", params, options);
            }
          };
          that.validate(callback, {closeWorkOrder: that.getValue("isCloseOnPost")});
        };

        if (that.getValue("isBackflushMaterials")) { // If backflush checked, go get the details array
          that.backflush(function (backflushDetails) {
            if (backflushDetails) { // Redefine the params to add backflushDetails
              var params = [
                that.get("workOrder").id,
                that.getValue("toPost"),
                {
                  asOf: that.getValue("transactionDate"),
                  detail: detail,
                  closeWorkOrder: that.getValue("isCloseOnPost"),
                  backflushDetails: backflushDetails
                }
              ];
              postProduction(params, options);
            }
          });
        } else { // Don't backflush, we're valid, forward to server
          postProduction(params, options);
        }

      },

      toPostChanged: function () {
        this.setStatus(XM.Model.READY_DIRTY);
        this.balance();
        this.undistributed();
      },

      /**
        Return the quantity of items that require detail distribution.

        @returns {Number}
      */
      undistributed: function () {
        var toPost = this.getValue("toPost"),
          scale = XT.QTY_SCALE,
          undist = 0,
          dist;

        // We only care about distribution on controlled items
        if (this.requiresDetail() && toPost) {
          // Get the distributed values
          dist = _.compact(_.pluck(_.pluck(this.getValue("detail").models, "attributes"), "quantity"));
          if (XT.math.add(dist, scale) > 0) {
            undist = XT.math.add(dist, scale);
          }
          undist = XT.math.subtract(toPost, undist, scale);
        }
        this.set("undistributed", undist);
        return undist;
      },

      /**
        Unlike most validations on models, this one accepts a callback
        into which will be forwarded a boolean response. Errors will
        trigger `invalid`. Options var is used to pass (meta) Close Work Order option

        @param {Function} Callback
        @returns {Object} Receiver
        */
      validate: function (callback, options) {
        var toPost = this.meta.get("toPost"),
          err;

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toPost <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (options.closeWorkOrder) {
          this.notify("_closeWorkOrder".loc(), {
            type: XM.Model.QUESTION,
            callback: function (resp) {
              callback(resp.answer);
            }
          });
          return this;
        }

        if (err) {
          this.trigger("invalid", this, err, {});
          callback(false);
        } else {
          callback(true);
        }
        return this;
      },

      workOrderChanged: function () {
        var workOrder = this.get("workOrder");

        if (_.isObject(workOrder)) {
          this.fetch({id: workOrder.id});
        } else {
          this.clear();
        }
      }

    }));

    /**
      @class

      @extends XM.Model
    */
    XM.ReturnMaterial = XM.Model.extend(_.extend({}, XM.TransactionMixin, XM.IssueMaterialMixin, {

      recordType: "XM.ReturnMaterial",

      quantityAttribute: "toIssue",

      quantityTransactedAttribute: "issued",

      isReturn: true,

      canReturnItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("ReturnWoMaterials"),
          issued = this.get("issued");
        if (callback) {
          callback(hasPrivilege && issued > 0);
        }
        return this;
      }

    }));

    /**
      Static function to call issue material on a set of multiple items.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Manufacturing.transactItem = function (params, options, functionName) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Manufacturing", functionName, params, options);
    };

    /**
      Static function to call return material on a set of multiple items.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Manufacturing.returnItem = function (params, options, functionName) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Manufacturing", "returnMaterial", params, options);
    };

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.IssueMaterialCollection = XM.Collection.extend({

      model: XM.IssueMaterial

    });

  };

}());

