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
                 
      recordType: "XM.ReworkOperation",

      readOnlyAttributes: [
        "operationType",
      ],

      save: function (key, value, options) {
        options = options ? _.clone(options) : {};
        var workOrder = this.get("workOrder"),
          standardOperation = this.get("standardOperation");
          
        this.off("change:workOrder", this.workOrderChanged);
        
        // Prep data for saving
        this.set({
          workOrder: workOrder.id,
          standardOperation: standardOperation.id
        });
        
        return XM.Model.prototype.save.call(this, key, value, options);
      },
           
    });
    
    // ..........................................................
    // COLLECTIONS
    //


  };
}());
