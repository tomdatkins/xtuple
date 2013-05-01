/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initBaseModel = function () {

    /**
      @class

      @extends XM.Model
    */
    OHRM.Model = XM.Model.extend(/** @lends OHRM.Model.prototype */ {

      autoFetchId: true

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.Info = XM.Info.extend(/** @lends OHRM.Info.prototype */ {

    });
  }

}());

