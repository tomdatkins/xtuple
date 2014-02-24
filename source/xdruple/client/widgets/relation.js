/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XT:true, XV:true, XM:true, Backbone:true, window:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.XdrupleCommerceContactWidget",
    kind: "XV.RelationWidget",
    label: "_contact".loc(),
    collection: "XM.XdrupleCommerceContactCollection",
    list: "XV.XdrupleCommerceContactList",
    keyAttribute: "name",
    nameAttribute: "jobTitle",
    descripAttribute: "phone",
    classes: "xv-relationwidget",
    published: {
      showAddress: false
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", fit: true, classes: "xv-flexible-label"},
        {kind: "onyx.InputDecorator", name: "decorator",
          classes: "xv-input-decorator", components: [
          {name: "input", kind: "onyx.Input", classes: "xv-subinput",
            onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur",
            onfocus: "receiveFocus"
          },
          {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
            {kind: "onyx.IconButton", classes: "icon-folder-open-alt"},
            {name: "popupMenu", floating: true, kind: "onyx.Menu",
              components: [
              {kind: "XV.MenuItem", name: "searchItem", content: "_search".loc()},
              {kind: "XV.MenuItem", name: "openItem", content: "_open".loc(),
                disabled: true},
              {kind: "XV.MenuItem", name: "newItem", content: "_new".loc(),
                disabled: true}
            ]}
          ]},
          {name: "completer", kind: "XV.Completer", onSelect: "itemSelected"}
        ]}
      ]},
      {kind: "FittableColumns", components: [
        {name: "labels", classes: "xv-relationwidget-column left",
          components: [
          {name: "jobTitleLabel", content: "_jobTitle".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "phoneLabel", content: "_phone".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "alternateLabel", content: "_alternate".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "faxLabel", content: "_fax".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "primaryEmailLabel", content: "_email".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "webAddressLabel", content: "_web".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "addressLabel", content: "_address".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false}
        ]},
        {name: "data", fit: true, components: [
          {name: "name", classes: "xv-relationwidget-description hasLabel"},
          {name: "firstName", classes: "xv-relationwidget-description hasLabel"},
          {name: "lastName", classes: "xv-relationwidget-description hasLabel"},
          {name: "description", ontap: "callPhone",
            classes: "xv-relationwidget-description hasLabel hyperlink"},
          {name: "alternate", classes: "xv-relationwidget-description hasLabel"},
          {name: "fax", classes: "xv-relationwidget-description hasLabel"},
          {name: "primaryEmail", ontap: "sendMail",
            classes: "xv-relationwidget-description hasLabel hyperlink"},
          {name: "webAddress", ontap: "openWindow",
            classes: "xv-relationwidget-description hasLabel hyperlink"},
          {name: "address", classes: "xv-relationwidget-description hasLabel",
            allowHtml: true}
        ]}
      ]}
    ],
    disabledChanged: function () {
      this.inherited(arguments);
      var disabled = this.getDisabled();
      if (this.$.phone) {
        this.$.jobTitle.addRemoveClass("disabled", disabled);
        this.$.phone.addRemoveClass("disabled", disabled);
        this.$.alternate.addRemoveClass("disabled", disabled);
        this.$.fax.addRemoveClass("disabled", disabled);
        this.$.primaryEmail.addRemoveClass("disabled", disabled);
        this.$.webAddress.addRemoveClass("disabled", disabled);
      }
    },
    setValue: function (value, options) {
      this.inherited(arguments);
      if (value && !value.get) {
        // the value of the widget is still being fetched asyncronously.
        // when the value is fetched, this function will be run again,
        // so for now we can just stop here.
        return;
      }
      var jobTitle = value ? value.get("jobTitle") : "",
        phone = value ? value.get("phone") : "",
        alternate = value ? value.get("alternate") : "",
        fax = value ? value.get("fax") : "",
        primaryEmail = value ? value.get("primaryEmail") : "",
        webAddress = value ? value.get("webAddress") : "",
        address = value ? XM.Address.format(value.get("address")) : "",
        showAddress = this.getShowAddress();
      this.$.jobTitleLabel.setShowing(jobTitle);
      this.$.phoneLabel.setShowing(phone);
      this.$.alternate.setShowing(alternate);
      this.$.alternate.setContent(alternate);
      this.$.alternateLabel.setShowing(alternate);
      this.$.fax.setShowing(fax);
      this.$.fax.setContent(fax);
      this.$.faxLabel.setShowing(fax);
      this.$.primaryEmail.setShowing(primaryEmail);
      this.$.primaryEmail.setContent(primaryEmail);
      this.$.primaryEmailLabel.setShowing(primaryEmail);
      this.$.webAddress.setShowing(webAddress);
      this.$.webAddress.setContent(webAddress);
      this.$.webAddressLabel.setShowing(webAddress);
      this.$.address.setShowing(address && showAddress);
      this.$.addressLabel.setShowing(address && showAddress);
      if (showAddress) { this.$.address.setContent(address); }
    },
    openWindow: function () {
      var address = this.value ? this.value.get("webAddress") : null;
      if (address) { window.open("http://" + address); }
      return true;
    },
    callPhone: function () {
      var phoneNumber = this.value ? this.value.get("phone") : null,
        win;
      if (phoneNumber) {
        win = window.open("tel://" + phoneNumber);
        win.close();
      }
      return true;
    },
    sendMail: function () {
      var email = this.value ? this.value.get("primaryEmail") : null,
        win;
      if (email) {
        win = window.open("mailto:" + email);
        win.close();
      }
      return true;
    }
  });

}());
