
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

  // ..........................................................
  // QUALITY PLAN AND QUALITY TESTS WORKFLOW
  //
    enyo.kind({
      name: "XV.QualityPlanWorkflowEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"},
          {kind: "XV.WorkflowStatusPicker", attr: "status"},
          {kind: "XV.QualityTestDispositionPicker", attr: "workflowType" },
          {kind: "XV.PriorityPicker", attr: "priority", showNone: false},
          {kind: "XV.NumberSpinnerWidget", attr: "sequence"},
          {kind: "onyx.GroupboxHeader", content: "_startDate".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "startSet"},
          {kind: "XV.NumberSpinnerWidget", attr: "startOffset"},
          {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "dueSet"},
          {kind: "XV.NumberSpinnerWidget", attr: "dueOffset"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "XV.UserAccountWidget", attr: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
          {kind: "XV.QualityTestDispositionPicker", attr: "completedParentStatus",
            label: "_disposition".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "completedSuccessors", parentId: "id"}},
          {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
          {kind: "XV.QualityTestDispositionPicker", attr: "deferredParentStatus",
            label: "_disposition".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "deferredSuccessors", parentId: "id"}},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.QualityTestWorkflowEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"},
          {kind: "XV.WorkflowStatusPicker", attr: "status"},
          {kind: "XV.PriorityPicker", attr: "priority", showNone: false},
          {kind: "XV.NumberSpinnerWidget", attr: "sequence"},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", attr: "dueDate"},
          {kind: "XV.DateWidget", attr: "startDate"},
          {kind: "XV.DateWidget", attr: "assignDate"},
          {kind: "XV.DateWidget", attr: "completeDate"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "XV.UserAccountWidget", attr: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
          {kind: "XV.QualityTestStatusPicker", attr: "completedParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "completedSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
          {kind: "XV.QualityTestStatusPicker", attr: "deferredParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.QualityPlanWorkflowBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_workflow".loc(),
      editor: "XV.QualityPlanWorkflowEditor",
      parentKey: "qualityPlan",
      listRelations: "XV.QualityPlanWorkflowListRelations",
      fitButtons: false
    });

    enyo.kind({
      name: "XV.QualityTestWorkflowBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_workflow".loc(),
      editor: "XV.QualityTestWorkflowEditor",
      parentKey: "qualityTest",
      listRelations: "XV.QualityTestWorkflowListRelations",
      fitButtons: false
    });

  };

}());
