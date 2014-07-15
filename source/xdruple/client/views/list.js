/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, enyo:true, console:true, _:true, XV:true */

(function () {
  "use strict";

  XT.extensions.xdruple.initList = function () {
    enyo.kind({
      name: "XV.XdSiteList",
      kind: "XV.List",
      label: "_xdSites".loc(),
      collection: "XM.XdSiteCollection",
      query: {orderBy: [
        {attribute: 'id'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "name", isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "drupalUrl"}
            ]}
          ]}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.XdUserContactList",
      kind: "XV.List",
      label: "_xdUserContacts".loc(),
      collection: "XM.XdUserContactCollection",
      query: {orderBy: [
        {attribute: 'id'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "contact", formatter: "formatContact", isKey: true}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "drupalUserUuid", formatter: "formatDrupalUuid"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "xdruple_site", formatter: "formatDrupalSite"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatAccount: function (value, view, model) {
        var contact = model ? model.get('contact') : null,
            accountName = contact ? contact.get('account') || null : null;

        value = "_drupalAccountName".loc() + ": " + accountName;

        return value;
      },
      formatContact: function (value, view, model) {
        var contact = model.get('contact'),
            firstName = contact.get('firstName') || null,
            lastName = contact.get('lastName') || null;

        value = "_drupalContactName".loc() + ": " + firstName + " " + lastName;

        return value;
      },
      formatDrupalSite: function (value, view, model) {
        var site = model.get('xdruple_site'),
            siteName = site.get('name') || null,
            drupalUrl = site.get('drupalUrl') || null;

        value = "_drupalSiteName".loc() + ": " + siteName + " URL: " + drupalUrl;

        return value;
      },
      formatDrupalUuid: function (value, view, model) {
        var drupalUserUuid = model.get('drupalUserUuid') || null;

        value = "_drupalUserUuid".loc() + ": " + drupalUserUuid;

        return value;
      }
    });


    // ..........................................................
    // CONTACT
    //

    enyo.kind({
      name: "XV.XdContactList",
      kind: "XV.List",
      label: "_contacts".loc(),
      collection: "XM.XdContactCollection",
      query: {orderBy: [
        {attribute: 'lastName'},
        {attribute: 'firstName'},
        {attribute: 'primaryEmail'}
      ]},
      allowPrint: true,
      parameterWidget: "XV.XdContactListParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "firstName",
                  formatter: "formatFirstName", isKey: true},
                {kind: "XV.ListAttr", attr: "lastName", fit: true,
                  style: "padding-left: 0px;"}
              ]},
              {kind: "XV.ListAttr", attr: "jobTitle", showPlaceholder: true}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "phone"},
              {kind: "XV.ListAttr", attr: "primaryEmail"}
            ]},
            {kind: "XV.ListColumn", fit: true, components: [
              {kind: "XV.ListAttr", attr: "address", showPlaceholder: true}
            ]}
          ]}
        ]}
      ],
      formatFirstName: function (value, view, model) {
        var lastName = (model.get('lastName') || "").trim(),
          firstName = (model.get('firstName') || "").trim();
        if (_.isEmpty(firstName) && _.isEmpty(lastName)) {
          view.addRemoveClass("placeholder", true);
          value = "_noName".loc();
        } else {
          view.addRemoveClass("bold", _.isEmpty(lastName));
        }
        if (this.getToggleSelected()) {
          view.addRemoveClass("hyperlink", true);
        }
        return value;
      }
    });

    XV.registerModelList("XM.XdContact", "XV.XdContactList");
  };
}());
