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

      autoFetchId: true,
      
      /**
        Override of parse function in model so that we may handle
          Date/Time differently
      */
      parse: function (resp) {
        var K = XT.Session,
          schemas = XT.session.getSchemas(),
          parse;
        parse = function (namespace, typeName, obj) {
          var type = schemas[namespace].get(typeName),
            column,
            rel,
            attr,
            i;
          if (!type) { throw typeName + " not found in schema."; }
          for (attr in obj) {
            if (obj.hasOwnProperty(attr) && obj[attr] !== null) {
              if (_.isObject(obj[attr])) {
                rel = _.findWhere(type.relations, {key: attr});
                typeName = rel ? rel.relatedModel.suffix() : false;
                if (typeName) {
                  if (_.isArray(obj[attr])) {
                    for (i = 0; i < obj[attr].length; i++) {
                      obj[attr][i] = parse(namespace, typeName, obj[attr][i]);
                    }
                  } else {
                    obj[attr] = parse(namespace, typeName, obj[attr]);
                  }
                }
              } else {
                column = _.findWhere(type.columns, {name: attr}) || {};
                if (column.category === K.DB_DATE) {
                  // check to make sure this is really a date
                  if (obj[attr].indexOf("T") !== -1) {
                    // it is a date, carry on
                    obj[attr] = new Date(obj[attr]);
                  } else {
                    // this is a time and so we need to create a valid date for it
                    // this date string could be any date because we care about time
                    var dateString = "1/1/1980", time = obj[attr];
                    obj[attr] = new Date(dateString + " " + obj[attr]);
                  }
                }
              }
            }
          }
          return obj;
        };
        return parse(this.recordType.prefix(), this.recordType.suffix(), resp);
      }
      

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.Info = XM.Info.extend(/** @lends OHRM.Info.prototype */ {

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.Comment = OHRM.Model.extend(/** @lends OHRM.LeaveComment.prototype */ {

      requiredAttributes: [
        "createdBy"
      ],

      defaults: function () {
        var result = {};
        result.createdBy = XM.currentUser.get('username');
        return result;
      }

    });

  }

}());

