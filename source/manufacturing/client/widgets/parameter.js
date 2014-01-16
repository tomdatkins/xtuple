/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, enyo:true*/

(function () {

  XT.extensions.manufacturing.initParameters = function () {

    // ..........................................................
    // ISSUE MATERIAL
    //

    enyo.kind({
      name: "XV.IssueMaterialParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_parameters".loc()},
        {name: "transactionDate", label: "_issueDate".loc(),
          defaultKind: "XV.DateWidget"},
        {name: "order", attr: "order", label: "_workOrder".loc(),
          defaultKind: "XV.OpenWorkOrderWidget",
        getParameter: function () {
          var param,
           value = this.getValue();

          // If no order build a query that returns nothing
          if (value) {
            param = {
              attribute: "order.number",
              operator: "=",
              value: value
            };
          } else {
            param = {
              attribute: "order.number",
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
    // WORK ORDER
    //

    enyo.kind({
      name: "XV.WorkOrderListParameters",
      kind: "XV.ParameterWidget",
      characteristicsRole: "isItems",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_workOrders".loc()},
        {name: "orderNumberPattern", label: "_orderNumber".loc(), attr: "number"},
        {name: "site", label: "_site".loc(), attr: "itemSite.site.code", defaultKind: "XV.SitePicker"},
        {name: "showClosed", attr: "status", label: "_showClosed".loc(), defaultKind: "XV.CheckboxWidget",
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
        /*TODO
          Has Parent Sales Order
          Has Closed Parent Sales Orders
          Item Group
        */
        {kind: "onyx.GroupboxHeader", content: "_item".loc()},
        {name: "itemWidget", label: "_item".loc(), attr: "itemSite.item",
          defaultKind: "XV.ItemWidget"},
        {name: "description", label: "_description".loc(), attr: "itemSite.item.description1"},
        {kind: "onyx.GroupboxHeader", content: "_plannerCode".loc()},
        {name: "plannerCode", label: "_plannerCode".loc(), attr: "itemSite.plannerCode",
          defaultKind: "XV.PlannerCodePicker"},
        {name: "plannerCodePattern", label: "_plannerCode".loc() + " " + "_pattern".loc(), attr: "itemSite.plannerCode"},
        {kind: "onyx.GroupboxHeader", content: "_classCode".loc()},
        {name: "classCode", label: "_classCode".loc(), attr: "itemSite.item.classCode",
          defaultKind: "XV.ClassCodePicker"},
        {name: "classCodePattern", label: "_classCode".loc() + " " + "_pattern".loc(), attr: "itemSite.item.classCode"}
      ]
    });

  };

}());
