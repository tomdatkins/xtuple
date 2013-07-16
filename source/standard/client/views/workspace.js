/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XV:true, Backbone:true, enyo:true, console:true */

(function () {
  "use strict";

  XT.extensions.standard.initWorkspace = function () {

    var salesExtensions, preferencesExtensions;

    salesExtensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_multiSite".loc()},
      {kind: "XV.ToggleButtonWidget", container: "mainGroup", attr: "MultiWhs",
        label: "_enableMultipleSites".loc() }
    ];
    XV.appendExtension("XV.SalesWorkspace", salesExtensions);

    preferencesExtensions = [
      {kind: "XV.SitePicker", container: "mainGroup", attr: "PreferredWarehouse",
        label: "_defaultSite".loc() }
    ];
    XV.appendExtension("XV.UserPreferenceWorkspace", preferencesExtensions);
  };
}());
