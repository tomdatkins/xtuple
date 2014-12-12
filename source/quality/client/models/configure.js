/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.quality.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.Quality = XM.Settings.extend(/** @lends XM.Quality.Settings.prototype */ {

      recordType: 'XM.Quality',
      
      privileges: 'MaintainQualityPlans'

    });

    XM.quality = new XM.Quality();
    
  };

}());
