/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  Used for categorizing Purchase orders from the list.
  @class
  @alias PurchaseType
  @property {String} id
  @property {String} Code [is the idAttribute](Unique string to identify the purchase type)
  @property {String} Description (Brief description about the purchase type)
  @property {Boolean} isActive  (Identifies whether the Item is currently active.)
  @property {String} emailProfile (Email profile to be linked to the purchase type)
  @property {String} workflow (Workflows linked to the purchase type)
  **/

  var spec = {
      recordType: "XM.PurchaseType",
      collectionType: "XM.PurchaseTypeCollection",
      skipSmoke: true,
      skipCrud: true,

      /**
      @member Other
      @memberof PurchaseType
      @description The Purchase Type Collection is not cached.
    */
      cacheName: null,
      listKind: "XV.PurchaseTypeList",
      instanceOf: "XM.Model",
      
      /**
        @member - Settings
        @memberof PurchaseType
        @description The ID attribute is "code", which will not be automatically uppercased.
      */
      idAttribute: "code",
      enforceUpperKey: false,
      attributes: ["code", "description", "isActive", "emailProfile", "workflow"],
      requiredAttributes: ["code"],
      /**
        @member - Setup
		@memberof PurchaseType
        @description Used in the Purchasing module
      */
      extensions: ["purchasing"],

      /**
        @member - Settings
        @memberof PurchaseType
        @description PurchaseTypes are lockable.
      */
      isLockable: true,

      /**
        @member - Privileges
        @memberof PurchaseType
        @description Purchase Types can be created, updated, or deleted by users with the "MaintainPurchaseTypes" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainPurchaseTypes",
        read: true
      },

      createHash: {
        code: "PType" + Math.random(),
        description: 'PurchaseType Description'
      },
      updatableField: "description"
    };
  var additionalTests =  function () {
    /**
      @member Buttons
      @memberof PurchaseType
      @description WorkFlow panel should exist to display the WorkFlows linked to the PurchaseType
     */
      it.skip("WorkFlow panel should exist to display the WorkFlows linked to the " +
      "PurchaseType", function () {
      });
    
      /**
      @member Navigation
      @memberof PurchaseType
      @description An Action gear exists in the 'PurchaseTypes' work space  with following options: 'Delete' option where the user has MaintainPurchaseTypes privilege
     */
      it.skip("Action gear should exist in the PurchaseTypes work space with 'Delete' option if" +
      " there is no Purchase Order linked to it and if the user has 'MaintainPurchaseTypes' " +
      "privilege", function () {
      });
      /**
      @member Navigation
      @memberof PurchaseType
      @description An Action gear exists in the 'PurchaseTypes' work space with no 'Delete' option if the selected PurchaseType has purchase order linked to it
     */
      it.skip("Action gear should exist in the PurchaseTypes work space without 'Delete' " +
      "option if there is a purchase order linked to the selected PurchaseType", function () {
      });

     /**
      @member Settings
      @memberof PurchaseType
      @description Unchecking 'Active' checkbox in the 'PurchaseType' screen should de-activate the selected purchase type
     */
      it.skip("Unchecking the 'Active' checkbox in the 'PurchaseType' should de-activate the " +
      "purchase type ", function () {
      });

      /**
      @member Settings
      @memberof PurchaseType
      @description User should not be able to save the purchase type without entering the code
     */
      it.skip("User should not be able to save the purchase type without entering the " +
      "code", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
