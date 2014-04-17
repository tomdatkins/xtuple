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
      {kind: "XV.Groupbox", container: "this.$.panels", components: [
        {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
        {kind: "XV.ScrollableGroupbox", name: "mainGroup",
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "test1",
            label: "_test1".loc()},
          {kind: "XV.InputWidget", attr: "test2",
              label: "_test2".loc()},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "test3"}
        ]}
      ]}
    ];

    XV.appendExtension("XV.DatabaseInformationWorkspace", extensions);

  };
}());
