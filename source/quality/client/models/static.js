/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.quality.initStaticModels = function () {

    // Revision Status
    XM.RevisionStatusEnum = { 
      P: "PENDING",
      A: "ACTIVE",
      I: "INACTIVE"
    };

    XM.RevisionStatuses = new XM.EnumMapCollection(
      XM.RevisionStatusEnum
    );

   // Quality Plan Test Type
    XM.QualityTestTypeEnum = {
      T: "TEST_TEXT",
      N: "TEST_NUMERIC",
      B: "TEST_BOOL"
    };

    XM.QualityTestTypes = new XM.EnumMapCollection(
      XM.QualityTestTypeEnum
    );

   // Quality Plan Test Frequency
    XM.QualityTestFreqEnum = {
      F: "TEST_FIRST",
      L: "TEST_LAST",
      S: "TEST_SAMPLE",
      LOT: "LOT",
      SER: "SERIAL",
      A: "TEST_ALL" 
    };
    
    XM.QualityTestFreqs = new XM.EnumMapCollection(
      XM.QualityTestFreqEnum
    );
    
   // Quality Test Status
    XM.QualityStatusEnum = {
      O: "TEST_OPEN",
      P: "TEST_PASS",
      F: "TEST_FAIL"
    };
    
    XM.QualityTestStatus = new XM.EnumMapCollection(
      XM.QualityStatusEnum
    );

    // Quality Test Disposition Options
    XM.QualityTestDispositionEnum = {
      I: "IN_PROCESS",
      OK: "RELEASE",
      Q: "QUARANTINE",
      R: "REWORK",
      S: "SCRAP"
    }
    
    XM.QualityTestDispositions = new XM.EnumMapCollection(
      XM.QualityTestDispositionEnum
    );

  };

}());
