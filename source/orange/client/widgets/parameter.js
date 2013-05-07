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
  
  // ..........................................................
  // JOB CANDIDATE
  //

  enyo.kind({
    name: "XV.JobCandidateListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_candidate".loc()},
      {name: "candidateStatus", label: "_status".loc(), attr: "candidateStatus", defaultKind: "XV.CandidateStatusPicker"},
      {name: "hiringManager", label: "_hiringManager".loc(), attr: "hiringManager", defaultKind: "XV.OrangeEmployeeWidget"},
      {name: "keywords", label: "_keywords".loc(), attr: "keywords", defaultKind: "XV.InputWidget"},
      {kind: "onyx.GroupboxHeader", content: "_dateApplied".loc()},
      {name: "appliedFromDate", label: "_fromDate".loc(),
        filterLabel: "_dateApplied".loc() + " " + "_fromDate".loc(),
        attr: "dateOfApplication", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {name: "appliedToDate", label: "_toDate".loc(),
        filterLabel: "_dateApplied".loc() + " " + "_toDate".loc(),
        attr: "dateOfApplication", operator: "<=",
        defaultKind: "XV.DateWidget"}
    ]
  });
  
  // ..........................................................
  // JOB VACANCY
  //

  enyo.kind({
    name: "XV.JobVacancyListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_vacancy".loc()},
      {name: "isActive", attr: "vacancyStatus", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: 1
            };
          }
          return param;
        }
      },
      {name: "title", defaultKind: "XV.JobTitlePicker", attr: "title", label: "_title".loc()},
      {name: "vacancyName", defaultKind: "XV.InputWidget", attr: "name", label: "_vacancyName".loc()},
      {name: "hiringManager", label: "_hiringManager".loc(), attr: "hiringManager", defaultKind: "XV.OrangeEmployeeWidget"}
    ]
  });

}());

