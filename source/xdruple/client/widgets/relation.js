/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XT:true, XV:true, XM:true, Backbone:true, window:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.XdContactWidget",
    kind: "XV.ContactWidget",
    label: "_contact".loc(),
    collection: "XM.XdContactCollection",
    list: "XV.XdContactList",
    keyAttribute: ["firstName", "lastName"],
    sidecarAttribute: "lastName",
    descriptionComponents: [
      {name: "jobTitleRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: 'xv-description', name: "name"}
      ]},
      {name: "nameRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: 'xv-description', name: "firstName"},
        {classes: 'xv-description', name: "lastName"}
      ]},
      {name: "phoneRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: "xv-description hyperlink", target: '_blank', name: "description"}
      ]},
      {name: "alternateRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: "xv-description hyperlink", target: "_blank", name: "alternate"}
      ]},
      {name: "faxRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: "xv-description hyperlink", target: "_blank", name: "fax"}
      ]},
      {name: "emailRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: 'xv-description hyperlink', target: "_blank", name: "email"}
      ]},
      {name: "webAddressRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: 'xv-description hyperlink', target: "_blank", name: "webAddress"}
      ]},
      {name: "addressRow", controlClasses: "enyo-inline", showing: false, components: [
        {classes: "xv-description", name: "address", allowHtml: true}
      ]}
    ],
    setValue: function (value, options) {
      this.inherited(arguments);

      var firstName = value ? value.get("firstName") : "",
        lastName = value ? value.get("lastName") : "";

      this.$.nameRow.setShowing(!!lastName);
      this.$.firstName.setContent(firstName);
      this.$.lastName.setContent(lastName);
    },
  });

}());
