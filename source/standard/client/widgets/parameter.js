/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, enyo:true*/

(function () {

  XT.extensions.standard.initParameters = function () {

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueToShippingMultiParameters",
      kind: "XV.IssueToShippingParameters",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_parameters".loc()},
        {name: "transactionDate", label: "_issueDate".loc(), defaultKind: "XV.DateWidget"},
        {name: "order", attr: "order", label: "_order".loc(), defaultKind: "XV.OrderWidget",
        getParameter: function () {
          var param,
           value = this.getValue();

          // If no order build a query that returns nothing
          if (value) {
            param = {
              attribute: "order",
              operator: "=",
              value: value
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
      ]
    });

    // ..........................................................
    // ORDER
    //

    enyo.kind({
      name: "XV.OrderListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_quote".loc()},
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

  };

}());
