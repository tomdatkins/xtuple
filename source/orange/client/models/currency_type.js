/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initCurrencyTypeModels = function () {

    /**
      @class

      @extends XM.Model
    */
    OHRM.CurrencyType = OHRM.Model.extend(/** @lends OHRM.CurrencyType.prototype */ {

      recordType: 'OHRM.CurrencyType'

    });
    
    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    OHRM.CurrencyTypeCollection = XM.Collection.extend(/** @lends XM.CurrencyTypeCollection.prototype */{

      model: OHRM.CurrencyType

    });
  };

}());

