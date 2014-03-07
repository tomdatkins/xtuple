/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  XT.extensions.inventory.initParameters = function () {

    // ..........................................................
    // ACTIVITY
    //

    XV.ActivityListParameters.prototype.activityTypes.inventory = [
      {type: "TransferOrder", label: "_transferOrder".loc()},
      {type: "TransferOrderWorkflow", label: "_transferOrderWorkflow".loc()}
    ];

    // ..........................................................
    // ITEM
    //

    enyo.kind({
      name: "XV.TransferOrderItemListParameters",
      kind: "XV.ParameterWidget",
      characteristicsRole: 'isItems',
      components: [
        {kind: "onyx.GroupboxHeader", content: "_item".loc()},
        {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '=',
                value: true
              };
            }
            return param;
          }
        },
        {name: "number", label: "_number".loc(), attr: "number"},
        {name: "description", label: "_description".loc(), attr: ["description1", "description2"]},
        {name: "itemType", label: "_type".loc(), attr: "itemType",
          defaultKind: "XV.ItemTypePicker"},
        {name: "classCode", label: "_classCode".loc(), attr: "classCode",
          defaultKind: "XV.ClassCodePicker"}
      ]
    });

    // ..........................................................
    // INVENTORY AVAILABILITY
    //

    enyo.kind({
      name: "XV.InventoryAvailabilityListParameters",
      kind: "XV.ParameterWidget",
      defaultParameters: function () {
        return {
          days: 0,
          startDate: new Date(),
          endDate: new Date()
        };
      },
      components: [
        {kind: "onyx.GroupboxHeader", content: "_lookAhead".loc()},
        {name: "lookAhead", kind: "XV.PickerWidget",
          collection: "XM.lookAheadOptions",
          label: "_selection".loc(), showNone: false,
          onValueChange: "lookAheadChanged",
          defaultValue: "byLeadTime"},
        {name: "days", label: "_days".loc(),  defaultKind: "XV.NumberWidget",
          disabled: true},
        {name: "startDate", label: "_startDate".loc(),
          defaultKind: "XV.DateWidget"},
        {name: "endDate", label: "_endDate".loc(),
          defaultKind: "XV.DateWidget"},
        {kind: "onyx.GroupboxHeader", content: "_onlyShow".loc()},
        {name: "shortages", label: "_shortages".loc(),
          defaultKind: "XV.CheckboxWidget"},
        {name: "reorderExceptions", label: "_reorderExceptions".loc(),
          defaultKind: "XV.CheckboxWidget"},
        {name: "ignoreZeroReorder", label: "_ignoreReorderAtZero".loc(),
          defaultKind: "XV.CheckboxWidget"},
        {kind: "onyx.GroupboxHeader", content: "_item".loc()},
        {name: "itemWidget", label: "_item".loc(), attr: "item",
          defaultKind: "XV.ItemWidget"},
        {name: "number", label: "_number".loc(), attr: "item"},
        {name: "description", label: "_description".loc(),
          attr: ["item.description1", "item.description2"]},
        {name: "itemType", label: "_type".loc(), attr: "itemType",
          defaultKind: "XV.ItemTypePicker"},
        {name: "sitePicker", label: "_site".loc(), attr: "site",
          defaultKind: "XV.SitePicker"},
        {kind: "onyx.GroupboxHeader", content: "_plannerCode".loc()},
        {name: "plannerCode", label: "_selection".loc(), attr: "plannerCode",
          defaultKind: "XV.PlannerCodePicker"},
        {name: "plannerCodePattern", label: "_code".loc(),
          attr: "plannerCode",
          defaultKind: "XV.InputWidget"},
        {kind: "onyx.GroupboxHeader", content: "_classCode".loc()},
        {name: "classCode", label: "_selection".loc(), attr: "classCode",
          defaultKind: "XV.ClassCodePicker"},
        {name: "classCodePattern", label: "_code".loc(),
          attr: "item.classCode",
          defaultKind: "XV.InputWidget"},
        {kind: "onyx.GroupboxHeader", content: "_vendor".loc()},
        {name: "vendor", label: "_vendor".loc(), attr: "vendor",
          defaultKind: "XV.VendorWidget"},
        {name: "vendorType", label: "_type".loc(), attr: "vendorType",
          defaultKind: "XV.VendorTypePicker"},
        {name: "typePattern", label: "_typePattern".loc(), attr: "vendorType.code"}
      ],
      create: function () {
        this.inherited(arguments);
        this.$.days.setDisabled(true);
        this.$.startDate.setDisabled(true);
        this.$.endDate.setDisabled(true);
        this.$.ignoreZeroReorder.setDisabled(true);
      },
      getParameters: function () {
        var params = this.inherited(arguments),
          lookAhead = this.$.lookAhead.getValue().id,
          shortages = this.$.shortages.getValue(),
          reorderExceptions = this.$.reorderExceptions.getValue(),
          ignoreZeroReorder = this.$.ignoreZeroReorder.getValue();

        params.push({
          attribute: "lookAhead",
          value: lookAhead
        });

        // This work will actually be done on the client because
        // server side processing of this data is too punishing
        if (shortages) {
          params.push({
            attribute: "showShortages",
            value: true
          });
        }

        // These will do at least some server side processing
        // Still much will be done on the client
        if (reorderExceptions) {
          params.push({
            attribute: "useParameters",
            value: true
          });
        }

        if (ignoreZeroReorder) {
          params.push({
            attribute: "reorderLevel",
            operator: ">",
            value: 0
          });
        }

        switch (lookAhead)
        {
        case "byDays":
          params.push({
            attribute: "days",
            value: this.$.days.getValue()
          });
          break;
        case "byDates":
          params.push({
            attribute: "startDate",
            value: this.$.startDate.getValue()
          });
          params.push({
            attribute: "endDate",
            value: this.$.endDate.getValue()
          });
        }

        return params;
      },
      getSelectedValues: function (options) {
        options = options || {};
        var values = this.inherited(arguments),
          lookAhead = this.$.lookAhead.getValue().id,
          days = this.$.days,
          startDate = this.$.startDate,
          endDate = this.$.endDate,
          resolveProp = function (component) {
            return options.name ? component.getName() :
              component.getFilterLabel() || component.getLabel();
          };

        // We don't actually filter by these values, so take them
        // off the filter list.
        delete values[resolveProp(days)];
        delete values[resolveProp(startDate)];
        delete values[resolveProp(endDate)];

        return values;
      },
      lookAheadChanged: function (inSender, inEvent) {
        var lookAhead = this.$.lookAhead.getValue().id;

        switch (lookAhead)
        {
        case "byLeadTime":
          this.$.days.setDisabled(true);
          this.$.startDate.setDisabled(true);
          this.$.endDate.setDisabled(true);
          break;
        case "byDays":
          this.$.days.setDisabled(false);
          this.$.startDate.setDisabled(true);
          this.$.endDate.setDisabled(true);
          break;
        case "byDates":
          this.$.days.setDisabled(true);
          this.$.startDate.setDisabled(false);
          this.$.endDate.setDisabled(false);
        }

        this.doParameterChange();
      },
      parameterChanged: function (inSender, inEvent) {
        var reorderExceptions = this.$.reorderExceptions.getValue(),
          shortages = this.$.shortages.getValue(),
          ignoreZeroReorder = this.$.ignoreZeroReorder.getValue();
  
        switch (inEvent.originator)
        {
        case this.$.reorderExceptions:
          if (reorderExceptions) {
            // Can't do both
            if (shortages) {
              this.$.shortages.setValue(false, {silent: true});
            }
          } else {
            this.$.ignoreZeroReorder.setValue(false, {silent: true});
          }
          this.$.ignoreZeroReorder.setDisabled(!reorderExceptions);
          break;
        case this.$.shortages:
          if (shortages) {
            // Can't do both
            if (reorderExceptions) {
              this.$.reorderExceptions.setValue(false, {silent: true});
            }
            if (ignoreZeroReorder) {
              this.$.ignoreZeroReorder.setValue(false, {silent: true});
            }
            this.$.ignoreZeroReorder.setDisabled(true);
          }
        }
      }
    });

    // ..........................................................
    // INVENTORY HISTORY
    //

    enyo.kind({
      name: "XV.InventoryHistoryListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_dateRange".loc()},
        //TODO are dates working?
        {name: "transactionFromDate", label: "_fromDate".loc(),
          filterLabel: "_transactionDate".loc() + " " + "_fromDate".loc(),
          attr: "transactionDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "transactionToDate", label: "_toDate".loc(),
          filterLabel: "_transactionDate".loc() + " " + "_toDate".loc(),
          attr: "transactionDate", operator: "<=",
          defaultKind: "XV.DateWidget"},
        {kind: "onyx.GroupboxHeader", content: "_plannerCode".loc()},
        {name: "plannerCode", label: "_plannerCode".loc(), attr: "itemSite.plannerCode",
          defaultKind: "XV.PlannerCodePicker"},
        {name: "plannerCodePattern", label: "_plannerCode".loc() + " " + "_pattern".loc(), attr: "itemSite.plannerCode"},
        {kind: "onyx.GroupboxHeader", content: "_classCode".loc()},
        {name: "classCode", label: "_classCode".loc(), attr: "itemSite.item.classCode",
          defaultKind: "XV.ClassCodePicker"},
        {name: "classCodePattern", label: "_classCode".loc() + " " + "_pattern".loc(), attr: "itemSite.item.classCode"},
        {kind: "onyx.GroupboxHeader", content: "_item".loc()},
        {name: "itemNumber", label: "_number".loc(), attr: "itemSite.item.number"},
        {name: "itemDescription", label: "_description".loc(), attr: ["itemSite.item.description1", "itemSite.item.description2"]},
        /*TODO get item groups working - orms, picker
        {kind: "onyx.GroupboxHeader", content: "_itemGroup".loc()},
        {name: "itemGroup", label: "_equals".loc(), attr: "itemSite.item.itemGroups",
          defaultKind: "XV.ItemGroupPicker"},
        {name: "itemGroupPattern", label: "_itemGroup".loc() + " " + "_pattern".loc(), attr: "itemSite.item.itemGroups"},
        {kind: "onyx.GroupboxHeader", content: "_orderNumber".loc()}, */
        {name: "orderNumberPattern", label: "_orderNumber".loc(), attr: "orderNumber"},
        {kind: "onyx.GroupboxHeader", content: "_costCategory".loc()},
        {name: "costCategory", label: "_equals".loc(), attr: "itemSite.costCategory",
          defaultKind: "XV.CostCategoryPicker"},
        {name: "costCategoryPattern", label: "_costCategory".loc() + " " + "_pattern".loc(), attr: "itemSite.costCategory"},
        //TODO SALES ORDER
        //TODO TRANSACTION TYPE
        {kind: "onyx.GroupboxHeader", content: "_site".loc()},
        {name: "site", label: "_site".loc(), attr: "itemSite.site.code", defaultKind: "XV.SitePicker"},
      ]
    });

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueToShippingParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_parameters".loc()},
        {name: "transactionDate", label: "_issueDate".loc(),
          defaultKind: "XV.DateWidget"},
        {name: "order", attr: "order", label: "_order".loc(),
          defaultKind: "XV.IssueToShippingOrderWidget",
          getParameter: function () {
            var param,
             value = this.getValue();
            // If no order build a query that returns nothing
            if (value) {
              param = {
                attribute: "order.uuid",
                operator: "=",
                value: value.id
              };
            } else {
              param = {
                attribute: "lineNumber",
                operator: "=",
                value: -1
              };
            }
            return param;
          }},
        {name: "shipment", label: "_shipment".loc(), defaultKind: "XV.ShipmentWidget"}
      ],
      create: function () {
        this.inherited(arguments);
        this.$.transactionDate.setValue(new Date());
        this.$.shipment.$.input.setDisabled(true);
      }
    });

    // ..........................................................
    // ENTER RECEIPT
    //

    enyo.kind({
      name: "XV.EnterReceiptParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_receipt".loc()},
        {name: "transactionDate", label: "_date".loc(), defaultKind: "XV.DateWidget"},
        {name: "order", attr: "order", label: "_order".loc(), defaultKind: "XV.ReceiptOrderWidget",
        getParameter: function () {
          var param = [],
           value = this.getValue();

          // If no order build a query that returns nothing
          if (value) {
            param = [{
              attribute: "order",
              operator: "=",
              value: value
            },
            {
              attribute: "status",
              value: "O"
            }];
          } else {
            param = {
              attribute: "lineNumber",
              operator: "=",
              value: -1
            };
          }

          return param;
        }}
      ],
      create: function () {
        this.inherited(arguments);
        this.$.transactionDate.setValue(new Date());
      }
    });

    // ..........................................................
    // PLANNED ORDERS
    //

    enyo.kind({
      name: "XV.PlannedOrderListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_item".loc()},
        {name: "itemWidget", label: "_item".loc(), attr: "item",
          defaultKind: "XV.ItemWidget"},
        {name: "number", label: "_number".loc(), attr: "item"},
        {name: "description", label: "_description".loc(),
          attr: ["item.description1", "item.description2"]},
        {name: "itemType", label: "_type".loc(), attr: "item.itemType",
          defaultKind: "XV.ItemTypePicker"},
        {name: "sitePicker", label: "_site".loc(), attr: "site",
          defaultKind: "XV.SitePicker"},
        {kind: "onyx.GroupboxHeader", content: "_plannerCode".loc()},
        {name: "plannerCode", label: "_selection".loc(), attr: "plannerCode",
          defaultKind: "XV.PlannerCodePicker"},
        {name: "plannerCodePattern", label: "_code".loc(),
          attr: "plannerCode",
          defaultKind: "XV.InputWidget"},
        {kind: "onyx.GroupboxHeader", content: "_classCode".loc()},
        {name: "classCode", label: "_selection".loc(), attr: "item.classCode",
          defaultKind: "XV.ClassCodePicker"},
        {name: "classCodePattern", label: "_code".loc(),
          attr: "item.classCode",
          defaultKind: "XV.InputWidget"},
        {kind: "onyx.GroupboxHeader", content: "_startDate".loc()},
        {name: "startFromDate", label: "_fromDate".loc(),
          filterLabel: "_startDate".loc() + " " + "_fromDate".loc(),
          attr: "startDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "startToDate", label: "_toDate".loc(),
          filterLabel: "_startDate".loc() + " " + "_toDate".loc(),
          attr: "startDate", operator: "<=",
          defaultKind: "XV.DateWidget"},
        {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
        {name: "dueFromDate", label: "_fromDate".loc(),
          filterLabel: "_dueDate".loc() + " " + "_fromDate".loc(),
          attr: "dueDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "dueToDate", label: "_toDate".loc(),
          filterLabel: "_dueDate".loc() + " " + "_toDate".loc(),
          attr: "dueDate", operator: "<=",
          defaultKind: "XV.DateWidget"}
      ]
    });

    // ..........................................................
    // PURCHASE REQUESTS
    //

    enyo.kind({
      name: "XV.PurchaseRequestListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_item".loc()},
        {name: "itemWidget", label: "_item".loc(), attr: "item",
          defaultKind: "XV.ItemWidget"},
        {name: "number", label: "_number".loc(), attr: "item"},
        {name: "description", label: "_description".loc(),
          attr: ["item.description1", "item.description2"]},
        {name: "sitePicker", label: "_site".loc(), attr: "site",
          defaultKind: "XV.SitePicker"},
        {kind: "onyx.GroupboxHeader", content: "_plannerCode".loc()},
        {name: "plannerCode", label: "_selection".loc(), attr: "plannerCode",
          defaultKind: "XV.PlannerCodePicker"},
        {name: "plannerCodePattern", label: "_code".loc(),
          attr: "plannerCode",
          defaultKind: "XV.InputWidget"},
        {kind: "onyx.GroupboxHeader", content: "_classCode".loc()},
        {name: "classCode", label: "_selection".loc(), attr: "item.classCode",
          defaultKind: "XV.ClassCodePicker"},
        {name: "classCodePattern", label: "_code".loc(),
          attr: "item.classCode",
          defaultKind: "XV.InputWidget"},
        {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
        {name: "dueFromDate", label: "_fromDate".loc(),
          filterLabel: "_dueDate".loc() + " " + "_fromDate".loc(),
          attr: "dueDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "dueToDate", label: "_toDate".loc(),
          filterLabel: "_dueDate".loc() + " " + "_toDate".loc(),
          attr: "dueDate", operator: "<=",
          defaultKind: "XV.DateWidget"}
      ]
    });

    // ..........................................................
    // SHIPMENT LIST
    //

    enyo.kind({
      name: "XV.ShipmentListItemParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_shipments".loc()},
        {name: "isShipped", attr: "isShipped", label: "_showShipped".loc(), defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '=',
                value: false
              };
            }
            return param;
          }
        },
        {name: "isInvoiced", attr: "isInvoiced", label: "_showInvoiced".loc(), defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: "=",
                value: false
              };
            }
            return param;
          }
        },
        {name: "orderNumber", label: "_orderNumber".loc(), attr: "order.number"},
        {name: "customer", attr: "order.customer.name", label: "_customer".loc(), defaultKind: "XV.CustomerProspectWidget"},
        {name: "shipVia", attr: "shipVia", label: "_shipVia".loc(), defaultKind: "XV.ShipViaPicker"},
        {kind: "onyx.GroupboxHeader", content: "_shipped".loc()},
        {name: "shippedFromDate", label: "_fromDate".loc(),
          filterLabel: "_shipDate".loc() + " " + "_fromDate".loc(),
          attr: "shipDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "shippedToDate", label: "_toDate".loc(),
          filterLabel: "_shipDate".loc() + " " + "_toDate".loc(),
          attr: "shipDate", operator: "<=",
          defaultKind: "XV.DateWidget"}
      ]
    });

    // ..........................................................
    // ORDER
    //

    enyo.kind({
      name: "XV.OrderListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_order".loc()},
        {name: "showClosed", label: "_showClosed".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: "!=",
                value: "C"
              };
            }
            return param;
          }
        },
        {name: "number", label: "_number".loc(), attr: "number"},
        {name: "createdFromDate", label: "_fromDate".loc(),
          filterLabel: "_salesOrderDate".loc() + " " + "_fromDate".loc(),
          attr: "orderDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "createdToDate", label: "_toDate".loc(),
          filterLabel: "_orderDate".loc() + " " + "_toDate".loc(),
          attr: "orderDate", operator: "<=",
          defaultKind: "XV.DateWidget"}
      ]
    });

    // ..........................................................
    // TRACE SEQUENCE
    //

    enyo.kind({
      name: "XV.TraceSequenceListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_traceSequence".loc()},
        {name: "number", label: "_number".loc(), attr: "number"},
        {name: "description", label: "_description".loc(), attr: "description"},
      ]
    });

    // ..........................................................
    // TRANSFER ORDER
    //

    enyo.kind({
      name: "XV.TransferOrderListParameters",
      kind: "XV.ParameterWidget",
      defaultParameters: function () {
        return {
          showUnreleased: true,
          showOpen: true
        };
      },
      characteristicsRole: 'isTransferOrders',
      components: [
        {kind: "onyx.GroupboxHeader", content: "_transferOrder".loc()},
        {name: "number", label: "_number".loc(), attr: "number"},
        {kind: "onyx.GroupboxHeader", content: "_show".loc()},
        {name: "showUnreleased", label: "_unreleased".loc(), defaultKind: "XV.CheckboxWidget"},
        {name: "showOpen", label: "_open".loc(), defaultKind: "XV.CheckboxWidget"},
        {name: "showClosed", label: "_closed".loc(), defaultKind: "XV.CheckboxWidget"},
        {name: "agent", attr: "agent", label: "_agent".loc(), defaultKind: "XV.AgentPicker"},
        {kind: "onyx.GroupboxHeader", content: "_site".loc()},
        {name: "source", attr: "sourceSite", label: "_source".loc(), defaultKind: "XV.SitePicker"},
        {name: "destination", attr: "destinationSite", label: "_destination".loc(), defaultKind: "XV.SitePicker"},
        {kind: "onyx.GroupboxHeader", content: "_orderDate".loc()},
        {name: "createdFromDate", label: "_fromDate".loc(),
          filterLabel: "_orderDate".loc() + " " + "_fromDate".loc(),
          attr: "orderDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "createdToDate", label: "_toDate".loc(),
          filterLabel: "_orderDate".loc() + " " + "_toDate".loc(),
          attr: "orderDate", operator: "<=",
          defaultKind: "XV.DateWidget"}
      ],
      getParameters: function () {
        var params = this.inherited(arguments),
          param = {},
          value = [];
        if (this.$.showOpen.getValue()) {
          value.push('O');
        }
        if (this.$.showUnreleased.getValue()) {
          value.push('U');
        }
        if (this.$.showClosed.getValue()) {
          value.push('C');
        }
        if (value.length) {
          param.attribute = "status";
          param.operator = "ANY";
          param.value = value;
          params.push(param);
        }
        return params;
      }
    });

  };

}());
