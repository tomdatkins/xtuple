/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.Manufacturing = XM.Settings.extend(/** @lends XM.Manufacturing.Settings.prototype */ {

      recordType: 'XM.Manufacturing',

      privileges: 'ConfigureWO',

      validate: function (attributes, options) {
        // XXX not sure if number widgets can fail in this way.
        var params = { type: "_number".loc() };
        if (attributes.NextWorkOrderNumber !== undefined &&
            isNaN(attributes.NextWorkOrderNumber)) {
          params.attr = "_workOrder".loc() + " " + "_number".loc();
          return XT.Error.clone('xt1003', { params: params });
        }
      }
    });

    _.extend(XM.Manufacturing, {
      /** @scope XM.Manufacturing */

      /**
        Start Date.

        @static
        @constant
        @type String
        @default S
      */
      EXPLODE_START_DATE: 'S',

      /**
        Explosion Date.

        @static
        @constant
        @type String
        @default E
      */
      EXPLODE_CURRENT_DATE: 'E',

      /**
        Single Level.

        @static
        @constant
        @type String
        @default S
      */
      EXPLODE_SINGLE_LEVEL: 'S',

      /**
        Multiple Level.

        @static
        @constant
        @type String
        @default M
      */
      EXPLODE_MULTIPLE_LEVEL: 'M',

      /**
        To Date Cost Recognition.

        @static
        @constant
        @type String
        @default D
      */
      TO_DATE_COST_RECOGNITION: 'D',

      /**
        Proportional Cost Recognition.

        @static
        @constant
        @type String
        @default P
      */
      PROPORTINAL_COST_RECOGNITION: 'P',

      /**
        Issue Push.

        @static
        @constant
        @type String
        @default P
      */
      ISSUE_PUSH: 'P',

      /**
        Issue Pull.

        @static
        @constant
        @type String
        @default L
      */
      ISSUE_PULL: 'L',

      /**
        Issue Mixed.

        @static
        @constant
        @type String
        @default P
      */
      ISSUE_MIXED: 'M'

    });
    

    XM.manufacturing = new XM.Manufacturing();

  };

}());
