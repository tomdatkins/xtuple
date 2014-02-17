/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, enyo:true, console:true */

(function () {
  "use strict";

  XT.extensions.xdruple.initList = function () {
    enyo.kind({
      name: "XV.XdrupleSiteList",
      kind: "XV.List",
      label: "_xdrupleSites".loc(),
      collection: "XM.XdrupleSiteCollection",
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
      name: "XV.XdrupleUserContactList",
      kind: "XV.List",
      label: "_xdrupleUserContacts".loc(),
      collection: "XM.XdrupleUserContactCollection",
      query: {orderBy: [
        {attribute: 'id'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "contact", formatter: "formatContact", isKey: true}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "account", formatter: "formatAccount"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "uid", formatter: "formatDrupalUid"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "site", formatter: "formatDrupalSite"}
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
        var site = model.get('site'),
            siteName = site.get('name') || null,
            drupalUrl = site.get('drupalUrl') || null;

        value = "_drupalSiteName".loc() + ": " + siteName + " URL: " + drupalUrl;

        return value;
      },
      formatDrupalUid: function (value, view, model) {
        var uid = model.get('uid') || null;

        value = "_drupalUserId".loc() + ": " + uid;

        return value;
      }
    });
  };
}());
