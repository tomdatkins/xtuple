/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  Operation Type is a classification/grouping element for Work Order Operations
  @class
  @alias Operation Type
  @property {Number} id:
  @property {String} name: is the code/name for the Operation Type
  @property {String} description: Is a brief name to describe the Operation Type
  @property {Boolean} isSystem: is a System defined Operation Type that cannot be deleted
  **/

  var spec = {
      recordType: "XM.OperationType",
      collectionType: "XM.OperationTypeCollection",
      
      /**
      @member Other
      @memberof OperationType
      @description The OperationType Collection is not cached.
      */
      cacheName: null,
      listKind: "XV.OperationTypeList",
      instanceOf: "XM.Document",
      skipCrud: false,
      skipSmoke: false,

      /**
        @member Settings
        @memberof OperationType
        @description The ID attribute is "name".
      */
      idAttribute: ["name"],
      enforceUpperKey: false,
      attributes: ["name", "description", "isSystem"],
      requiredAttributes: ["name"],
      
      /**
        @member Settings
        @memberof OperationType
        @description OperationTypes are lockable.
      */
      isLockable: true,
      
      /**
        @member Privileges
        @memberof OperationType
        @description OperationType can be read, created, updated,
          or deleted by users with the "MaintainOperationTypes" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainStandardOperations",
        read: true
      },
      
      createHash: {
        name: "OPType" + Math.random(),
        description: 'Operation Type Description'
      },
      
      updateHash: {
        description: 'Operation Type edited'
      },
      
      updatableField: "description"

    };

  var additionalTests =  function () {
    /**
      @member Navigation
      @memberof OperationType
      @description An Action gear exists in the 'OperationTypes' work space  with following options:
      'Delete' option where the user has MaintainOperationTypes privilege
     */
      it.skip("Action gear should exist in the OperationTypes work space with 'Delete' option if the " +
      "OperationType is not a System Type (isSystem)", function () {
      });
      /**
      @member Settings
      @memberof OperationType
      @description User should not be allowed to duplicate the OperationType number
     */
      it.skip("User should not be allowed to duplicate the OperationType name", function () {
      });
      /**
      @member Settings
      @memberof OperationType
      @description OperationType should not allow to save without entering OperationType number
     */
      it.skip("User should not able to save unless OperationType name is entered", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
