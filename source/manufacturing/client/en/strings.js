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
    "_autoIssue": "Auto Issue",
    "_assembly": "Assembly",
    "_backflushMaterials": "Backflush Materials",
    "_closeWorkOrderAfterPosting": "Close Work Order After Posting",
    "_consumed": "Consumed",
    "_disassembly": "Disassembly",
    "_executionDay": "Execution Day",
    "_exploded": "Exploded",
    "_explodeWorkOrders": "Explode Work Order's Effective as of",
    "_explorer": "Explorer",
    "_isBackflushMaterials": "Backflush Materials",
    "_in-process": "In-Process",
    "_instructions": "Instructions",
    "_isAutoIssueComponents": "Auto Issue",
    "_isReceiveInventory": "Receive Inventory",
    "_isScheduleAtOperation": "Schedule At",
    "_issued": "Issued",
    "_issueMethod": "Issue Method",
    "_issueWoMaterials": "Issue Work Order Materials",
    "_itemSiteNotValid": "Item Site is not valid",
    "_itemSiteNotManufactured": "{item} can not be manufactured at {site}.",
    "_jobItemCosDefault": "Job Work Order Cost Recognition Defaults",
    "_lateStart": "Late Start",
    "_material": "Material",
    "_materials": "Materials",
    "_materialUnit": "Material Unit",
    "_manufacture": "Manufacture",
    "_manufacturing": "Manufacturing",
    "_manufacturingDescription": "Manufacturing",
    "_min": "min.",
    "_mixed": "Mixed",
    "_mode": "Mode",
    "_noStandardOperation": "No Standard Operation",
    "_notApplicable": "Not Applicable",
    "_notStarted": "Not Started",
    "_onTime": "On Time",
    "_operation": "Operation",
    "_orderQuantity": "Order Quantity",
    "_overdue": "Overdue",
    "_parentOrderRequired": "A parent order is required for Work Orders with Job Cost item sites",
    "_per": "Per",
    "_postMaterialVariances": "Post Material Variances",
    "_postProduction": "Post Production",
    "_production": "Production",
    "_proportional": "Proportional",
    "_pull": "Pull",
    "_push": "Push",
    "_quantityPer": "Qty. Per",
    "_received": "Received",
    "_recognitionMethod": "Recognition Method",
    "_required": "Required",
    "_remaining": "Remaining",
    "_remainingToDistribute": "Remaining to Distribute",
    "_returnWoMaterials": "Return Work Order Materials",
    "_routing": "Routing",
    "_routings": "Routings",
    "_run": "Run",
    "_runComplete": "Run Complete",
    "_runStarted": "Run Started",
    "_runTime": "Run Time",
    "_scrap": "Scrap",
    "_scrapOnPost": "Scrap on Post",
    "_seq#": "Seq #",
    "_setupComplete": "Setup Complete",
    "_setupStarted": "Setup Started",
    "_setupTime": "Setup Time",
    "_standardOperation": "Std. Operation",
    "_started": "Started",
    "_timeClockHistory": "Time Clock History",
    "_toolingReference": "Tooling Ref.",
    "_toPost": "To Post",
    "_totalQuantity": "Total Quantity",
    "_undistributed": "Remaining to Distibute",
    "_useFixedWidthFont": "Use Fixed-Width Font",
    "_warrantyDate": "Purchase Warranty Date",
    "_wip": "WIP",
    "_wipLocation": "WIP Location",
    "_woExplosionLevel": "Default Work ORder Explosion Level",
    "_workCenter": "Work Center",
    "_workOrder": "Work Order",
    "_workOrders": "Work Orders",
    "_workOrderChangeLog": "Post Work Order Changes to the Change Log"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
