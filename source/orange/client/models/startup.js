/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initStartup = function () {

    /**
      Put startup functions here
     */
    XT.cacheCollection("OHRM.leaveEntitlementTypes", "OHRM.LeaveEntitlementTypeCollection", "name");
    XT.cacheCollection("OHRM.leaveTypes", "OHRM.LeaveTypeCollection", "name");
    XT.cacheCollection("OHRM.leaveStatuses", "OHRM.LeaveStatusCollection", "name");
    XT.cacheCollection("OHRM.leaveRequests", "OHRM.LeaveRequestCollection"); // XXX demo only
    XT.cacheCollection("OHRM.jobVacancies", "OHRM.JobVacancyCollection");
    XT.cacheCollection("OHRM.jobTitles", "OHRM.JobTitleCollection");
    XT.cacheCollection("OHRM.candidateStatuses", "OHRM.CandidateStatusCollection");
    XT.cacheCollection("OHRM.maritalStatuses", "OHRM.MaritalStatusCollection");
    XT.cacheCollection("OHRM.genders", "OHRM.GenderCollection");
    XT.cacheCollection("OHRM.employmentStatuses", "OHRM.EmploymentStatusCollection");
  };

}());
