/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.quality.initParameters = function () {

    // ..........................................................
    // ACTIVITY
    //

    XV.ActivityListParameters.prototype.activityTypes.quality = [
      {type: "QualityTest", label: "_qualityTests".loc()},
      {type: "QualityTestWorkflow", label: "_qualityTestWorkflow".loc()}
    ];

    // ..........................................................
    // QUALITY SPECIFICATIONS
    //

    enyo.kind({
      name: "XV.QualitySpecsListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_qualitySpecification".loc()},
        {name: "testSpecType", label: "_testSpecType".loc(), attr: "testSpecType",
          defaultKind: "XV.QualitySpecTypePicker"},
        {name: "code", label: "_code".loc(), attr: "code"},
        {name: "description", label: "_description".loc(), attr: "description"}
      ]
    });

    // ..........................................................
    // QUALITY PLAN
    //

    enyo.kind({
      name: "XV.QualityPlanListParameters",
      kind: "XV.ParameterWidget",
      defaultParameters: function () {
        return {
          revisionStatus: XM.QualityPlan.ACTIVE_STATUS
        };
      },
      components: [
        {kind: "onyx.GroupboxHeader", content: "_qualityPlan".loc()},
        {name: "code", label: "_code".loc(), attr: "code"},
        {name: "description", label: "_description".loc(), attr: "description"},
        {name: "revisionStatus", label: "_revisionStatus".loc(), attr: "revisionStatus",
          defaultKind: "XV.RevisionStatusPicker"}
      ]
    });

    // ..........................................................
    // QUALITY TESTS
    //
    enyo.kind({
      name: "XV.QualityTestListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_qualityTests".loc()},
        {name: "number", label: "_testNumber".loc(), attr: "number"},
        {name: "startDate", label: "_startDate".loc(), attr: "startDate",
          defaultKind: "XV.DateWidget"},
        {name: "testStatus", label: "_testStatus".loc(), attr: "testStatus",
          defaultKind: "XV.QualityTestStatusPicker"},
        {kind: "onyx.GroupboxHeader", content: "_orders".loc()},
        {name: "orderNumberPattern", label: "_orderNumber".loc(), attr: "orderNumber"},
        {kind: "onyx.GroupboxHeader", content: "_item".loc()},
        {name: "itemWidget", label: "_item".loc(), attr: "item",
          defaultKind: "XV.ItemWidget"},
        {name: "classCode", label: "_classCode".loc(), attr: "item.classCode",
          defaultKind: "XV.ClassCodePicker"},
        {name: "classCodePattern", label: "_classCode".loc() + " " + "_pattern".loc(), attr: "item.classCode"}
      ]
    });

  };

}());
