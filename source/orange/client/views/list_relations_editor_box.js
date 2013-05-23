/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {
  
  // ..........................................................
  // DEPENDENT
  //
  enyo.kind({
    name: "XV.DependentEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
      classes: "in-panel", style: "border-right: #aaa 1px solid;", components: [
        {kind: "XV.InputWidget", attr: "name", classes: "editor-field"},
        {kind: "XV.InputWidget", attr: "relationship", classes: "editor-field"},
        {kind: "XV.DateWidget", attr: "dateOfBirth", classes: "editor-field"}
      ]}
    ]
  });
  
  enyo.kind({
    name: "XV.DependentBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_dependents".loc(),
    editor: "XV.DependentEditor",
    parentKey: "employee",
    listRelations: "XV.DependentListRelations",
    fitButtons: false
  });

  // ..........................................................
  // EMERGENCY CONTACT
  //
  enyo.kind({
    name: "XV.EmergencyContactEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
      classes: "in-panel", style: "border-right: #aaa 1px solid;", components: [
        {kind: "XV.InputWidget", attr: "name", classes: "editor-field"},
        {kind: "XV.InputWidget", attr: "relationship", classes: "editor-field"},
        {kind: "XV.InputWidget", attr: "homePhone", classes: "editor-field"},
        {kind: "XV.InputWidget", attr: "mobilePhone", classes: "editor-field"},
        {kind: "XV.InputWidget", attr: "workPhone", classes: "editor-field"}
      ]}
    ]
  });
  
  enyo.kind({
    name: "XV.EmergencyContactBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_emergencyContacts".loc(),
    editor: "XV.EmergencyContactEditor",
    parentKey: "employee",
    listRelations: "XV.EmergencyContactListRelations",
    fitButtons: false
  });
  
}());