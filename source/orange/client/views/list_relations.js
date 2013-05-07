/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {
  
  // ..........................................................
  // EMERGENCY CONTACT
  //

  enyo.kind({
    name: "XV.EmergencyContactListRelations",
    kind: "XV.ListRelations",
    parentKey: "employee",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name"},
              {kind: "XV.ListAttr", attr: "relationship"}
            ]}
          ]}
        ]}
      ]}
    ]
  });
  
}());