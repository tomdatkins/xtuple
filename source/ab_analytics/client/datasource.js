/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XV:true, Backbone:true, enyo:true, console:true, window:true */

(function () {
  "use strict";

  XT.extensions.ab_analytics.hookRequest = function () {
    var oldRequest = XT.dataSource.request;
    XT.dataSource.request = function (obj, method, payload, options) {
      oldRequest.apply(this, arguments);
      XT.extensions.ab_analytics.report(method, payload && payload.type, payload);
    };

    var oldShowHelp = XV.Navigator.prototype.showHelp;
    XV.Navigator.prototype.showHelp = function () {
      var listName;
      oldShowHelp.apply(this, arguments);

      listName = this.$.contentPanels.getActive().name;
      XT.extensions.ab_analytics.report("help", listName);
    };



  };
}());

