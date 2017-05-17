/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XT:true, XM:true, enyo:true */

(function () {

  XT.extensions.quality.initPickers = function () {

    // ..........................................................
    // Revision Statuses
    //

    enyo.kind({
      name: "XV.RevisionStatusPicker",
      kind: "XV.PickerWidget",
      collection: "XM.RevisionStatuses",
      nameAttribute: "label",
      //showNone: false
    });

    // ..........................................................
    // Quality Test Type
    //

    enyo.kind({
      name: "XV.QualityTestTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.QualityTestTypes",
      nameAttribute: "label",
      showNone: false
    });

    // ..........................................................
    // Quality Test Frequency
    //

    enyo.kind({
      name: "XV.QualityTestFreqPicker",
      kind: "XV.PickerWidget",
      collection: "XM.QualityTestFreqs",
      nameAttribute: "label",
      showNone: false
    });

    // ..........................................................
    // Quality Test Status
    //

    enyo.kind({
      name: "XV.QualityTestStatusPicker",
      kind: "XV.PickerWidget",
      collection: "XM.QualityTestStatus",
      nameAttribute: "label",
      showNone: false
    });

    // ..........................................................
    // Test Dispositions
    //

    enyo.kind({
      name: "XV.QualityTestDispositionPicker",
      kind: "XV.PickerWidget",
      nameAttribute: "label",
      /*showNone: false, */
      collection: "XM.QualityTestDispositions"
    });
    
    // ..........................................................
    // Quality Test Release Codes
    //

    enyo.kind({
      name: "XV.QualityReleaseCodePicker",
      kind: "XV.PickerWidget",
      collection: "XM.qualityReleaseCodes",
      nameAttribute: "name"
    });

    // ..........................................................
    // Quality Test Reason Codes
    //

    enyo.kind({
      name: "XV.QualityReasonCodePicker",
      kind: "XV.PickerWidget",
      collection: "XM.qualityReasonCodes",
      nameAttribute: "name"
    });

    // ..........................................................
    // Quality Plan EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.QualityPlanEmailProfilePicker",
      kind: "XV.PickerWidget",
      label: "_emailProfile".loc(),
      collection: "XM.qualityPlanEmailProfiles"
    });

    // ..........................................................
    // Quality Specification Types
    //

    enyo.kind({
      name: "XV.QualitySpecTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.qualitySpecificationTypes",
      nameAttribute: "name"
    });

    // ..........................................................
    // Quality Plan Types
    //

    enyo.kind({
      name: "XV.QualityPlanTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.qualityPlanTypes",
      nameAttribute: "name"
    });

  };

}());
