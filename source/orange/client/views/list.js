/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // JOB CATEGORY
  //

  enyo.kind({
    name: "XV.JobCategoryList",
    kind: "XV.List",
    label: "_jobCategories".loc(),
    collection: "OHRM.JobCategoryCollection",
    query: {orderBy: [
      {attribute: 'name'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "name", isKey: true}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("XM.JobCategory", "XV.JobCategoryList");

  // ..........................................................
  // JOB TITLE
  //

  enyo.kind({
    name: "XV.JobTitleList",
    kind: "XV.List",
    label: "_jobTitles".loc(),
    collection: "OHRM.JobTitleCollection",
    query: {orderBy: [
      {attribute: 'title'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "title", isKey: true},
            {kind: "XV.ListAttr", attr: "description"}
          ]}
        ]}
      ]}
    ]
  });
  XV.registerModelList("XM.JobTitle", "XV.JobTitleList");

}());
