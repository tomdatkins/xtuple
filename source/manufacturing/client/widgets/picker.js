/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XT:true, XM:true, enyo:true */

(function () {

  XT.extensions.manufacturing.initPickers = function () {

    // ..........................................................
    // COST RECOGNITIONS
    //

    enyo.kind({
      name: "XV.CostRecognitionPicker",
      kind: "XV.PickerWidget",
      collection: "XM.costRecognitions"
    });

    // ..........................................................
    // ISSUE METHODS
    //

    enyo.kind({
      name: "XV.IssueMethodPicker",
      kind: "XV.PickerWidget",
      collection: "XM.issueMethods",
      showNone: false
    });

    // ..........................................................
    // LABOR RATES
    //

    enyo.kind({
      name: "XV.LaborRatePicker",
      kind: "XV.PickerWidget",
      collection: "XM.laborRates",
      nameAttribute: "code",
      showNone: false
    });
    
    // ..........................................................
    // OPERATION TYPES
    //

    enyo.kind({
      name: "XV.OperationTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.operationTypes",
      nameAttribute: "name"
    });

    // ..........................................................
    // STANDARD OPERATIONS
    //

    enyo.kind({
      name: "XV.StandardOperationPicker",
      kind: "XV.PickerWidget",
      collection: "XM.standardOperations",
      nameAttribute: "number",
      showNone: false
    });
    
    // ..........................................................
    // STANDARD OPERATIONS REPORT COST PICKER
    //

    enyo.kind({
      name: "XV.StdOpReportsPicker",
      kind: "XV.PickerWidget",
      collection: "XM.reportOperationCostsAsOptions",
      nameAttribute: "label",
      showNone: false
    });

    // ..........................................................
    // WORK CENTERS
    //

    enyo.kind({
      name: "XV.WorkCenterPicker",
      kind: "XV.PickerWidget",
      collection: "XM.workCenters",
      nameAttribute: "code",
      showNone: false
    });

    // ..........................................................
    // WORK ORDER EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.WorkOrderEmailProfilePicker",
      kind: "XV.PickerWidget",
      label: "_emailProfile".loc(),
      collection: "XM.workOrderEmailProfiles"
    });

    // ..........................................................
    // WORK ORDER OPERATIONS
    //

    enyo.kind({
      name: "XV.WorkOrderOperationPicker",
      kind: "XV.PickerWidget",
      nameAttribute: "getName"
    });

    // ..........................................................
    // WORK ORDER STATUS
    //

    enyo.kind({
      name: "XV.WorkOrderStatusPicker",
      kind: "XV.PickerWidget",
      collection: "XM.workOrderStatuses",
      showNone: false
    });

  };

}());
