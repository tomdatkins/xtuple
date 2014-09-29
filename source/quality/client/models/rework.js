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
                 
//      recordType: "XM.ReworkOperation",
      
      getReworkStdOperation: function (options) {
        var coll = new XM.StandardOperationCollection(),
          that = this,
          standardOperation = this.get("standardOperation"),
          operationType = _.isObject(this.get("operationType")) ? this.get("operationType").id : this.get("operationType"),
          options = {};
               
        if (operationType !== "REWORK" || (operationType === "REWORK" && standardOperation === undefined)) {
        
          options.query = {
            parameters: [{attribute: "operationType", value: "REWORK"}]
          };
          options.success = function () {
            that.set("standardOperation", coll.first());
          };
          coll.fetch(options);
        }
      },
      
      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        var workOrder = this.get("workOrder"),
          standardOperation = this.get("standardOperation");
          
        this.off("change:workOrder", this.workOrderChanged);
        
        this.set({
          workOrder: workOrder.id,
          standardOperation: standardOperation.id  
        });
        
        // Don't use XM.Document prototype because duplicate key rules are different here
        return XM.Model.prototype.save.call(this, key, value, options);
      },
           
    });
    
    XM.ReworkOperation.prototype.augment({
        handlers: {"change:operationType": "getReworkStdOperation"}
    });

    // ..........................................................
    // COLLECTIONS
    //


  };
}());
