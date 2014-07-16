/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

   /**
   The Item Availability Workbench is designed to consolidate on one screen the functions performed by personnel who manage and track Inventory.

    @class
    @alias ItemWorkbench
    @property {String} id
	@property {Item} item
    @property {String} number [is the idAttribute.] (Enter the Item Number of the Item whose Inventory Availability you want to display.)
    @property {Boolean} isActive (Displays the selected item is active or not.)
	@property {String} itemType  (Displays type of the item.)
    @property {ClassCode} classCode (Displays class code of the item.)
	@property {Unit} inventoryUnit  (Displays inventory unit of the item.)
	@property {Boolean} isFractional (Displays whether the item is of type fractional or not.)
    @property {String} notes (Displays notes from item screen.)
    @property {String} extendedDescription (Displays extendedDescription of the item.)
    @property {Boolean} isSold (.Displays whether the item is of type sold or not.)
    @property {ProductCategory} productCategory (Displays product category of the item.)
    @property {FreightClass} freightClass (Displays freight class assigned to the item.)
    @property {String} barcode (Displays barcode of the item.)
    @property {Money} listPrice (Displays listPrice of the item.)
    @property {Money} wholesalePrice (Displays wholesalePrice of the item.)
    @property {Unit} priceUnit		(Displays price unit of the item.)
	@property {Number} productWeight (Displays weight of the item.)
    @property {Number} packageWeight  (Displays packing weight of the item.)
    @property {Money} maximumDesiredCost (Displays maximum desired cost of the item.)
	@property {orders} orders (Displays purchase , sales and work orders of the item.)
	@property {Availability} availability (Displays inventory availability of the item.)
	@property {String} aliases (Displays aliases of the item.)
    @property {ItemComment} comments (Displays change log from item screen.)
    */
  var spec = {
      recordType: "XM.ItemWorkbench",
      collectionType: null,
      skipSmoke: true, //this is causing work space related tests to fail
      skipCrud: true, //this is because create, delete and update operation will not be performed on item workbench screen

      /**
      @member Other
      @memberof ItemWorkbench
      @description The ItemWorkbench doesn't have a Collection
    */
      cacheName: null,
      listKind: null,
      instanceOf: "XM.Model",

    /**
      @member Settings
      @memberof ItemWorkbench
      @description ItemWorkbench is not lockable.
    */
      isLockable: false,

    /**
      @member Settings
      @memberof ItemWorkbench
      @description The ID attribute is "number", which will be automatically uppercased.
    */
      idAttribute: "number",
      enforceUpperKey: false,
      attributes: ["id", "item", "number", "isActive", "itemType", "classCode", "inventoryUnit",
      "isFractional", "notes", "extendedDescription", "isSold", "productCategory", "freightClass",
      "barcode", "listPrice", "wholesalePrice", "priceUnit", "productWeight", "packageWeight",
      "maximumDesiredCost", "orders", "availability", "aliases", "comments"],
      requiredAttributes: ["number"],

      /**
      @member Setup
      @memberof ItemWorkbench
      @description Used in the inventory modules
      */
      extensions: ["inventory"]

    };
  var additionalTests =  function () {
    /**
      @member Buttons
      @memberof ItemWorkbench
      @description Selection panel should exist to display the item number, item site and planning information
      related to the selected item site
     */
      it.skip("Selection panel should exist to display the item number, item site and planning " +
      "information related to the selected item site", function () {
      });
    
	/**
	/**
      @member Buttons
      @memberof ItemWorkbench
      @description Orders panel should exist to display orders related to the item selected
     */
      it.skip("Orders panel should exist to display orders related to the item " +
      "selected", function () {
      });

      /**
      @member Buttons
      @memberof ItemWorkbench
      @description Availability panel should exist to display the QOH on each item sites
     */
      it.skip("Availability panel should exist to display the QOH on each item" +
      " sites", function () {
      });
    
	/**
      @member Buttons
      @memberof ItemWorkbench
      @description History panel should exist to display item transaction history
     */
      it.skip("History panel should exist to display item transaction history", function () {
      });

      /**
      @member Buttons
      @memberof ItemWorkbench
      @description Comments panel should exist to display change log from item screen
     */
      it.skip("Comments panel should exist to display change log from item screen", function () {
      });

      /**
      @member Buttons
      @memberof ItemWorkbench
      @description OverView panel should exist to display item basic information
     */
      it.skip("OverView panel should exist to display item basic information", function () {
      });

      /**
      @member Buttons
      @memberof ItemWorkbench
      @description Settings panel should exist to display detailed item information
     */
      it.skip("Settings panel should exist to display detailed item information", function () {
      });

      /**
      @member Buttons
      @memberof ItemWorkbench
      @description Aliases panel should exist to display item aliases
     */
      it.skip("Aliases panel should exist to display item aliases", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());