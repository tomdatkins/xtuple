/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.standard.initPostbooks = function () {
    var relevantPrivileges;

    // ..........................................................
    // APPLICATION
    //

    relevantPrivileges = [
      "AccessStandardExtension"
    ];
    XT.session.addRelevantPrivileges("setup", relevantPrivileges);

  };

}());
