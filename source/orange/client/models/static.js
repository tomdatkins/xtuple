/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  // These are hard coded collections that may be turned into tables at a later date
  var i;

  // Account Type
  var candidateStatusJson = [
    { id: 0, name: "_applicationInitiated".loc() },
    { id: 1, name: "_shortListed".loc() },
    { id: 2, name: "_interviewScheduled".loc() },
    { id: 3, name: "_interviewPassed".loc() },
    { id: 4, name: "_interviewFailed".loc() },
    { id: 5, name: "_jobOffered".loc() },
    { id: 6, name: "_offerDeclined".loc() },
    { id: 7, name: "_rejected".loc() },
    { id: 8, name: "_hired".loc() }
  ];
  OHRM.CandidateStatusModel = Backbone.Model.extend({
  
  });
  
  OHRM.CandidateStatusCollection = Backbone.Collection.extend({
    model: OHRM.CandidateStatusModel
  });
  
  OHRM.candidateStatuses = new OHRM.CandidateStatusCollection();
  for (i = 0; i < candidateStatusJson.length; i++) {
    var candidateStatus = new OHRM.CandidateStatusModel(candidateStatusJson[i]);
    OHRM.candidateStatuses.add(candidateStatus);
  }
  
}());
