/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initRoutingModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.LaborRate = XM.Document.extend(
      /** @lends XM.LaborRate.prototype */{

      recordType: "XM.LaborRate",

      documentKey: "code",

      enforceUpperKey: false

    });

    /**
      @class

      @extends XM.Document
    */
    XM.WorkCenter = XM.Document.extend(
      /** @lends XM.WorkCenter.prototype */{

      recordType: "XM.WorkCenter",

      documentKey: "code",

      enforceUpperKey: false

    });
    
    /**
      @class

      @extends XM.Document
    */
    XM.OperationType = XM.Document.extend(
      /** @lends XM.OperationType.prototype */{

      recordType: "XM.OperationType",

      documentKey: "name",

      enforceUpperKey: false,
      
      handlers: {
        "status:READY_CLEAN": "statusReadyClean"
      },
      
      statusReadyClean: function () {
        var isSystem = this.get("isSystem");

        this.setReadOnly(["name", "description"], isSystem);
      },
      
      canDelete: function (callback) {
        if (callback) { callback(!this.get("isSystem")); }
        return this;
      },
      
      deleteItem: function (done) {
        var options = {},
          that = this;
        
        options.success = function (resp) {
          done();
        };      
        this.destroy(options);
      }

    });    

    /**
      @class

      @extends XM.Document
    */
    XM.StandardOperation = XM.Document.extend(
      /** @lends XM.StandardOperation.prototype */{

      recordType: "XM.StandardOperation",

      enforceUpperKey: false,
      
      validate: function (attributes) {
        var params = {},
          setup = this.get("setupTime"),
          run = this.get("runTime");
          
        if (attributes.standardTimes && setup <= 0 && run <= 0) {
          return XT.Error.clone('mfg1004', { params: params });
        }
        // if our custom validation passes, then just test the usual validation
        return XM.Model.prototype.validate.apply(this, arguments);
      }
                
    });

    _.extend(XM.StandardOperation, {
      /**
        Standard Operations - Report Costs As
        
        Direct Labor
        @static
        @constant
        @type String
        @default D
      */
      STDOPN_DIRECT: 'D',
      /* Overhead
        @static
        @constant
        @type String
        @default O
      */
      STDOPN_OVERHEAD: 'O',
      /* None
        @static
        @constant
        @type String
        @default N
      */
      STDOPN_NONE: 'N'
    });

    /**
      @class

      @extends XM.Model
    */
    XM.Routing = XM.Model.extend(
      /** @lends XM.Routing.prototype */{

      recordType: "XM.Routing"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.RoutingListItem = XM.Info.extend(
      /** @lends XM.RoutingListItem.prototype */{

      recordType: "XM.RoutingListItem",

      editableModel: "XM.Routing"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.RoutingRelation = XM.Info.extend(
      /** @lends XM.RoutingRelation.prototype */{

      recordType: "XM.RoutingRelation",

      editableModel: "XM.Routing"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.RoutingOperation = XM.Model.extend(
      /** @lends XM.RoutingOperation.prototype */{

      recordType: "XM.RoutingOperation"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.RoutingOperationRelation = XM.Model.extend(
      /** @lends XM.RoutingOperationRelation.prototype */{

      recordType: "XM.RoutingOperationRelation"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.RoutingRevision = XM.Model.extend(
      /** @lends XM.RoutingRevision.prototype */{

      recordType: "XM.RoutingRevision"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.LaborRateCollection = XM.Collection.extend(
      /** @lends XM.LaborRateCollection.prototype */{

      model: XM.LaborRate

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.OperationTypeCollection = XM.Collection.extend(
      /** @lends XM.OperationTypeCollection.prototype */{

      model: XM.OperationType

    });
    
    /**
      @class

      @extends XM.Collection
    */
    XM.WorkCenterCollection = XM.Collection.extend(
      /** @lends XM.WorkCenterCollection.prototype */{

      model: XM.WorkCenter

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.StandardOperationCollection = XM.Collection.extend(
      /** @lends XM.StandardOperationCollection.prototype */{

      model: XM.StandardOperation

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.RoutingCollection = XM.Collection.extend(
      /** @lends XM.RoutingCollection.prototype */{

      model: XM.Routing

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.RoutingListItemCollection = XM.Collection.extend(
      /** @lends XM.RoutingListItemCollection.prototype */{

      model: XM.RoutingListItem

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.RoutingRevisionCollection = XM.Collection.extend(
      /** @lends XM.RoutingRevisoinCollection.prototype */{

      model: XM.RoutingRevision

    });

  };

}());
