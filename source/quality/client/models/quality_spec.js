/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initQualitySpecModels = function () {

/* =========================================================
*  Quality Control Test Specification
*  ========================================================= */

    /**
      @class

      @extends XM.Info
    */
    XM.QualitySpecList = XM.Info.extend({

      recordType: "XM.QualitySpecList",
      editableModel: "XM.QualitySpecification",
      
    });
    
    /**
      @class

      @extends XM.Info
    */
    XM.QualitySpecRelation = XM.Info.extend({
    /** @scope XM.QualitySpecRelation.prototype */

      recordType: 'XM.QualitySpecRelation',

      editableModel: 'XM.QualitySpecification',

      descriptionKey: "description"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.QualitySpecification = XM.Document.extend({

      recordType: "XM.QualitySpecification",
      enforceUpperKey: false,
      documentKey: "code",

      idAttribute: "code",

      handlers: {
        "change:testType": "typeDidChange",
        "status:READY_CLEAN": "statusReadyClean"
      },

      typeDidChange: function () {
        var testTypeIsNumeric = this.get("testType") === XM.QualitySpecification.TESTTYPE_NUMERIC;

        this.setReadOnly(["target", "upper", "lower", "testUnit"], !testTypeIsNumeric);

      },
      
      statusReadyClean: function () {
        this.typeDidChange();
      },

      validate: function (attributes) {
        var K = XM.QualitySpecification,
          params = {};

        if (attributes.testType === K.TESTTYPE_NUMERIC && (attributes.target < attributes.lower || attributes.target >= attributes.upper)) {
          return XT.Error.clone('quality1001', { params: params });
        }

        if (attributes.testType === K.TESTTYPE_NUMERIC && !attributes.testUnit) {
          return XT.Error.clone('quality1002', { params: params });
        }
        // if our custom validation passes, then just test the usual validation
        return XM.Model.prototype.validate.apply(this, arguments);
      }

    });
    
    _.extend(XM.QualitySpecification, {
      /** @scope XM.QualitySpecification */
      
      /**
        Test Type - Text Entry.

        @static
        @constant
        @type String
        @default T
      */
      TESTTYPE_TEXT: 'T',

      /**
        Test Type - Numeric (Quantitative) Entry.

        @static
        @constant
        @type String
        @default N
      */
      TESTTYPE_NUMERIC: 'N',

      /**
        Test Type - Boolean (Pass/Fail) Entry.

        @static
        @constant
        @type String
        @default B
      */
      TESTTYPE_BOOLEAN: 'B',

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.QualitySpecsCollection = XM.Collection.extend({
      model: XM.QualitySpecList
    });

    /**
      @class

      @extends XM.Collection
    */
    XM.QualitySpecsRelationCollection = XM.Collection.extend({
      model: XM.QualitySpecRelation
    });
    
  };
}());
