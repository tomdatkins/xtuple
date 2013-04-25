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
    OHRM.JobCategory = XM.Model.extend(/** @lends XM.ProjectVersion.prototype */ {

      recordType: 'OHRM.JobCategory'

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.JobCategoryCollection = XM.Collection.extend(/** @lends XM.ProjectVersionCollection.prototype */{

      model: XM.JobCategory

    });
  };

}());

