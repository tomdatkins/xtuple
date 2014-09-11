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
    
//      recordType: "XM.WorkOrderOperation",
      
      typeGetStdOperation: function (done) {
        var stdOp = new XM.StandardOperation(),
          options = {};
        
        options.operationType = this.id();
        options.success = function (model) {
          done(model.get("id"));
        };
        this.fetchFirst(options);
      }
    });

    // ..........................................................
    // COLLECTIONS
    //

    
  };
}());
