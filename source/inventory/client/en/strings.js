/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true  */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_a": "A",
    "_abcClass": "ABC Class",
    "_aisle": "Aisle",
    "_adjustment": "Adjustment",
    "_after": "After",
    "_allocated": "Allocated",
    "_allowableItems": "Allowable Items",
    "_allowAvgCostMethod": "Average",
    "_allowDups": "Allow Dups.",
    "_allowJobCostMethod": "Job",
    "_allowReceiptCostOverride": "Allow Inventory Receipt Cost Override (Avg. costing method only)",
    "_allowStdCostMethod": "Standard",
    "_approveForBilling": "Approve for Billing",
    "_atShipping": "At Shipping",
    "_audit": "Audit",
    "_available": "Available",
    "_availability": "Availability",
    "_average": "Average",
    "_b": "B",
    "_backlog": "Backlog",
    "_barcodeScanner": "Barcode Scanner",
    "_before": "Before",
    "_billto": "Bill To",
    "_bin": "Bin",
    "_byDays": "By Days",
    "_byDates": "By Date Range",
    "_byLeadTime": "By Lead Time",
    "_c": "C",
    "_controlMethod": "Control Method",
    "_cost": "Cost",
    "_costing": "Costing",
    "_countAvgCostMethod": "Cost to Use When Posting Count Tag for Avg. Cost Items",
    "_countSlipAuditing": "Count Slip # Auditing",
    "_createAndPrintInvoice": "Create and Print Invoice",
    "_createOrder": "Create Order",
    "_cycleCount": "Cycle Count",
    "_cycleCountFrequency": "Cycle Count Frequency",
    "_defaultEventFence": "Default Event Fence (Days)",
    "_defaultSite": "Default Site",
    "_defaultTransitSite": "Default Transit Site",
    "_deleteChildOrder?": "Are you sure you want to delete the existing supply order?",
    "_demand": "Demand",
    "_destination": "Destination",
    "_destinationName": "Destination Name",
    "_disableReceiptExcessQty": "Disallow PO Receipt of Qty greater than ordered",
    "_distribute": "Distribute",
    "_distributionDetail": "Distribution Detail",
    "_distributionMustNotBeGreater": "Distribution record must not be greater than the Qty remaining to distribute.",
    "_dontPost": "Do Not Post",
    "_enableAsOfQOH": "Enable As-Of QOH Reporting",
    "_enableMultipleSites": "Enable Multiple Sites",
    "_enterReceipt": "Enter Receipt",
    "_expiration": "Expiration",
    "_expressCheckout": "Checkout",
    "_extCost": "Ext Cost",
    "_firm": "Firm",
    "_fulfilled": "Fulfilled",
    "_groupLeadtimeFirst": "Group Leadtime First",
    "_ignoreReorderAtZero": "Ignore Reorder at Zero",
    "_isAutoRegister": "Auto Register",
    "_isPlannedTransferOrders": "Plan Transfers",
    "_isPerishable": "Perishable",
    "_isPurchaseWarrantyRequired": "Warranty Required",
    "_inventory": "Inventory",
    "_inventoryHistory": "Inventory History",
    "_inventoryDescription": "Shipping and Receiving, Inventory and Cost Management",
    "_invoiced": "Invoiced",
    "_isAutomaticAbcClassUpdates": "Auto ABC Updates",
    "_isLocationControl": "Location Control",
    "_isNetable": "Netable",
    "_isReceiveLocationAuto": "Auto Receive",
    "_isRestricted": "Restricted",
    "_isShipped": "Shipped",
    "_isShippingSite": "Shipping Site",
    "_isStocked": "Stocked",
    "_isStockLocationAuto": "Auto Issue",
    "_isTransitSite": "Transit Site",
    "_isUseSlips": "Force Use Count Slips",
    "_isUseZones": "Force Use Zones",
    "_isIssueLocationAuto": "Auto",
    "_issue": "Issue",
    "_issueBreeder": "Issue Breeder",
    "_issueLocation": "Issue Location",
    "_issueAll": "Issue All",
    "_issueAll?": "Are you sure you want to issue stock for all these items?",
    "_issueExcess": "You are attempting to issue more material than is required. Are you sure you want to do this?",
    "_issueLine": "Issue Line",
    "_issueMaterial": "Issue Material",
    "_issueStock": "Issue Stock",
    "_issueToShipping": "Issue to Shipping",
    "_issueUnit": "Unit",
    "_isUseDefaultLocation": "Use Default Location",
    "_itemSettings": "Item Settings",
    "_itemWorkbench": "Item Workbench",
    "_job": "Job",
    "_kitComponentInheritCOS": "Kit Components Inherit COS from Kit Parent",
    "_lineItemAtShipping": "This line item currently has stock issued to shipping and can not be closed at this time.",
    "_lineItemHasShipmentsClose?": "This line item has shipments against it. Would you like to close it?",
    "_location": "Location",
    "_locationControl": "Location Control",
    "_locations": "Locations",
    "_locationComment": "Comment",
    "_lookAhead": "Look Ahead",
    "_lot": "Lot",
    "_LotSerialControl": "Trace Control",
    "_materialReceipt": "Material Receipt",
    "_maximumOrderQuantity": "Order Max.",
    "_mrp": "MRP",
    "_multipleLocationControl": "Multiple Location Control",
    "_multiSite": "Multi-Site",
    "_multipleSites": "Multiple Sites",
    "_none": "None",
    "_noItem": "No Item",
    "_noItemSources": "One or more Item Sources will need to be created for this item before the system will be able to automatically create Purchase Orders for it.",
    "_noLocationsForSite": "There are no Locations setup for this Site",
    "_noOrder": "No Order",
    "_noParent": "No Parent",
    "_noQuantity": "No Quantity",
    "_noShipVia": "No ShipVia",
    "_noUnit": "No Unit",
    "_noUnpostedSlipDupsSite": "No Unposted Dups. in a Site",
    "_noUnpostedSlipDups": "No Unposted Dups.",
    "_noSlipDupsSite": "No Dups. in a Site",
    "_nextShipmentNumber": "Next Shipment Number",
    "_nextTransferOrderNumber": "Next Transfer Order Number",
    "_noSlipDups": "No Slip # Duplications",
    "_number": "Number",
    "_onHand": "On Hand",
    "_onlyShow": "Only Show",
    "_orderMaximum": "Order Maximum",
    "_orderMinimum": "Order Minimum",
    "_orderMultiple": "Order Multiple",
    "_orderTo": "Order To",
    "_orderToQuantity": "Order To",
    "_orderGroup": "Order Grouping Days",
    "_orders": "Orders",
    "_pack": "Pack",
    "_packingList": "Packing List",
    "_planned": "Planned",
    "_plannedOrder": "Planned Order",
    "_plannedOrders": "Planned Orders",
    "_planningSystem": "Planning System",
    "_postSiteChanges": "Post Site Changes",
    "_postItemSiteChanges": "Post Item Site Changes",
    "_postCountTagToDefault": "When Count Tag Qty exceeds Slip Qty",
    "_postReceipt": "Post Receipt",
    "_postReceipts": "Post Receipts",
    "_postTranferOrderChanges": "Post Tranfer Order Changes",
    "_postToDefaultLocation": "Post to Default Loc.",
    "_physicalInventory": "Physical Inventory (Counting)",
    "_prefix": "Prefix",
    "_printLabel": "Print Label",
    "_printLocations": "Print Locations",
    "_printPacklist": "Print Packlist",
    "_promised": "Promised",
    "_purchaseCost": "Purchase Cost",
    "_purchaseRequest": "Purchase Request",
    "_purchaseRequests": "Purchase Requests",
    "_qtyAfter": "Qty. After",
    "_qtyBefore": "Qty. Before",
    "_rack": "Rack",
    "_recallShipment": "Recall Shipment",
    "_recallShipment?": "Are you sure you want to recall this shipment?",
    "_receipt": "Receipt",
    "_receiptQtyTolerancePct": "By the Following Amount (%)",
    "_receive": "Receive",
    "_receiveLocation": "Receive",
    "_receiveAll": "Receive All",
    "_receiveAll?": "Are you sure you want to enter receipt for all these items?",
    "_receiveBreeder": "Receive Breeder",
    "_receiveQtyVar": "The Qty entered does not match the receivable Qty for this order. Do you wish to continue anyway?",
    "_receivePurchaseOrder": "Receive Purchase Order",
    "_receiveLine": "Receive Line",
    "_receiveMaterial": "Receive Material",
    "_receiveReturn": "Receive Return",
    "_recordPPVOnReceipt": "Record Purchase Price Variance on Receipt",
    "_relocate": "Relocate",
    "_reorder": "Reorder",
    "_reorderExceptions": "Reorder Exceptions",
    "_reorderLevel": "Reorder Level",
    "_reporting": "Reporting",
    "_request": "Request",
    "_request#": "Request #",
    "_requests": "Requests",
    "_restrictedLocations": "Restricted Locations",
    "_restrictedLocationsAllowed": "Restricted Locations Allowed",
    "_returnFromShipping": "Return From Shipping",
    "_returnLine": "Return Line",
    "_running": "Running",
    "_safetyStock": "Safety Stock",
    "_save": "Save",
    "_save?": "Do you want to Save your work before you continue?",
    "_schedulingSequence": "Scheduling Sequence",
    "_serial": "Serial",
    "_serial#": "Serial #",
    "_ship": "Ship",
    "_shipped": "Shipped",
    "_shipping": "Shipping",
    "_shippingCommission": "Shipping Commission",
    "_shippingAndReceiving": "Shipping and Receiving",
    "_shipmentNumberPolicy": "Shipment Number Policy",
    "_shipto": "Ship To",
    "_shortages": "Shortages",
    "_signature": "Signature",
    "_signHere": "Sign Here",
    "_siteEmailProfile": "Site Email Profile",
    "_siteEmailProfiles": "Site Email",
    "_siteTransfer": "Site Transfer",
    "_siteZone": "Site Zone",
    "_showInvoiced": "Show Invoiced Shipments",
    "_showShipped": "Show Shipped",
    "_shipFrom": "Ship From",
    "_shipment": "Shipment",
    "_shipShipment": "Ship Shipment",
    "_shipTo": "Ship To",
    "_shipments": "Shipments",
    "_soften": "Soften",
    "_sourceName": "Source Name",
    "_standard": "Standard",
    "_stockLocation": "Stock",
    "_success": "Success",
    "_supply": "Supply",
    "_supplySite": "Supply Site",
    "_toIssue": "To Issue",
    "_trackingNumber": "Tracking Number",
    "_traceOptions": "Trace Options",
    "_traceSequence": "Sequence",
    "_traceSequences": "Trace Sequences",
    "_transaction": "Transaction",
    "_transDate": "Trans. Date",
    "_transferOrder": "Transfer Order",
    "_transferOrderNumberPolicy": "Transfer Order Number Policy",
    "_transferOrderLine": "Transfer Order Line",
    "_transferOrders": "Transfer Orders",
    "_transferOrderWorkflow": "Transfer Workflow",
    "_transitSite": "Transit Site",
    "_transType": "Trans. Type",
    "_unalloc.": "Unalloc.",
    "_unallocated": "Unallocated",
    "_undistributed": "Undistributed",
    "_unReleased": "Unreleased",
    "_updateChildDueDate?": "Do you want to update the due date on the child order to match the line item?",
    "_updateChildQuantity?": "Do you want to update the quantity on the child order to match the line item?",
    "_updateInventory": "Update Inventory",
    "_useDefaultLocation": "Use Default",
    "_useExistingPurchaseOrder?": "An Unreleased Purchase Order exists for {vendor}. Would you like to use this Purchase Order?",
    "_useExistingTransferOrder?": "An Unreleased Transfer Order exists for {site}. Would you like to use this Transfer Order?",
    "_useParameters": "Use Parameters",
    "_useParametersManual": "Enforce on Manual Orders",
    "_userDefinedLocation": "Location Name",
    "_useStandardCost": "Standard Costs",
    "_useAverageCost": "Average Costs",
    "_valueAfter": "Value After",
    "_valueBefore": "Value Before",
    "_vendor": "Vendor",
    "_vendors": "Vendors",
    "_vendorType": "Vendor Type",
    "_warrantyDate": "Warranty Date",
    "_warnIfReceiptQtyDiffers": "Warn if PO Receipt Qty differs from receivable Qty",
    "_workbench": "Workbench",
    "_workOrder": "Work Order",
    "_workspaceNotSupported": "The workspace for this order type is not yet supported.",

    // Privs
    "_createPlannedOrders": "Create",
    "_deletePlannedOrders": "Delete",
    "_maintainSiteEmailProfiles": "Maintain Site Email Profiles",
    "_maintainTransferOrders": "Maintain Transfer Orders",
    "_releasePlannedOrders": "Release",
    "_softenPlannedOrders": "Soften",
    "_viewPlannedOrders": "View",
    "_viewTransferOrders": "View Transfer Orders",
    "_viewInventoryAvailability": "View Inventory Availability",
    "_viewItemAvailabilityWorkbench": "View Item Workbench",

    // Errors
    "_transferSitesMustDiffer": "The ship-from and ship-to sites must be different."
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
