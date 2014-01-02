/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initWorkOrderModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderEmailProfile = XM.Model.extend(
      /** @lends XM.WorkOrderEmail.prototype */{

      recordType: "XM.WorkOrderEmailProfile"

    });

    XM.WorkOrderStatus = {

      /**
      Returns Work Order status as a localized string.

      @returns {String}
      */
      getWorkOrderStatusString: function () {
        var K = XM.WorkOrder,
          status = this.get('status');

        switch (status)
        {
        case K.RELEASED_STATUS:
          return '_released'.loc();
        case K.EXPLODED_STATUS:
          return '_exploded'.loc();
        case K.INPROCESS_STATUS:
          return '_in-process'.loc();
        case K.OPEN_STATUS:
          return '_open'.loc();
        case K.CLOSED_STATUS:
          return '_closed'.loc();
        }
      },

      isActive: function () {
        return this.get("status") !== XM.WorkOrder.CLOSED_STATUS;
      }

    };

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrder = XM.Model.extend({
      /** @lends XM.WorkOrder.prototype */

      recordType: 'XM.WorkOrder',

      /**
        Calculate the balance remaining to issue.

        @returns {Number}
      */
      postBalance: function () {
        var quantity = this.get("quantity"),
          received = this.get("received"),
          toPost = XT.math.subtract(received, quantity, XT.QTY_SCALE);
        return toPost >= 0 ? toPost : 0;
      }

    });

    XM.WorkOrder = XM.WorkOrder.extend(XM.WorkOrderStatus);

    _.extend(XM.WorkOrder, {
      /** @scope XM.WorkOrder */

      /**
        Open Status.

        @static
        @constant
        @type String
        @default O
      */
      OPEN_STATUS: 'O',

      /**
        Expoloded status.

        @static
        @constant
        @type String
        @default E
      */
      EXPLODED_STATUS: 'E',

      /**
        In-Process status.

        @static
        @constant
        @type String
        @default I
      */
      INPROCESS_STATUS: 'I',

      /**
        Released Status.

        @static
        @constant
        @type String
        @default R
      */
      RELEASED_STATUS: 'R',

      /**
        Open Status.

        @static
        @constant
        @type String
        @default C
      */
      CLOSED_STATUS: 'C',

      /**
        Start Date.

        @static
        @constant
        @type String
        @default S
      */
      START_DATE: 'S',

      /**
        Explosion Date.

        @static
        @constant
        @type String
        @default E
      */
      EXPLOSION_DATE: 'E',

      /**
        Single Level.

        @static
        @constant
        @type String
        @default S
      */
      SINGLE_LEVEL: 'S',

      /**
        Multiple Level.

        @static
        @constant
        @type String
        @default M
      */
      MULTIPLE_LEVEL: 'M',

      /**
        To Date.

        @static
        @constant
        @type String
        @default D
      */
      TO_DATE: 'D',

      /**
        Proportional.

        @static
        @constant
        @type String
        @default P
      */
      PROPORTIONAL: 'P'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderMaterial = XM.Model.extend({

      recordType: "XM.WorkOrderMaterial"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderOperation = XM.Model.extend({

      recordType: "XM.WorkOrderOperation"

    });

    /**
      @class

      @extends XM.CharacteristicAssignment
    */
    XM.WorkOrderCharacteristic = XM.CharacteristicAssignment.extend(
      /** @lends XM.WorkOrderCharacteristic.prototype */{

      recordType: "XM.WorkOrderCharacteristic",

      canView: function () {
        return true;
      }

    });

    /**
      @class

      @extends XM.Comment
    */
    XM.WorkOrderComment = XM.Comment.extend({

      recordType: "XM.WorkOrderComment",

      sourceName: "W"

    });


    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderWorkflow = XM.Workflow.extend(/** @lends XM.WorkOrderWorkflow.prototype */{

      recordType: "XM.PurchaseOrderWorkflow",

      getWorkOrderWorkflowStatusString: function () {
        return XM.WorkOrderWorkflow.prototype.getWorkflowStatusString.call(this);
      }

    });

    _.extend(XM.WorkOrderWorkflow, /** @lends XM.WorkOrderWorkflow# */{

      TYPE_OTHER: "O",

      TYPE_ISSUE_MATERIAL: "I",

      TYPE_POST_PRODUCTION: "P"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.WorkOrderRelation = XM.Info.extend({
      /** @lends XM.WorkOrderRelation.prototype */

      recordType: 'XM.WorkOrderRelation',

      editableModel: 'XM.WorkOrder'

    });

    /**
      @class

      @extends XM.Info
    */
    XM.WorkOrderListItem = XM.Info.extend({
      /** @lends XM.WorkOrderListItem.prototype */

      recordType: 'XM.WorkOrderListItem',

      editableModel: 'XM.WorkOrder',

      canIssueMaterial: function (callback) {
        var hasPrivilege = XT.session.privileges.get("IssueWoMaterials");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      },

      canPostProduction: function (callback) {
        var hasPrivilege = XT.session.privileges.get("PostProduction");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      }

    });

    XM.WorkOrderListItem = XM.WorkOrderListItem.extend(XM.WorkOrderStatus);

    /**
      @class

      @extends XM.Model
    */
    XM.WorkOrderListItemCharacteristic = XM.Model.extend({
      /** @scope XM.WorkOrderListItemCharacteristic.prototype */

      recordType: "XM.WorkOrderListItemCharacteristic"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.WorkOrderListItemCollection = XM.Collection.extend(
      /** @lends XM.WorkOrderListItemCollection.prototype */{

      model: XM.WorkOrderListItem

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.WorkOrderRelationCollection = XM.Collection.extend(
      /** @lends XM.WorkOrderRelationCollection.prototype */{

      model: XM.WorkOrderRelation

    });

  };

}());
