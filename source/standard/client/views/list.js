/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global  enyo:true, XM:true, XT:true, XV:true*/

(function () {


  XT.extensions.standard.initList = function () {
    // Add support for Transfer Orders

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.mixin(XV.IssueToShippingList.prototype, {
      collection: "XM.IssueToShippingMultiCollection",
      parameterWidget: "XV.IssueToShippingMultiParameters"
    });


    // ..........................................................
    // ORDER
    //

    enyo.kind({
      name: "XV.OrderList",
      kind: "XV.List",
      label: "_orders".loc(),
      collection: "XM.OrderListItemCollection",
      parameterWidget: "XV.OrderListParameters",
      query: {orderBy: [
        {attribute: "orderDate"},
        {attribute: "number"}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
                {kind: "XV.ListAttr", attr: "getOrderStatusString",
                  style: "padding-left: 24px"},
                {kind: "XV.ListAttr", attr: "scheduleDate",
                  formatter: "formatScheduleDate", classes: "right",
                  placeholder: "_noSchedule".loc()}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "sourceName"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "shiptoName", classes: "italic"},
              {kind: "XV.ListAttr", formatter: "formatShipto"}
            ]}
          ]}
        ]}
      ],
      formatScheduleDate: function (value, view, model) {
        var isLate = model && model.get("scheduleDate") &&
          (XT.date.compareDate(value, new Date()) < 1);
        view.addRemoveClass("error", isLate);
        return value;
      },
      formatShipto: function (value, view, model) {
        var city = model.get("shiptoCity"),
          state = model.get("shiptoState"),
          country = model.get("shiptoCountry");
        return XM.Address.formatShort(city, state, country);
      }
    });

    // ..........................................................
    // SHIPMENT
    //

    enyo.mixin(XV.ShipmentList.prototype, {
      collection: "XM.ShipmentMultiListItemCollection"
    });

  };

}());
