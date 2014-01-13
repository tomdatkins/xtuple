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
    "_autoExplodeWO": "Automatically Explode Work Orders",
    "_backflushMaterials": "Backflush Materials",
    "_closeWorkOrderAfterPosting": "Close Work Order After Posting",
    "_exploded": "Exploded",
    "_explodeWorkOrders": "Explode Work Order's Effective as of",
    "_isBackflushMaterials": "Backflush Materials",
    "_in-process": "In-Process",
    "_jobItemCosDefault": "Job Work ORder Cost Recognition Defaults",
    "_location": "Location",
    "_materialUnit": "Material Unit",
    "_manufacturing": "Manufacturing",
    "_manufacturingDescription": "Manufacturing",
    "_mixed": "Mixed",
    "_postMaterialVariances": "Post Material Variances",
    "_postProduction": "Post Production",
    "_pull": "Pull",
    "_push": "Push",
    "_issued": "Issued",
    "_issueWoMaterials": "Issue Work Order Materials",
    "_received": "Received",
    "_required": "Required",
    "_remainingToDistribute": "Remaining to Distribute",
    "_returnWoMaterials": "Return Work Order Materials",
    "_scrapOnPost": "Scrap on Post",
    "_toPost": "To Post",
    "_trace": "Trace",
    "_undistributed": "Remaining to Distibute",
    "_warrantyDate": "Purchase Warranty Date",
    "_woExplosionLevel": "Default Work ORder Explosion Level",
    "_workOrderChangeLog": "Post Work Order Changes to the Change Log"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
