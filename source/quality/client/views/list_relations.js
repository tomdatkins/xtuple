/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.quality.initListRelations = function () {

    // ..........................................................
    // QUALITY PLANS
    //
    enyo.kind({
      name: "XV.QualityPlanItemListRelations",
      kind: "XV.ListRelations",
      parentKey: "qualityPlan",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableRows", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "specification.number", classes: "bold"},
                {kind: "XV.ListAttr", fit: true, attr: "specification.description"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.QualityItemSiteAssignmentListRelations",
      kind: "XV.ListRelations",
      parentKey: "qualityPlan",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableRows", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "site.code"},
                {kind: "XV.ListAttr", attr: "item.number"},
                {kind: "XV.ListAttr", attr: "item.description1"},
                {kind: "XV.ListAttr", attr: "frequency_type", formatter: "formatFrequency"}
              ]},
            ]},
          ]}
        ]}
      ],
      formatFrequency: function (value, view, model) {
        var K = XM.QualityPlanItemSiteAssignment,
          result = model ? model.get('frequency_type') : null;
        switch (result)
        {
        case K.TESTFREQ_FIRST:
          return '_testFirst'.loc();
        case K.TESTFREQ_LAST:
          return '_testLast'.loc();
        case K.TESTFREQ_LOT:
          return '_lot'.loc();
        case K.TESTFREQ_SERIAL:
          return '_serial'.loc();
        case K.TESTFREQ_SAMPLE:
          return '_testSample'.loc();
        case K.TESTFREQ_ALL:
          return '_testAll'.loc();
        }
        return "";
      },
    });

    // ..........................................................
    // QUALITY TESTS
    //
    enyo.kind({
      name: "XV.QualityTestItemListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "qualityPlanItem.code"}
      ],
      parentKey: "qualityTest",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableRows", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "lineNumber", formatter: "formatTestItem"},
                {kind: "XV.ListAttr", attr: "description"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "result", formatter: "formatResult"},
              ]}
            ]}
          ]}
        ]}
      ],
      formatTestItem: function (value, view, model) {
        var line = model ? model.get('lineNumber') : null,
          test = model ? model.get('qualityTest').get("number") : null;
          
        return test + "-"+line;
      },    
      formatResult: function (value, view, model) {
        var K = XM.QualityTest,
          result = model ? model.get('result') : null;
        // TODO: change color depending on status
        switch (result)
        {
        case K.STATUS_OPEN:
          return '_testOpen'.loc();
        case K.STATUS_PASS:
          return '_testPass'.loc();
        case K.STATUS_FAIL:
          return '_testFail'.loc();
        }
        return "";
      },
    });

    // ..............................................................
    // QUALITY PLAN/TEST WORKFLOW
    // 
    enyo.kind({
      name: "XV.QualityTestWorkflowListRelations",
      kind: "XV.WorkflowListRelations",
      parentKey: "qualityTest",
      orderBy: [
        {attribute: "sequence"}
      ],
    });

    enyo.kind({
      name: "XV.QualityPlanWorkflowListRelations",
      kind: "XV.WorkflowListRelations",
      parentKey: "qualityPlan",
      orderBy: [
        {attribute: "sequence"}
      ],
    });


  };

}());
