/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Globalize:true, OHRM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initLeaveModels = function () {

    // thanks http://stackoverflow.com/questions/3464268/find-day-difference-between-two-dates-excluding-weekend-days
    // TODO: orange lets you set your own working days and holidays.
    // this just does M-F on, S&S off
    function _calcBusinessDays(dDate1, dDate2) { // input given as Date objects
      var iWeeks, iDateDiff, iAdjust = 0;
      if (dDate2 < dDate1) return -1; // error code if dates transposed
      var iWeekday1 = dDate1.getDay(); // day of week
      var iWeekday2 = dDate2.getDay();
      iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
      iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
      if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
      iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
      iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

      // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
      iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

      if (iWeekday1 <= iWeekday2) {
        iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
      } else {
        iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
      }

      iDateDiff -= iAdjust // take into account both days on weekend

      return (iDateDiff + 1); // add 1 because dates are inclusive
    };

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
      ],

      readOnlyAttributes: [
        "lengthDays"
      ],

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on("change:employee", this.getEntitledLeave);
        this.on("change:leaveType", this.getEntitledLeave);
        this.on("change:date", this.calculateDayLength);
        this.on("change:lengthDays", this.calculateLeave);
      },

      defaults: function () {
        var result = {};

        // XXX demo hack
        // not clear from orange UI how leave requests are integrated here
        if (OHRM.leaveRequests.length > 0) {
          result.leaveRequest = OHRM.leaveRequests.models[0];
        }

        return result;
      },

      calculateLeave: function () {
        var leaveRemaining;
        if (this._entitledLeave !== undefined && this._assignedLeave !== undefined) {
          this._leaveRemaining = this._entitledLeave - this._assignedLeave;

          if (this.get("lengthDays")) {
            this._leaveRemaining -= this.get("lengthDays");
            if (this._leaveRemaining < 0) {
              this.trigger("notify", this, "_notEnoughLeave".loc(), {});
            }
          }
          this.trigger("leaveRemaining", this._leaveRemaining);
        }
      },

      getEntitledLeave: function () {
        var that = this;

        if (this.get("employee") && this.get("leaveType")) {
          // determine entitlement
          var entitlementColl = new OHRM.LeaveEntitlementCollection();
          var entitlementOptions = {
            query: {
              parameters: [{
                attribute: "employee",
                value: this.get("employee")
              }, {
                attribute: "leaveType",
                value: this.get("leaveType")
              }]
            }
          };
          entitlementOptions.success = function (collection, results) {
            that._entitledLeave = results.length ? results[0].numberOfDays : 0;
            that.calculateLeave();
          };
          entitlementColl.fetch(entitlementOptions);

          // determine leave assigned
          var leaveColl = new OHRM.LeaveCollection();
          var leaveOptions = {
            query: {
              parameters: [{
                attribute: "employee",
                value: this.get("employee")
              }, {
                attribute: "leaveType",
                value: this.get("leaveType")
              }]
            }
          };
          leaveOptions.success = function (collection, results) {
            that._assignedLeave = results.length ? results[0].lengthDays : 0;
            that.calculateLeave();
          };
          leaveColl.fetch(leaveOptions);
        }
      },

      save: function () {
        var that = this,
          saveArguments = arguments,
          options = {};

        if (this._leaveRemaining < 0) {

          options.type = XM.Model.QUESTION;
          options.callback = function (answer) {
            if (answer) {
              XM.Model.prototype.save.apply(that, saveArguments);
            }
          };
          this.trigger("notify", this, "_notEnoughLeave".loc() + " " + "_continueAnyway".loc(), options);
        } else {
          XM.Model.prototype.save.apply(this, arguments);
        }
      },

      calculateDayLength: function () {
        if (this.get("date") && this._toDate) {
          this.set("lengthDays", _calcBusinessDays(this.get("date"), this._toDate));
        }
      },

      setToDate: function (toDate) {
        this._toDate = toDate;
        this.calculateDayLength();
      }
    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveRelation = OHRM.Info.extend(/** @lends OHRM.LeaveRelation.prototype */ {

      recordType: 'OHRM.LeaveRelation',

      editableModel: 'OHRM.Leave'

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveComment = OHRM.Comment.extend(/** @lends OHRM.LeaveComment.prototype */ {

      recordType: 'OHRM.LeaveComment'

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveAdjustment = OHRM.Model.extend(/** @lends OHRM.LeaveAdjustment.prototype */ {

      recordType: 'OHRM.LeaveAdjustment',

      requiredAttributes: [
        "employee",
        "numberOfDays",
        "leaveType"
      ]

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveEntitlement = OHRM.Model.extend(/** @lends OHRM.LeaveEntitlement.prototype */ {

      recordType: 'OHRM.LeaveEntitlement',

      requiredAttributes: [
        "employee",
        "numberOfDays",
        "daysUsed",
        "leaveType",
        "fromDate"
      ],

      readOnlyAttributes: [
        "fromDate",
        "toDate",
        "daysUsed"
      ],

      bindEvents: function () {
        OHRM.Model.prototype.bindEvents.apply(this, arguments);
        this.on("statusChange", this.calculateDaysUsed);
        this.on("change:employee", this.calculateDaysUsed);
        this.on("change:leaveType", this.calculateDaysUsed);
      },

      calculateDaysUsed: function () {
        var that = this;

        if (!this.isReady()) {
          return;
        }

        // determine leave assigned
        var leaveColl = new OHRM.LeaveCollection();
        var leaveOptions = {
          query: {
            parameters: [{
              attribute: "employee",
              value: this.get("employee")
            }, {
              attribute: "leaveType",
              value: this.get("leaveType")
            }]
          }
        };
        leaveOptions.success = function (collection, results) {
          var daysUsed = 0;
          _.each(results, function (res) {
            daysUsed += res.lengthDays;
          });
          that.set("daysUsed", daysUsed);
        };
        leaveColl.fetch(leaveOptions);
      },

      // TODO: get from date from leavePeriodHistory
      defaults: function () {
        var result = {};
        result.fromDate = new Date(new Date().getFullYear(), 0, 1);
        result.toDate = new Date(new Date().getFullYear(), 11, 31);
        result.daysUsed = 0;

        if (OHRM.leaveEntitlementTypes.length > 0) {
          result.entitlementType = OHRM.leaveEntitlementTypes.models[0];
        }

        return result;
      }

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveEntitlementListItem = OHRM.Model.extend(/** @lends OHRM.LeaveEntitlementListItem.prototype */ {

      recordType: 'OHRM.LeaveEntitlementListItem',

      // TODO: get from date from leavePeriodHistory
      defaults: function () {
        var result = {};
        result.fromDate = new Date(new Date().getFullYear(), 0, 1);
        result.toDate = new Date(new Date().getFullYear(), 11, 31);
        result.daysUsed = 0;

        if (OHRM.leaveEntitlementTypes.length > 0) {
          result.entitlementType = OHRM.leaveEntitlementTypes.models[0];
        }

        return result;
      },

      leavePeriod: function () {
        return "_from".loc() + " " +
          Globalize.format(this.get("fromDate"), "d") +
          " " + "_to".loc() + " " +
          Globalize.format(this.get("toDate"), "d");
      }

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveEntitlementType = OHRM.Model.extend(/** @lends OHRM.LeaveEntitlementType.prototype */ {

      recordType: 'OHRM.LeaveEntitlementType',

      requiredAttributes: [
        "name"
      ]

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
    OHRM.LeaveRelationCollection = XM.Collection.extend(/** @lends XM.LeaveRelationCollection.prototype */{

      model: OHRM.LeaveRelation

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
    OHRM.LeaveEntitlementCollection = XM.Collection.extend(/** @lends XM.LeaveEntitlementCollection.prototype */{

      model: OHRM.LeaveEntitlement

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveEntitlementListItemCollection = XM.Collection.extend(/** @lends XM.LeaveEntitlementListItemCollection.prototype */{

      model: OHRM.LeaveEntitlementListItem

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.LeaveEntitlementTypeCollection = XM.Collection.extend(/** @lends XM.LeaveEntitlementTypeCollection.prototype */{

      model: OHRM.LeaveEntitlementType

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

