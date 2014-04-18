/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.CommandCenter.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.DatabaseInformation = XM.DatabaseInformation.extend({

      initialize: function (attributes, options) {
        this.meta = new Backbone.Model({
          backupPath: "",
          targetName: "",
          pilotVersion: "",
          prodVersion: ""
        });
      },

      validate: function () {
        var error = XM.Settings.prototype.validate.apply(this, arguments);
        if (error) { return error; }
      }
    });
  };

}());
