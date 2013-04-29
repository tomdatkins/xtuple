/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.ppm.initPostbooks = function () {
    var relevantPrivileges,
      panels;

    // ..........................................................
    // APPLICATION
    //

    relevantPrivileges = [
      "AccessPPMExtension"
    ];
    XT.session.addRelevantPrivileges("setup", relevantPrivileges);
    
    panels = [
      {name: "worksheet", kind: "XV.WorksheetList"}
    ];

    XT.app.$.postbooks.appendPanels("project", panels);

  };

}());
