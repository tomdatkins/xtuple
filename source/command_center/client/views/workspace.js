/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true, async:true,
  window:true, setTimeout:true */

(function () {

  XT.extensions.commandCenter.initWorkspaces = function () {

    // ..........................................................
    // DATABASE CONFIGURE
    //

    var extensions = [
      {kind: "XV.Groupbox", container: "panels", components: [
        {kind: "XV.ScrollableGroupbox",
          classes: "in-panel", components: [
          {kind: "onyx.GroupboxHeader", content: "_databaseBackup".loc()},
          {kind: "FittableColumns", classes: "xv-buttons center", components: [
            {kind: "onyx.Button", name: "backup",
              content: "_backup".loc(), classes: "text", ontap: ""},
          ]},
          {kind: "onyx.GroupboxHeader", content: "_restore".loc()},
          {kind: "XV.InputWidget", attr: "", label: "_backupPath".loc()},
          {kind: "XV.InputWidget", attr: "", label: "_targetName".loc()},
          {kind: "FittableColumns", classes: "xv-buttons center", components: [
            {kind: "onyx.Button", name: "restore", classes: "icon-ok", ontap: ""},
          ]},
          {kind: "onyx.GroupboxHeader", content: "_pilotUpgrade".loc()},
          {kind: "XV.InputWidget", attr: "", label: "_version".loc()},
          {kind: "FittableColumns", classes: "xv-buttons center", components: [
            {kind: "onyx.Button", name: "pilotUpgrade", classes: "icon-ok", ontap: ""},
          ]},
          {kind: "onyx.GroupboxHeader", content: "_productionUpgrade".loc()},
          {kind: "XV.InputWidget", attr: "", label: "_version".loc()},
          {kind: "FittableColumns", classes: "xv-buttons center", components: [
            {kind: "onyx.Button", name: "prodUpgrade", classes: "icon-ok", ontap: ""},
          ]},
        ]}
      ]}
    ];

    XV.appendExtension("XV.DatabaseInformationWorkspace", extensions);

  };
}());
