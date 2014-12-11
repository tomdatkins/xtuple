/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {

  "use strict";

  XT.extensions.quality.initQualityPlanModels = function () {

/* =========================================================
*  Quality Control Plans
*  ========================================================= */
    XM.QualityPlan = XM.Document.extend({

      recordType: "XM.QualityPlan",
      documentKey: "uuid",
      idAttribute: "uuid",
      enforceUpperKey: false,
      keyIsString: false,
      
      handlers: {
        "status:READY_CLEAN": "statusReadyClean",
        "change:revisionNumber": "revisionNumberDidChange"
      },
      
      defaults: function () {
        return {
          revisionStatus: XM.QualityPlan.PENDING_STATUS
        };
      },
           
      statusReadyClean: function (model, value, options) {
        var revisionNumber = this.get("revisionNumber"),
          inactiveStatus = this.get("revisionStatus") === XM.QualityPlan.INACTIVE_STATUS;
        
        if (!this.meta) {
          this.meta = new Backbone.Model({
            currentRevision: revisionNumber
          });
        }
        
        if (inactiveStatus) {
          this.setReadOnly();
        }
      },
      
      revisionNumberDidChange: function () {
        var newRevision = this.get("revisionNumber"),
          activeRevision = this.get("revisionStatus") === XM.QualityPlan.ACTIVE_STATUS,
          oldRevision,
          params = {},
          that = this;
        
        if (this.meta) {
          oldRevision  = this.meta.get("currentRevision");
        } else {
          return;
        }
          
        if (newRevision < oldRevision) {
          that.set({revisionNumber: oldRevision});
          return XT.Error.clone('quality1008', { params: params });
        }
        
        if (newRevision > oldRevision && activeRevision) {
          this.notify("_confirmRevisionUpdate".loc(), {
            type: XM.Model.QUESTION,
            callback: function (response) {
              if (!response.answer) {
                that.set({ revisionNumber: oldRevision });
              } else {
                that.set({
                  revisionDate: XT.date.today(),
                  revisionStatus: XM.QualityPlan.ACTIVE_STATUS
                });
              }
            }
          });
          return;
        }
      },
      
      resetPlanModel: function () {
        var workflowModel;
          
        this.setStatus(XM.Model.READY_NEW);  // Trigger save new model
        
        this.set({uuid: XT.generateUUID()}); // Reset the model uuid
        
        // Now reset all item uuids to avoid dupls
        _.each(this.get("items").models, function (model) {
          model.set({uuid: XT.generateUUID()});
        });
        _.each(this.get("itemSiteAssignment").models, function (model) {
          model.set({uuid: XT.generateUUID()});
        });
        workflowModel = _.map(this.get("workflow").models, function (model) {
          var oldUUID = model.get("uuid");
          model.set({uuid: XT.generateUUID()});
          return { olduuid: oldUUID, newuuid: model.get("uuid") };
        });
        
        // Rebuild Workflow relationships
        _.each(this.get("workflow").models, function (model) {
          var uuid;
          if (model.get("completedSuccessors")) {
            uuid = _.findWhere(workflowModel, {olduuid: model.get("completedSuccessors")});
            model.set({ completedSuccessors: uuid.newuuid });
          }
          if (model.get("deferredSuccessors")) {
            uuid = _.findWhere(workflowModel, {olduuid: model.get("deferredSuccessors")});
            model.set({ deferredSuccessors: uuid.newuuid });
          }
        });
        
        // Clear out comments so new model can create its own
        this.set({ comments: [] });
      },
      
      validate: function (attributes) {
        var revisionHasChanged,
          newStatus = this.getStatus() === XM.Model.READY_NEW;

        // If the Revision Number has been updated then save the record as a NEW record.
        // Use trigger to set existing active plans to inactive.        
        if (this.meta && !newStatus) {
          revisionHasChanged = this.get("revisionNumber") !== this.meta.get("currentRevision");
          if (revisionHasChanged) { this.resetPlanModel(); }
        }
        
        if (this.get("revisionNumber") && !this.get("revisionDate")) {
          this.set({ revisionDate: XT.date.today() });
        }
          
        // if our custom validation passes, then just test the usual validation
        return XM.Model.prototype.validate.apply(this, arguments);
      }
      
    });

    _.extend(XM.QualityPlan, {
      /** @scope XM.QualityPlan */
      
      /**
        Pending Status.

        @static
        @constant
        @type String
        @default P
      */
      PENDING_STATUS: 'P',

      /**
        Active Status.

        @static
        @constant
        @type String
        @default A
      */
      ACTIVE_STATUS: 'A',

      /**
        In-Active Status.

        @static
        @constant
        @type String
        @default I
      */
      INACTIVE_STATUS: 'I'

    });

    /**
      @class

      @extends XM.Info
    */
    XM.QualityPlanList = XM.Info.extend({

      recordType: "XM.QualityPlanList",
      editableModel: "XM.QualityPlan",
      
      canCreateTest: function (callback) {
        var status = this.getValue("revisionStatus"),
          K = XM.QualityPlan,
          statusIsValid = status === K.ACTIVE_STATUS;

        if (callback) { callback(statusIsValid); }

        return this;
      }

    });

    /**
      @class

      @extends XM.Info
    */
    XM.QualityPlanRelation = XM.Info.extend({
    /** @scope XM.QualityPlanRelation.prototype */

      recordType: 'XM.QualityPlanRelation',

      editableModel: 'XM.QualityPlan',

      descriptionKey: "description"

    });

    XT.documentAssociations.QPLAN = {
      model: "XM.QualityPlanRelation",
      label: "_qualityPlan".loc()
    };
    
    /**
      @class

      @extends XM.Document
    */
    XM.QualityPlanItem = XM.Model.extend({

      recordType: "XM.QualityPlanItem",
      enforceUpperKey: false,

      idAttribute: "uuid",

      parentKey: "qualityPlan"

    });

    XM.QualityPlanItemSiteAssignment = XM.Model.extend({

      recordType: "XM.QualityPlanItemSiteAssignment",

      idAttribute: "uuid",

      parentKey: "qualityPlan",
           
      defaults: function () {
        return {
          frequency_type: XM.QualityPlanItemSiteAssignment.TESTFREQ_ALL,
          frequency: 0
        };
      },
      
      handlers: {
        "change:frequency_type": "typeDidChange",
        "change:item": "itemSiteDidChange",
        "change:site": "itemSiteDidChange",
        "status:READY_NEW": "typeDidChange",
        "status:READY_CLEAN": "typeDidChange"
      },
      
      
      initialize: function (attributes, options) {
        options = options ? _.clone(options) : {};
        XM.Model.prototype.initialize.apply(this, arguments);
        
        if (!this.meta) {
          this.meta = new Backbone.Model({
            itemSite: XM.ItemSiteInventory
          });
        }
      },
      
      itemSiteDidChange: function () {
        this.validate(this.attributes);
      },
        
      validate: function (attributes) {
        var params = {},
          itemSite,
          freqType,
          isLot,
          isSerial,
          K = XM.QualityPlanItemSiteAssignment;
          
        if (!attributes.item || !attributes.site) {
          return XT.Error.clone('quality1007', { params: params });
        }

        this.fetchItemSite();
        itemSite = this.getValue("itemSite");
        
        if (_.isObject(itemSite) && !_.isFunction(itemSite)) {
          freqType = this.get("frequency_type");
          isLot = itemSite.get("controlMethod") === "L";
          isSerial = itemSite.get("controlMethod") === "S";
        }
        
        if (freqType === K.TESTFREQ_LOT && !isLot) {
          this.set("frequency_type", K.TESTFREQ_ALL);
          return XT.Error.clone('quality1005', { params: params });
        }
        if (freqType === K.TESTFREQ_SERIAL && !isSerial) {
          this.set("frequency_type", K.TESTFREQ_ALL);
          return XT.Error.clone('quality1006', { params: params });
        }

        if (!attributes.operation && !attributes.production && !attributes.receipt && !attributes.shipment) {
          return XT.Error.clone('quality1003', { params: params });
        }
        if (attributes.frequency_type === XM.QualityPlanItemSiteAssignment.TESTFREQ_SAMPLE && attributes.frequency <= 0) {
          return XT.Error.clone('quality1004', { params: params });
        }
        // if our custom validation passes, then just test the usual validation
        return XM.Model.prototype.validate.apply(this, arguments);
      },
      
      typeDidChange: function () {
        var type = this.get("frequency_type") === XM.QualityPlanItemSiteAssignment.TESTFREQ_SAMPLE;

        this.setReadOnly(["frequency"], !type);
      },
      
      fetchItemSite: function () {
        var item = this.get("item"),
          site = this.get("site"),
          itemSites = new XM.ItemSiteInventoryCollection(),
          options = {},
          that = this;

        options.success = function () {
          var itemSite;
          
          if (itemSites.length) {
            itemSite = itemSites.first();
            that.setValue("itemSite", itemSite);
          }
        };

        options.error = function (resp) {
          XT.log(resp);
        };

        if (item && site) {
          options.query = {
            parameters: [
              {attribute: "item", value: item},
              {attribute: "site", value: site}
            ]
          };

          itemSites.fetch(options);
        }
      }

    });
    
    _.extend(XM.QualityPlanItemSiteAssignment, {
          /**
        Test Frequency - First Item(s).

        @static
        @constant
        @type String
        @default F
      */
      TESTFREQ_FIRST: 'F',

      /**
        Test Frequency - Last Item(s).

        @static
        @constant
        @type String
        @default L
      */
      TESTFREQ_LAST: 'L',

      /**
        Test Frequency - Sample Frequency Item(s).
        Have to also define the frequency

        @static
        @constant
        @type String
        @default R
      */
      TESTFREQ_SAMPLE: 'S',

      /**
        Test Frequency - All Item(s).

        @static
        @constant
        @type String
        @default A
      */
      TESTFREQ_ALL: 'A',

      /**
        Test Frequency - Lot(s).

        @static
        @constant
        @type String
        @default LOT
      */
      TESTFREQ_LOT: 'LOT',

      /**
        Test Frequency - Serial Item(s).

        @static
        @constant
        @type String
        @default SER
      */
      TESTFREQ_SERIAL: 'SER'
      
    });

    /**
      @class

      @extends XM.Model
    */
    XM.QualityPlanComment = XM.Comment.extend({

      recordType: "XM.QualityPlanComment",

      sourceName: "QPLAN"

    });

    /**
      @class

      @extends XM.WorkflowSource
   */
    XM.QualityPlanWorkflow = XM.WorkflowSource.extend(
      /** @scope XM.QualityPlanWorkflow.prototype */ {

      recordType: 'XM.QualityPlanWorkflow',
      
      handlers: {
        "change:status": "statusDidChange"
      },
      
      statusDidChange: function () {
        var WF = XM.QualityTestWorkflow;
        
        if (this.get("status") === 'I') {
          this.set("workflowType", WF.DISPOSITION_INPROCESS);
        }
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.QualityPlanEmailProfile = XM.Document.extend(
      /** @lends XM.WorkOrderEmail.prototype */{

      recordType: "XM.QualityPlanEmailProfile",
      documentKey: "name"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.QualityPlansCollection = XM.Collection.extend({
      model: XM.QualityPlanList
    });

    /**
      @class

      @extends XM.Collection
    */
    XM.QualityPlansRelationCollection = XM.Collection.extend({
      model: XM.QualityPlanRelation
    });

    /**
      @class

      @extends XM.Collection
    */
    XM.QualityPlanEmailProfileCollection = XM.Collection.extend(
      /** @lends XM.QualityPlanEmailProfileCollection.prototype */{
      model: XM.QualityPlanEmailProfile
    });

  };
}());
