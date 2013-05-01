/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.OrangeEmployeeList",
    kind: "XV.List",
    label: "_employees".loc(),
    collection: "OHRM.EmployeeCollection",
    query: {orderBy: [
      {attribute: 'employeeId'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "employeeId", isKey: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("XM.Employee", "XV.OrangeEmployeeList");

  // ..........................................................
  // JOB CATEGORY
  //

  enyo.kind({
    name: "XV.JobCategoryList",
    kind: "XV.List",
    label: "_jobCategories".loc(),
    collection: "OHRM.JobCategoryCollection",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "name", isKey: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("XM.JobCategory", "XV.JobCategoryList");

  // ..........................................................
  // JOB TITLE
  //

  enyo.kind({
    name: "XV.JobTitleList",
    kind: "XV.List",
    label: "_jobTitles".loc(),
    collection: "OHRM.JobTitleCollection",
    query: {orderBy: [
      {attribute: 'title'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "title", isKey: true},
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("XM.JobTitle", "XV.JobTitleList");

  // ..........................................................
  // LEAVE
  //

  enyo.kind({
    name: "XV.LeaveList",
    kind: "XV.List",
    label: "_leaves".loc(),
    collection: "OHRM.LeaveCollection",
    query: {orderBy: [
      {attribute: 'employeeNumber'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "employeeNumber", isKey: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("XM.Leave", "XV.LeaveList");

  // ..........................................................
  // LEAVE REQUEST
  //

  enyo.kind({
    name: "XV.LeaveRequestList",
    kind: "XV.List",
    label: "_leaveRequests".loc(),
    collection: "OHRM.LeaveRequestCollection",
    query: {orderBy: [
      {attribute: 'dateApplied'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "dateApplied", isKey: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("XM.LeaveRequest", "XV.LeaveRequestList");

  // ..........................................................
  // LEAVE TYPE
  //

  enyo.kind({
    name: "XV.LeaveTypeList",
    kind: "XV.List",
    label: "_leaveTypes".loc(),
    collection: "OHRM.LeaveTypeCollection",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "name", isKey: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("XM.LeaveType", "XV.LeaveTypeList");

}());
