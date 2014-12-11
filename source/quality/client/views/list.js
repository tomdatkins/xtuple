/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, XV:true, enyo:true, XM:true, Globalize:true, _:true*/

(function () {


  XT.extensions.quality.initLists = function () {

    // ..........................................................
    // ACTIVITY
    //
    var _actions = XV.ActivityList.prototype.activityActions,
      _qualityScrapMethod = function (inSender, inEvent) {
        var that = this,
          qualityTest;

        if (!XT.session.privileges.get("CreateScrapTrans")) {
          inEvent.message = "_insufficientPrivileges".loc();
          inEvent.type = XM.Model.CRITICAL;
          this.doNotify(inEvent);
          return;
        }
        inEvent.workspace = "XV.ScrapTransactionWorkspace";
        inEvent.callback = function () {
        // Scrap Trans saved - now close the workflow so it does not get reused
          qualityTest.completeWorkflow(inEvent.model.id, function () { that.fetch(); });
        };
        qualityTest = new XM.QualityTest();
        qualityTest.fetch({
          id: inEvent.model.get("parent").id,
          success: function (model) {
            inEvent.attributes = {
              item: model.get("item"),
              site: model.get("site")
            };
            that.bubbleUp("onWorkspace", inEvent, inSender);
          }
        });
      },
      _qualityReworkMethod = function (inSender, inEvent) {
        var that = this,
          qualityTest = new XM.QualityTest(),
          standardOperation = new XM.ReworkOperation(),
          wo = new XM.WorkOrder();
          
        if (!XT.session.privileges.get("MaintainWoOperations")) {
          inEvent.message = "_insufficientPrivileges".loc();
          inEvent.type = XM.Model.CRITICAL;
          this.doNotify(inEvent);
          return;
        }
        inEvent.workspace = "XV.ReworkOperationWorkspace";
        
        var afterWoFetch = function () {
          inEvent.attributes = {
            workOrder:         wo,
            standardOperation: standardOperation
          };
          inEvent.callback = function () {
          // Rework Operation saved - now close the workflow so it does not get reused
            qualityTest.completeWorkflow(inEvent.model.id, function () { that.fetch(); });
          };
          that.bubbleUp("onWorkspace", inEvent, inSender);
        },
        afterFetch = function (model) {
          // Rework transaction can only work on tests initiated by Work Orders
          if (model.get("orderType") !== 'WO') {
            inEvent.message = "_documentIsNotAWorkOrder".loc();
            inEvent.type = XM.Model.CRITICAL;
            that.doNotify(inEvent);
            return;
          } else {
            async.series([
              function (callback) {
                wo.fetch({
                  id: model.get("parent"),
                  success: function () {
                    callback();
                  }
                });
              },
              function (callback) {
                var coll = new XM.StandardOperationCollection(),
                  options = {};

                options.query = {
                  parameters: [{attribute: "operationType", value: "REWORK"}]
                };
                options.success = function () {
                  standardOperation = coll.first();
                  callback();
                };
                coll.fetch(options);
              }
            ], function (err) {
              afterWoFetch();
            });
          }
        };
        
        qualityTest.fetch({
          id: inEvent.model.get("parent").id,
          success: afterFetch
        });
      },
      _qualityQuarantineMethod = function (inSender, inEvent) {
        var that = this,
          qualityTest;

        if (!XT.session.privileges.get("RelocateInventory")) {
          inEvent.message = "_insufficientPrivileges".loc();
          inEvent.type = XM.Model.CRITICAL;
          this.doNotify(inEvent);
          return;
        }
        inEvent.workspace = "XV.RelocateInventoryWorkspace";
        inEvent.callback = function () {
        // Quarantine saved - now close the workflow so it does not get reused
          qualityTest.completeWorkflow(inEvent.model.id, function () { that.fetch(); });
        };
        qualityTest = new XM.QualityTest();
        qualityTest.fetch({
          id: inEvent.model.get("parent").id,
          success: function (model) {
            inEvent.attributes = {
              item: model.get("item"),
              site: model.get("site")
            };

            that.bubbleUp("onWorkspace", inEvent, inSender);
          }
        });
      };

    _actions.push({activityType: "QualityTestWorkflow",
      activityAction: XM.QualityTestWorkflow.DISPOSITION_SCRAP,
      method: _qualityScrapMethod
    });

    _actions.push({activityType: "QualityTestWorkflow",
      activityAction: XM.QualityTestWorkflow.DISPOSITION_REWORK,
      method: _qualityReworkMethod
    });

    _actions.push({activityType: "QualityTestWorkflow",
      activityAction: XM.QualityTestWorkflow.DISPOSITION_QUARANTINE,
      method: _qualityQuarantineMethod
    });

    // ..........................................................
    // QUALITY SPECIFICATIONS
    //

    enyo.kind({
      name: "XV.QualitySpecsList",
      kind: "XV.List",
      label: "_qualitySpecifications".loc(),
      collection: "XM.QualitySpecsCollection",
      parameterWidget: "XV.QualitySpecsListParameters",
      allowPrint: true,
      actions: [
        {name: "print", privilege: "MaintainQualitySpecs ViewQualitySpecs", method: "doPrint", isViewMethod: true },
      ],
      query: {orderBy: [
        {attribute: 'code'}
      ]},
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-list-header", components: [
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {content: "_code".loc()}
          ]},
          {kind: "XV.ListColumn", fit: true, classes: "first", components: [
            {content: "_description".loc()}
          ]}
        ]}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "name-column",
              components: [
              {kind: "XV.ListAttr", attr: "code", fit: true, isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "first",
              components: [
              {kind: "XV.ListAttr", attr: "description", fit: true}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // QUALITY PLANS
    //

    enyo.kind({
      name: "XV.QualityPlansList",
      kind: "XV.List",
      label: "_qualityPlans".loc(),
      collection: "XM.QualityPlansCollection",
      allowPrint: true,
      parameterWidget: "XV.QualityPlanListParameters",
      query: {orderBy: [
        {attribute: 'code'},
        {attribute: 'revisionNumber'}
      ]},
      actions: [
        {name: "createTest", method: "createQualityTest", notify: false, isViewMethod: true,
          privilege: "MaintainQualityTests", label: "_createQualityTest".loc(), prerequisite: "canCreateTest"}
      ],
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-list-header", components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_code".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_revisionNumber".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_revisionStatus".loc()}
          ]},
          {kind: "XV.ListColumn", fit: true, classes: "first", components: [
            {content: "_description".loc()}
          ]}
        ]}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "code", fit: true, isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "revisionNumber"}
            ]},
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "revisionStatus", formatter: "formatRevStatus"}
            ]},
            {kind: "XV.ListColumn", classes: "first",
              components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ],

      formatRevStatus: function (value, view, model) {
        var K = XM.QualityPlan,
          result = model ? model.get('revisionStatus') : null;
        switch (result)
        {
        case K.PENDING_STATUS:
          return '_pending'.loc();
        case K.ACTIVE_STATUS:
          return '_active'.loc();
        case K.INACTIVE_STATUS:
          return '_inactive'.loc();
        }
        return "";
      },

      /**
        Create a Quality Test from the selected Quality Plan. The way we
        do this is to open a QualityTest workspace and then call the model method
        convertFromQualityPlan AFTER the workspace is initialized. That way
        the view and the model get bound together correctly. The user will have
        to fill out some itemsite-specific fields, and when they save a new
        test will be created.
     */
      createQualityTest: function (inEvent) {
        var model = inEvent.model,
          revision = model.get("revisionNumber"),
          success = function () {
            this.getValue().createFromQualityPlan(model.id, revision);
          };

        this.doWorkspace({
          workspace: "XV.QualityTestWorkspace",
          attributes: {
            qualityPlan: model.get("uuid")
          },
          success: success,
          allowNew: false
        });

      }

    });

    // ..........................................................
    // QUALITY TESTS
    //

    enyo.kind({
      name: "XV.QualityTestList",
      kind: "XV.List",
      label: "_qualityTests".loc(),
      collection: "XM.QualityTestsCollection",
      parameterWidget: "XV.QualityTestListParameters",
      allowPrint: true,
      actions: [
        {name: "print", privilege: "MaintainQualityTests ViewQualityTests", method: "doPrint", isViewMethod: true },
        {name: "printCert", privilege: "MaintainQualityTests ViewQualityTests", method: "doPrintCert", isViewMethod: true, prerequisite: "canPrintCert" },
        {name: "printNCR", privilege: "MaintainQualityTests ViewQualityTests", method: "doPrintNCR", isViewMethod: true, prerequisite: "canPrintNCR" },
        {name: "download", privilege: "MaintainQualityTests ViewQualityTests", method: "doDownload", isViewMethod: true}
      ],
      query: {orderBy: [
        {attribute: 'startDate'}
      ]},
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-list-header", components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_testNumber".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_startDate".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_completedDate".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {content: "_testStatus".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {content: "_qualityPlan".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {content: "_item".loc()}
          ]}
        ]}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "number", fit: true, isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "startDate", fit: true}
            ]},
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "completedDate", fit: true}
            ]},
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "testStatus", formatter: "formatStatus", fit: true}
            ]},
            {kind: "XV.ListColumn", classes: "name-column",
              components: [
              {kind: "XV.ListAttr", attr: "qualityPlan", formatter: "formatQualityPlan"}
            ]},
            {kind: "XV.ListColumn", classes: "name-column",
              components: [
              {kind: "XV.ListAttr", attr: "item.number"}
            ]}
          ]}
        ]}
      ],
      
      doPrintNCR: function (inEvent) {
        var reportUrl = "/generate-report?nameSpace=ORPT&type=QualityNonConformance&params=id::string=%@".f(inEvent.model.id);
        
        this.openReport(XT.getOrganizationPath() + reportUrl);
      },
      
      doPrintCert: function (inEvent) {
        var reportUrl = "/generate-report?nameSpace=ORPT&type=QualityCertificate&params=id::string=%@".f(inEvent.model.id);
        
        this.openReport(XT.getOrganizationPath() + reportUrl);
      },
      
      formatStatus: function (value, view, model) {
        var K = XM.QualityTest,
          status = model ? model.get('testStatus') : null;
        // TODO: change color depending on status
        switch (status)
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
      formatQualityPlan: function (value, view, model) {
        var qplancode = model ? model.getValue('qualityPlan.code') : null,
          qplandesc = model ? model.getValue('qualityPlan.description') : null;

        return qplancode + ' - ' + qplandesc;
      },
      getStyle: function (model) {
        var settings = XT.session.getSettings(),
          K = XM.QualityTest,
          status = model ? model.get('testStatus') : null,
          background,
          style;
        switch (status)
        {
        case K.STATUS_OPEN:
          background = settings.get('IncidentConfirmedColor');
          break;
        case K.STATUS_PASS:
          background = settings.get('IncidentResolvedColor');
          break;
        case K.STATUS_FAIL:
          background = settings.get('IncidentFeedbackColor');
          break;
        }
        if (background) {
          style = "background: " + background + ";";
        }
        return style;
      },
      setupItem: function (inSender, inEvent) {
        this.inherited(arguments);
        var model = this.getValue().models[inEvent.index],
          style = this.getStyle(model),
          prop,
          view;

        // Apply background color to all views.
        this.$.listItem.setStyle(style);
        for (prop in this.$) {
          if (this.$.hasOwnProperty(prop) && this.$[prop].getAttr) {
            view = this.$[prop];
            view.setStyle(style);
          }
        }
        return true;
      }
    });

    // ..........................................................
    // QUALITY TEST EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.QualityPlanEmailProfileList",
      kind: "XV.EmailProfileList",
      label: "_qualityPlanEmailProfiles".loc(),
      collection: "XM.QualityPlanEmailProfileCollection"
    });
    
    // ..........................................................
    // QUALITY REASON CODES
    //
    enyo.kind({
      name: "XV.QualityReasonCodeList",
      kind: "XV.NameDescriptionList",
      published: {
        query: {orderBy: [{ attribute: 'name' }] }
      }

    });
    
  };

}());
