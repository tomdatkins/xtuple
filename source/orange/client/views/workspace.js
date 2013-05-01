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
            {kind: "XV.OrangeEmployeeWidget", attr: "employee"},
            {kind: "XV.LeaveRequestWidget", attr: "leaveRequest"},
            {kind: "XV.LeaveTypePicker", attr: "leaveType"},
            {kind: "XV.NumberWidget", attr: "lengthDays"}
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
            {kind: "XV.DateWidget", attr: "dateApplied"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveRequest", "XV.LeaveRequestWorkspace");
  XV.registerModelWorkspace("OHRM.LeaveRequestRelation", "XV.LeaveRequestWorkspace");

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
            {kind: "XV.InputWidget", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveType", "XV.LeaveTypeWorkspace");

}());
