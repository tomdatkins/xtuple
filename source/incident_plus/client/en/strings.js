/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_fixedIn": "Fixed In",
    "_foundIn": "Found In",
    "_incidentPlus": "Incident Plus",
    "_version": "Version",
    "_versions": "Versions"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
