/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.standard.initTraceModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.Trace = XM.Document.extend({

      recordType: "XM.Trace",

      /**
        This version of `save` first checks to see if a trace number for this item
        exists before committing.
      */
      save: function (key, value, options) {
        var that = this,
          K = XM.Model,
          number = this.get("number"),
          item = this.get("item"),
          status = this.getStatus(),
          checkOptions = {},
          collection,
          query;

        // Check for existing item/trace number conflicts on new saves
        if (status === K.READY_NEW) {
          collection = new XM.TraceRelationCollection();
          checkOptions.success = function () {
            var err;
            if (collection.length) {
              err = XT.Error.clone("xt2003");
              that.trigger("invalid", that, err, options);
            } else {
              XM.Document.prototype.save.call(that, key, value, options);
            }
          };
          query = {
            parameters: [
              {
                attribute: "number",
                value: number
              },
              {
                attribute: "item",
                value: item
              }
            ]
          };
          collection.dispatch(query, checkOptions);

        // Otherwise just go ahead and save
        } else {
          XM.Document.prototype.save.call(that, key, value, options);
        }

      }

    });

    /**
      @class

      @extends XM.Characteristic
    */
    XM.TraceCharacteristic = XM.CharacteristicAssignment.extend({

      recordType: "XM.TraceCharacteristic"

    });

    /**
      @class

      @extends XM.Comment
    */
    XM.TraceComment = XM.Comment.extend({

      recordType: "XM.TraceComment",

      sourceName: "T"

    });

    /**
      @class

      @extends XM.Document
    */
    XM.TraceRegistration = XM.Document.extend({

      recordType: "XM.TraceRegistration",

      numberPolicy: XM.Document.AUTO_NUMBER

    });

    /**
      @class

      @extends XM.Info
    */
    XM.TraceRelation = XM.Info.extend({

      recordType: "XM.TraceRelation",

      editableModel: "XM.Trace"

    });

    /**
      @class

      @extends XM.Document
    */
    XM.AccountTraceRegistration = XM.Document.extend({

      recordType: "XM.AccountTraceRegistration",

      numberPolicy: XM.Document.AUTO_NUMBER

    });

    /**
      @class

      @extends XM.Document
    */
    XM.RegistrationType = XM.Document.extend({

      recordType: "XM.RegistrationCode",

      documentKey: "code"

    });

    /**
      @class

      @extends XM.Document
    */
    XM.TraceSequence = XM.Document.extend({

      recordType: "XM.TraceSequence"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.TraceRelationCollection = XM.Collection.extend({

      model: XM.TraceRelation

    });

  };

}());

