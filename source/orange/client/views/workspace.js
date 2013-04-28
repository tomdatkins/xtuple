/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, window:true */

(function () {

  // ..........................................................
  // JOB CATEGORY
  //

  enyo.kind({
    name: "XV.JobCategoryWorkspace",
    kind: "XV.Workspace",
    title: "_jobCategory".loc(),
    model: "OHRM.JobCategory",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.JobCategory", "XV.JobCategoryWorkspace");

  // ..........................................................
  // JOB TITLE
  //

  enyo.kind({
    name: "XV.JobTitleWorkspace",
    kind: "XV.Workspace",
    title: "_jobTitle".loc(),
    model: "OHRM.JobTitle",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "title"},
            {kind: "XV.InputWidget", attr: "description"},
            //{kind: "XV.CheckboxWidget", attr: "isDeleted"}, TODO: this is a smallint in Orange and not a boolean!
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "note", fit: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelWorkspace("OHRM.JobTitle", "XV.JobTitleWorkspace");

}());
