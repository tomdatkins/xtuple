/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initJobModels = function () {

    /**
      @class

      @extends XM.Model
    */
    OHRM.JobCategory = OHRM.Model.extend(/** @lends OHRM.JobCategory.prototype */ {

      recordType: 'OHRM.JobCategory'

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.JobTitle = OHRM.Model.extend(/** @lends OHRM.JobTitle.prototype */ {

      recordType: 'OHRM.JobTitle'

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    OHRM.JobCategoryCollection = XM.Collection.extend(/** @lends XM.JobTitleCollection.prototype */{

      model: OHRM.JobCategory

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.JobTitleCollection = XM.Collection.extend(/** @lends XM.JobTitleCollection.prototype */{

      model: OHRM.JobTitle

    });
  };

}());

