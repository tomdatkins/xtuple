/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, window:true */

(function () {
  "use strict";

  XT.extensions.xdruple.initModels = function () {

    //
    // MODELS
    //

    XM.XdrupleSite = XM.Model.extend({

      recordType: "XM.XdrupleSite",

      autoFetchId: true,

      save: function (key, value, options) {
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value;
        }
        options = options ? _.clone(options) : {};

        var success = options.success;

        options.success = function (model, resp, options) {
          if (success) { success(model, resp, options); }
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          value = options;
        }

        XM.Model.prototype.save.call(this, key, value, options);
      }

    });

    XM.XdrupleUserContact = XM.Model.extend({

      recordType: "XM.XdrupleUserContact",

      autoFetchId: true,

      save: function (key, value, options) {
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value;
        }
        options = options ? _.clone(options) : {};

        var success = options.success;

        options.success = function (model, resp, options) {
          if (success) { success(model, resp, options); }
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          value = options;
        }

        XM.Model.prototype.save.call(this, key, value, options);
      }

    });

    //
    // COLLECTIONS
    //

    XM.XdrupleSiteCollection = XM.Collection.extend({
      model: XM.XdrupleSite
    });

    XM.XdrupleUserContactCollection = XM.Collection.extend({
      model: XM.XdrupleUserContact
    });
  };
}());
