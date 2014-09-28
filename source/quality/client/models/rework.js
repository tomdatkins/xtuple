/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {

  "use strict";

  XT.extensions.quality.initReworkModels = function () {

/* =========================================================
*  Rework Operation
*  ========================================================= */

    /**
      @class

      @extends XM.WorkOrderOperation.prototype
    */
    XM.ReworkOperation = XM.WorkOrderOperation.extend({

      destroy: function () {
        return XM.Model.prototype.destroy.apply(this, arguments);
      },

      getReworkStdOperation: function (options) {
        var coll = new XM.StandardOperationCollection(),
          that = this,
          options = {}; // XXX do you want to wipe out the incoming options parameter?

        options.query = {
          // what if I'm trying to change the std operation to inspect?
          parameters: [{attribute: "operationType", value: "REWORK"}]
        };
        options.success = function () {
          that.set("standardOperation", coll.first());
        };
        coll.fetch(options);
      },

      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        var workOrder = this.get("workOrder"),
          standardOperation = this.get("standardOperation");

        this.set({
          workOrder: workOrder.id,
          standardOperation: standardOperation.id
        });

        // Don't use XM.Document prototype because duplicate key rules are different here
        return XM.Model.prototype.save.call(this, key, value, options);
      },

/*      workOrderChanged: function () {
      // Override WorkOrderOperation as the W/O cannot change here
      }
*/
    });

    XM.ReworkOperation.prototype.augment({
        handlers: {"change:operationType": "getReworkStdOperation"}
    });

    // ..........................................................
    // COLLECTIONS
    //


  };
}());
