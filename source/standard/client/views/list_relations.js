/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global  XT:true, XV:true*/

(function () {


  XT.extensions.standard.initListRelations = function () {

    // ..........................................................
    // ISSUE TO SHIPPING DETAIL
    //

    XV.IssueToShippingDetailListRelations.prototype.kindComponents = [
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
              {kind: "XV.ListAttr", attr: "distributed",
                classes: "right hyperlink", ontap: "distributedTapped"}
            ]}
          ]}
        ]}
      ]}
    ];
  };

}());
