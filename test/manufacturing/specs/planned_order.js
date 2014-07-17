/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true,
 beforeEach:true */

(function () {
  "use strict";
  /**
    Planned Orders are a scheduling mechanism used by the two planning systems—Master Production Scheduling 'MPS' and Material Requirements Planning 'MRP'—to create 'soft' demands for materials and capacity required to meet the Production Plan. These Planned Orders are converted to actual Work Orders or Purchase Orders as their Lead Time approaches.
    @class
    @alias PlannedOrder
    @property {String} id
	@property {String} uuid [is the idAttribute, required]
	@property {String} number [required, readonly] (Displays system-defined Planned Order Number.)
	@property {String} subnumber [required, readonly]
	@property {Boolean} isFirm [required]
	@property {String} plannedOrderType (Specify the supply type of the Planned Order: Purchase Order, Work Order, or Transfer Order. If you specify Transfer Order then you must specify the From Site.)
	@property {Date} startDate [required, readonly] (This date will be equal to the due date less the Lead Time. The start date may be changed by altering the Lead Time field.)
	@property {Date} dueDate [required] (Enter the date the Planned Order must be completed by.)
	@property {Item} item [required] (Enter the Item Number of the Item you want to create a Planned Order for.)
	@property {Site} site [required] (Specify Site for Planned Order.)
	@property {String} quantity [required] (Enter the quantity of the specified Item required for the Planned Order.)
	@property {String} notes (This is a scrolling text field with word-wrapping for entering general Notes related to the Planned Order)
	@property {String} parent (Specifies the order generated from)
	@property {Site} supplySite (Specify the supply site if the order type is selected as 'Transfer Order')
		
    */
  var spec = {
      recordType: "XM.PlannedOrder",
      skipSmoke: true,
      skipCrud: true,
      enforceUpperKey: true,
    /**
      @member Other
      @memberof PlannedOrder
      @description The PlannedOrder Collection is not cached.
    */
      collectionType: "XM.PlannedOrderListItemCollection",
      listKind: "XV.PlannedOrderList",
      instanceOf: "XM.Document",
      cacheName: null,
    /**
      @member Settings
      @memberof PlannedOrder
      @description PlannedOrder is lockable.
    */
      isLockable: true,
    /**
      @member Settings
      @memberof PlannedOrder
      @description The ID attribute is "uuid"
    */
      attributes: ["id", "uuid", "number", "subNumber", "isFirm", "plannedOrderType", "startDate",
                   "dueDate", "item", "site", "quantity", "notes", "parent", "supplySite"],
      requiredAttributes: ["number", "subNumber", "isFirm", "startDate", "dueDate", "quantity",
                           "item", "site", "uuid"],
      idAttribute: "uuid",
    /**
      @member Setup
      @memberof PlannedOrder
      @description Used in inventory, purchasing, manufacturing module
    */
      extensions: ["inventory"],
       /**
      @member Privileges
      @memberof PlannedOrder
      @description Users can create, update, and delete PlannedOrder if they have the
      'CreatePlannedOrder',"ViewPlannedOrder" and "DeletePlannedOrder" privileges.
    */
      privileges: {
        createUpdate: "CreatePlannedOrders",
		//Update: "updatePlannedOrder",
		delete: "DeletePlannedOrders",
        read: "ViewPlannedOrders"
      }
      
    };
  var additionalTests =  function () {
    /**
      @member Settings
      @memberof plannedOrder
      @description User should not allow to create Planned Order without entering Item number
     */
      it.skip("User should not allow to create a Planned Order without entering an Item" +
      "Number", function () {
      });
      
    /**
      @member Settings
      @memberof plannedOrder
      @description Supply Site drop down should not enable, unless the the Order Type is selected
      as 'Transfer Order'
     */
      it.skip("Supply Site drop down should not enable, unless the the Order Type is selected" +
		" as 'Transfer Order'", function () {
      });
    /**
      @member Settings
      @memberof plannedOrder
      @description Order Type drop down should be in active mode in-order to changes type of the
      order on re-opening it
     */
      it.skip("Order Type drop down should be in active mode in-order to changes type of the" +
		"order on re-opening it", function () {
      });
     /**
      @member Settings
      @memberof plannedOrder
      @description Start Date of the Planned Order should selected according to the Due Date and
      Lead Time of the selected Item Site
     */
      it.skip("Start Date of the Planned Order should selected according to the Due Date and" +
		"Lead Time of the selected Item Site, excluding non-working days", function () {
      });
    /**
      @member Navigation
      @memberof plannedOrder
      @description An action gear should exist in the Planned Order work space with the following
      options: a). Item Workbench b). Firm  c). Release d). Delete
     */
      it.skip("An action gear should exist in the Planned Order work space with the following" +
		"options: a). Item Workbench b). Firm  c). Release d). Delete", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
  
}());