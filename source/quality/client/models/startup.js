/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.quality.initStartup = function () {
    XT.cacheCollection("XM.qualityPlanEmailProfiles", "XM.QualityPlanEmailProfileCollection", "name");
    XT.cacheCollection("XM.qualityReasonCodes", "XM.QualityReasonCodeCollection", "name");
    XT.cacheCollection("XM.qualityReleaseCodes", "XM.QualityReleaseCodeCollection", "name");
    XT.cacheCollection("XM.qualitySpecificationTypes", "XM.QualitySpecificationTypeCollection", "name");
  };

}());
