/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {

  "use strict";

  XT.extensions.manufacturing.initItemModels = function () {

    var _proto = XM.Item.prototype,
      _defaults = _proto.defaults;

    // Unfortunately augment won't work here
    _proto.defaults = function () {
      var defaults = _defaults.apply(this, arguments);

      _.extend(defaults, {
        isPicklist: false
      });

      return defaults;
    };

  };

}());
