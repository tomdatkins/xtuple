
/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  XT.extensions.quality.initListRelationsEditorBox = function () {

    // ..........................................................
    // QUALITY PLANS
    //
    enyo.kind({
      name: "XV.QualityPlanItemEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.QualitySpecWidget", attr: "specification"}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.QualityPlanItemBox",
      kind: "XV.ListRelationsEditorBox",
      classes: "xv-list-relations-box",
      title: "_qualitySpecifications".loc(),
      editor: "XV.QualityPlanItemEditor",
      parentKey: "qualityPlan",
      listRelations: "XV.QualityPlanItemListRelations",
      fitButtons: false
    });

    enyo.kind({
      name: "XV.QualityItemSiteAssignmentEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.ItemSiteWidget", attr: {item: "item", site: "site"},
            query: {parameters: [
            {attribute: "isActive", value: true}
          ]}},
          {kind: "onyx.GroupboxHeader", content: "_test_assign_to".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "operation"},
          {kind: "XV.ToggleButtonWidget", attr: "production"},
          {kind: "XV.ToggleButtonWidget", attr: "receipt"},
          {kind: "XV.ToggleButtonWidget", attr: "shipment"},
          {kind: "onyx.GroupboxHeader", content: "_test_sample_frequency".loc()},
          {kind: "XV.QualityTestFreqPicker", attr: "frequency_type"},
          {kind: "XV.NumberWidget", attr: "frequency"}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.QualityItemSiteAssignmentBox",
      kind: "XV.ListRelationsEditorBox",
      classes: "xv-list-relations-box",
      title: "_itemAssignment".loc(),
      editor: "XV.QualityItemSiteAssignmentEditor",
      parentKey: "qualityPlan",
      listRelations: "XV.QualityItemSiteAssignmentListRelations",
      fitButtons: false
    });

    // ..........................................................
    // QUALITY TESTS
    //
    enyo.kind({
      name: "XV.QualityTestItemEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "onyx.GroupboxHeader", content: "_description".loc()},
          {kind: "XV.TextArea", name: "description", attr: "description"},
          {kind: "onyx.GroupboxHeader", content: "_test_instructions".loc()},
          {kind: "XV.TextArea", name: "instructions", attr: "instructions"},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true},
          {name: "testDetails", components: [
            {kind: "onyx.GroupboxHeader", content: "_result".loc()},
            {kind: "XV.QuantityWidget", attr: "target"},
            {kind: "XV.InputWidget", attr: "actual"},
            {kind: "XV.UnitPicker", attr: "testUnit" },
            {kind: "XV.QualityTestStatusPicker", attr: "result", fit: true},
          ]},
        ]}
      ]
      
    });

    enyo.kind({
      name: "XV.QualityTestItemBox",
      kind: "XV.ListRelationsEditorBox",
      classes: "xv-list-relations-box",
      title: "_quality_test_items".loc(),
      editor: "XV.QualityTestItemEditor",
      parentKey: "qualityTest",
      listRelations: "XV.QualityTestItemListRelations",
      fitButtons: false,
      
      create: function () {
        this.inherited(arguments);
        this.$.newButton.setDisabled(true);
        this.$.deleteButton.setDisabled(true);
      }
       
    });

  };

}());
