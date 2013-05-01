/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, window:true */

(function () {


  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.OrangeEmployeeWorkspace",
    kind: "XV.Workspace",
    title: "_employee".loc(),
    model: "OHRM.Employee",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "employeeId"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.Employee", "XV.OrangeEmployeeWorkspace");
  XV.registerModelWorkspace("OHRM.EmployeeRelation", "XV.OrangeEmployeeWorkspace");

  // TODO: lots more employee-related models
  // TODO: lots more job models

  // ..........................................................
  // JOB CATEGORY
  //

  enyo.kind({
    name: "XV.JobCategoryWorkspace",
    kind: "XV.Workspace",
    title: "_jobCategory".loc(),
    model: "OHRM.JobCategory",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.JobCategory", "XV.JobCategoryWorkspace");

  // ..........................................................
  // JOB TITLE
  //

  enyo.kind({
    name: "XV.JobTitleWorkspace",
    kind: "XV.Workspace",
    title: "_jobTitle".loc(),
    model: "OHRM.JobTitle",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "title"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.NumberCheckboxWidget", attr: "isDeleted"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "note", fit: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.JobTitle", "XV.JobTitleWorkspace");

  // TODO: leave adjustment
  // TODO: leave comment
  // TODO: leave period history
  // TODO: leave entitlement
  // TODO: leave entitlement type
  // TODO: leave entitlement adjustment
  // TODO: leave leave entitlement

  // ..........................................................
  // LEAVE
  //

  enyo.kind({
    name: "XV.LeaveWorkspace",
    kind: "XV.Workspace",
    title: "_leave".loc(),
    model: "OHRM.Leave",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.DateWidget", attr: "date"},
            {kind: "XV.NumberWidget", attr: "lengthHours"},
            {kind: "XV.NumberWidget", attr: "lengthDays"},
            {kind: "XV.LeaveStatusPicker", attr: "leaveStatus"},
            {kind: "XV.LeaveRequestWidget", attr: "leaveRequest"},
            {kind: "XV.LeaveTypePicker", attr: "leaveType"},
            {kind: "XV.OrangeEmployeeWidget", attr: "employee"},
            //{kind: "XV.TimeWidget", attr: "startTime"}, TODO
            //{kind: "XV.TimeWidget", attr: "endTime"},
            {kind: "onyx.GroupboxHeader", content: "_comments".loc()},
            {kind: "XV.TextArea", attr: "comments", fit: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.Leave", "XV.LeaveWorkspace");

  // ..........................................................
  // LEAVE REQUEST
  //

  enyo.kind({
    name: "XV.LeaveRequestWorkspace",
    kind: "XV.Workspace",
    title: "_leaveRequest".loc(),
    model: "OHRM.LeaveRequest",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.OrangeEmployeeWidget", attr: "employee"},
            {kind: "XV.LeaveTypePicker", attr: "leaveType"},
            {kind: "XV.DateWidget", attr: "dateApplied"},
            {kind: "onyx.GroupboxHeader", content: "_comments".loc()},
            {kind: "XV.TextArea", attr: "comments", fit:true }
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveRequest", "XV.LeaveRequestWorkspace");
  XV.registerModelWorkspace("OHRM.LeaveRequestRelation", "XV.LeaveRequestWorkspace");

  // TODO: leave request comment

  // ..........................................................
  // LEAVE STATUS
  //

  enyo.kind({
    name: "XV.LeaveStatusWorkspace",
    kind: "XV.Workspace",
    title: "_leaveStatus".loc(),
    model: "OHRM.LeaveStatus",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.NumberWidget", attr: "isStatus"}, // TODO: NumberCheckboxWidget?
            {kind: "XV.InputWidget", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveStatus", "XV.LeaveStatusWorkspace");

  // ..........................................................
  // LEAVE TYPE
  //

  enyo.kind({
    name: "XV.LeaveTypeWorkspace",
    kind: "XV.Workspace",
    title: "_leaveType".loc(),
    model: "OHRM.LeaveType",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            //{kind: "XV.NumberCheckboxWidget", attr: "isDeleted"}, TODO
            //{kind: "XV.NumberCheckboxWidget", attr: "excludeInReportsIfNoEntitlement"},
            //{kind: "XV.SomenewWidget", attr: "operationalCountry"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveType", "XV.LeaveTypeWorkspace");

}());
