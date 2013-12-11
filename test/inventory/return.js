/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true,
require:true, assert:true, setTimeout:true, clearTimeout:true, exports:true,
it:true, describe:true, beforeEach:true, before:true, enyo:true */

(function () {
  "use strict";

  var coreReturn = require("../../../xtuple/test/specs/return"),
    assert = require("chai").assert,
    spec = coreReturn.spec;

  var extensionTests = function () {
    describe("Inventory extensions to return", function () {
      it("Return line has updateInventory", function () {
        assert.include(XM.ReturnLine.prototype.getAttributeNames(), "updateInventory");
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = coreReturn.additionalTests;
  exports.extensionTests = extensionTests;
}());

