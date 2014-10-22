/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/
var fs = require('fs');
var _ = require("underscore");

(function () {
  "use strict";

  // To generate release notes for a given version, run this file
  // node getReleaseNotes.js
  // copy the console output, log into the production app,
  // and paste the code into the console.
  //
  // That will paste some documentation back at you, in markdown format.
  // Copy and paste that documentation into RELEASE.md.

  // TODO: This code could log into the production app itself to
  // run the code. It could even update the RELEASE.md file. That would
  // be pretty clever.

  var code = fs.readFileSync("./releaseNoteCode.js");

  // an excellent way to remind us to update the version number in our package.json
  // file at the end of every sprint.
  var version = JSON.parse(fs.readFileSync("../../../../xtuple/package.json")).version;
  var projects = [
    { projectName: "XT-MOBILE", versionPrefix: "xt-mobile "},
    { projectName: "XTUPLEAPPS", versionPrefix: ""}
  ];

  console.log(code.toString());
  _.each(projects, function (project) {
    console.log("getReleaseNotes(\"" + project.projectName + "\",\"" + project.versionPrefix + version + "\");");
  });

}());
