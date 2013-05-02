/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initLeaveModels = function () {

    /**
      @class

      @extends XM.Model
    */
    OHRM.Leave = OHRM.Model.extend(/** @lends OHRM.Leave.prototype */ {

      recordType: 'OHRM.Leave',

      requiredAttributes: [
        "employee",
        "leaveRequest",
        "leaveType"
      ]

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveComment = OHRM.Comment.extend(/** @lends OHRM.LeaveComment.prototype */ {

      recordType: 'OHRM.LeaveComment',

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveAdjustment = OHRM.Model.extend(/** @lends OHRM.LeaveAdjustment.prototype */ {

      recordType: 'OHRM.LeaveAdjustment'

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveStatus = OHRM.Model.extend(/** @lends OHRM.LeaveStatus.prototype */ {

      recordType: 'OHRM.LeaveStatus'

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveType = OHRM.Model.extend(/** @lends OHRM.LeaveType.prototype */ {

      recordType: 'OHRM.LeaveType'

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveRequest = OHRM.Model.extend(/** @lends OHRM.LeaveRequest.prototype */ {

      recordType: 'OHRM.LeaveRequest',

      requiredAttributes: [
        "employee",
        "leaveType",
        "dateApplied"
      ]

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveRequestRelation = OHRM.Info.extend(/** @lends OHRM.LeaveRequest.prototype */ {

      recordType: 'OHRM.LeaveRequestRelation',

      editableModel: 'OHRM.LeaveRequest'

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveRequestComment = OHRM.Comment.extend(/** @lends OHRM.LeaveRequestComment.prototype */ {

      recordType: 'OHRM.LeaveRequestComment'

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveCollection = XM.Collection.extend(/** @lends XM.LeaveCollection.prototype */{

      model: OHRM.Leave

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveCommentCollection = XM.Collection.extend(/** @lends XM.LeaveCommentCollection.prototype */{

      model: OHRM.LeaveComment

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveAdjustmentCollection = XM.Collection.extend(/** @lends XM.LeaveAdjustmentCollection.prototype */{

      model: OHRM.LeaveAdjustment

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveStatusCollection = XM.Collection.extend(/** @lends XM.LeaveStatusCollection.prototype */{

      model: OHRM.LeaveStatus

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveTypeCollection = XM.Collection.extend(/** @lends XM.LeaveTypeCollection.prototype */{

      model: OHRM.LeaveType

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveRequestCollection = XM.Collection.extend(/** @lends XM.LeaveRequestCollection.prototype */{

      model: OHRM.LeaveRequest

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveRequestRelationCollection = XM.Collection.extend(/** @lends XM.LeaveRequestRelationCollection.prototype */{

      model: OHRM.LeaveRequestRelation

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveRequestCommentCollection = XM.Collection.extend(/** @lends XM.LeaveRequestCommentCollection.prototype */{

      model: OHRM.LeaveRequestComment

    });



  };

}());

