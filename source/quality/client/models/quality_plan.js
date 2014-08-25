/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initQualityPlanModels = function () {

/* =========================================================
*  Quality Control Plans
*  ========================================================= */
    XM.QualityPlan = XM.Document.extend({

      recordType: "XM.QualityPlan",
      documentKey: "code",
      
      defaults: function () {
        return {
          revisionStatus: XM.QualityPlan.PENDING_STATUS
        };
      },
      
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

      readOnlyAttributes: [
        "operation"
      ],
            
      defaults: function () {
        return {
          frequency_type: XM.QualityPlanItemSiteAssignment.TESTFREQ_ALL,
          frequency: 0
        };
      },
      
      handlers: {
        "change:frequency_type": "typeDidChange",
        "change:item": "itemSiteDidChange",
        "change:site": "itemSiteDidChange"
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

    });

    /**
      @class

      @extends XM.Model
    */
    XM.QualityPlanEmailProfile = XM.Model.extend(
      /** @lends XM.WorkOrderEmail.prototype */{

      recordType: "XM.QualityPlanEmailProfile"

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
