/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true, Globalize:true, console:true, async:true*/

(function () {
  "use strict";

  XT.extensions.inventory.initInventoryModels = function () {

    XM.InvoiceAndReturnInventoryMixin = {
      // like sales order, minus shipto phone
      shiptoAttrArray: [
        "shiptoName",
        "shiptoAddress1",
        "shiptoAddress2",
        "shiptoAddress3",
        "shiptoCity",
        "shiptoState",
        "shiptoPostalCode",
        "shiptoCountry",
        "shiptoPhone"
      ],

      handlers: {
        'change:customer': 'customerDidChange',
        'change:freight': 'calculateTotalTax',
        'change:shipto': 'shiptoDidChange',
        'change:shiptoName': 'shiptoAddressDidChange',
        'change:shiptoAddress1': 'shiptoAddressDidChange',
        'change:shiptoAddress2': 'shiptoAddressDidChange',
        'change:shiptoAddress3': 'shiptoAddressDidChange',
        'change:shiptoCity': 'shiptoAddressDidChange',
        'change:shiptoState': 'shiptoAddressDidChange',
        'change:shiptoPostalCode': 'shiptoAddressDidChange',
        'change:shiptoCountry': 'shiptoAddressDidChange'
      },

      extraSubtotalFields: ["freight"],

      defaults: function () {
        return {freight: 0};
      },

      applyCustomerSettings: function () {
        var customer = this.get("customer"),
          isFreeFormShipto = customer ? customer.get("isFreeFormShipto") : false;

        // Set read only state for free form shipto
        this.setReadOnly(this.shiptoAttrArray, !isFreeFormShipto);
      },

      applyIsPostedRules: function () {
        this.setReadOnly(["freight", "shipZone", "shipCharge", "shipTo"], this.get("isPosted"));
      },

      copyBilltoToShipto: function () {
        this.set({
          shipto: null,
          shiptoName: this.get("billtoName"),
          shiptoAddress1: this.get("billtoAddress1"),
          shiptoAddress2: this.get("billtoAddress2"),
          shiptoAddress3: this.get("billtoAddress3"),
          shiptoCity: this.get("billtoCity"),
          shiptoState: this.get("billtoState"),
          shiptoZip: this.get("billtoZip"),
          shiptoPostalCode: this.get("billtoPostalCode"),
          shiptoCountry: this.get("billtoCountry"),
          taxZone: this.get("customer") && this.getValue("customer.taxZone")
        }, {silent: true});
        // we don't want an avanlance of triggers here, but we do want to update the view
        this.trigger("change", this);
      },

      customerDidChange: function () {
        var customer = this.get("customer"),
          defaultShipto;

        if (!customer) {
          return;
        }

        defaultShipto = customer.getDefaultShipto();
        if (defaultShipto) {
          this.set("shipto", defaultShipto.attributes);
        }
        this.applyCustomerSettings();
      },

      /**
        Populate shipto defaults. Similar to the one on sales order
      */
      shiptoDidChange: function () {
        var shipto = this.get("shipto"),
          shiptoAddress = shipto ? shipto.get("address") : false,
          shiptoAttrs;

        if (!shipto) {
          this.unset("shiptoName")
            .unset("shiptoAddress1")
            .unset("shiptoAddress2")
            .unset("shiptoAddress3")
            .unset("shiptoCity")
            .unset("shiptoState")
            .unset("shiptoPostalCode")
            .unset("shiptoCountry");

          return;
        }

        shiptoAttrs = {
          shiptoName: shipto.get("name"),
          salesRep: shipto.get("salesRep"),
          commission: shipto.get("commission"),
          taxZone: shipto.get("taxZone"),
          shipZone: shipto.get("shipZone")
        };
        if (shiptoAddress) {
          _.extend(shiptoAttrs, {
            shiptoAddress1: shiptoAddress.getValue("line1"),
            shiptoAddress2: shiptoAddress.getValue("line2"),
            shiptoAddress3: shiptoAddress.getValue("line3"),
            shiptoCity: shiptoAddress.getValue("city"),
            shiptoState: shiptoAddress.getValue("state"),
            shiptoPostalCode: shiptoAddress.getValue("postalCode"),
            shiptoCountry: shiptoAddress.getValue("country")
          });
        }
        this.set(shiptoAttrs, {silent: true});
        // we don't want an avanlance of triggers here, but we do want to update the view
        this.trigger("change", this);
      },

      shiptoAddressDidChange: function () {
        // If the address was manually changed, then clear shipto
        this.unset("shipto", {silent: true});
        // we don't want an avanlance of triggers here, but we do want to update the view
        this.trigger("change", this);
      }

    };

    XM.InventoryAndReturnLineInventoryMixin = {
      handlers: {
        'change:item': 'setUpdateInventoryReadOnly',
        'change:site': 'setUpdateInventoryReadOnly'
      },

      initialize: function () {
        this.setUpdateInventoryReadOnly();
      },

      setUpdateInventoryReadOnly: function () {
        if (!this.getParent() || this.getParent().get("isPosted") || !this.get("item") || !this.get("site")) {
          this.setReadOnly("updateInventory", true);
          return;
        }

        var that = this,
          itemSiteColl = new XM.ItemSiteCollection(),
          success = function () {
            var isJobCost = itemSiteColl.length > 0 && itemSiteColl.models[0].get("costMethod") ===
              XM.ItemSite.JOB_COST;

            that.setReadOnly("updateInventory", isJobCost);
          },
          options = {
            query: {
              parameters: [{
                attribute: "item",
                value: this.get("item").id
              }, {
                attribute: "site",
                value: this.get("site").id
              }]
            },
            success: success
          };

        itemSiteColl.fetch(options);
      }
    };

    XM.InvoiceAndReturnListItemMixin = {
      doPostWithInventory: function () {
        var that = this,
          transWorkspace = that.transParams.transWorkspace,
          transDate = that.get(that.transParams.transDate),
          oldPost = that.transParams.oldPost,
          sourceDocName = that.transParams.sourceDocName,
          transQtyAttrName = that.transParams.transQtyAttrName,
          qtyAttrName = that.transParams.qtyAttrName,
          gatherDistributionDetail = function (lineArray) {
            var processLine = function (line, done) {
              var details;

              if (!line.invControl) {
                // XXX do not open up a workspace if the line is not under
                // inventory control.
                done(null, {
                  id: line.uuid,
                  quantity: line.quantity // qty from line item ("Returned" / "Billed")
                });
                return;
              }
              // Workspace detail - XV.IssueStockWorkspace / XV.EnterReceiptWorkspace
              details = {
                workspace: transWorkspace,
                id: line.uuid,
                // Make qty field readOnly because it is set on doc. User will distribute detail.
                success: function () {
                  if (this.value) {
                    this.value.setReadOnly(transQtyAttrName);
                  }
                },
                callback: function (workspace) {
                  var lineModel = workspace.value; // must be gotten before doPrevious
                  workspace.doPrevious();
                  done(null, lineModel);
                }
              };
              // TODO: this will not stand
              XT.app.$.postbooks.addWorkspace(null, details);
            };
            // Now map all the "updateInventory" line items populate dispatch params
            async.mapSeries(lineArray, processLine, function (err, results) {
              var params = _.map(results, function (result) {
                var detail;
                if (result.get) {
                  // Detail is a nested model on Returns, whereas in Invoices it is nested inside itemSite.
                  if (sourceDocName === "XM.Return") {
                    detail = result.get("detail").models;
                  } else if (sourceDocName === "XM.Invoice") {
                    detail = _.filter(result.getValue("itemSite.detail").models, function (det) {
                      return det.get("distributed") > 0;
                    });
                  }
                } else { detail = undefined; }

                return {
                  lineItem: result.id,
                  quantity: result.quantity || result.get(transQtyAttrName),
                  options: {
                    post: true,
                    asOf: transDate,
                    detail: detail ? detail.map(function (detail) {
                      return {
                        quantity: detail.get("distributed") || detail.get("quantity"),
                        location: detail.getValue("location.uuid") || undefined,
                        trace: detail.getValue("trace.number") || undefined
                      };
                    }) : undefined
                  }
                };
              }),
              dispatchSuccess = function (result, options) {
                // XXX - Not working!
                that.notify("_success!".loc());
              },
              dispatchError = function () {
                console.log("dispatch error", arguments);
              };

              that.dispatch(sourceDocName, "postWithInventory", [that.id, params], {
                success: dispatchSuccess,
                error: dispatchError
              });
            });
          },
          dispatchSuccess = function (lineArray) {
            if (lineArray.length === 0) {
              // TODO - Test to make sure this works
              // this return is not under inventory control, so we can post per usual
              oldPost.apply(that, arguments);
            } else {
              gatherDistributionDetail(lineArray);
            }
          },
          dispatchError = function () {
            console.log("dispatch error", arguments);
          };
        this.dispatch(sourceDocName, "getControlledLines", [that.id], {
          success: dispatchSuccess,
          error: dispatchError
        });
      }
    };

    /**
      @class

      @extends XM.Model
    */
    XM.InventoryAvailability = XM.Model.extend({

      recordType: "XM.InventoryAvailability",

      canCreatePurchaseOrders: function (callback) {
        var itemSources = new XM.ItemSourceCollection(),
          item = this.get("item"),
          options = {},
          query = {
            parameters: [{attribute: "item", value: item}],
            rowLimit: 1
          },
          afterFetch = function () {
            callback(itemSources.length > 0);
          };

        if (callback) {
          if (this.get("isPurchased")) {
            options.success = afterFetch;
            options.query = query;
            itemSources.fetch(options);
          } else {
            callback(false);
          }
        }
        return this;
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.Distribution = XM.Model.extend({

      recordType: "XM.Distribution",

      parentKey: "itemSite",

      readOnlyAttributes: [
        "location",
        "trace",
        "expireDate",
        "warrantyDate",
        "characteristic"
      ],

      requiredAttributes: [
        "quantity"
      ],

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('change:' + this.parentKey, this.handleNew);
        this.on('status:READY_CLEAN', this.statusReadyClean);
      },

      // Copied model destroy method, take out options
      // to override destroy for Post Production's meta collection
      destroy: function (options) {
        options = options ? _.clone(options) : {};
        var klass = this.getClass(),
          canDelete = klass.canDelete(this),
          success = options.success,
          isNew = this.isNew(),
          model = this,
          result,
          K = XM.Model,
          parent = this.getParent(true),
          children = [],
          findChildren = function (model) {
            _.each(model.relations, function (relation) {
              var i,
                attr = model.attributes[relation.key];
              if (attr && attr.models && relation.type === Backbone.HasMany) {
                for (i = 0; i < attr.models.length; i += 1) {
                  findChildren(attr.models[i]);
                }
                children = _.union(children, attr.models);
              }
            });
          };
        if ((parent && parent.canUpdate(this)) ||
            (!parent && canDelete) ||
             this.getStatus() === K.READY_NEW) {
          this._wasNew = isNew; // Hack so prototype call will still work
          this.setStatus(K.DESTROYED_DIRTY, {cascade: true});

          // If it's top level commit to the server now.
          if ((!parent && canDelete) || isNew) {
            findChildren(this); // Lord Vader ... rise
            this.setStatus(K.BUSY_DESTROYING, {cascade: true});
            options.wait = true;
            options.success = function (resp) {
              var i;
              // Do not hesitate, show no mercy!
              for (i = 0; i < children.length; i += 1) {
                children[i].didDestroy();
              }
              if (XT.session.config.debugging) {
                XT.log('Destroy successful');
              }
              if (success) { success(model, resp, options); }
            };
            // XXX - If no parent (due to use of meta) take out options var,
            // because destroy is not successful with no parent.
            if (!parent) {
              result = Backbone.Model.prototype.destroy.call(this);
            } else {
              result = Backbone.Model.prototype.destroy.call(this, options);
            }
            delete this._wasNew;
            return result;

          }

          // Otherwise just marked for deletion.
          if (success) {
            success(this, null, options);
          }
          return true;
        }
        XT.log('Insufficient privileges to destroy');
        return false;
      },

      // Set readOnly and defaults for new distribution.
      handleNew: function (parent) {
        if (!this.getParent() && !this.collection) {
          return;
        }
        if (this.getParent()) {
          parent = this.getParent();
        }
        var undistributed = parent.undistributed(),
          location = parent.getValue("itemSite.locationControl"),
          warranty = parent.getValue("itemSite.warranty"),
          perishable = parent.getValue("itemSite.perishable"),
          controlMethod = parent.getValue("itemSite.controlMethod"),
          isReceiveLocationAuto = parent.getValue("itemSite.receiveLocationAuto"),
          receiveLocation,
          K = XM.ItemSite,
          trace = controlMethod === K.LOT_CONTROL || controlMethod === K.SERIAL_CONTROL;

        if (trace) {
          this.requiredAttributes.push("trace");
          this.setReadOnly("trace", false);
        }
        if (location) {
          this.requiredAttributes.push("location");
          if (isReceiveLocationAuto) {
            receiveLocation = parent.getValue("itemSite.receiveLocation");
            this.set("location", receiveLocation);
          } else {
            this.setReadOnly("location", false);
          }
        }
        if (perishable) {
          this.requiredAttributes.push("expireDate");
          this.setReadOnly("expireDate", false);
        }
        if (warranty) {
          this.requiredAttributes.push("warrantyDate");
          this.setReadOnly("warrantyDate", false);
        }
        this.set("quantity", undistributed);
        return this;
      },

      // Get to handleNew this way when parent is accessed via collection
      statusReadyClean: function () {
        var parent = this.getParent() || (this.collection ? this.collection.parent : null);
        if (parent) {
          this.handleNew(parent);
        }
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.EnterReceipt = XM.Model.extend(_.extend({}, XM.TransactionMixin, {

      recordType: "XM.EnterReceipt",

      quantityAttribute: "toReceive",

      quantityTransactedAttribute: "atReceiving",

      issueMethod: "transactItem",

      readOnlyAttributes: [
        "atReceiving",
        "received",
        "itemSite",
        "order",
        "ordered",
        "returned",
        "received",
        "scheduleDate",
        "undistributed",
        "site",
        "unitCost",
        "extCost",
        "notes",
        "balance"
      ],

      handlers: {
        "status:READY_CLEAN": "statusReadyClean"
      },

      // TODO - distribution detail is not stored in the db until it's refactored.
      canPrintLabels: function (callback) {
        if (callback) {
          callback(this.get("atReceiving") > 0);
        }
        return this.get("atReceiving") > 0;
      },

      canReceiveItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("EnterReceipts");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      },

      /**
        Receipts can't be returned (yet).
      */
      canReturnItem: function (callback) {
        if (callback) {
          callback(false);
        }
        return this;
      },

      extCost: function () {
        var unitCost = this.get("unitCost"),
          toReceive = this.get("toReceive"),
          extCost = (unitCost * toReceive);
        return XT.toExtendedPrice(extCost);
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

      formatStatus: function () {
        var balance = this.getValue("balance"),
          scanned = this.getValue("itemScan") || this.getValue("traceScan") ||
            this.getValue("locationScan");

        if (scanned) {
          this.meta.get("metaStatus").code = "P";
          this.meta.get("metaStatus").description = "_pickFrom".loc();
          this.meta.get("metaStatus").order = 1;
          this.meta.get("metaStatus").color = "#7ebe7e";
          return "P";
        } else if (balance > 0) {
          this.meta.get("metaStatus").code = "I";
          this.meta.get("metaStatus").description = "_inTruck".loc();
          this.meta.get("metaStatus").order = 2;
          this.meta.get("metaStatus").color = "#edd89e";
          return "I";
        } else if (balance <= 0) {
          this.meta.get("metaStatus").code = "F";
          this.meta.get("metaStatus").description = "_fulfilled".loc();
          this.meta.get("metaStatus").order = 3;
          this.meta.get("metaStatus").color = "#7579a4";
          return "F";
        }
      },

      getPrintParameters: function (callback) {
        var that = this,
          dispOptions = {};

        dispOptions.success = function (resp) {
          var id = resp;

          callback({
            id: id,
            reportName: "ReceivingLabel", //TODO - get from XM.Sales.getFormReportName
            printParameters: [
              {name: "orderitemid", type: "integer", value: id},
              {name: "vendorItemLit", type: "string", value: " "}, // TODO - vendor item number
              {name: "ordertype", type: "string", value: that.getValue("order.orderType")}
            ]
          });
        };

        XM.ModelMixin.dispatch('XM.Model', 'fetchPrimaryKeyId', this.getValue("uuid"), dispOptions);
      },

      handleReturns: function () {
        if (this.getValue("order.orderType") === XM.Order.CREDIT_MEMO) {
          this.set("toReceive", this.get("balance"));
        }
      },

      name: function () {
        return this.get("order") + " #" + this.get("lineNumber");
      },

      statusReadyClean: function () {
        this.handleReturns();
      },

      toReceiveChanged: function () {
        var undistributed = this.undistributed();
        if (undistributed > 0) {
          // There is qty to distribute, bubble an event to "tap" the new button on the detail box.
          //this.$.detail.newItem();
        } else if (undistributed < 0) {
          this.error(this.getValue(), XT.Error.clone("xt2026"));
        }
      },

      /**
        Return the quantity of items that require detail distribution.

        @returns {Number}
      */
      undistributed: function () {
        var toReceive = this.get(this.quantityAttribute),
          scale = XT.QTY_SCALE,
          undist = 0,
          dist;
        // We only care about distribution on controlled items
        if (this.requiresDetail() && toReceive) {
          // Get the distributed values
          dist = _.compact(_.pluck(_.pluck(this.getValue("detail").models, "attributes"), "quantity"));
          if (XT.math.add(dist, scale) > 0) {
            undist = XT.math.add(dist, scale);
          }
          undist = XT.math.subtract(toReceive, undist, scale);
        }
        this.set("undistributed", undist);
        return undist;
      },

      /**
        Unlike most validations on models, this one accepts a callback
        into which will be forwarded a boolean response. Errors will
        trigger `invalid`.

        @param {Function} Callback
        @returns {Object} Receiver
        */
      validate: function (callback) {
        var toReceive = this.get("toReceive"),
          ordered = this.get("ordered"),
          err;

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toReceive <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (toReceive !== ordered) {
          this.notify("_receiveQtyVar".loc(), {
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
      }

    }));

    /**
      @class

      @extends XM.Model
    */
    XM.InventoryHistory = XM.Model.extend({

      recordType: "XM.InventoryHistory",

      readOnlyAttributes: [
        "getOrderTypeString",
        "getTransactionTypeString",
        "formatCreateTime",
        "formatCreateDate"
      ],

      nameAttribute: "itemSite.item.number",

      formatOrderType: function () {
        switch (this.get("orderType"))
        {
        case "SO":
          return "_salesOrder".loc();
        case "PO":
          return "_purchaseOrder".loc();
        case "WO":
          return "_workOrder".loc();
        case "EX":
          return "_expense".loc();
        case "AD":
          return "_adjustment".loc();
        case "RX":
          return "_materialReceipt".loc();
        case "TO":
          return "_transferOrder".loc();
        case "Misc":
          return "_miscellaneous".loc();
        default:
          return "";
        }
      },

      formatTransactionType: function () {
        switch (this.get("transactionType"))
        {
        case "SH":
          return "_issueToShipping".loc();
        case "RS":
          return "_returnFromShipping".loc();
        case "IM":
          return "_issueMaterial".loc();
        case "CC":
          return "_cycleCount".loc();
        case "RP":
          return "_receivePurchaseOrder".loc();
        case "RM":
          return "_receiveMaterial".loc();
        case "EX":
          return "_expense".loc();
        case "AD":
          return "_adjustment".loc();
        case "RX":
          return "_materialReceipt".loc();
        case "TW":
          return "_siteTransfer".loc();
        case "RB":
          return "_receiveBreeder".loc();
        case "IB":
          return "_issueBreeder".loc();
        case "RL":
          return "_relocate".loc();
        case "RR":
          return "_receiveReturn".loc();
        default:
          return "";
        }
      },

      formatCostMethod: function () {
        var costMethod = this.get("costMethod");

        switch (costMethod)
        {
        case XM.ItemSite.STANDARD_COST:
          return "_standard".loc();
        case XM.ItemSite.AVERAGE_COST:
          return "_average".loc();
        case XM.ItemSite.JOB_COST:
          return "_job".loc();
        case XM.ItemSite.NO_COST:
          return "_None".loc();
        default:
          return costMethod;
        }
      },

      formatCreateDate: function () {
        var created = XT.date.applyTimezoneOffset(this.get("created"));
        return Globalize.format(created, "d");
      },

      formatCreateTime: function () {
        var created = XT.date.applyTimezoneOffset(this.get("created"));
        return Globalize.format(created, "t");
      },

      formatTransactionTime: function () {
        var transacted = XT.date.applyTimezoneOffset(this.get("transactionTime"));
        return Globalize.format(transacted, "t");
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.InventoryDetail = XM.Model.extend({

      recordType: "XM.InventoryDetail"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.IssueToShipping = XM.Model.extend(_.extend({}, XM.TransactionMixin, {

      recordType: "XM.IssueToShipping",

      quantityAttribute: "toIssue",

      quantityTransactedAttribute: "atShipping",

      issueMethod: "issueItem",

      readOnlyAttributes: [
        "atShipping",
        "balance",
        "item",
        "order",
        "ordered",
        "returned",
        "site",
        "shipment",
        "shipped",
        "unit",
        "qohOtherWhs"
      ],

      name: function () {
        return this.get("order") + " #" + this.get("lineNumber");
      },

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);

        // Bind events
        this.on("statusChange", this.statusDidChange);
        this.on("change:toIssue", this.toIssueDidChange);
      },

      canPrintLabels: function (callback) {
        if (callback) {
          callback(this.get("atShipping") > 0);
        }
        return this.get("atShipping") > 0;
      },

      canIssueItem: function (callback) {
        var isShipped = this.getValue("shipment.isShipped") || false,
          hasPrivilege = XT.session.privileges.get("IssueStockToShipping");
        if (callback) {
          callback(!isShipped && hasPrivilege && (
            this.getValue("order.holdType") !== XM.SalesOrder.SHIPPING_HOLD_TYPE
          ));
        }
        return this;
      },

      canIssueLine: function (callback) {
        var isShipped = this.getValue("shipment.isShipped") || false,
          hasPrivilege = XT.session.privileges.get("IssueStockToShipping"),
          hasQtyToIssue = this.getValue("ordered") > this.getValue("atShipping");
        if (callback) {
          callback(!isShipped && hasPrivilege && hasQtyToIssue);
        }
        return this;
      },

      canReturnItem: function (callback) {
        var isShipped = this.getValue("shipment.isShipped") || false,
          hasPrivilege = XT.session.privileges.get("ReturnStockFromShipping"),
          atShipping = this.get("atShipping");
        if (callback) {
          callback(!isShipped && atShipping > 0 && hasPrivilege);
        }
        return this;
      },

      getPrintParameters: function (callback) {
        var that = this,
          dispOptions = {},
          dispParams = [{"uuid": this.getValue("uuid")}, {"uuid": this.getValue("order.uuid")}];

        dispOptions.success = function (resp) {
          var id = resp;

          callback({
            id: id[0],
            reportName: "ShippingLabelsBySo", //TODO - get from XM.Sales.getFormReportName
            printParameters: [
              {name: "soitem_id", type: "integer", value: id[0]},
              {name: "sohead_id", type: "integer", value: id[1]},
              {name: "labelFrom", type: "integer", value: 1},
              {name: "labelTo", type: "integer", value: 1}
            ]
          });
        };

        XM.ModelMixin.dispatch('XM.Model', 'fetchPrimaryKeyId', dispParams, dispOptions);
      },

      /**
        Calculate the balance remaining to issue.

        @returns {Number}
      */
      issueBalance: function () {
        var balance = this.get("balance"),
          atShipping = this.get("atShipping"),
          toIssue = XT.math.subtract(balance, atShipping, XT.QTY_SCALE);
        return toIssue >= 0 ? toIssue : 0;
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
        } else if (toIssue > this.issueBalance()) {
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

      statusDidChange: function () {
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.set("toIssue", this.issueBalance());

          if (this.requiresDetail() && !(this.getValue("itemSite.detail").models.length)) {
            this.notify("_zeroDetailQOH".loc(), {
              type: XM.Model.NOTICE
            });
          }
        }
      },

      toIssueDidChange: function () {
        this.distributeToDefault();
      }

    }));

    /**
      @class

      @extends XM.Model
    */
    XM.ScrapTransaction = XM.Model.extend(_.extend({}, XM.TransactionMixin, {

      recordType: "XM.ScrapTransaction",

      quantityAttribute: "toScrap",

      nameAttribute: "item.description1",

      keepInHistory: false,

      readOnlyAttributes: [
        "quantityBefore",
        "quantityAfter",
      ],

      handlers: {
        "change:item": "fetchItemSite",
        "change:site": "fetchItemSite"
      },

      quantityAfter: function () {
        var toScrap = this.meta.get("toScrap") || 0,
          qtyBefore = this.get("quantityBefore") || 0,
          qtyAfter = XT.math.subtract(qtyBefore, toScrap, XT.QTY_SCALE);

        return Math.max(qtyAfter, 0);
      },

      fetchItemSite: function () {
        var item = this.get("item"),
          site = this.get("site"),
          itemSites = new XM.ItemSiteInventoryCollection(),
          options = {},
          that = this;

        options.success = function () {
          var itemSite;

          if (itemSites.length) {
            itemSite = itemSites.first();
            that.setValue("itemSite", itemSite);
          }
        };

        options.error = function (resp) {
          XT.log(resp);
        };

        if (item && site) {
          options.query = {
            parameters: [
              {attribute: "item", value: item},
              {attribute: "site", value: site}
            ]
          };

          itemSites.fetch(options);
        }
      },

      itemSiteChanged: function () {
        var itemSite = this.getValue("itemSite");

        if (_.isObject(itemSite)) {
          this.fetch({id: itemSite.id});
          this.meta.set({
            detail: itemSite.get("detail")
          });
        }
      },
      
      validate: function (callback) {
        var toScrap = this.getValue("toScrap"),
          qtyAfter = this.getValue("quantityAfter"),
          err,
          params = {};

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toScrap <= 0 || qtyAfter < 0) {
          err = XT.Error.clone("xt2011");
        }

        if (err) {
          this.trigger("invalid", this, err, {});
          callback(false);
        } else {
          callback(true);
        }
        
        // if our custom validation passes, then just test the usual validation
        return XM.Model.prototype.validate.apply(this, arguments);
      },

      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        var that = this,
          detail = _.compact(_.map(this.getValue("detail").models, function (item) {
              return item.get("distributed") > 0 ? item.toJSON() : null;
            })),
          success,
          transDate = this.getValue("transactionDate") || new Date(),
          params = [
            this.getValue("itemSite.uuid"),
            this.getValue("toScrap"),
            {
              docNumber: this.getValue("documentNumber"),
              notes: this.getValue("notes"),
              transDate: this.getValue("transactionDate"),
              detail: detail
            }
          ],
          scrapTransaction;

        success = options.success;

        // Do not persist invalid models.
        if (!this._validate(this.attributes, options)) { return false; }

        options.success = function () {
          that.clear();
          if (success) { success(); }
        };
        
        options.error = function (resp) {
          XT.log(resp);
        };

        // First validate, then forward to server (dispatch scrapTransaction)
        scrapTransaction = function (params, options) {
          var callback = function (isValid) {
            if (isValid) {
              // Finally scrapTransaction!!!
              that.dispatch("XM.Inventory", "scrapTransaction", params, options);
            }
          };
          that.validate(callback);
        };

        scrapTransaction(params, options);

      },

      initialize: function (attributes, options) {
        var isNew = options && options.isNew,
          that = this;

        options = options ? _.clone(options) : {};
        XM.Model.prototype.initialize.apply(this, arguments);
        if (!this.meta) {
          var coll = new XM.DistributionCollection();
          coll.parent = this;
          this.meta = new Backbone.Model({
            transactionDate: XT.date.today(),
            documentNumber: null,
            itemSite: XM.ItemSiteInventory,
            undistributed: 0.0,
            toScrap: 0.0,
            notes: "",
            detail: coll
          });
          this.meta.on("change:itemSite", this.itemSiteChanged, this);
          this.meta.on("change:toScrap", this.toScrapChanged, this);
        }

      },

      toScrapChanged: function () {
        this.quantityAfter();
        this.setStatus(XM.Model.READY_DIRTY);
      }

    }));

    /**
      @class

      @extends XM.Model
    */
    XM.RelocateInventory = XM.Model.extend(_.extend({}, XM.TransactionMixin, {

      recordType: "XM.RelocateInventory",

      quantityAttribute: "quantity",
      
      nameAttribute: "item.description1",

      keepInHistory: true,

      readOnlyAttributes: [
      ],

      handlers: {
        "change:item": "fetchItemSite",
        "change:site": "fetchItemSite"
      },

      fetchItemSite: function () {
        var item = this.get("item"),
          site = this.get("site"),
          itemSites = new XM.ItemSiteInventoryCollection(),
          options = {},
          that = this;

        options.success = function () {
          var itemSite;

          if (itemSites.length) {
            itemSite = itemSites.first();
            that.setValue("itemSite", itemSite);
          }
        };

        options.error = function (resp) {
          XT.log(resp);
        };

        if (item && site) {
          options.query = {
            parameters: [
              {attribute: "item", value: item},
              {attribute: "site", value: site}
            ]
          };

          itemSites.fetch(options);
        }
      },
      
      itemSiteChanged: function () {
        var itemSite = this.getValue("itemSite");

        if (_.isObject(itemSite)) {
          this.fetch({id: itemSite.id});
        }
      },

      quantityChanged: function () {
        if (this.getValue("quantity") > 0) {
          this.setStatus(XM.Model.READY_DIRTY);
        }
      },
           
      validate: function (callback) {
        var qty = this.getValue("quantity"),
          sourceLoc = _.compact(_.map(this.getValue("source").models, function (model) {
              return model.getValue("isSelected") === true ? model.get("location").id : null;
            }))[0],
          targetLoc = _.compact(_.map(this.getValue("target").models, function (model) {
              return model.getValue("isSelected") === true ? model.id : null;
            }))[0],
          err,
          params = {};

        // Validate Selected Information
        if (qty <= 0) {
          err = XT.Error.clone("xt2011");
        }
        if (!sourceLoc || ! targetLoc) {
          err = XT.Error.clone("inv1003");
        }
        if (sourceLoc === targetLoc) {
          err = XT.Error.clone("inv1004");
        }

        if (err) {
          this.trigger("invalid", this, err, {});
          callback(false);
        } else {
          callback(true);
        }
        return this;
      },

      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        var that = this,
          sourceItemLoc = _.compact(_.map(this.getValue("source").models, function (model) {
              return model.getValue("isSelected") === true ? model.id : null;
            }))[0],
          targetLocation = _.compact(_.map(this.getValue("target").models, function (model) {
              return model.getValue("isSelected") === true ? model.id : null;
            }))[0],
          success,
          transDate = this.getValue("transactionDate") || new Date(),
          params = [
            this.get("uuid"),
            this.getValue("quantity"),
            sourceItemLoc,
            targetLocation,
            {
              notes: this.getValue("notes"),
              transDate: this.getValue("transactionDate"),
              defaultToTarget: this.getValue("defaultToTarget")
            }
          ],
          relocateInventory;

        success = options.success;

        // Do not persist invalid models.
        if (!this._validate(this.attributes, options)) { return false; }

        options.success = function () {
          that.clear();
          if (success) { success(); }
        };
        
        options.error = function (resp) {
          XT.log(resp);
        };

        // First validate, then forward to server (dispatch relocateInventory)
        relocateInventory = function (params, options) {
          var callback = function (isValid) {
            if (isValid) {
              // Finally relocate inventory!!!
              that.dispatch("XM.Inventory", "relocateInventory", params, options);
            }
          };
          that.validate(callback);
        };

        relocateInventory(params, options);

      },

      initialize: function (attributes, options) {
        var isNew = options && options.isNew,
          that = this;

        options = options ? _.clone(options) : {};
        XM.Model.prototype.initialize.apply(this, arguments);
        if (!this.meta) {
          this.meta = new Backbone.Model({
            transactionDate: XT.date.today(),
            itemSite: XM.ItemSiteInventory,
            quantity: 0.0,
            notes: "",
            defaultToTarget: false
          });
          this.meta.on("change:itemSite", this.itemSiteChanged, this);
          this.meta.on("change:quantity", this.quantityChanged, this);
          this.setReadOnly("defaultToTarget", !XT.session.privileges.get("MaintainItemSites"));
        }
      },
      
      showDefaultToTarget: function () {
        return XT.session.settings.get("SetDefaultLocations") || false;
      }

    }));

    /**
      @class

      @extends XM.Model
    */
    XM.LocationInventoryRelation = XM.Model.extend(_.extend({}, XM.TransactionMixin, {

      recordType: "XM.LocationInventoryRelation",

      idAttribute: "uuid",

      parentKey: "itemSite",
      
      readOnlyAttributes: [
        "location",
        "trace",
        "quantity"
      ],
      
      initialize: function (attributes, options) {
        options = options ? _.clone(options) : {};
        XM.Model.prototype.initialize.apply(this, arguments);
        if (!this.meta) {
          this.meta = new Backbone.Model({
            isSelected: false
          });
        }
      }

    }));
    
    /**
      @class

      @extends XM.Model
    */
    XM.LocationTargetRelation = XM.Model.extend(_.extend({}, XM.TransactionMixin, {

      recordType: "XM.LocationTargetRelation",

      idAttribute: "uuid",

      parentKey: "itemSite",
      
      readOnlyAttributes: [
        "location",
        "quantity"
      ],
      
      initialize: function (attributes, options) {
        options = options ? _.clone(options) : {};
        XM.Model.prototype.initialize.apply(this, arguments);
        if (!this.meta) {
          this.meta = new Backbone.Model({
            isSelected: false
          });
        }
      }

    }));
        
    /**
      @class

      @extends XM.Model
    */
    XM.Receipt = XM.Model.extend({

      recordType: "XM.Receipt"

    });

    /**
      Static function to call an inventory transaction function on one or multiple items.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Inventory.transactItem = function (params, options, functionName) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", functionName, params, options);
    };

    /**
      Static function to call return from shipping on a set of multiple items.

      @params {Array} Array of model ids
      @params {Object} Options
    */
    XM.Inventory.returnItem = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", "returnFromShipping", params, options);
    };

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.DistributionCollection = XM.Collection.extend({

      model: XM.Distribution

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.InventoryAvailabilityCollection = XM.Collection.extend({

      model: XM.InventoryAvailability,

      dispatch: true

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.InventoryHistoryCollection = XM.Collection.extend({

      model: XM.InventoryHistory

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.IssueToShippingCollection = XM.Collection.extend({

      model: XM.IssueToShipping

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.EnterReceiptCollection = XM.Collection.extend({

      model: XM.EnterReceipt

    });
    
    /**
      @class

      @extends XM.Collection
    */
    XM.LocationInventoryCollection = XM.Collection.extend({

      model: XM.LocationInventoryRelations

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.LocationTargetCollection = XM.Collection.extend({

      model: XM.LocationTargetRelations

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.RelocateInventoryCollection = XM.Collection.extend({

      model: XM.RelocateInventory

    });

  };

}());

