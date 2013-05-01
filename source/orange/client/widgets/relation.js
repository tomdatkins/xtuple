/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, window:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.OrangeEmployeeWidget",
    kind: "XV.RelationWidget",
    collection: "OHRM.EmployeeRelationCollection",
    keyAttribute: "employeeId",
    list: "XV.OrangeEmployeeList"
  });

  // ..........................................................
  // LEAVE REQUEST
  //

  enyo.kind({
    name: "XV.LeaveRequestWidget",
    kind: "XV.RelationWidget",
    collection: "OHRM.LeaveRequestCollection",
    keyAttribute: "dateApplied",
    list: "XV.LeaveRequestList"
  });
}());
