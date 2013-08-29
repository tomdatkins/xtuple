/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global  enyo:true, XT:true, XV:true*/

(function () {


  XT.extensions.standard.initListRelations = function () {

    // ..........................................................
    // ISSUE TO SHIPPING DETAIL
    //

    enyo.mixin(XV.IssueToShippingDetailListRelations.prototype, {
      kindComponents: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "FittableColumns", components: [
                  {kind: "XV.ListAttr", attr: "location",
                    formatter: "formatLocation"},
                ]},
                {kind: "XV.ListAttr", attr: "quantity",
                  formatter: "formatQuantity",
                  classes: "right"},
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "trace.number"},
                {kind: "XV.ListAttr", attr: "expiration",
                  formatter: "formatDate"},
                {kind: "XV.ListAttr", attr: "purchaseWarranty",
                  formatter: "formatDate"},
                {kind: "XV.ListAttr", attr: "distributed",
                  formatter: "formatQuantity",
                  classes: "right hyperlink", ontap: "distributedTapped"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatDate: function (value, view) {
        var isExpired = value ? XT.date.compareDate(value, new Date()) >= 0 : false;
        view.addRemoveClass("error", isExpired);
        return XT.date.isEndOfTime(value) ? "" : value;
      }
    });
  };

}());
