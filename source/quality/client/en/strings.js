// ==========================================================================
// Project:   XT Strings
// Copyright: ©2014 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

// Place strings you want to localize here.  In your app, use the key and
// localize it using "key string".loc().  HINT: For your key names, use the
// english string with an underscore in front.  This way you can still see
// how your UI will look and you'll notice right away when something needs a
// localized string added to this file!
//

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_quality": "Quality",
    "_qualityDescription": "Quality",

/* Quality Specifications */
    "_qualitySpecifications": "Quality Test Specifications",
    "_qualitySpecification": "Quality Test Specification",
    "_testEquipment": "Test Equipment",
    
/* Quality Plans */
    "_qualityPlans": "Quality Plans",
    "_qualityPlan": "Quality Plan",
    "_qualityTests": "Quality Tests",
    "_qualityTest": "Quality Test",
    "_revisionNumber": "Revision #",
    "_revisionDate": "Revision Date",
    "_revisionStatus": "Revision Status",
    "_qualityPlanEmailProfiles": "Quality Plan Email",
    "_qualityPlanEmailProfile": "Quality Plan Email",
    "_confirmRevisionUpdate": "New Revision number entered. Do you want to make this plan the active plan?",
    "_frequency_type": "Test Frequency",

/* Quality Tests   */
    "_createQualityTest": "Create Test",
    "_printNCR": "NonConformance Report",
    "_printCert": "Compliance Certificate",
    "_quality_test_items": "Quality Test Items",
    "_qualityTestWorkflow": "Quality Test Workflow",
    "_qualityTestSummary": "Quality Tests",
    "_qualityTestListError": "You can only print the Summary from the Quality Test list",
    "_testNumber": "Test Number",
    "_trace.number": "Lot/Serial #",
    "_startDate": "Start Date",
    "_completedDate": "Completion Date",
    "_testType": "Test Type",
    "_test_instructions": "Test Instructions",
    "_upper": "Upper Level",
    "_lower": "Lower Level",
    "_testText": "Text Comment",
    "_testNumeric": "Numeric Value",
    "_testBool": "Pass/Fail",
    "_testUnit": "Test UoM",
    "_testvalues": "Test Values",
    "_itemAssignment": "Item Assignment",
    "_test_assign_to": "Transaction Assignment",
    "_test_sample_frequency": "Item Sampling Frequency",
    "_testStatus": "Test Status",
    "_testDisposition": "Test Disposition",
    "_testOpen": "Open",
    "_testPass": "Pass",
    "_testFail": "Fail",
    "_testFirst": "First Item",
    "_testLast": "Last Item",
    "_testSample": "Sample",
    "_testAll": "All Items",
    "_result": "Test Result",
    
/* Quality Reason Codes */
    "_qualityReasonCodes": "Quality Reason Codes",
    "_qualityReasonCode": "Quality Reason Code",
    
/* Rework Operation */
    "_reworkOperation": "Rework Operation",    

/* Dispositions  */
    /* "_scrap" <-- already covered in Inventory */
    "_disposition": "Item Disposition",
    "_release": "Released",
    "_quarantine": "Quarantine",
    "_rework": "Rework",

    // PERMISSIONS
    "_maintainQualitySpecs": "Maintain Quality Test Specifications",
    "_viewQualitySpecs": "View Quality Test Specifications",
    "_maintainQualityPlans": "Maintain Quality Plans",
    "_viewQualityPlans": "View Quality Plans",
    "_maintainQualityTests": "Maintain Quality Tests",
    "_maintainQualityPlanEmailProfiles": "Quality Plan Email Profiles",
    "_viewQualityTests": "View Quality Tests",

/* Error Messages */
    "_documentIsNotAWorkOrder": "Incorrect Document Type.  This action must originate from a Work Order.",
    "_revisionNumberNotValid": "You have entered a revision number lower than the existing revision.  Please correct.",
    "_testTolerances": "Target measure must fall between Upper and Lower tolerance limits",
    "_testUnitRequired": "You must define a test unit of measure for numeric tests",
    "_testInitRequired": "You must select at least one Transaction to initiate tests from",
    "_testFreqRequired": "If you select the Sample frequency type you must also select a frequency to test",
    "_testFreqNotLot": "You cannot Lot test an Item Site that is not Lot Controlled",
    "_testFreqNotSerial": "You cannot Serial test an Item Site that is not Serial Controlled"

  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
