/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_accessxDrupleExtension": "Access xDruple Extension",
    "_drupalAccountName": "Account",
    "_drupalContactName": "Contact",
    "_drupalSiteName": "Site Name",
    "_drupalUrl": "Site URL",
    "_drupalUserUuid": "Drupal User UUID",
    "_uid": "Drupal User ID",
    "_xdruple": "xDruple",
    "_xDruple": "xDruple",
    "_XDRUPLE": "xDruple",
    "_xdrupleSites": "Drupal Websites",
    "_xdrupleSite": "Drupal Website",
    "_xdruple_site": "Drupal Website",
    "_xdrupleUserContacts": "Drupal User Contact Associations",
    "_xdrupleUserContact": "Drupal User Contact Association",
    "_xdrupleCommerceContacts": "Drupal Commerce Contacts"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
