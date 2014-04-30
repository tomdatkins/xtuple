// ==========================================================================
// Project:   XT` Strings
// Copyright: ©2014 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

// Place strings you want to localize here.  In your app, use the key and
// localize it using "key string".loc().  HINT: For your key names, use the
// english string with an underscore in front.  This way you can still see
// how your UI will look and you'll notice right away when something needs a
// localized string added to this file!
//

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_backup": "Backup",
    "_backupPath": "Backup Path",
    "_commandCenter": "Command Center",
    "_databaseBackup": "Database Backup",
    "_pilotUpgrade": "Pilot Upgrade",
    "_productionUpgrade": "Production Upgrade",
    "_restore": "Database Restore",
    "_submit": "Submit",
    "_targetName": "Target Name",
    "_version": "Version"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
