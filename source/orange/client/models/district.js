/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initDistrictModels = function () {

    /**
      @class

      @extends XM.Model
    */
    OHRM.District = OHRM.Model.extend(/** @lends OHRM.District.prototype */ {

      recordType: 'OHRM.District'

    });
    
    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    OHRM.DistrictCollection = XM.Collection.extend(/** @lends XM.DistrictCollection.prototype */{

      model: OHRM.District

    });
  };

}());

