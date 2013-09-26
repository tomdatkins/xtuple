/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, enyo:true, _:true*/

(function () {

  XT.extensions.standard.initPickers = function () {

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

  };

}());
