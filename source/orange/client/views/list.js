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
    collection: "OHRM.EmployeeRelationCollection",
    parameterWidget: "XV.OrangeEmployeeListParameters",
    query: {orderBy: [
      {attribute: 'employeeId'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "employeeId", isKey: true},
            {kind: "XV.ListAttr", attr: "fullName"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("OHRM.Employee", "XV.OrangeEmployeeList");
  XV.registerModelList("OHRM.EmployeeRelation", "XV.OrangeEmployeeList");

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
  XV.registerModelList("OHRM.JobCategory", "XV.JobCategoryList");

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
  XV.registerModelList("OHRM.JobTitle", "XV.JobTitleList");

  // ..........................................................
  // LEAVE
  //

  enyo.kind({
    name: "XV.LeaveList",
    kind: "XV.List",
    label: "_leave".loc(),
    collection: "OHRM.LeaveRelationCollection",
    parameterWidget: "XV.LeaveListParameters",
    query: {orderBy: [
      {attribute: 'employee.employeeId'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "employee.employeeId", isKey: true},
            {kind: "XV.ListAttr", attr: "date"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "leaveType.name"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("OHRM.Leave", "XV.LeaveList");
  XV.registerModelList("OHRM.LeaveRelation", "XV.LeaveList");

  // ..........................................................
  // LEAVE ADJUSTMENT
  //

  enyo.kind({
    name: "XV.LeaveAdjustmentList",
    kind: "XV.List",
    label: "_leaveAdjustments".loc(),
    collection: "OHRM.LeaveAdjustmentCollection",
    query: {orderBy: [
      {attribute: 'employee.employeeId'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "employee.employeeId", isKey: true},
            {kind: "XV.ListAttr", attr: "numberOfDays"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("OHRM.LeaveAdjustment", "XV.LeaveAdjustmentList");

  // ..........................................................
  // LEAVE ENTITLEMENT
  //

  enyo.kind({
    name: "XV.LeaveEntitlementList",
    kind: "XV.List",
    label: "_leaveEntitlements".loc(),
    collection: "OHRM.LeaveEntitlementListItemCollection",
    parameterWidget: "XV.LeaveEntitlementListParameters",
    query: {orderBy: [
      {attribute: 'employee.employeeId'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "employee.fullName", isKey: true},
            {kind: "XV.ListAttr", attr: "numberOfDays"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "leaveType.name"},
            {kind: "XV.ListAttr", attr: "leavePeriod"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("OHRM.LeaveEntitlement", "XV.LeaveEntitlementList");
  XV.registerModelList("OHRM.LeaveEntitlementListItem", "XV.LeaveEntitlementList");

  // ..........................................................
  // LEAVE ENTITLEMENT TYPE
  //

  enyo.kind({
    name: "XV.LeaveEntitlementTypeList",
    kind: "XV.List",
    label: "_leaveEntitlementTypes".loc(),
    collection: "OHRM.LeaveEntitlementTypeCollection",
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
  XV.registerModelList("OHRM.LeaveEntitlementType", "XV.LeaveEntitlementTypeList");

  // ..........................................................
  // LEAVE REQUEST
  //

  enyo.kind({
    name: "XV.LeaveRequestList",
    kind: "XV.List",
    label: "_leaveRequests".loc(),
    collection: "OHRM.LeaveRequestRelationCollection",
    parameterWidget: "XV.LeaveRequestListParameters",
    query: {orderBy: [
      {attribute: 'dateApplied'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "employee.fullName", isKey: true},
            {kind: "XV.ListAttr", attr: "dateApplied"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "leaveType.name"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("OHRM.LeaveRequest", "XV.LeaveRequestList");
  XV.registerModelList("OHRM.LeaveRequestRelation", "XV.LeaveRequestList");

  // ..........................................................
  // LEAVE STATUS
  //

  enyo.kind({
    name: "XV.LeaveStatusList",
    kind: "XV.List",
    label: "_leaveStatuses".loc(),
    collection: "OHRM.LeaveStatusCollection",
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
  XV.registerModelList("OHRM.LeaveStatus", "XV.LeaveStatusList");

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
  XV.registerModelList("OHRM.LeaveType", "XV.LeaveTypeList");

  // ..........................................................
  // CANDIDATE
  //

  enyo.kind({
    name: "XV.JobCandidateList",
    kind: "XV.List",
    label: "_candidates".loc(),
    collection: "OHRM.JobCandidateCollection",
    parameterWidget: "XV.JobCandidateListParameters",
    query: {orderBy: [
      {attribute: 'id'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "XV.ListAttr", attr: "fullName", isKey: true},
            {kind: "XV.ListAttr", attr: "jobVacancy.name"}
          ]},
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "dateOfApplication"},
            {kind: "XV.ListAttr", attr: "getCandidateStatusString"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("OHRM.JobCandidate", "XV.JobCandidateList");

  // ..........................................................
  // VACANCY
  //

  enyo.kind({
    name: "XV.JobVacancyList",
    kind: "XV.List",
    label: "_vacancies".loc(),
    collection: "OHRM.JobVacancyRelationCollection",
    parameterWidget: "XV.JobVacancyListParameters",
    query: {orderBy: [
      {attribute: 'id'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "XV.ListAttr", attr: "name", isKey: true},
            {kind: "XV.ListAttr", attr: "title.title"}
          ]},
          {kind: "XV.ListColumn", classes: "last", components: [
             {kind: "XV.ListAttr", attr: "getVacancyStatusString"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("OHRM.JobVacancy", "XV.JobVacancyList");
  XV.registerModelList("OHRM.JobVacancyRelation", "XV.JobVacancyList");

}());
