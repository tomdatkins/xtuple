/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, Globalize:true */

(function () {

  // ..........................................................
  // EMERGENCY CONTACT
  //

  enyo.kind({
    name: "XV.EmergencyContactBox",
    kind: "XV.ListRelationsBox",
    title: "_emergencyContacts".loc(),
    parentKey: "employee",
    listRelations: "XV.EmergencyContactListRelations",
    searchList: "XV.EmergencyContactList"
  });
  
}());