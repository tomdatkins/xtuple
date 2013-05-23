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
        {kind: "XV.Groupbox", name: "mainPanel", title: "_overview".loc(), components: [
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.InputWidget", attr: "employeeId"},
            {kind: "XV.InputWidget", attr: "firstName"},
            {kind: "XV.InputWidget", attr: "middleName"},
            {kind: "XV.InputWidget", attr: "lastName"},
            {kind: "XV.InputWidget", attr: "nickName"},
            {kind: "onyx.GroupboxHeader", content: "_identification".loc()},
            {kind: "XV.InputWidget", attr: "driversLicenseNumber"},
            {kind: "XV.InputWidget", attr: "otherId"},
            {kind: "XV.DateWidget", attr: "driversLicenseExpiration"},
            {kind: "onyx.GroupboxHeader", content: "_info".loc()},
            {kind: "XV.GenderPicker", attr: "gender"},
            {kind: "XV.MaritalStatusPicker", attr: "maritalStatus"},
            {kind: "XV.OrangeCountryWidget", attr: "nationality"},
            {kind: "XV.DateWidget", attr: "birthday"}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "contactPanel", title: "_contact".loc(), components: [
          {kind: "XV.ScrollableGroupbox", name: "addressGroup",
            classes: "in-panel", components: [
            {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
            {kind: "XV.InputWidget", attr: "street1"},
            {kind: "XV.InputWidget", attr: "street2"},
            {kind: "XV.InputWidget", attr: "city"},
            {kind: "XV.OrangeProvinceWidget", attr: "province"},
            {kind: "XV.OrangeCountryWidget", attr: "country"},
            {kind: "XV.InputWidget", attr: "zip"},
            {kind: "onyx.GroupboxHeader", content: "_phone".loc()},
            {kind: "XV.InputWidget", attr: "homePhone"},
            {kind: "XV.InputWidget", attr: "mobilePhone"},
            {kind: "XV.InputWidget", attr: "workPhone"},
            {kind: "onyx.GroupboxHeader", content: "_email".loc()},
            {kind: "XV.InputWidget", attr: "workEmail"},
            {kind: "XV.InputWidget", attr: "otherEmail"}
          ]}
        ]},
        {kind: "XV.EmergencyContactBox", attr: "emergencyContactRelations"},
        {kind: "XV.DependentBox", attr: "dependentRelations"},
        {kind: "XV.Groupbox", name: "jobPanel", title: "_job".loc(), components: [
          {kind: "XV.ScrollableGroupbox", name: "jobGroup",
            classes: "in-panel", components: [
            {kind: "onyx.GroupboxHeader", content: "_job".loc()},
            {kind: "XV.JobTitlePicker", attr: "jobTitle"},
            //job specification?
            {kind: "XV.EmploymentStatusPicker", attr: "employmentStatus"},
            {kind: "XV.JobCategoryPicker", attr: "jobCategory"},
            {kind: "XV.DateWidget", attr: "joinedDate"},
            //subunit?
            //location?
            {kind: "onyx.GroupboxHeader", content: "_employmentContract".loc()}
            //{kind: "XV.DateWidget", name: "startDate"},
            //{kind: "XV.DateWidget", name: "endDate"}
            //contract details (attachment)
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.Employee", "XV.OrangeEmployeeWorkspace");
  XV.registerModelWorkspace("OHRM.EmployeeRelation", "XV.OrangeEmployeeWorkspace");


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
            // These fields are only shown when leave is on the same day
            //{kind: "XV.TimeWidget", attr: "startTime"},
            //{kind: "XV.TimeWidget", attr: "endTime"},
            {kind: "XV.OrangeEmployeeWidget", attr: "employee"},
            {kind: "XV.LeaveTypePicker", attr: "leaveType"},
            {kind: "XV.DateWidget", attr: "date", label: "_fromDate".loc()},
            {kind: "XV.DateWidget", name: "toDate", label: "_toDate".loc(), onchange: "toDateChanged"},
            {kind: "XV.NumberWidget", attr: "lengthDays"},
            //{kind: "XV.NumberWidget", attr: "lengthHours"},
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
        /* Leave request seems half-baked even in orange
        {kind: "XV.Groupbox", name: "leaveRequestPanel", title: "_leaveRequest".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_leaveRequest".loc()},
          {kind: "XV.ScrollableGroupbox", name: "leaveRequestsGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.LeaveRequestWidget", attr: "leaveRequest"}
          ]}
        ]},
        */
        {kind: "XV.LeaveCommentBox", attr: "comments"}
      ]}
    ],
    newRecord: function (attributes, options) {
      this.inherited(arguments);
      this.value.off("leaveRemaining", this.updateLeaveRemaining, this);
      this.value.on("leaveRemaining", this.updateLeaveRemaining, this);
      this.value.off("toDate", this.updateToDate, this);
      this.value.on("toDate", this.updateToDate, this);
    },
    destroy: function () {
      this.value.off("leaveRemaining", this.updateLeaveRemaining, this);
      this.value.off("toDate", this.updateToDate, this);
      this.inherited(arguments);
    },
    recordIdChanged: function () {
      this.inherited(arguments);
      if (this.value) {
        this.value.off("leaveRemaining", this.updateLeaveRemaining, this);
        this.value.on("leaveRemaining", this.updateLeaveRemaining, this);
        this.value.off("toDate", this.updateToDate, this);
        this.value.on("toDate", this.updateToDate, this);
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
    },
    updateToDate: function (toDate) {
      this.$.toDate.setValue(toDate);
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
  // JOB CANDIDATE
  //

  enyo.kind({
    name: "XV.JobCandidateWorkspace",
    kind: "XV.Workspace",
    title: "_candidate".loc(),
    model: "OHRM.JobCandidate",
    events: {
      onWorkspace: ""
    },
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
            //{kind: "XV.JobVacancyPicker", attr: "vacancy"},
            {kind: "XV.CandidateStatusPicker", name: "actions", attr: "candidateStatus", label: "_actions".loc()},
            {kind: "XV.InputWidget", attr: "keywords"},
            {kind: "onyx.GroupboxHeader", content: "_comments".loc()},
            {kind: "XV.TextArea", attr: "comment", fit: true},
            {kind: "XV.DateWidget", attr: "dateOfApplication", label: "_dateApplied".loc()}
            // TODO: Resume Attachment
            //{kind: "XV.JobCandidateDocumentsBox", attr: resume"}
            // TODO: Add Candidate History
            //{kind: "XV.JobCandidateHistoryRelationsBox", attr: "history"}
          ]}
        ]}
      ]}
    ],
    attributesChanged: function (model, options) {
      this.inherited(arguments);
      var status = model.getStatus(), action = model.get("candidateStatus");
      // only show the actions on existing candidates
      this.$.actions.setShowing(status !== XM.Model.READY_NEW);
    },
    controlValueChanged: function (inSender, inEvent) {
      this.inherited(arguments);
      // an interview has been scheduled, open interview workspace
      if (inEvent.originator.name === 'actions' && inEvent.value === OHRM.JobCandidate.INTERVIEW_SCHEDULED) {
        var callback = function (model) {
          if (!model) { return; }
          var Model = OHRM.JobInterview,
            attrs = {},
            value,
            that = this,
            options = {};
          options.success = function () {
            that.setValue(value);
          };
          attrs[Model.prototype.idAttribute] = model.id;
          value = Model.findOrCreate(attrs);
          value.fetch(options);
        };

        this.doWorkspace({
          workspace: "XV.JobInterviewWorkspace",
          callback: callback,
          allowNew: false,
          attributes: {
            candidate: this.value.id
          }
        });
      }
    }
  });
  XV.registerModelWorkspace("OHRM.JobCandidate", "XV.JobCandidateWorkspace");
  XV.registerModelWorkspace("OHRM.JobCandidateRelation", "XV.JobCandidateWorkspace");

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
            {kind: "XV.OrangeEmployeeWidget", attr: "hiringManager"},
            {kind: "XV.NumberWidget", attr: "positions", label: "_numberPositions".loc()},
            {kind: "onyx.GroupboxHeader", content: "_comments".loc()},
            {kind: "XV.TextArea", attr: "description", fit: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.JobVacancy", "XV.JobVacancyWorkspace");
  XV.registerModelWorkspace("OHRM.JobVacancyRelation", "XV.JobVacancyWorkspace");
  // ..........................................................
  // JOB VACANCY
  //

  enyo.kind({
    name: "XV.JobInterviewWorkspace",
    kind: "XV.Workspace",
    title: "_interview".loc(),
    model: "OHRM.JobInterview",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            //{kind: "XV.InputWidget", attr: "candidate.vacancy", label: "_vacancy".loc()},
            {kind: "XV.InputWidget", attr: "candidate.fullName", label: "_candidate".loc()},
            {kind: "XV.InputWidget", attr: "candidate.getCandidateStatusString", label: "_status".loc()},
            {kind: "XV.InputWidget", attr: "name", label: "_interviewName".loc()},
            {kind: "XV.OrangeEmployeeWidget", attr: "interviewer"}, // employee lookup
            {kind: "XV.DateWidget", attr: "date", label: "_date".loc()},
            //{kind: "XV.TimeWidget", attr: "time"}, // not using
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "note", fit: true}
            // TODO: Attachments
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.JobInterview", "XV.JobInterviewWorkspace");
  XV.registerModelWorkspace("OHRM.JobInterviewRelation", "XV.JobInterviewWorkspace");

}());
