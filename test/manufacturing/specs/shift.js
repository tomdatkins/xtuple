/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  Shift is period of time in which group of people work.
  @class
  @alias Shift
  @property {String} id
  @property {String} number [Is the id Attribute.](Is a unique code to identify the Shift.)
  @property {String} name (Is a brief name to describe the Shift.)

  **/

  var spec = {
      recordType: "XM.Shift",
      collectionType: "XM.ShiftCollection",
      
      /**
      @member Other
      @memberof Shift
      @description The Shift Collection is not cached.
      */
      cacheName: null,
      listKind: "XV.ShiftList",
      instanceOf: "XM.Document",

      /**
        @member Settings
        @memberof Shift
        @description The ID attribute is "number", which will be automatically uppercased.
      */
      idAttribute: ["number"],
      enforceUpperKey: true,
      attributes: ["number", "name"],
      requiredAttributes: ["number"],
      /**
        @member Settings
        @memberof Shift
        @description Shifts are lockable.
      */
      isLockable: true,
      
      /**
        @member Privileges
        @memberof Shift
        @description Shift can be read, created, updated,
          or deleted by users with the "MaintainShifts" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainShifts",
        read: true
      },

      createHash: {
        number: "test-Shift123" + Math.random(),
		name: "test-Shift123" + Math.random()
      },
      updatableField: "name"
    };

  var additionalTests =  function () {
    /**
      @member Navigation
      @memberof Shift
      @description An Action gear exists in the 'Shifts' work space  with following options:
      'Delete' option where the user has MaintainShifts privilege
     */
      it.skip("Action gear should exist in the Shifts work space with 'Delete' option if the" +
      "shift is not assigned to any employee  and if the user has 'MaintainShifts'" +
      "privilege", function () {
      });
      /**
      @member Navigation
      @memberof Shift
      @description An Action gear exists in the 'Shifts' work space with no 'Delete' option
      if the selected Shift has assigned to an employee
     */
      it.skip("Action gear should exist in the Shifts work space without 'Delete' option if" +
      "the selected Shift is assigned to an employee", function () {
      });
      /**
      @member Settings
      @memberof Shift
      @description User should not be allowed to duplicate the shift number
     */
      it.skip("User should not be allowed to duplicate the shift number", function () {
      });
      /**
      @member Settings
      @memberof Shift
      @description Shift should not allow to save without entering shift number
     */
      it.skip("User should not able to save unless shift number is entered", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
