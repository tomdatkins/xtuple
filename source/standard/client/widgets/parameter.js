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

  };

}());
