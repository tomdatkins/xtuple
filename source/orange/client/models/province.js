/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initProvinceModels = function () {

    /**
      @class

      @extends XM.Model
    */
    OHRM.Province = OHRM.Model.extend(/** @lends OHRM.Province.prototype */ {

      recordType: 'OHRM.Province'

    });
    
    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    OHRM.ProvinceCollection = XM.Collection.extend(/** @lends XM.ProvinceCollection.prototype */{

      model: OHRM.Province

    });
  };

}());

