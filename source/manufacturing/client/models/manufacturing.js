/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, async:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initManufacturingModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.PostProduction = XM.Model.extend(_.extend({}, XM.TransactionMixin, {

      recordType: "XM.PostProduction",

      transactionDate: null,

      readOnlyAttributes: [
        "balance",
        "dueDate",
        "isBackflushMaterials",
        "isScrapOnPost",
        "notes",
        "ordered",
        "received",
        "required",
        "status",
        "undistributed"
      ],

      handlers: {
        "change:workOrder": "workOrderChanged",
        "status:READY_CLEAN": "statusReadyClean"
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
        var gatherDistributionDetail = function (lineArray, options) {
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
        },
        dispatchError = function () {
          console.log("dispatch error", arguments);
        };
        this.dispatch("XM.WorkOrder", "getControlledLines", [this.getValue("workOrder.id"), this.getValue("toPost")], {
          success: gatherDistributionDetail,
          error: dispatchError,
          saveCallback: saveCallback
        });
      },

      clear: function (options) {
        options = options ? _.clone(options) : {};
        if (!options.isFetching) {
          XM.Transaction.prototype.clear.apply(this, arguments);
        }
        this.set({
          ordered: 0,
          received: 0
        });
        this.off("status:READY_CLEAN", this.statusReadyClean);
        this.setStatus(XM.Model.READY_CLEAN);
        this.on("status:READY_CLEAN", this.statusReadyClean);
      },

      initialize: function (attributes, options) {
        options = options ? _.clone(options) : {};
        XM.Transaction.prototype.initialize.apply(this, arguments);
        if (this.meta) { return; }
        this.meta = new Backbone.Model();
        this.meta.on("change:toPost", this.toPostChanged, this);
        if (options.isFetching) { this.setReadOnly("workOrder"); }
        this.clear(options);
      },

      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        var that = this,
          detail = this.getValue("detail"),
          success,
          transDate = this.transactionDate || new Date(),
          params = [
            this.get("workOrder").id,
            this.getValue("toPost"),
            {
              asOf: this.getValue("transactionDate"),
              detail: detail.toJSON(),
              closeWorkOrder: options.closeWorkOrder
            }
          ],
          postProduction;

        success = options.success;

        // Do not persist invalid models.
        if (!this._validate(this.attributes, options)) { return false; }

        options.success = function () {
          that.clear();
          if (success) { success(); }
        };

        // First validate, then forward to server (dispatch postProduction)
        postProduction = function (params, options) {
          var callback = function (isValid) {
            if (isValid) {
              // Finally postProduction!!!
              that.dispatch("XM.Manufacturing", "postProduction", params, options);
            }
          };
          that.validate(callback, {closeWorkOrder: options.closeWorkOrder});
        };

        if (options.backflush) { // If backflush checked, go get the details array
          that.backflush(function (backflushDetails) {
            if (backflushDetails) { // Redefine the params to add backflushDetails
              var params = [
                that.get("workOrder").id,
                that.getValue("toPost"),
                {
                  asOf: that.getValue("transactionDate"),
                  detail: detail.toJSON(),
                  closeWorkOrder: options.closeWorkOrder,
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

      statusReadyClean: function () {
        var coll = new XM.DistributionCollection();
        coll.parent = this;
        this.meta.set({
          transactionDate: XT.date.today(),
          undistributed: 0,
          toPost: null,
          isBackflushMaterials: false,
          isCloseOnPost: false,
          isScrapOnPost: false,
          notes: "",
          detail: coll
        });
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
        var toPost = this.meta.get("toPost"),
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

      workOrderChanged: function () {
        var workOrder = this.get("workOrder");

        if (_.isObject(workOrder)) {
          this.fetch({id: workOrder.id});
        } else {
          this.clear();
        }
      }

    }));

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

      @extends XM.Transaction
    */
    XM.IssueMaterialMixin = {

      issueMethod: "issueItem",

      quantityAttribute: "toIssue",

      quantityTransactedAttribute: "issued",

      transactionDate: null,

      isReturn: null,

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
        options = options ? _.clone(options) : {};
        XM.Model.prototype.initialize.apply(this, arguments);
        if (this.meta) { return; }
        this.meta = new Backbone.Model();
        if (options.isFetching) { this.setReadOnly("workOrder"); }
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
              obj.loc = detail.getValue("location.uuid") || undefined;
              obj.trace = detail.getValue("trace.number") || undefined;
              obj.expiration = detail.getValue("expireDate") || undefined;
              obj.warranty = detail.getValue("warrantyDate") || undefined;
            }
            return obj;
          });
        } else {return XM.TransactionMixin.formatDetail.call(this); }
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
          this.set("toIssue", null);
          this.meta.set({
            //transactionDate: XT.date.today(),
            undistributed: 0
            //detail: coll
          });
        } else {
          this.set("toIssue", this.issueBalance());
        }
      },

      toIssueDidChange: function () {
        this.distributeToDefault();
        this.qohAfter();
        if (this.isReturn) {
          this.undistributed();
        }
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
        } else { return XM.Transaction.prototype.undistributed.call(this); }
      }

    };

    XM.ReturnMaterial = XM.Model.extend(_.extend({}, XM.TransactionMixin, XM.IssueMaterialMixin, {

      recordType: "XM.IssueMaterial",

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

