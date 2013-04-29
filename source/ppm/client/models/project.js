/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.ppm.initProjectModels = function () {
  
    /**
      @class

      @extends XM.Model
    */
    XM.ProjectTaskRelation = XM.Info.extend(
      /** @scope XM.ProjectTaskRelation.prototype */ {

      recordType: 'XM.ProjectTaskRelation',

    });

  };

}());
