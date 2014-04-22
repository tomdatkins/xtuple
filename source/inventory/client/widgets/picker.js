/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, enyo:true, _:true*/

(function () {

  XT.extensions.inventory.initPickers = function () {

    // ..........................................................
    // ABC CLASS
    //

    enyo.kind({
      name: "XV.AbcClassPicker",
      kind: "XV.PickerWidget",
      collection: "XM.abcClasses",
      valueAttribute: "id",
      showNone: false
    });

    // ..........................................................
    // CONTROL METHOD
    //

    enyo.kind({
      name: "XV.ControlMethodPicker",
      kind: "XV.PickerWidget",
      collection: "XM.controlMethods",
      valueAttribute: "id",
      showNone: false
    });

    // ..........................................................
    // COST METHOD
    //

    enyo.kind({
      name: "XV.CostMethodPicker",
      kind: "XV.PickerWidget",
      collection: "XM.costMethods",
      valueAttribute: "id",
      showNone: false,
      filter: function (models) {
        var ret = [],
          costMethods;
        if (this._model) {
          costMethods = this._model.costMethods;
          ret = _.filter(models, function (model) {
            return _.contains(costMethods, model.id);
          });
        }
        return ret;
      }
    });

    // ..........................................................
    // PLANNING SYSTEM
    //

    enyo.kind({
      name: "XV.PlanningSystemPicker",
      kind: "XV.PickerWidget",
      collection: "XM.planningSystems",
      valueAttribute: "id",
      showNone: false
    });

    // ..........................................................
    // SITE EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.SiteEmailProfilePicker",
      kind: "XV.PickerWidget",
      label: "_emailProfile".loc(),
      collection: "XM.siteEmailProfiles"
    });

    // ..........................................................
    // SITE ZONE
    //

    enyo.kind({
      name: "XV.SiteZonePicker",
      kind: "XV.PickerWidget",
      collection: "XM.siteZoneRelations",
      orderBy: [
        {attribute: 'code'}
      ]
    });

    // ..........................................................
    // SUPPLY SITE PICKER
    //

    enyo.kind({
      name: "XV.SupplySitePicker",
      kind: "XV.SitePicker",
      showNone: true,
      filter: function (models) {
        var ret = [],
          sites;
        if (this._model) {
          sites = this._model.supplySites;
          ret = _.filter(models, function (model) {
            return _.contains(sites, model.id);
          });
        }
        return ret;
      }
    });

    // ..........................................................
    // TRANSFER ORDER STATUS
    //

    enyo.kind({
      name: "XV.TransferOrderStatusPicker",
      kind: "XV.PickerWidget",
      collection: "XM.transferOrderStatuses",
      valueAttribute: "id",
      showNone: false
    });

    // ..........................................................
    // TRANSFER ORDER WORKFLOW TYPE
    //

    enyo.kind({
      name: "XV.TransferOrderWorkflowTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.transferOrderWorkflowTypes",
      valueAttribute: "id"
    });

  };

}());
