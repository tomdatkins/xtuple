/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global XT:true, XV:true, Backbone:true, enyo:true, console:true */

(function () {

  XT.extensions.xdruple.initWorkspace = function () {
    enyo.kind({
      name: "XV.XdSiteWorkspace",
      kind: "XV.Workspace",
      title: "_xdSite".loc(),
      model: "XM.XdSite",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
                classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "name", classes: "xv-short-textarea" },
              {kind: "XV.InputWidget", attr: "drupalUrl", classes: "xv-short-textarea" },
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", classes: "xv-short-textarea" }
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.XdSite", "XV.XdSiteWorkspace");

    enyo.kind({
      name: "XV.XdUserContactWorkspace",
      kind: "XV.Workspace",
      title: "_xdUserContact".loc(),
      model: "XM.XdUserContact",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
                classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "uuid", classes: "xv-short-textarea" },
              {kind: "XV.XdContactWidget", attr: "contact" },
              {kind: "XV.XdSitePicker", attr: "xdruple_site" }
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.XdUserContact", "XV.XdUserContactWorkspace");
  };
}());
