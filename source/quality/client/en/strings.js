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

/* Desktop Host/Port Settings */
    "_desktopHost":  "Desktop Hostname Url",
    "_desktopPort":  "Desktop Port",

/* Quality Specifications */
    "_qualitySpecifications": "Quality Test Specifications",
    "_qualitySpecification": "Quality Test Specification",
    "_qualitySpecificationTypes": "Quality Specification Types",
    "_testSpecType": "Quality Specification Type",
    "_testSpecificationType": "Quality Specification Type",
    "_testEquipment": "Test Equipment",
    
/* Quality Plan Type */
    "_qualityPlanType": "Quality Plan Type",
    "_qualityPlanTypes": "Quality Plan Types",
    
/* Quality Plans */
    "_qualityPlans": "Quality Plans",
    "_qualityPlan": "Quality Plan",
    "_qualityTests": "Quality Tests",
    "_qualityTest": "Quality Test",
    "_revisionNumber": "Revision #",
    "_revisionDate": "Revision Date",
    "_revisionStatus": "Revision Status",
    "_confirmRevisionUpdate": "New Revision number entered. Do you want to make this version the active plan?",
    "_frequency_type": "Test Frequency",

/* Quality Tests   */
    "_createQualityTest": "Create Test",
    "_printNCR": "NonConformance Report",
    "_printCert": "Compliance Certificate",
    "_printTest": "Print Test",
    "_printWOSummary": "W/O Test Summary",
    "_quality_test_items": "Quality Test Items",
    "_qualityTestWorkflow": "Quality Test Workflow",
    "_qualityTestSummary": "Quality Tests",
    "_qualityTestListError": "You can only print the Summary from the Quality Test list",
    "_testNumber": "Test Number",
    "_trace.number": "Lot/Serial #",
    "_startDate": "Start Date",
    "_completedDate": "Completion Date",
    "_testType": "Test Type",
    "_testItem": "Test Item",    
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
    "_testCancelled": "Cancelled",
    "_testFirst": "First Item",
    "_testLast": "Last Item",
    "_testSample": "Sample",
    "_testAll": "All Items",
    "_result": "Test Result",
    
/* Quality Release Codes */
    "_releaseCode": "Release Code",
    "_qualityReleaseCodes": "Quality Release Codes",
    "_qualityReleaseCode": "Quality Release Code",

/* Quality Reason Codes */
    "_qualityReasonCodes": "Quality Reason Codes",
    "_qualityReasonCode": "Quality Reason Code",
    
/* Rework Operation */
    "_reworkOperation": "Rework Operation",    

/* Dispositions  */
    /* "_scrap" <-- already covered in Inventory */
    "_disposition": "Item Disposition",
    "_release": "Release",
    "_quarantine": "Quarantine",
    "_rework": "Rework",

    // PERMISSIONS
    "_maintainQualitySpecs": "Maintain Quality Test Specifications",
    "_viewQualitySpecs": "View Quality Test Specifications",
    "_maintainQualityPlans": "Maintain Quality Plans",
    "_viewQualityPlans": "View Quality Plans",
    "_maintainQualityTests": "Maintain Quality Tests",
    "_viewQualityTests": "View Quality Tests",
    "_releaseQualityTests": "Release Quality Tests",

/* Error Messages */
    "_documentIsNotAWorkOrder": "Incorrect Document Type.  This action must originate from a Work Order.",
    "_revisionNumberNotValid": "You have entered a revision number lower than the existing revision.  Please correct.",
    "_testTolerances": "Target measure must fall between Upper and Lower tolerance limits",
    "_testUnitRequired": "You must define a test unit of measure for numeric tests",
    "_testInitRequired": "You must select at least one Transaction to initiate tests from",
    "_testFreqRequired": "If you select the Sample frequency type you must also select a frequency to test",
    "_testFreqNotLot": "You cannot Lot test an Item Site that is not Lot Controlled",
    "_testFreqNotSerial": "You cannot Serial test an Item Site that is not Serial Controlled",
    "_missingReleaseCode": "You must enter a Release Code",
    "_insufficientReleasePrivilege": "You have insufficient privileges to Release Quality Tests",
    "_insufficientCancelPrivilege": "You have insufficient privileges to cancel Quality Tests"

  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
