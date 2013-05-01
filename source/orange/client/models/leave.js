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

      recordType: 'OHRM.Leave'

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.LeaveAdjustment = OHRM.Model.extend(/** @lends OHRM.LeaveAdjustment.prototype */ {

      recordType: 'OHRM.LeaveAdjustment'

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
    OHRM.LeaveAdjustmentCollection = XM.Collection.extend(/** @lends XM.LeaveAdjustmentCollection.prototype */{

      model: OHRM.LeaveAdjustment

    });
  };

}());

