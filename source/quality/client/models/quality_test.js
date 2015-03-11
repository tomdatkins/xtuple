/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global Globalize:true, XT:true, XM:true, Backbone:true, _:true,
  console:true, async:true, window:true */

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
        this.setReadOnly(["qualityPlan"], this.get("qualityPlan"));
        this.setReadOnly(["reasonCode"], this.get("testStatus") !== XM.QualityTest.STATUS_FAIL);
        this.setReadOnly(["releaseCode"]);
      },

      qualityPlanDidChange: function () {
        var rev = this.get("revisionNumber"),
          workflow = this.get("workflow"),
          planCode = this.get("qualityPlan") ? this.get("qualityPlan").id : null;

        if (!rev && planCode) {
          this.createFromQualityPlan(planCode, rev);
        }
        if (workflow.length === 0) {
          this.inheritWorkflowSource(this.get("qualityPlan"), false, "XM.QualityTestWorkflow");
        }
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
          this.setReadOnly(["reasonCode"], false);
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
            workflowDisposition,
            params = {},
            hasPrivilege = XT.session.privileges.get("ReleaseQualityTests"),
            failedItems = this.get("qualityTestItems").every(function (items) { return items.getValue("result") === K.STATUS_FAIL; });


        if (testStatus === K.STATUS_OPEN) { return; } // Do nothing

        /* Overall Test PASSED then set open workflow items to Completed elseif Test FAILED then set open workflow items to Deferred */
        workflowDisposition = testStatus === K.STATUS_PASS ? XM.Workflow.COMPLETED : XM.Workflow.DEFERRED;
        _.each(this.get("workflow").where(
            {workflowType: XM.QualityTestWorkflow.DISPOSITION_INPROCESS}),
            function (workflow) {
              workflow.set({status: workflowDisposition});
            });

        /* Open up Release Code if any test items FAIL and manually overridden to PASS */
        /* But only if the user is permitted to do so */
        if (failedItems && testStatus === K.STATUS_PASS) {
          if (hasPrivilege) {
            this.setReadOnly(["releaseCode"], false);
          } else {
            var err = XT.Error.clone('quality1010', { params: params });
            this.notify(err.message());
            this.set("testStatus", XM.QualityTest.STATUS_FAIL);
          }
        }
      },

      createFromQualityPlan: function (id, rev) {
        var plan = new XM.QualityPlan(),
          fetchOptions = {},
          that = this,
          K = XM.QualityTest;

        fetchOptions.id = id;

        console.log("Creating Quality Test from Quality Plan: " + id);

        fetchOptions.success = function (resp) {
          // Create the Quality Test
          that.set({
              "qualityPlan": plan.get("uuid"),
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

      completeWorkflow: function (wf, done) {
        _.each(_.where(this.get("workflow").models, {id: wf}),
          function (workflow) {
            workflow.set({status: XM.Workflow.COMPLETED});
          });
        this.save();
        done();
      },

      validate: function (attributes) {
        var K = XM.QualityTest,
          params = {},
          testStatus = this.get("testStatus"),
          failedItems,
          shouldHaveRelease,
          releaseCode = this.get("releaseCode");

        failedItems = this.get("qualityTestItems").every(function (items) { return items.getValue("result") === K.STATUS_FAIL; });
        shouldHaveRelease = (failedItems && testStatus === K.STATUS_PASS);

        if (shouldHaveRelease && !releaseCode) {
          XT.Error.clone('quality1009', { params: params });
        }
          
        // if our custom validation passes, then just test the usual validation
        return XM.Model.prototype.validate.apply(this, arguments);
      }

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

      @extends XM.Document
    */
    XM.QualityReleaseCode = XM.Document.extend(
      /** @lends XM.QualityReleaseCode.prototype */{

      recordType: "XM.QualityReleaseCode",

      documentKey: "name",

      enforceUpperKey: true,

    });

    /**
      @class

      @extends XM.Document
    */
    XM.QualityReasonCode = XM.Document.extend(
      /** @lends XM.QualityReasonCode.prototype */{

      recordType: "XM.QualityReasonCode",

      documentKey: "name",

      enforceUpperKey: true,

    });
    

    /**
      @class

      @extends XM.Info
    */
    XM.QualityTestList = XM.Info.extend({

      recordType: "XM.QualityTestList",
      editableModel: "XM.QualityTest",

      canPrintNCR: function (callback) {
        var failStatus = this.get("testStatus") === XM.QualityTest.STATUS_FAIL;

        if (callback) { callback(failStatus); }
        return this;
      },

      canPrintCert: function (callback) {
        var passStatus = this.get("testStatus") === XM.QualityTest.STATUS_PASS;

        if (callback) { callback(passStatus); }
        return this;
      },

      canPrintWOSummary: function (callback) {
        var isWO = (this.get("orderType") === 'WO' ||
                    this.get("orderType") === 'OP');
        if (callback) { callback(isWO); }
        return this;
      }
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
    
    XT.documentAssociations.QTEST = {
      model: "XM.QualityTestRelation",
      label: "_qualityTest".loc()
    };

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

        if (!this.isReady()) { return; }

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
    
    /**
      @class

      @extends XM.Collection
    */
    XM.QualityReasonCodeCollection = XM.Collection.extend(
      /** @lends XM.QualityReasonCodeCollection.prototype */{
      model: XM.QualityReasonCode
    });

    /**
      @class

      @extends XM.Collection
    */
    XM.QualityReleaseCodeCollection = XM.Collection.extend(
      /** @lends XM.QualityReleaseCodeCollection.prototype */{
      model: XM.QualityReleaseCode
    });

  };
}());
