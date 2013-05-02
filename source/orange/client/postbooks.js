/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.orange.initPostbooks = function () {
    var module, panels, relevantPrivileges;

    panels = [
      {name: "jobCategoryList", kind: "XV.JobCategoryList"},
      {name: "jobTitleList", kind: "XV.JobTitleList"},
      {name: "leaveStatusList", kind: "XV.LeaveStatusList"},
      {name: "leaveTypeList", kind: "XV.LeaveTypeList"}
    ];

    XT.app.$.postbooks.appendPanels("setup", panels);

    module = {
      name: "hr",
      label: "_hr".loc(),
      panels: [
        {name: "employeeList", kind: "XV.OrangeEmployeeList"},
        {name: "leaveList", kind: "XV.LeaveList"},
        {name: "leaveRequestList", kind: "XV.LeaveRequestList"},
        {name: "candidateList", kind: "XV.JobCandidateList"},
        {name: "vacancyList", kind: "XV.JobVacancyList"}
      ]
    };
    XT.app.$.postbooks.insertModule(module, 2);

    // ..........................................................
    // APPLICATION
    //

    relevantPrivileges = [
      "AccessOrangeExtension"
    ];
    XT.session.addRelevantPrivileges("setup", relevantPrivileges);

  };

}());
