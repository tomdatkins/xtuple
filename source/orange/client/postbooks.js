/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.orange.initPostbooks = function () {
    var module, panels, relevantPrivileges;

    panels = [
      {name: "jobCategoryList", kind: "XV.JobCategoryList"},
      {name: "jobTitleList", kind: "XV.JobTitleList"}
    ];

    XT.app.$.postbooks.appendPanels("setup", panels);

    module = {
      name: "hr",
      label: "_hr".loc(),
      panels: [
        // This one won't live here forever but serves as POC that we can put lists in here.
        {name: "jobCategoryListTemp", kind: "XV.JobCategoryList"}
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
