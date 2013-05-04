/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.ppm.initPostbooks = function () {
    var relevantPrivileges,
      projectPanels,
      setupPanels;

    // ..........................................................
    // APPLICATION
    //

    relevantPrivileges = [
      "AccessPPMExtension"
    ];
    XT.session.addRelevantPrivileges("setup", relevantPrivileges);

    setupPanels = [
      {name: "expeneseCategoryList", kind: "XV.ExpenseCategoryList"}
    ];
    XT.app.$.postbooks.appendPanels("setup", setupPanels);

    projectPanels = [
      {name: "worksheet", kind: "XV.WorksheetList"}
    ];

    XT.app.$.postbooks.appendPanels("project", projectPanels);

  };

}());
