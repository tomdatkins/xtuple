/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true,
require:true, assert:true, setTimeout:true, clearTimeout:true, exports:true,
it:true, describe:true, beforeEach:true, before:true, enyo:true */

(function () {
  "use strict";

  var coreFile = require("../../../../xtuple/test/specs/command_center"),
    spec = coreFile.spec;

  spec.extensions.push("command_center");

  var additionalTests = function () {
    /**
      @member
      @memberof
      @description
    */
    describe("Database workspace", function () {
      it.skip("Should include the command center panel", function () {
        var workspace = new XV.DatabaseInformationWorkspace();
        assert.isDefined(workspace.$.commandPanel);
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = coreFile.additionalTests;
}());
