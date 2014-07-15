/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, enyo:true, console:true */

(function () {
  "use strict";

  XT.extensions.xdruple.initPostbooks = function () {

    var module = {
      name: "xdruple",
      label: "_xdruple".loc(),
      panels: [
        {name: "XdSiteList", kind: "XV.XdSiteList"},
        {name: "XdUserContactList", kind: "XV.XdUserContactList"}
      ]
    };
    XT.app.$.postbooks.insertModule(module, 2);

    var relevantPrivileges = [
      "AccessxDrupleExtension"
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

  };

}());
