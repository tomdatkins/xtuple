/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  enyo.kind({
    name: "XV.SalesChartParameters",
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
        
        {name: "itemType", label: "_type".loc(), attr: "itemType", defaultKind: "XV.ItemTypePicker"},
        {name: "category", label: "_category".loc(), attr: "productCategory", defaultKind: "XV.ProductCategoryPicker"},
        {name: "classCode", label: "_classCode".loc(), attr: "classCode", defaultKind: "XV.ClassCodePicker"},
        {kind: "XV.MonthPicker", attr: "monthExpired"},
        {kind: "XV.YearPicker", attr: "yearExpired"},
        {kind: "XV.CountryPicker", attr: "DefaultAddressCountry", label: "_default".loc(), idAttribute: "name"},
        {name: "stage", label: "_stage".loc(), attr: "opportunityStage", defaultKind: "XV.OpportunityStagePicker"},
        {kind: "XV.OpportunityTypePicker", attr: "opportunityType", label: "_type".loc()}
        
      ]
    });
  
  enyo.kind({
    name: "XV.OpportunityChartParameters",
    kind: "XV.ParameterWidget",
    classes: "chart-filters",
    components: [

      {kind: "onyx.GroupboxHeader",
         style: "display: flex;",
         components: [
          {name: "chartTitle", classes: "chart-title"},
        ]
        },
        {name: "account", label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
        {name: "user", label: "_user".loc(), attr: "user", defaultKind: "XV.UserAccountWidget"}

      ]
    });
  
  enyo.kind({
    name: "XV.TimeChartParameters",
    kind: "XV.ParameterWidget",
    classes: "chart-filters",
    components: [

      {kind: "onyx.GroupboxHeader",
         style: "display: flex;",
         components: [
          {name: "chartTitle", classes: "chart-title"},
        ]
        },
        /*  todo: need month picker for end period */
      ]
    });

}());
