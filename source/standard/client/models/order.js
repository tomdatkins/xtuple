/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.standard.initOrderModels = function () {

    /**
      @class

      @extends XM.Info
    */
    XM.OrderRelation = XM.Info.extend({

      recordType: "XM.OrderRelation"

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.OrderRelationCollection = XM.Collection.extend({

      model: XM.OrderRelation

    });

  };

}());

