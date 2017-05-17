/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, _:true, Globalize: true, async:true*/

(function () {

  XT.extensions.quality.initWorkspaces = function () {

    // ..........................................................
    // CONFIGURE
    //

    enyo.kind({
      name: "XV.QualityWorkspace",
      kind: "XV.Workspace",
      title: "_quality".loc(),
      model: "XM.Quality",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_qualityTest".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "QTNumberGeneration",
                label: "_number".loc() + " " + "_policy".loc(),
                showNone: false},
              {kind: "XV.NumberWidget", attr: "NextQualityTestNumber",
                label: "_nextNumber".loc(), formatting: false},
              {kind: "onyx.GroupboxHeader", content: "_desktopHost".loc()},
              {kind: "XV.InputWidget", attr: "WebappHostname",
                label: "_desktopHost".loc(), formatting: false},
              {kind: "XV.NumberWidget", attr: "WebappPort",
                label: "_desktopPort".loc(), formatting: false}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // QUALITY TEST SPECIFICATION
    //
    enyo.kind({
      name: "XV.QualitySpecWorkspace",
      kind: "XV.Workspace",
      title: "_qualitySpecification".loc(),
      model: "XM.QualitySpecification",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          classes: "xv-top-panel", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
                {kind: "XV.InputWidget", attr: "code"},
                {kind: "XV.InputWidget", attr: "description"},
                {kind: "XV.QualitySpecTypePicker", attr: "testSpecType"},
                {kind: "onyx.GroupboxHeader", content: "_testType".loc()},
                {kind: "XV.QualityTestTypePicker", attr: "testType"},
                {kind: "XV.QuantityWidget", attr: "target" },
                {kind: "XV.QuantityWidget", attr: "upper" },
                {kind: "XV.QuantityWidget", attr: "lower" },
                {kind: "XV.UnitPicker", attr: "testUnit" },
                {kind: "onyx.GroupboxHeader", content: "_testEquipment".loc()},
                {kind: "XV.InputWidget", attr: "testEquipment"},
                {kind: "onyx.GroupboxHeader", content: "_instructions".loc()},
                {kind: "XV.TextArea", attr: "instructions", fit: true}
              ]}
            ]}
          ]}
        ]
      });

    XV.registerModelWorkspace("XM.QualitySpecList", "XV.QualitySpecWorkspace");

    // ..........................................................
    // QUALITY PLAN
    //
    enyo.kind({
      name: "XV.QualityPlanWorkspace",
      kind: "XV.Workspace",
      title: "_qualityPlan".loc(),
      model: "XM.QualityPlan",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "code"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.QualityPlanTypePicker", attr: "qualityPlanType"},
              {kind: "XV.InputWidget", attr: "revisionNumber"},
              {kind: "XV.DateWidget", attr: "revisionDate"},
              {kind: "XV.RevisionStatusPicker", attr: "revisionStatus" },
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true},
              {kind: "XV.QualityPlanEmailProfilePicker", attr: "emailProfile"}
            ]}
          ]},
          {kind: "FittableRows", title: "_qualityTests".loc(), name: "testItemsPanel"},
          {kind: "FittableRows", title: "_itemAssignment".loc(), name: "testItemAssignmentPanel"},
          {kind: "XV.QualityPlanCommentBox", attr: "comments"},
          {kind: "XV.QualityPlanDocumentsBox", attr: "documents"}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        var touch = enyo.platform.touch,
          itemsKind = touch ? "XV.QualityPlanItemBox" : "XV.QualityPlanItemBox";

        this.$.testItemsPanel.createComponents([
          {kind: itemsKind, attr: "items", fit: true}
        ], {owner: this});

        this.$.testItemAssignmentPanel.createComponents([
          {kind: "XV.QualityItemSiteAssignmentBox", attr: "itemSiteAssignment", fit: true}
        ], {owner: this});
      }
    });

    XV.registerModelWorkspace("XM.QualityPlanList", "XV.QualityPlanWorkspace");

    // ..........................................................
    // QUALITY TEST
    //
    enyo.kind({
      name: "XV.QualityTestWorkspace",
      kind: "XV.Workspace",
      title: "_qualityTest".loc(),
      model: "XM.QualityTest",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.QualityPlanWidget", attr: "qualityPlan",
                query: {parameters: [{attribute: "revisionStatus", operator: "=",
                  value: [ XM.QualityPlan.ACTIVE_STATUS
                ]}
              ]}},
              {kind: "XV.InputWidget", attr: "revisionNumber"},
              {kind: "XV.ItemSiteWidget",
                attr: {item: "item", site: "site"},
                name: "itemsite"},
              {kind: "XV.InputWidget", attr: "orderNumber"},
              {kind: "XV.TraceWidget", attr: "trace.number"},
              {kind: "XV.DateWidget", attr: "startDate"},
              {kind: "XV.DateWidget", attr: "completedDate"},
              {kind: "onyx.GroupboxHeader", content: "_result".loc()},
              {kind: "XV.QualityTestStatusPicker", attr: "testStatus", fit: true},
              {kind: "XV.QualityTestDispositionPicker", attr: "testDisposition", fit: true},
              {kind: "XV.QualityReasonCodePicker", name: "reasonCodePicker", attr: "reasonCode", documentType: null},
              {kind: "XV.QualityReleaseCodePicker", name: "releaseCodePicker", attr: "releaseCode", documentType: null},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "testNotes", fit: true}
            ]}
          ]},
          {kind: "XV.CommentBox", model: "XM.QualityTestComment", name: "commentsBox", attr: "comments"},
          {kind: "XV.QualityTestDocumentsBox", attr: "documents"}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        var touch = enyo.platform.touch,
          itemsKind = touch ? "XV.QualityTestItemBox" : "XV.QualityTestItemBox";

        this.$.panels.createComponents([
          {kind: itemsKind, attr: "qualityTestItems", addBefore: this.$.commentsBox, classes: "small-panel"}
        ], {owner: this});
      }

    });

    XV.registerModelWorkspace("XM.QualityTestList", "XV.QualityTestWorkspace");
    XV.registerModelWorkspace("XM.QualityTest", "XV.QualityTestWorkspace");
    XV.registerModelWorkspace("XM.QualityTestRelation", "XV.QualityTestWorkspace");

    // ..........................................................
    // QUALITY PLAN TYPE
    //
    enyo.kind({
      name: "XV.QualityPlanTypeWorkspace",
      kind: "XV.Workspace",
      title: "_qualityPlanType".loc(),
      model: "XM.QualityPlanType",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_qualityPlanType".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.CheckboxWidget", attr: "active"},
              {kind: "XV.CheckboxWidget", attr: "default"}
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.QualityPlanType", "XV.QualityPlanTypeWorkspace");


    // ..........................................................
    // QUALITY PLAN DOCUMENTS BOX
    //
    enyo.kind({
      name: "XV.QualityPlanDocumentsBox",
      kind: "XV.DocumentsBox",
      parentKey: "qualityPlan"
    });

    // ..........................................................
    // QUALITY TEST DOCUMENTS BOX
    //
    enyo.kind({
      name: "XV.QualityTestDocumentsBox",
      kind: "XV.DocumentsBox",
      parentKey: "qualityTest"
    });

    // ..........................................................
    // QUALITY PLAN COMMENT BOX
    //
    enyo.kind({
      name: "XV.QualityPlanCommentBox",
      kind: "XV.CommentBox",
      model: "XM.QualityPlanComment"
    });

    // ..........................................................
    // QUALITY TEST COMMENT BOX
    //
    enyo.kind({
      name: "XV.QualityTestCommentBox",
      kind: "XV.CommentBox",
      model: "XM.QualityTestComment"
    });

    // ..........................................................
    // QUALITY PLAN EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.QualityPlanEmailProfileWorkspace",
      kind: "XV.EmailProfileWorkspace",
      title: "_qualityPlanEmailProfile".loc(),
      model: "XM.QualityPlanEmailProfile",
    });

    XV.registerModelWorkspace("XM.QualityPlanEmailProfile", "XV.QualityPlanEmailProfileWorkspace");

    // ..........................................................
    // QUALITY TEST RELEASE CODE
    //
    enyo.kind({
      name: "XV.QualityReleaseCodeWorkspace",
      kind: "XV.Workspace",
      title: "_qualityReleaseCode".loc(),
      model: "XM.QualityReleaseCode"
    });

    XV.registerModelWorkspace("XM.QualityReleaseCode", "XV.QualityReleaseCodeWorkspace");

    // ..........................................................
    // QUALITY TEST REASON CODE
    //
    enyo.kind({
      name: "XV.QualityReasonCodeWorkspace",
      kind: "XV.Workspace",
      title: "_qualityReasonCode".loc(),
      model: "XM.QualityReasonCode"
    });

    XV.registerModelWorkspace("XM.QualityReasonCode", "XV.QualityReasonCodeWorkspace");

  // ...................................................................
  // REWORK OPERATION WORKSPACE
  //

    var reworkOperationWorkspace = {
      name: "XV.ReworkOperationWorkspace",
      model: "XM.ReworkOperation",
      kind: "XV.Workspace",
      title: "_reworkOperation".loc()
    };

    enyo.mixin(reworkOperationWorkspace, XV.WorkOrderOperationMixin);
    enyo.kind(reworkOperationWorkspace);

    XV.registerModelWorkspace("XM.ReworkOperation", "XV.ReworkOperationWorkspace");

    // ..........................................................
    // QUALITY SPECIFICATION TYPE WORKSPACE
    //
    enyo.kind({
      name: "XV.QualitySpecificationTypeWorkspace",
      kind: "XV.Workspace",
      title: "_testSpecificationType".loc(),
      model: "XM.QualitySpecificationType"
    });

    XV.registerModelWorkspace("XM.QualitySpecificationType", "XV.QualitySpecificationTypeWorkspace");

  };
}());
