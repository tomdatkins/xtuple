/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true,
require:true, __dirname:true, console:true */

(function () {
  "use strict";

  var fs = require('fs'),
    _ = require("underscore"),
    path = require('path'),
    // TODO: not just inventory
    specFiles = _.filter(fs.readdirSync(path.join(__dirname, "../inventory/specs")), function (fileName) {
      // filter out .swp files, etc.
      return path.extname(fileName) === '.js';
    }),
    specs = _.map(specFiles, function (specFile) {
      var fileContents = require(path.join(__dirname, "../inventory/specs", specFile));
      // slam in an override to the creds
      fileContents.spec.loginDataPath = path.join(__dirname, "login_data.js");
      console.log(fileContents);
      return fileContents;
    }),
    runSpec = require("../../../xtuple/test/lib/runner_engine").runSpec;

  _.each(specs, runSpec);

}());

