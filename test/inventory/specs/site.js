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

  //spec.skipSmoke = false;
  spec.extensions.push("inventory");
  
  var additionalTests = function (done) {
    it("A new Site can be created", function () {
      assert.equal(XM.sites.length, 2);
      smoke.navigateToList(XT.app, "XV.SiteList");
      assert.isFalse(XT.app.$.postbooks.getActive().$.newButton.disabled);
      done();
    });
    it.skip("Create a new (transit) Site", function (done) {
      assert.equal(XM.sites.length, 2);
      smoke.navigateToList(XT.app, "XV.SiteList");
      assert.isTrue(XT.app.$.postbooks.getActive().$.newButton.disabled);
      done();
    });
    /**
      @member -
      @memberof Return
      @property {CustomerShiptoRelation} shipto Added by inventory
      @property {String} shiptoName Added by inventory
    */
    it.skip("Return has ...", function () {
      var newFields = ["aisleSize", "binSize", "costCategory", "isAisleAlpha", "isBinAlpha",
        "isEnforceAisleRackBinLocation", "isLocationAlpha", "isRackAlpha", "isTransit",
        "isUseZones", "locationSize", "rackSize", "sequence", "shipVia", "zones"];
      _.each(newFields, function (field) {
        assert.include(XM.Site.prototype.getAttributeNames(), field);
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
