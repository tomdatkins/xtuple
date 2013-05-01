/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

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

}());
