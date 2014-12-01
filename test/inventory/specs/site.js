/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  var coreFile = require("../../../../xtuple/test/specs/site"),
    common = require("../../../../xtuple/test/lib/common"),
    _ = require("underscore"),
    async = require("async"),
    assert = require("chai").assert,
    smoke = require("../../../../xtuple/test/lib/smoke"),
    spec = coreFile.spec;

  spec.skipSmoke = false;
  spec.extensions.push("inventory");
  spec.createHash = {
    code: "NewSite" + Math.random(),
    siteType: {name: "MFG"},
    isActive: true,
    isTransitSite: false,
    isShippingSite: true
  };
  
  var additionalTests = function () {
    it("The 'New' button is enabled in the SiteList", function () {
      // Running test-build from private-extensions in 4_8_x did not populate > 1 site. 
      //assert.equal(XM.sites.length, 2);
      smoke.navigateToList(XT.app, "XV.SiteList");
      assert.isFalse(XT.app.$.postbooks.getActive().$.newButton.disabled);
    });
    /**
      @member -
      @memberof Site
      @property {Number} aisleSize Added by inventory
      @property {Number} binSize Added by inventory
      @property {String} costCategory Added by inventory
      @property {Boolean} isAisleAlpha Added by inventory
      @property {Boolean} isShippingSite Added by inventory
      @property {Boolean} isBinAlpha Added by inventory
      @property {Boolean} isLocationAlpha Added by inventory
      @property {Boolean} isRackAlpha Added by inventory
      @property {Boolean} isTransitSite Added by inventory
      @property {SiteZone} zones Added by inventory
      @property {Number} locationSize Added by inventory
      @property {String} isEnforceAisleRackBinLocation Added by inventory
      @property {String} isUseZones Added by inventory
      @property {Number} rackSize Added by inventory
      @property {Number} sequence Added by inventory
      @property {String} shipVia Added by inventory
    */
    it("Site has ...", function () {
      var newFields = ["aisleSize", "binSize", "costCategory", "isAisleAlpha", "isShippingSite",
        "isBinAlpha", "isLocationAlpha", "isRackAlpha", "isTransitSite", "zones", "locationSize",
        "isEnforceAisleRackBinLocation", "isUseZones", "rackSize", "sequence", "shipVia",];
      _.each(newFields, function (field) {
        assert.include(XM.Site.prototype.getAttributeNames(), field);
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
