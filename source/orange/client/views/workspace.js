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
            {kind: "XV.InputWidget", attr: "employeeId"},
            {kind: "XV.InputWidget", attr: "firstName"},
            {kind: "XV.InputWidget", attr: "middleName"},
            {kind: "XV.InputWidget", attr: "lastName"}
            // TODO: lots more fields
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

  // TODO: leave period history
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
    handlers: {
      onValueChange: "controlValueChanged"
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.DateWidget", attr: "date", label: "_fromDate".loc()},
            {kind: "XV.DateWidget", name: "toDate", label: "_toDate".loc(), onchange: "toDateChanged"},
            // These fields are only shown when leave is on the same day
            {kind: "XV.TimeWidget", attr: "startTime"},
            {kind: "XV.TimeWidget", attr: "endTime"},
            {kind: "XV.OrangeEmployeeWidget", attr: "employee"},
            {kind: "XV.LeaveTypePicker", attr: "leaveType"},
            {kind: "XV.NumberWidget", attr: "lengthDays"},
            // Only show if not an entire day
            {kind: "XV.NumberWidget", attr: "lengthHours"},
            {kind: "XV.LeaveStatusPicker", attr: "leaveStatus"},
            {kind: "FittableColumns", components: [
              {name: "label", content: "_leaveBalance".loc(), classes: "xv-label"},
              {kind: "onyx.InputDecorator", fit: true, classes: "xv-input-decorator",
                components: [
                {name: "leaveRemainingContent", classes: "xv-subinput", disabled: true}
              ]}
            ]},
            //{kind: "XV.LeaveRequestWidget", attr: "leaveRequest"}, // TODO: ???
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "leaveRequestPanel", title: "_leaveRequest".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_leaveRequest".loc()},
          {kind: "XV.ScrollableGroupbox", name: "leaveRequestsGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.LeaveRequestWidget", attr: "leaveRequest"}
          ]}
        ]},
        {kind: "XV.LeaveCommentBox", attr: "comments"}
      ]}
    ],
    newRecord: function (attributes, options) {
      this.inherited(arguments);
      this.value.off("leaveRemaining", this.updateLeaveRemaining, this);
      this.value.on("leaveRemaining", this.updateLeaveRemaining, this);
    },
    destroy: function () {
      this.value.off("leaveRemaining", this.updateLeaveRemaining, this);
      this.inherited(arguments);
    },
    recordIdChanged: function () {
      this.inherited(arguments);
      if (this.value) {
        this.value.off("leaveRemaining", this.updateLeaveRemaining, this);
        this.value.on("leaveRemaining", this.updateLeaveRemaining, this);
      }
    },
    controlValueChanged: function (inSender, inEvent) {
      if (inEvent.originator.name === 'toDate') {
        this.value.setToDate(this.$.toDate.value);
        return true; // prevent propagation
      } else {
        this.inherited(arguments);
      }
    },
    updateLeaveRemaining: function (leaveRemaining) {
      this.$.leaveRemainingContent.setContent(leaveRemaining);
    }
  });
  XV.registerModelWorkspace("OHRM.LeaveRelation", "XV.LeaveWorkspace");
  XV.registerModelWorkspace("OHRM.Leave", "XV.LeaveWorkspace");

  // ..........................................................
  // LEAVE ADJUSTMENT
  //

  enyo.kind({
    name: "XV.LeaveAdjustmentWorkspace",
    kind: "XV.Workspace",
    title: "_leaveAdjustment".loc(),
    model: "OHRM.LeaveAdjustment",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.OrangeEmployeeWidget", attr: "employee"},
            {kind: "XV.NumberWidget", attr: "numberOfDays"},
            {kind: "XV.LeaveTypePicker", attr: "leaveType"},
            {kind: "XV.DateWidget", attr: "fromDate"},
            {kind: "XV.DateWidget", attr: "toDate"},
            {kind: "XV.DateWidget", attr: "creditedDate"},
            {kind: "XV.LeaveEntitlementTypePicker", attr: "adjustmentType"},
            {kind: "XV.CheckboxWidget", attr: "isDeleted"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "note", fit: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveAdjustment", "XV.LeaveAdjustmentWorkspace");

  // ..........................................................
  // LEAVE ENTITLEMENT
  //

  enyo.kind({
    name: "XV.LeaveEntitlementWorkspace",
    kind: "XV.Workspace",
    title: "_leaveEntitlement".loc(),
    model: "OHRM.LeaveEntitlement",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.OrangeEmployeeWidget", attr: "employee"},
            {kind: "XV.NumberWidget", attr: "numberOfDays"},
            {kind: "XV.NumberWidget", attr: "daysUsed"},
            {kind: "XV.LeaveTypePicker", attr: "leaveType"},
            {kind: "XV.DateWidget", attr: "fromDate"},
            {kind: "XV.DateWidget", attr: "toDate"},
            //{kind: "XV.DateWidget", attr: "creditedDate"},
            {kind: "XV.LeaveEntitlementTypePicker", attr: "entitlementType"},
            //{kind: "XV.CheckboxWidget", attr: "isDeleted"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "note", fit: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveEntitlement", "XV.LeaveEntitlementWorkspace");
  XV.registerModelWorkspace("OHRM.LeaveEntitlementListItem", "XV.LeaveEntitlementWorkspace");

  // ..........................................................
  // LEAVE ENTITLEMENT TYPE
  //

  enyo.kind({
    name: "XV.LeaveEntitlementTypeWorkspace",
    kind: "XV.Workspace",
    title: "_leaveEntitlementType".loc(),
    model: "OHRM.LeaveEntitlementType",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.CheckboxWidget", attr: "isEditable"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveEntitlementType", "XV.LeaveEntitlementTypeWorkspace");

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
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true }
          ]}
        ]},
        {kind: "XV.LeaveRequestCommentBox", attr: "comments"}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveRequest", "XV.LeaveRequestWorkspace");
  XV.registerModelWorkspace("OHRM.LeaveRequestRelation", "XV.LeaveRequestWorkspace");

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
            {kind: "XV.NumberCheckboxWidget", attr: "isStatus"},
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
            {kind: "XV.NumberCheckboxWidget", attr: "isDeleted"},
            {kind: "XV.NumberCheckboxWidget", attr: "excludeInReportsIfNoEntitlement"}//,
            //{kind: "XV.SomenewWidget", attr: "operationalCountry"} TODO
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.LeaveType", "XV.LeaveTypeWorkspace");

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.JobCandidateWorkspace",
    kind: "XV.Workspace",
    title: "_candidate".loc(),
    model: "OHRM.JobCandidate",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "firstName"},
            {kind: "XV.InputWidget", attr: "middleName"},
            {kind: "XV.InputWidget", attr: "lastName"},
            {kind: "XV.InputWidget", attr: "email"},
            {kind: "XV.InputWidget", attr: "contactNumber"},
            {kind: "XV.JobVacancyPicker", attr: "jobVacancy"},
            {kind: "XV.InputWidget", attr: "keywords"},
            {kind: "onyx.GroupboxHeader", content: "_comments".loc()},
            {kind: "XV.TextArea", attr: "comment", fit: true},
            {kind: "XV.DateWidget", attr: "dateOfApplication", label: "_dateApplied".loc()}
            // TODO: Resume Attachment
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.JobCandidate", "XV.JobCandidateWorkspace");

  // ..........................................................
  // JOB VACANCY
  //

  enyo.kind({
    name: "XV.JobVacancyWorkspace",
    kind: "XV.Workspace",
    title: "_vacancy".loc(),
    model: "OHRM.JobVacancy",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.NumberCheckboxWidget", attr: "vacancyStatus", label: "_active".loc()},
            {kind: "XV.CheckboxWidget", attr: "publishedInFeed", label: "_publishedInFeed".loc()},
            {kind: "XV.JobTitlePicker", attr: "title"},
            {kind: "XV.InputWidget", attr: "name", label: "_vacancyName".loc()},
            {kind: "XV.NumberWidget", attr: "hiringManager"}, //TODO: lookup hiring manager
            {kind: "XV.NumberWidget", attr: "positions", label: "_numberPositions".loc()},
            {kind: "onyx.GroupboxHeader", content: "_comments".loc()},
            {kind: "XV.TextArea", attr: "description", fit: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.JobVacancy", "XV.JobVacancyWorkspace");

}());
