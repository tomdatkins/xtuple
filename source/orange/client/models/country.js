/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initCountryModels = function () {

    /**
      @class

      @extends XM.Model
    */
    OHRM.Country = OHRM.Model.extend(/** @lends OHRM.Country.prototype */ {

      recordType: 'OHRM.Country'

    });
    
    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    OHRM.CountryCollection = XM.Collection.extend(/** @lends XM.CountryCollection.prototype */{

      model: OHRM.Country

    });
  };

}());

