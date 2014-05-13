/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  enyo.kind({
    name: "XV.ChartParameters",
    kind: "XV.ParameterWidget",
    classes: "chart-filters",
    components: [

      {kind: "onyx.GroupboxHeader",
         style: "display: flex;",
         components: [
          {name: "chartTitle", classes: "chart-title"},
        ]
        },
        {name: "salesRep", attr: "salesRep", label: "_salesRep".loc(), defaultKind: "XV.SalesRepPicker"},
        {name: "customer", label: "_customer".loc(), attr: "customer", defaultKind: "XV.CustomerWidget"},
        {name: "itemWidget", label: "_item".loc(), attr: "item", defaultKind: "XV.ItemWidget"},
        {name: "itemType", label: "_type".loc(), attr: "itemType", defaultKind: "XV.ItemTypePicker"}
      ]
    });

}());
