/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.ppm.initProjectModels = function () {
  
    // ..........................................................
    // PROJECT
    //
    
    var _proto = XM.Project.prototype,
      _bindEvents = _proto.bindEvents,
      _statusDidChange = _proto.statusDidChange,
      _specifiedSetReadOnly = function () {
        var spec = this.get("isSpecifiedRate");
        this.setReadOnly("billingRate", !spec);
        this.setReadOnly("billingCurrency", !spec);
      };

    XM.Project = XM.Project.extend({

      bindEvents: function () {
        _bindEvents.apply(this, arguments);
        this.on('change:isSpecifiedRate', this.isSpecifiedRateDidChange);
      },

      isSpecifiedRateDidChange: function () {
        var spec = this.get("isSpecifiedRate");
        if (spec) {
          this.set("billingRate", 0);
          this.set("billingCurrency", XT.baseCurrency());
        } else {
          this.set("billingRate", null);
          this.set("billingCurrency", null);
        }
        _specifiedSetReadOnly.apply(this);
      },
      
      statusDidChange: function () {
        _statusDidChange.apply(this, arguments);
        var K = XM.Model,
          status = this.getStatus();
        if (status === K.READY_NEW || status === K.READY_CLEAN) {
          _specifiedSetReadOnly.apply(this);
        }
      }

    });
    
    // ..........................................................
    // PROJECT TASK
    //
    
    // Unfortunately classes below can't share much with abave because the private functions are different
    var _ptProto = XM.ProjectTask.prototype,
      _ptBindEvents = _ptProto.bindEvents,
      _ptStatusDidChange = _ptProto.statusDidChange;
    
    XM.ProjectTask = XM.ProjectTask.extend({

      bindEvents: function () {
        _ptBindEvents.apply(this, arguments);
        this.on('change:isSpecifiedRate', this.isSpecifiedRateDidChange);
      },

      isSpecifiedRateDidChange: function () {
        var spec = this.get("isSpecifiedRate");
        if (spec) {
          this.set("billingRate", 0);
          this.set("billingCurrency", XT.baseCurrency());
        } else {
          this.set("billingRate", null);
          this.set("billingCurrency", null);
        }
        _specifiedSetReadOnly.apply(this);
      },

      statusDidChange: function () {
        _ptStatusDidChange.apply(this, arguments);
        var K = XM.Model,
          status = this.getStatus();
        if (status === K.READY_NEW || status === K.READY_CLEAN) {
          _specifiedSetReadOnly.apply(this);
        }
      }

    });
    
    // ..........................................................
    // TASK
    //
    
    var _tProto = XM.Task.prototype,
      _tBindEvents = _tProto.bindEvents,
      _tStatusDidChange = _tProto.statusDidChange;
    
    XM.Task = XM.Task.extend({

      bindEvents: function () {
        _tBindEvents.apply(this, arguments);
        this.on('change:isSpecifiedRate', this.isSpecifiedRateDidChange);
      },

      isSpecifiedRateDidChange: function () {
        var spec = this.get("isSpecifiedRate");
        if (spec) {
          this.set("billingRate", 0);
          this.set("billingCurrency", XT.baseCurrency());
        } else {
          this.set("billingRate", null);
          this.set("billingCurrency", null);
        }
        _specifiedSetReadOnly.apply(this);
      },

      statusDidChange: function () {
        _tStatusDidChange.apply(this, arguments);
        var K = XM.Model,
          status = this.getStatus();
        if (status === K.READY_NEW || status === K.READY_CLEAN) {
          _specifiedSetReadOnly.apply(this);
        }
      }

    });

  };

}());
