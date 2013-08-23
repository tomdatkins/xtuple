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
              {kind: "XV.ListAttr", attr: "url"}
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
                {kind: "XV.ListAttr", attr: "id", isKey: true},
                {content: "_drupalContactName".loc() + ":", classes: "xv-list-attr",
                  style: "text-align: right;"},
                {kind: "XV.ListAttr", attr: "contact.firstName"},
                {kind: "XV.ListAttr", attr: "contact.lastName"}
              ]},
              {kind: "FittableColumns", components: [
                {content: "_drupalAccountName".loc() + ":", classes: "xv-list-attr",
                  style: "text-align: right;"},
                {kind: "XV.ListAttr", attr: "account.name"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "FittableColumns", components: [
                {content: "_drupalUserId".loc() + ":", classes: "xv-list-attr",
                  style: "text-align: right;", fit: true},
                {kind: "XV.ListAttr", attr: "uid", classes: "right", fit: true}
              ]},
              {kind: "FittableColumns", components: [
                {content: "_drupalSiteName".loc() + ":", classes: "xv-list-attr",
                  style: "text-align: right;", fit: true},
                {kind: "XV.ListAttr", attr: "site.name", fit: true}
              ]}
            ]}
          ]}
        ]}
      ]
    });
  };
}());
