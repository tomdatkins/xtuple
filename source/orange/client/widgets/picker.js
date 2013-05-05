/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // LEAVE ENTITLEMENT TYPE
  //

  enyo.kind({
    name: "XV.LeaveEntitlementTypePicker",
    kind: "XV.PickerWidget",
    collection: "OHRM.leaveEntitlementTypes"
  });

  // ..........................................................
  // LEAVE STATUS
  //

  enyo.kind({
    name: "XV.LeaveStatusPicker",
    kind: "XV.PickerWidget",
    collection: "OHRM.leaveStatuses"
  });

  // ..........................................................
  // LEAVE TYPE
  //

  enyo.kind({
    name: "XV.LeaveTypePicker",
    kind: "XV.PickerWidget",
    collection: "OHRM.leaveTypes"
  });
  
  // ..........................................................
  // JOB VACANCY
  //

  enyo.kind({
    name: "XV.JobVacancyPicker",
    kind: "XV.PickerWidget",
    collection: "OHRM.jobVacancies"
  });
  
  // ..........................................................
  // JOB TITLE
  //

  enyo.kind({
    name: "XV.JobTitlePicker",
    kind: "XV.PickerWidget",
    collection: "OHRM.jobTitles",
    nameAttribute: "title",
    valueAttribute: "id"
  });

}());
