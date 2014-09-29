/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {

  "use strict";
  
  XT.extensions.quality.initQualityTestModels = function () {

/* =========================================================
*  Quality Control Tests
*  ========================================================= */

    XM.QualityTestStatusMixin = {

      /**
      Returns Quality Test (overall) status as a localized string.

      @returns {String}
      */
      formatStatus: function () {
        var K = XM.QualityTest,
          status = this.get('testStatus');

        switch (status)
        {
        case K.STATUS_OPEN:
          return '_testOpen'.loc();
        case K.STATUS_PASS:
          return '_testPass'.loc();
        case K.STATUS_FAIL:
          return '_testFail'.loc();
        }
      },

      isActive: function () {
        return this.get("testStatus") === XM.QualityTest.STATUS_OPEN;
      },
      
      /**
      Returns combination of Order Type and Order Number
    
      @returns {String}
      */
      formatOrderNumber: function () {
        var type = this.get('orderType') || null,
          number = this.get('orderNumber') || null;
       
        if (type !== null) {
          return type + ' - ' + number;
        } else {
          return number;
        }
      }
    };

    /**
      @class
      @extends XM.Model
    */
    XM.QualityTestComment = XM.Comment.extend({

      recordType: "XM.QualityTestComment",

      sourceName: "QTEST"

    });

    /**
      @class

      @extends XM.Document
    */
    XM.QualityTest = XM.Document.extend({

      recordType: "XM.QualityTest",

      numberPolicySetting: 'QTNumberGeneration',

      nameAttribute: "number",

      readOnlyAttributes: [
        "number",
        "qualityPlan",
        "revisionNumber",
        "testDisposition",
        "orderType",
        "orderNumber",
        "trace",
      ],

      defaults: function () {
          return {
            testStatus: XM.QualityTest.STATUS_OPEN,
            testDisposition: XM.QualityTestWorkflow.DISPOSITION_INPROCESS
          };
        },

      handlers: {
        "change:qualityPlan": "qualityPlanDidChange",
        "change:testStatus": "testStatusDidChange",
        "status:READY_CLEAN": "statusReadyClean"
      },
      
      statusReadyClean: function (model, value, options) {
        this.setReadOnly(["item", "site", "trace"], this.get("item"));
      },

      qualityPlanDidChange: function () {
        this.inheritWorkflowSource(this.get("qualityPlan"), false, "XM.QualityTestWorkflow");
      },

      getTestItemStatuses: function () {
        return this.get("qualityTestItems").pluck('result');
      },

      checkTestItemStatus: function () {
        /* All test PASS - Set Overall to PASS */
        if (this.get("qualityTestItems").every(function (items) { return items.getValue("result") === XM.QualityTest.STATUS_PASS; })) {
          this.set("testStatus", XM.QualityTest.STATUS_PASS);
        } else if (_.contains(this.getTestItemStatuses(), XM.QualityTest.STATUS_FAIL)) {
        /* If ANY test FAIL - Set Overall to FAIL */
          this.set("testStatus", XM.QualityTest.STATUS_FAIL);
        } else {
        /* Otherwise Overall Test is incomplete (OPEN) */
          this.set("testStatus", XM.QualityTest.STATUS_OPEN);
          this.set("completedDate", null);
        }
        /* If ALL test status in Pass or Fail then set completed date */
        if (this.get("qualityTestItems").every(function (items) { return items.getValue("result") !== XM.QualityTest.STATUS_OPEN; })) {
          this.set("completedDate", XT.date.today());
        }
      },

      testStatusDidChange: function () {
        var K = XM.QualityTest,
            testStatus = this.get("testStatus"),
            workflowDisposition;
   
        if (testStatus === K.STATUS_OPEN) { return; } // Do nothing
        
        /* Overall Test PASSED then set open workflow items to Completed elseif Test FAILED then set open workflow items to Deferred */
        workflowDisposition = testStatus === K.STATUS_PASS ? XM.Workflow.COMPLETED : XM.Workflow.DEFERRED;
        _.each(this.get("workflow").where(
            {workflowType: XM.QualityTestWorkflow.DISPOSITION_INPROCESS}),
            function (workflow) {
              workflow.set({status: workflowDisposition});
            });
      },

      createFromQualityPlan: function (id) {
        var plan = new XM.QualityPlan(),
          fetchOptions = {},
          that = this,
          K = XM.QualityTest;
      
        fetchOptions.id = id;
        console.log("Creating Test from Plan ID:" + id);

        fetchOptions.success = function (resp) {
          // Create the Quality Test
          that.set({
              "qualityPlan": plan.get("code"),
              "revisionNumber": plan.get("revisionNumber"),
              "startDate": XT.date.today()
            });

          that.revertStatus();
          that.checkConflicts = false;
          that.qualityPlanDidChange(); //trigger workflow creation

          // Loop through Quality Plan Items and create Test Items
          // from the associated Test Specification
          var makeTestItemFromPlanItem = function (planItem, done) {
            var testItem = new XM.QualityTestItem();

            testItem.once("status:READY_NEW", function () {
              testItem.set({
                  "qualityTest": that.getValue("id"),
                  "qualityPlanItem": planItem.getValue("id"),
                  "description": planItem.getValue("specification.description"),
                  "instructions": planItem.getValue("specification.instructions"),
                  "target": planItem.getValue("specification.target") || 0.00,
                  "upper": planItem.getValue("specification.upper") || 0.00,
                  "lower": planItem.getValue("specification.lower") || 0.00,
                  "testUnit": planItem.getValue("specification.testUnit"),
                  "testType": planItem.getValue("specification.testType"),
                  "result": K.STATUS_OPEN
                });
              done(null, testItem);
            });
            testItem.initialize(null, {isNew: true});
          };

          async.map(plan.get("items"), makeTestItemFromPlanItem, function (err, results) {
            if (err) {
              console.log("Error creating Test Items", err);
            }

            _.each(results, function (testItem) {
              that.get("qualityTestItems").add(testItem);
            });
          });
        
        };
        fetchOptions.error = function (resp) {
          XT.log("Fetch failed in convertFromQualityPlan");
        };
        this.setStatus(XM.Model.BUSY_FETCHING);
        plan.fetch(fetchOptions);
      },


    });

    XM.QualityTest = XM.QualityTest.extend(
      _.extend(XM.QualityTestStatusMixin, XM.WorkflowMixin, XM.EmailSendMixin, {
      emailDocumentName: "_qualityTest".loc(),
      emailProfileAttribute: "qualityPlan.emailProfile",
      emailStatusMethod: "formatStatus"
    }));

    _.extend(XM.QualityTest, {
      /** @scope XM.QualityTest */
      
      /**
        Test Status - Open.

        @static
        @constant
        @type String
        @default O
      */
      STATUS_OPEN: 'O',

      /**
        Test Status - Pass.

        @static
        @constant
        @type String
        @default P
      */
      STATUS_PASS: 'P',

      /**
        Test Status - Fail.

        @static
        @constant
        @type String
        @default F
      */
      STATUS_FAIL: 'F',
      
    });
    
    /**
      @class

      @extends XM.Model
    */
    XM.QualityTestEmailProfile = XM.Model.extend(
      /** @lends XM.QualityTestEmail.prototype */{

      recordType: "XM.QualityTestEmailProfile"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.QualityTestList = XM.Info.extend({

      recordType: "XM.QualityTestList",
      editableModel: "XM.QualityTest"

    });

    XM.QualityTestList = XM.QualityTestList.extend(XM.QualityTestStatus);

    /**
      @class

      @extends XM.Info
    */
    XM.QualityTestRelation = XM.Info.extend({
    /** @scope XM.QualityTestRelation.prototype */

      recordType: 'XM.QualityTestRelation',

      editableModel: 'XM.QualityTest',

      descriptionKey: "number"

    });

    XM.QualityTestItem = XM.Model.extend({

      recordType: "XM.QualityTestItem",
      enforceUpperKey: false,

      idAttribute: "uuid",

      parentKey: 'qualityTest',

      handlers: {
        "change:actual": "testResultEntered",
        "change:result": "testStatusChanged",
        "change:qualityTest": "qualityTestChanged"
      },


      readOnlyAttributes: [
        "lineNumber",
        "target",
        "description",
        "instructions",
        "testUnit"
      ],

      initialize: function () {
        XM.Model.prototype.initialize.apply(this, arguments);
//        this.setReadOnly(["actual"], this.get("testType") === XM.QualityPlan.TESTTYPE_BOOLEAN);
      },

      testStatusChanged: function () {
        var parent = this.getParent();
        if (parent) {
          parent.checkTestItemStatus();
        }
      },

      testResultEntered: function () {
        if (this.get("testType") === XM.QualitySpecification.TESTTYPE_NUMERIC) {
          var x = parseFloat(this.get("actual")),
          passFail = (this.get("lower") <= x && x <= this.get("upper"));

          this.set("result", passFail ? XM.QualityTest.STATUS_PASS : XM.QualityTest.STATUS_FAIL);
        }
      },

      qualityTestChanged: function () {
        var qualityTest = this.get("qualityTest"),
         lineNumber = this.get("lineNumber"),
         lineNumberArray,
         maxLineNumber;

        if (!this.isReady()) { return; } // Can't silence backbone relation events

        // Set next line number to be 1 more than the highest living model
        if (qualityTest && !lineNumber) {
          lineNumberArray = _.compact(_.map(qualityTest.get("qualityTestItems").models, function (model) {
            return model.isDestroyed() ? null : model.get("lineNumber");
          }));
          maxLineNumber = lineNumberArray.length > 0 ? Math.max.apply(null, lineNumberArray) : 0;
          this.set("lineNumber", maxLineNumber + 1);
        }
      },
 
    });

    XM.QualityTestItem = XM.QualityTestItem.extend(XM.QualityTestStatusMixin);

    /**
      @class

      @extends XM.Workflow
    */
    XM.QualityTestWorkflow = XM.Workflow.extend(
      /** @scope XM.QualityTestWorkflow.prototype */ {

      recordType: 'XM.QualityTestWorkflow',

      parentStatusAttribute: 'testDisposition',
    
      getQualityTestWorkflowStatusString: function () {
        return XM.QualityTestWorkflow.prototype.getWorkflowStatusString.call(this);
      }

    });

    _.extend(XM.QualityTestWorkflow, {
 
       /**
          Test Disposition - In Process (Tests not completed).

          @static
          @constant
          @type String
          @default OK
       */
      DISPOSITION_INPROCESS: 'I',

       /**
          Test Disposition - Release (All OK).

          @static
          @constant
          @type String
          @default OK
       */
      DISPOSITION_RELEASE: 'OK',

       /**
          Test Disposition - Quarantine.

          @static
          @constant
          @type String
          @default Q
       */
      DISPOSITION_QUARANTINE: 'Q',

       /**
          Test Disposition - Rework.

          @static
          @constant
          @type String
          @default R
       */
      DISPOSITION_REWORK: 'R',

       /**
          Test Disposition - Scrap.

          @static
          @constant
          @type String
          @default S
       */
      DISPOSITION_SCRAP: 'S',
    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.QualityTestsCollection = XM.Collection.extend({
      model: XM.QualityTestList
    });

  };
}());
