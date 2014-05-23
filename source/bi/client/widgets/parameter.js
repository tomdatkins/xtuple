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
/*
      {kind: "onyx.GroupboxHeader",
         style: "display: flex;",
         components: [
          {name: "chartTitle", classes: "chart-title"},
        ]
        },
 */
        {name: "salesRep", attr: "salesRep", label: "_salesRep".loc(), defaultKind: "XV.SalesRepPicker"},
        {name: "customer", label: "_customer".loc(), attr: "customer", defaultKind: "XV.CustomerWidget"},
        {kind: "onyx.GroupboxHeader", content: "_item".loc()},
        {name: "itemWidget", label: "_item".loc(), attr: "item", defaultKind: "XV.ItemWidget"},
        {name: "itemType",
          label: "_type".loc(),
          attr: "itemType",
          defaultKind: "XV.ItemTypePicker",
          getParameter: function () {
            // use static model itemTypes to get the string for the item type code
            var value = this.getValue(),
              param;
            if (value) {
              param = {attribute: "itemType",
                        value: {id: XM.itemTypes.get(value).attributes.name}
                     };
            }
            return param;
          }
        },
        {name: "category", label: "_category".loc(), attr: "productCategory", defaultKind: "XV.ProductCategoryPicker"},
        {name: "classCode", label: "_class".loc(), attr: "classCode", defaultKind: "XV.ClassCodePicker"},
        {kind: "onyx.GroupboxHeader", content: "_endPeriod".loc()},
        {name: "year", label: "_year".loc(), defaultKind: "XV.EndYearPicker", attr: "year"},
        {name: "month", label: "_month".loc(), defaultKind: "XV.EndMonthPicker", attr: "month"},
        /*
        {kind: "XV.CountryPicker", attr: "DefaultAddressCountry", label: "_default".loc(), idAttribute: "name"},
        {name: "stage", label: "_stage".loc(), attr: "opportunityStage", defaultKind: "XV.OpportunityStagePicker"},
        {kind: "XV.OpportunityTypePicker", attr: "opportunityType", label: "_type".loc()}
        */
        
      ]
    });
  
  enyo.kind({
    name: "XV.OpportunityChartParameters",
    kind: "XV.ParameterWidget",
    classes: "chart-filters",
    components: [
/*
      {kind: "onyx.GroupboxHeader",
         style: "display: flex;",
         components: [
          {name: "chartTitle", classes: "chart-title"},
        ]
        },
*/
        {name: "account", label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
        {name: "user", label: "_user".loc(), attr: "user", defaultKind: "XV.UserAccountWidget"},
        {kind: "onyx.GroupboxHeader", content: "_endPeriod".loc()},
        {name: "year", label: "_year".loc(), defaultKind: "XV.EndYearPicker", attr: "year"},
        {name: "month", label: "_month".loc(), defaultKind: "XV.EndMonthPicker", attr: "month"},

      ]
    });
  
  enyo.kind({
    name: "XV.TimeChartParameters",
    kind: "XV.ParameterWidget",
    classes: "chart-filters",
    components: [
/*
      {kind: "onyx.GroupboxHeader",
         style: "display: flex;",
         components: [
          {name: "chartTitle", classes: "chart-title"},
        ]
        },
*/
        {kind: "onyx.GroupboxHeader", content: "_endPeriod".loc()},
        {name: "year", label: "_year".loc(), defaultKind: "XV.EndYearPicker", attr: "year"},
        {name: "month", label: "_month".loc(), defaultKind: "XV.EndMonthPicker", attr: "month"},
      ]
    });

}());
