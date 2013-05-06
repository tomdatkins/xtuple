/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.OrangeEmployeeListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_employee".loc()},
      {name: "employeeId", label: "_employee".loc(), attr: "employeeId"}
    ]
  });

  // ..........................................................
  // LEAVE
  //

  enyo.kind({
    name: "XV.LeaveListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_leave".loc()},
      {name: "employee", label: "_employee".loc(), attr: "employee", defaultKind: "XV.OrangeEmployeeWidget"},
      {name: "leaveType", label: "_leaveType".loc(), attr: "leaveType", defaultKind: "XV.LeaveTypePicker"}
    ]
  });

  // ..........................................................
  // LEAVE ENTITLEMENT
  //

  enyo.kind({
    name: "XV.LeaveEntitlementListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_leaveEntitlement".loc()},
      {name: "employee", label: "_employee".loc(), attr: "employee", defaultKind: "XV.OrangeEmployeeWidget"},
      {name: "leaveType", label: "_leaveType".loc(), attr: "leaveType", defaultKind: "XV.LeaveTypePicker"}
    ]
  });

  // ..........................................................
  // LEAVE REQUEST
  //

  enyo.kind({
    name: "XV.LeaveRequestListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_leaveRequest".loc()},
      {name: "employee", label: "_employee".loc(), attr: "employee", defaultKind: "XV.OrangeEmployeeWidget"}
    ]
  });

}());

