/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.quality.initGridBox = function () {

    // ..........................................................
    // QUALITY TEST GRID Layout
    //

    enyo.kind({
      name: "XV.QualityItemGridBox",
      kind: "XV.GridBox",
      classes: "small-panel",
      title: "_quality_tests".loc(),
      workspace: "XV.QualityPlanItemWorkspace",

      parentKey: "qualityPlan",
      orderBy: [{attribute: 'code'}],
      columns: [
        {classes: "grid-item", header: "_code".loc(), rows: [
          {readOnlyAttr: "code",
            editor: {kind: "XV.InputWidget", attr: "item", placeholder: "_code".loc()}
          }
        ]},
        {classes: "grid-item", header: "_description".loc(), rows: [
          {readOnlyAttr: "description",
            editor: {kind: "XV.InputWidget", attr: "description", placeholder: "_description".loc()}
          }
        ]},
        {classes: "grid-item", header: "_testType".loc(), rows: [
          {readOnlyAttr: "testType",
            editor: {kind: "XV.QualityTestTypePicker", attr: "testType", placeholder: "_testType".loc()}
          }
        ]}
      ]
    });

    // ..........................................................
    // QUALITY TEST WORKFLOW GRID Layout
    //
    enyo.kind({
      name: "XV.QualityTestWorkflowGridBox",
      kind: "XV.WorkflowGridBox",
      workspace: "XV.QualityTestWorkflowWorkspace"
    });

  };

}());
