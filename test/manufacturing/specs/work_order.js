/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true,
 beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    common = require("../../../../xtuple/test/lib/common"),
    assert = require("chai").assert,
    primeSubmodels,
    spec,
    additionalTests;

 /**
    Work Order Description
    @class
    @alias WorkOrder
    @property {String} id [is the idAttribute]
    @property {String} number [is the document key and idAttribute, required] (Next available Work Order Number will automatically display, unless your system requires you to enter Work Order Numbers manually. Default values and input parameters for Work Order Numbers are configurable at the system level.)
    @property {String} subNumber [read only, required] (sub number is the extension for document key and defaulting to -1)
    @property {String} name [read only] (Combination of Work Order number, site and item)
    @property {String} parent [read only](defaults to 'W' if the work order is created directly, defaults to 'S' if the work order is created on creating a sales order.)
    @property {String} workOrderMaterial
    @property {String} status [required, read only] (A Work Order is a document which authorizes the production of manufactured Items. Work Orders can exist in five different states—from creation to completion. The five different states of Work Orders are listed below: 1. Open 'O': This is the initial state a Work Order receives when it is first created. 2. Exploded 'E': A Work Order is considered exploded once it has been opened and its accompanying Work Order Material Requirement and Work Order Operations have also been created. 3. Released 'R': This state describes a Work Order that has been released to the shop floor. 4. In-process 'I': This is the state a Work Order reaches when Work Order Material Requirements have been issued to it. 5. Closed 'C': The final state of a Work Order occurs when it is closed.)
    @property {Item} item [required] (Enter the Item Number of the Item you want to create a Work Order for)
    @property {Site} site [required] (Specify supplying Site for selected Item. Only Sites that contain supplying ItemSites for the selected Item may be chosen)
    @property {String} mode [read only] (We have two modes in work order creation to identify the the Work Order as Assembly order or Disassembly order)
    @property {Date} startDate [required, read only] (Enter the date the Work Order must be started by. By default, this date will be the due date less the Lead Time. The start date may be changed by altering the Lead Time field)
    @property {Date} dueDate [required] (Enter the date the Work Order must be completed by)
    @property {string} quantity [required] (Value entered specifies the number of Item units to be processed by the Work Order)
    @property {String} received [read only] (Displays the quantity of finished product posted as received into Inventory to date, if any)
    @property {String} isAdhoc [required]
    @property {Money} postedValue [read only, default to '0'] (Displays the current posted value of the Work Order. The posted value is equal to the total cost accumulated on the Work Order, including both labor and Materials. The posted value will be the same as the WIP value until the point when finished goods are received. Ultimately, once Production or Operations posting is completed, the posted value will be equal to the received value. If these two values are different, then a variance will result)
    @property {Money} receivedValue [read  only, default to '0'] (Displays the current value of finished goods received into Inventory from the Work Order. The received value is equal to the posted value minus WIP)
    @property {Money} wipValue [read only, defaulting to '0'] (Displays the current value of Work in Process 'WIP' for the Work Order. The WIP value is equal to the posted value minus the received value)
    @property {String} costRecognition [read only] (Used by Work Orders for Job and Average Cost Items to determine how and when costs are recognized:)
    @property {Project} project (If your application is configured to use Projects, select a Project Number to associate with the Work Order. If the Work Order was created from Sales Order demand—and the parent Sales Order had a Project Number associated with it—then the Project Number from the parent Sales Order will automatically be entered here. In this way, Sales Orders and Work Orders may be linked to the same Project. When you have the xTuple Project Accounting extension installed—and you link a Project to the Work Order—transactions related to the Work Order will include the Project Number as the final segment of affected G/L Account Numbers. Account Numbers related to the following transactions will include the Project Number as the final segment: Issue Materials, Post Operations, Post Production, Return Material, Correct Post Operations, Correct Post Production, Scrap Material.)
    @property {String} notes (This is a scrolling text field with word-wrapping for entering production Notes related to the Work Order. Production Notes are printed on Pick Lists and Packing Lists for reference by production personnel.)
    @property {String} priority [required, defaulting to 1] (Select a number using the arrow buttons, or manually enter a value up to a maximum of 99. Value entered assigns a priority to the selected Work Order. By assigning a priority to a Work Order, you can indicate the relative importance of a Work Order in comparison to other Work Orders.)
    @property {UserAccount} createdBy [required] (Default to logged in User)
    @property {BillofMaterial} billofMaterialRevision (Select from the list of existing available Revisions. The status of the Revision will also be displayed.)
    @property {String} routingRevision (Select from the list of existing available Revisions. The status of the Revision will also be displayed.)
    @property {StandardOperation} routings (Specify the BOO Revision you want to use for the Work Order. By default, the active Revision will be used.)
    @property {BillofMaterial} materials (Specify the BOM Revision you want to use for the Work Order. By default, the active Revision will be used.)
    @property {String} breederDistributions
    @property {Characteristic} characteristics (When specifying Characteristics for a Work Order Item, you are presented with the following options: 1.Name: Displays the name of any Item Characteristics associated with the Item. Characteristics defined as Item Characteristics may be associated with Items on the Item master. 2. Value: Displays the default Value associated with an Item Characteristic, but permits you to specify an alternate Value.)
    @property {String} workflow
    @property {String} comments (Display lists Comments related to the record)
    @property {String} timeClockHistory

  */
  primeSubmodels = function (done) {
    var submodels = {};
    async.series([
      function (callback) {
        submodels.itemModel = new XM.ItemRelation();
        submodels.itemModel.fetch({number: "BTRUCK1", success: function () {
          callback();
        }});
      },
      function (callback) {
        submodels.siteModel = new XM.SiteRelation();
        submodels.siteModel.fetch({code: "WH1", success: function () {
          callback();
        }});
      }
    ], function (err) {
      done(submodels);
    });
  };

  spec = {
    recordType: "XM.WorkOrder",
    skipCrud: true,
    skipSmoke: true,
    // XXX - this is on because there is an error in smoke.deleteFromList
    captureObject: true,
    collectionType: "XM.WorkOrderListItemCollection",
    /**
      @member Other
      @memberof WorkOrder
      @description Work OrderCollection is not cached.
    */
    cacheName: null,
    listKind: "XV.WorkOrderList",
    instanceOf: "XM.Document",
    /**
      @member Settings
      @memberof WorkOrder
      @description Work Orders are lockable.
    */
    isLockable: true,
    /**
      @member Settings
      @memberof WorkOrder
      @description The ID attribute is "uuid", which will be automatically uppercased.
    */
    idAttribute: "uuid",
    enforceUpperKey: true,
    attributes: ["id", "uuid", "number", "subNumber", "name", "parent", "workOrderMaterial",
  "status", "item", "site", "mode", "startDate", "dueDate", "quantity", "received", "isAdhoc",
  "postedValue", "receivedValue", "wipValue", "costRecognition", "project", "notes", "priority",
  "createdBy", "billOfMaterialRevision", "routingRevision", "routings", "materials",
  "breederDistributions", "characteristics", "workflow", "comments", "timeClockHistory"],
    /**
      @member Setup
      @memberof WorkOrder
      @description Used in the Manufacturing module
    */
    extensions: ["manufacturing"],
    /**
      @member Privileges
      @memberof WorkOrder
      @description WorkOrders can be read by people with "View"
       and can be created, updated,
       or deleted by users with the "Maintain" privilege.
    */
    privileges: {
      create: ["MaintainWorkOrders", "ReleasePlannedOrders"],
      update: "MaintainWorkOrders",
      read: "ViewWorkOrders",
      delete: "DeleteWorkOrders"
    },
    createHash: {
      quantity: 10,
      dueDate: new Date()
    },
    updatableField: "notes",
    beforeSaveActions: [{it: "should set the item and site ", action: function (data, next) {
      primeSubmodels(function (submodels) {
        data.model.set({
          "item": submodels.itemModel,
          "site": submodels.siteModel
        });
        setTimeout(function () {
          next();
        }, 3000);
      });
    }}],
    beforeSaveUIActions: [{it: 'sets item, site and quantity',
      action: function (workspace, done) {
        var gridRow;

        primeSubmodels(function (submodels) {
          workspace.$.itemSiteWidget.doValueChange({value: {item: submodels.itemModel,
            site: submodels.siteModel}});
          workspace.$.quantityWidget.doValueChange({value: 5});
          setTimeout(function () {
            done();
          }, 3000);
        });
      }
    }]
  };

  additionalTests = function () {
    /**
      @member Buttons
      @memberof WorkOrder
      @description An Action gear exists in the Work order workspace with three options if the
      status of the WorkOrder is Exploded
       - Implode
       - Release
       - Delete
    */
    it.skip("Action gear exists in the WorkOrder workspace with three options if the status" +
    "is Exploded:Implode, Release and Delete", function () {
    });
    /**
      @member Buttons
      @memberof WorkOrder
      @description An Action gear exists in the Work order workspace with two options if the
       status of the WorkOrder is open
       - Explode
       - Delete
    */
    it.skip("Action gear exists in the WorkOrder workspace with two options if the status is" +
    " Open: Explode and Delete", function () {
    });
    /**
      @member Buttons
      @memberof WorkOrder
      @description An Action gear exists in the Work order workspace with four options if the
      status of the WorkOrder is Released: Recall, Close, Issue Material, Post Production
    */
    it.skip("Action gear exists in the WorkOrder workspace with four options if the status is" +
    "Released : Recall, Close, Issue Material and Post Production", function () {
    });


    /**
    @member Navigation
    @memberof WorkOrder
    @description Selecting 'Issue Material' from the Actions menu on the Work order opens the Issue Material screen
    with the work orders bill of Materials
    */
    it.skip("Selecting 'Issue Material' should open the Issue Material screen" +
              " with the work order items bill of materials", function () {
    });
    /**
    @member Navigation
    @memberof WorkOrder
    @description Selecting 'Issue Material' option from the Actions menu on a material, opens the Issue Material screen
    with the work order bom item prepopulated
    */
    it.skip("Selecting 'Issue Material' should open the Issue Material screen" +
              " with the work order bom item pre populated", function () {
    });
    /**
    @member Navigation
    @memberof WorkOrder
    @description Selecting 'Issue Line' option from the Actions menu on a material, issues the
    selected line required Material directly
    */
    it.skip("Selecting 'Issue Line' should Issue the material directly without opening" +
    " any screen", function () {
    });
     /**
    @member Navigation
    @memberof WorkOrder
    @description Selecting 'Post Production'  from the Actions menu on the Work order opens
    Post Production screen with work order number prepopulated
    */
    it.skip("Selecting 'Post Production' should open Post Production screen  with the  work" +
    "order number and its details", function () {
    });
       /**
    @member Navigation
    @memberof WorkOrder
    @description Selecting 'Issue All' opens Lot-Control screen with work order number
    prepopulated to issue lot-control item which are not on pick list
    */
    it.skip("Selecting 'Issue All' should open Lot/Serial screen to distribute the lot/serial" +
    "bom items if any with the prepopulated Work Order number", function () {
    });
     /**
    @member Privileges
    @memberof WorkOrder
    @description Issue Material option will be available to the user if
    'IssueMaterial' privileges is assigned to it
    */
    it.skip("User requires 'IssueMaterial' privilege assigned" +
              " to it to access Issue Material option", function () {
    });

    /**
    @member Privileges
    @memberof WorkOrder
    @description Post Production option will be available to the user only if
    'PostProdcution' privileges is assigned to it
    */
    it.skip("User requires 'PostProduction' privilege assigned" +
              " to it to access PostProduction option", function () {
    });
    /**
    @member Privileges
    @memberof WorkOrder
    @description Post Production option will be available to the user only if
    'PostProduction' privilege is assigned to it
    */
    it.skip("User requires 'PostProduction' privilege assigned" +
              " to it to access PostProduction option", function () {
    });
    /**
    @member Setup
    @memberof WorkOrder
    @description Ordered quantity should be displayed with negative sign only if
    the work order mode is set to Disassembly
    */
    it.skip("Selecting Disassembly mode while work order creation should" +
              " display the ordered quantity in negative value", function () {
    });
    /**
    @member Navigation
    @memberof WorkOrder
    @description selecting Return Material for a disassemble work order opens the Return Material
     screen with the work order number pre-populated
    */
    it.skip("Selecting Return Material will opens the Return material Return Material screen" +
              " with pre-populated work order number ", function () {
    });
    /**
    @member Navigation
    @memberof WorkOrder
    @description selecting PostProdcution for a disassemble work order will open the Post
    Production screen with ordered quantity in negative
    */
    it.skip("Selecting PostProdcution for a disassembled work order should opens the Post Production" +
              " screen with the pre-populated work order number and the ordered quantity in" +
      "negative value", function () {

    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
